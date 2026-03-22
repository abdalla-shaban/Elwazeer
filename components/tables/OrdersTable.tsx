"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBulkDeleteOrders,
  useBulkUpdateOrderStatus,
  useOrders,
  useUpdateOrderStatus,
  useUpdateQuery,
} from "@/lib/api/hooks";
import { Order } from "@/types/orders";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Printer,
  Trash2,
  FileSpreadsheet,
} from "lucide-react";
import * as XLSX from "xlsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import * as motion from "motion/react-client";
import { BsWhatsapp } from "react-icons/bs";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const PRINT_STYLES = `
  @page { size: auto; margin: 0mm; }
  body { 
    font-family: 'Arial', sans-serif; 
    direction: rtl; 
    width: 80mm; 
    margin: 0 auto; 
    padding: 5mm;
    color: #000;
  }
  .order-page { 
    page-break-after: always; 
    border-bottom: 1px dashed #000; 
    margin-bottom: 10mm; 
    padding-bottom: 5mm;
  }
  .logo-container { text-align: center; margin-bottom: 5mm; }
  .logo-container img { width: 40mm; height: auto; }
  .order-header { text-align: center; margin-bottom: 5mm; border-bottom: 1px solid #000; padding-bottom: 2mm; }
  .order-header h2 { margin: 0; font-size: 16pt; }
  .shipping-info { margin-bottom: 5mm; font-size: 10pt; }
  .shipping-info h3 { border-bottom: 1px solid #000; display: inline-block; margin-bottom: 2mm; font-size: 11pt; }
  .shipping-info p { margin: 1mm 0; }
  .items-table { width: 100%; border-collapse: collapse; margin-top: 3mm; font-size: 9pt; }
  .items-table th, .items-table td { border-bottom: 1px solid #eee; padding: 2mm 1mm; text-align: right; }
  .items-table th { background: #f9f9f9; }
  .summary { margin-top: 5mm; border-top: 1px solid #000; padding-top: 2mm; font-size: 10pt; }
  .summary p { margin: 1mm 0; display: flex; justify-content: space-between; }
  @media print { 
    .order-page { border-bottom: 1px dashed #000; }
    .order-page:last-child { border-bottom: none; page-break-after: avoid; }
  }
`;

const generateOrderPrintHTML = (order: Order) => `
  <div class="order-page">
    <div class="logo-container">
      <img src="/logo-icon.png" alt="Elena Store Logo" />
    </div>
    <div class="order-header">
      <h2>ايلينا ستور</h2>
      <p>رقم الطلب: ${order._id.slice(-6).toUpperCase()}</p>
      <p>التاريخ: ${new Date(order.createdAt).toLocaleDateString("ar-EG")}</p>
    </div>
    <div class="shipping-info">
      <h3>بيانات الشحن</h3>
      <p>الأسم: ${order.shipping.name}</p>
      <p>الهاتف: ${[order.shipping.phone, order.shipping.phone2].filter(Boolean).join(" / ")}</p>
      <p>المحافظة - المدينة: ${order.shipping.governorate} - ${order.shipping.city}</p>
      <p>العنوان: ${[order.shipping.address, order.shipping.building].filter(Boolean).join(" / ")}</p>
    </div>
    <table class="items-table">
      <thead>
        <tr>
          <th>المنتج</th>
          <th>المقاس</th>
          <th>اللون</th>
          <th>الكمية</th>
          <th>السعر</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item: any) => {
              const itemName = item.name || item.productId?.name || "Product";
              const itemSize = item.size?.size ? `${item.size.size} ${item.size.range || ''}` : item.size;
              const itemColor = Array.isArray(item.color) ? item.color[0]?.name : (item.color?.name || item.color);
              const itemPrice = item.price || item.finalPrice || 0;
              return `
          <tr>
            <td>${itemName}</td>
            <td>${itemSize}</td>
            <td>${itemColor}</td>
            <td>${item.quantity}</td>
            <td>${itemPrice} EGP</td>
          </tr>
        `;
            }
          )
          .join("")}
      </tbody>
    </table>
    <div class="summary">
      <p><span>سعر الشحن:</span><span>${order.shipping.shippingPrice} EGP</span></p>
      <p><strong><span>إجمالي السعر:</span></strong><strong><span>${order.totalPrice} EGP</span></strong></p>
    </div>
  </div>
`;

const OrderStatus = [
  {
    lable: "جديد",
    value: "new",
  },
  {
    lable: "جاري الشحن",
    value: "confirmed",
  },
  {
    lable: "تم الشحن",
    value: "shipped",
  },
  {
    lable: "تم التسليم",
    value: "delivered",
  },
  {
    lable: "ملغي",
    value: "cancelled",
  },
  {
    lable: "فشل",
    value: "failed",
  },
];
export const OrdersTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileValue, setMobileValue] = useState(
    searchParams.get("phone") ?? "",
  );
  const { mutateAsync: updateStatus, isPending: isUpdateStausPending } =
    useUpdateOrderStatus();
  const { mutateAsync: bulkUpdateStatus, isPending: isBulkUpdating } =
    useBulkUpdateOrderStatus();
  const { mutateAsync: bulkDelete, isPending: isBulkDeleting } =
    useBulkDeleteOrders();

  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 50);
  const { update } = useUpdateQuery({ targetURL: "admin/orders" });

  const status = searchParams.get("status") ?? "all";
  const mobile = searchParams.get("mobile") ?? "";
  const { data, isLoading } = useOrders({ status, mobile, page, limit });

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const orders = useMemo(() => data?.data ?? [], [data]);

  const toggleAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  const toggleOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const selectedOrdersData = useMemo(() => {
    return orders.filter((o) => selectedOrders.includes(o._id));
  }, [orders, selectedOrders]);

  const updateMobile = useDebouncedCallback(
    (mobile: string) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (mobile) {
        newParams.set("mobile", mobile);
        newParams.set("page", "1");
      } else {
        newParams.delete("mobile");
      }

      router.push(`/admin/orders?${newParams.toString()}`, {
        scroll: false,
      });
    },

    400, // debounce time
  );
  const buildWhatsAppMessage = (order: Order) => {
    const itemsText = order.items
      .map((item: any) => {
        const itemName = item.name || item.productId?.name || "Product";
        const itemSize = item.size?.size ? item.size.size : item.size;
        const itemColor = Array.isArray(item.color) ? item.color[0]?.name : (item.color?.name || item.color);
        const itemPrice = item.price || item.finalPrice || 0;
        return `- ${itemName}
  • المقاس: ${itemSize}
  • اللون: ${itemColor}
  • الكمية: ${item.quantity}
  • السعر: ${itemPrice} جنيه`
      }).join("\n");

    const message = `
 اهلاً بك في يارا ستور

 الاسم: ${order.shipping.name}
 الهاتف: ${order.shipping.phone}
 العنوان: ${order.shipping.address}, ${order.shipping.building}, ${order.shipping.city}, ${order.shipping.governorate}

 المنتجات:
${itemsText}
الشحن: ${order.shipping.shippingPrice} جنيه
 إجمالي الطلب: ${order.totalPrice} جنيه
`;

    return encodeURI(message.trim());
  };

  const detectCurrentBadgeColor = (value: string) => {
    switch (value) {
      case "new":
        return "new";

      case "confirmed":
        return "confirmed";

      case "shipped":
        return "shipped";

      case "delivered":
        return "delivered";

      case "cancelled":
        return "cancelled";

      case "failed":
        return "failed";

      default:
        return "new";
    }
  };
  const detectCurrentStatus = (value: string) => {
    return OrderStatus.filter((item) => item.value === value)[0];
  };
  const handleExportToExcel = () => {
    const dataToExport =
      selectedOrders.length > 0 ? selectedOrdersData : orders;

    if (dataToExport.length === 0) {
      toast.error("لا يوجد بيانات لتصديرها");
      return;
    }

    const worksheetData = dataToExport.map((order) => {
      return {
        "Consignee Name": order.shipping.name,
        City: order.shipping.governorate,
        Area: order.shipping.city,
        Address: order.shipping.address,
        Phone_1: order.shipping.phone,
        Phone_2: order.shipping.phone2 || "",
        "E-mail": "",
        "Order ID": "",
        "Client ID": "",
        "Item Name": "",
        Quantity: "",
        "Item Description":
          order.items
            .map((item: any) => {
              const itemName = item.name || item.productId?.name || "Product";
              const itemSize = item.size?.size ? `${item.size.size} - ${item.size.range || ''}` : item.size;
              const itemColor = Array.isArray(item.color) ? item.color[0]?.name : (item.color?.name || item.color);
              
              return `الاسم: ${itemName}\nاللون: ${itemColor}\nالمقاس: ${itemSize} \nالكمية: ${item.quantity}`;
            })
            .join(" | ") + "\n",
        COD: order.totalPrice,
        Weight: "",
        Size: "",
        "Service Type": "",
        notes: order.items
          .map((item: any) => item.image || item.productId?.images?.[0]?.secure_url || "")
          .filter(Boolean)
          .join(", "),
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    // Adjust column widths
    const columnWidths = [
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
    ];
    worksheet["!cols"] = columnWidths;

    XLSX.writeFile(workbook, `orders_${new Date().getTime()}.xlsx`);
    toast.success("تم تصدير الطلبات بنجاح");
  };

  return (
    <>
      <div className="space-y-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Phone Search */}
            <Input
              className="max-w-sm"
              placeholder="بحث برقم الهاتف"
              value={mobileValue}
              onChange={(e) => {
                const v = e.target.value;
                setMobileValue(v);
                updateMobile(v);
              }}
            />

            {/* Status Filter */}
            <Select
              dir="rtl"
              value={status}
              onValueChange={(value) => {
                update({ status: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="all">الكل</SelectItem>
                {OrderStatus.map(({ lable, value }) => (
                  <SelectItem key={value} value={value}>
                    {lable}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Rows Limit Selector */}
            <Select
              dir="rtl"
              value={String(limit)}
              onValueChange={(value) => {
                update({ limit: value, page: 1 });
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="عدد الصفوف" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem value="10">10 صفوف</SelectItem>
                <SelectItem value="20">20 صف</SelectItem>
                <SelectItem value="50">50 صف</SelectItem>
                <SelectItem value="100">100 صف</SelectItem>
              </SelectContent>
            </Select>

            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                {/* Bulk Status Update */}
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2"
                      disabled={isBulkUpdating}
                    >
                      <MoreHorizontal className="size-4" />
                      تغيير الحالة ({selectedOrders.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="space-y-1">
                    {OrderStatus.map(({ lable, value }) => (
                      <DropdownMenuItem
                        key={value}
                        onClick={() => {
                          toast.promise(
                            bulkUpdateStatus({
                              orderIds: selectedOrders,
                              status: value,
                            }),
                            {
                              loading: "جاري تحديث الحالات...",
                              success: (res) => {
                                setSelectedOrders([]);
                                return `تم تحديث ${res.modifiedCount} طلب بنجاح`;
                              },
                              error: (err) => `حدث خطأ: ${err.message}`,
                            },
                          );
                        }}
                      >
                        <Badge variant={detectCurrentBadgeColor(value)}>
                          {lable}
                        </Badge>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Bulk Delete */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      disabled={isBulkDeleting}
                    >
                      <Trash2 className="size-4" />
                      حذف ({selectedOrders.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader dir="rtl">
                      <DialogTitle>تأكيد الحذف</DialogTitle>
                      <DialogDescription>
                        هل أنت متأكد من حذف {selectedOrders.length} طلب؟ هذا
                        الإجراء لا يمكن التراجع عنه.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4" dir="rtl">
                      <Button
                        variant="destructive"
                        onClick={() => {
                          toast.promise(
                            bulkDelete({ orderIds: selectedOrders }),
                            {
                              loading: "جاري الحذف...",
                              success: (res) => {
                                setSelectedOrders([]);
                                return `تم حذف ${res.deletedCount} طلب بنجاح`;
                              },
                              error: (err) => `حدث خطأ: ${err.message}`,
                            },
                          );
                        }}
                      >
                        تأكيد الحذف
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Batch Print */}
                <Button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      const printContent = selectedOrdersData
                        .map((order) => generateOrderPrintHTML(order))
                        .join("");
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>طباعة الطلبات</title>
                            <style>${PRINT_STYLES}</style>
                          </head>
                          <body>${printContent}</body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.focus();
                      setTimeout(() => {
                        printWindow.print();
                        printWindow.close();
                      }, 500);
                    }
                  }}
                  variant="outline"
                  className="gap-2"
                >
                  <Printer className="size-4" />
                  طباعة ({selectedOrders.length})
                </Button>

                {/* Export to Excel */}
                <Button
                  onClick={handleExportToExcel}
                  variant="outline"
                  className="gap-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <FileSpreadsheet className="size-4" />
                  تصدير (Excel)
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80 border-b border-slate-100 h-14">
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center w-[50px]">
                <Checkbox
                  className="cursor-pointer"
                  checked={
                    orders.length > 0 && selectedOrders.length === orders.length
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="text-right font-bold text-slate-700">العميل</TableHead>
              <TableHead className="text-right font-bold text-slate-700">المحافظة</TableHead>
              <TableHead className="text-center font-bold text-slate-700">العدد</TableHead>
              <TableHead className="text-center font-bold text-slate-700">الإجمالي</TableHead>
              <TableHead className="text-center font-bold text-slate-700">الدفع</TableHead>
              <TableHead className="text-center font-bold text-slate-700">الحالة</TableHead>
              <TableHead className="text-center font-bold text-slate-700">تاريخ التحديث</TableHead>
              <TableHead className="text-center font-bold text-slate-700">تاريخ الإنشاء</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading
              ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="size-4 rounded-sm border-slate-200" />
                    </TableCell>
                    {[...Array(8)].map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-8 rounded-lg" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : orders.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 15) * 0.05, duration: 0.3 }}
                    className="border-b transition-colors hover:bg-slate-50/80 data-[state=selected]:bg-muted"
                  >
                  <TableCell className="text-center">
                    <Checkbox
                      className="cursor-pointer"
                      checked={selectedOrders.includes(order._id)}
                      onCheckedChange={() => toggleOrder(order._id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="space-y-2">
                      <p className="capitalize">{order.shipping.name}</p>
                      <div className="flex flex-col items-start gap-2">
                        <Link
                          href={`https://wa.me/+20${
                            order.shipping.phone
                          }?text=${buildWhatsAppMessage(order)}`}
                          target="_blank"
                          className="flex w-fit px-4 justify-center items-center gap-2 py-1.5 rounded-full bg-black/5 backdrop-blur-md"
                        >
                          <p className="text-sm text-muted-foreground">
                            {order.shipping.phone}
                          </p>
                          <BsWhatsapp className="text-green-700" />
                        </Link>
                        {order.shipping.phone2 ? (
                          <Link
                            href={`https://wa.me/+20${
                              order.shipping.phone2
                            }?text=${buildWhatsAppMessage(order)}`}
                            target="_blank"
                            className="flex w-fit px-4 justify-center items-center gap-2 py-1.5 rounded-full bg-black/5 backdrop-blur-md"
                          >
                            <p className="text-sm text-muted-foreground">
                              {order.shipping.phone}
                            </p>
                            <BsWhatsapp className="text-green-700" />
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {order.shipping.governorate} - {order.shipping.city}
                  </TableCell>

                  <TableCell className="text-center">
                    {order.items.length}
                  </TableCell>

                  <TableCell className="text-center">
                    {order.totalPrice} EGP
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge variant="outline">{order.payment.method}</Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    {order.status === "delivered" ? (
                      <Badge
                        className="cursor-pointer"
                        onClick={() => {
                          toast.warning("لا يمكن التغيير في هذة الحالة");
                        }}
                        variant={detectCurrentBadgeColor(order.status)}
                      >
                        {detectCurrentStatus(order.status)?.lable}
                      </Badge>
                    ) : (
                      <DropdownMenu dir="rtl">
                        <DropdownMenuTrigger asChild>
                          <Badge
                            className="cursor-pointer"
                            variant={detectCurrentBadgeColor(order.status)}
                          >
                            {detectCurrentStatus(order.status)?.lable}
                          </Badge>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="space-y-2">
                          {OrderStatus.map(({ value }) => (
                            <DropdownMenuItem asChild key={value}>
                              <Badge
                                aria-disabled={isUpdateStausPending}
                                onClick={() => {
                                  toast.promise(
                                    updateStatus({
                                      id: order._id,
                                      status: value,
                                    }),
                                    {
                                      loading: "جاري التحديث",
                                      error: (err) => `حدث خطأ ما ${err}`,
                                      success: "تم تحديث حالة الأوردر",
                                    },
                                  );
                                }}
                                className="w-full cursor-pointer"
                                variant={detectCurrentBadgeColor(value)}
                              >
                                {detectCurrentStatus(value)?.lable}
                              </Badge>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    {new Date(order.updatedAt).toLocaleDateString("ar-EG")}
                  </TableCell>
                  <TableCell className="text-center">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </TableCell>

                  <TableCell className="text-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">عرض</Button>
                      </DialogTrigger>
                      <DialogContent className="p-4">
                        <DialogHeader className="print:w-full">
                          <DialogTitle className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                const printWindow = window.open("", "_blank");
                                if (printWindow) {
                                  const printContent =
                                    generateOrderPrintHTML(order);
                                  printWindow.document.write(`
                                    <html>
                                      <head>
                                        <title>طباعة الطلب</title>
                                        <style>${PRINT_STYLES}</style>
                                      </head>
                                      <body>${printContent}</body>
                                    </html>
                                  `);
                                  printWindow.document.close();
                                  printWindow.focus();
                                  setTimeout(() => {
                                    printWindow.print();
                                    printWindow.close();
                                  }, 500);
                                }
                              }}
                              variant={"outline"}
                              className="print:hidden"
                            >
                              <Printer />
                            </Button>
                            معلومات الأوردر
                            <span className="items-center gap-2 flex">
                              ({order.items.length})
                            </span>
                          </DialogTitle>
                          <DialogDescription className=""></DialogDescription>
                        </DialogHeader>

                        <div className="px-3 relative space-y-5">
                          {/* Logo for Print only */}
                          <div className="hidden print:flex justify-center mb-4">
                            <Image
                              src="/logo-icon.png"
                              alt="Elena Store Logo"
                              width={150}
                              height={150}
                              className="object-contain"
                            />
                          </div>
                          <ul className="space-y-2">
                            <li className="flex items-center gap-2">
                              <span className="font-medium">الأسم :</span>
                              <h4 className="capitalize">
                                {order.shipping.name}
                              </h4>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="font-medium">
                                المحافظة - المدينة :
                              </span>
                              <h4 className="capitalize">
                                {order.shipping.governorate} -{" "}
                                {order.shipping.city}
                              </h4>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="font-medium">العنوان :</span>
                              <h4 className="capitalize">
                                {order.shipping.address}{" "}
                                {order.shipping.building ? (
                                  <>- {order.shipping.building}</>
                                ) : null}
                              </h4>
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="font-medium">رقم الهاتف :</span>
                              <h4 className="capitalize">
                                {order.shipping.phone}{" "}
                                {order.shipping.phone2 &&
                                  `- ${order.shipping.phone2}`}
                              </h4>
                            </li>
                          </ul>
                          <ScrollArea
                            style={{
                              height:
                                order.items.length > 3
                                  ? "200px"
                                  : "fit-content",
                            }}
                            dir="rtl"
                            className="py-2 print:h-full!"
                          >
                            {order.items.map((item: any, idx: number) => {
                              const itemName = item.name || item.productId?.name || "Product";
                              const itemImage = item.image || item.productId?.images?.[0]?.secure_url || "/demo.jpg";
                              const itemColorName = Array.isArray(item.color) ? item.color[0]?.name : (item.color?.name || item.color);
                              const itemColorHex = Array.isArray(item.color) ? item.color[0]?.hexCode : (item.color?.hexCode || "#000");
                              const itemSizeObj = item.size?.size ? item.size : { size: item.size, range: "" };
                              const itemFinalPrice = item.finalPrice || item.price || item.productId?.finalPrice || 0;
                              
                              return (
                                <div
                                  className="relative px-4 space-y-5"
                                  key={item._id || idx}
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                    <div className="flex sm:items-center gap-4 flex-1">
                                      {/* IMAGE */}
                                      <div className="relative">
                                        <Image
                                          src={itemImage}
                                          alt={itemName}
                                          width={80}
                                          height={80}
                                          className="print:hidden size-16 rounded-md object-cover object-top"
                                        />
                                        <Badge className="print:hidden absolute top-0 translate-x-1/2">
                                          {item.quantity}
                                        </Badge>
                                      </div>
                                      {/* DETAILS */}
                                      <div className="space-y-1 text-right">
                                        <h4 className="flex items-center gap-2">
                                          <span className="hidden print:block">
                                            المنتج :{" "}
                                          </span>
                                          <Link
                                            href={item.productId?.slug ? `/product/${item.productId.slug}` : "#"}
                                          >
                                            {itemName}
                                          </Link>
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <span className="hidden print:block">
                                            المقاس :{" "}
                                          </span>
                                          <p className="text-sm text-gray-600">
                                            <span>{itemSizeObj.size}</span>{" "}
                                            <span>{itemSizeObj.range}</span>
                                          </p>
                                        </div>
                                        <div className="flex sm:items-center gap-2">
                                          <span className="hidden print:block">
                                            اللون :{" "}
                                          </span>
                                          <div
                                            className="print:hidden size-4 rounded border"
                                            style={{
                                              backgroundColor: itemColorHex,
                                            }}
                                          ></div>
                                          <p className="text-xs">
                                            {itemColorName}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="font-medium">
                                        {itemFinalPrice * item.quantity}{" "}
                                        EGP
                                      </p>
                                    </div>
                                  </div>
                                  <Separator />
                                </div>
                              );
                            })}
                          </ScrollArea>
                          <div className="space-y-3 mt-5">
                            <div className="flex items-center justify-between">
                              <h4>سعر الشحن</h4>
                              <p className="font-medium">
                                {order.shipping.shippingPrice} EGP
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <h4>إجمالي السعر</h4>
                              <p className="font-medium">
                                {order.totalPrice} EGP
                              </p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </motion.tr>
              ))}
        </TableBody>
      </Table>
    </div>
      {data && data.totalPages > 1 ? (
        <Pagination dir="rtl" className="mt-4">
          <PaginationContent dir="rtl">
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <PaginationItem key={idx} dir="rtl">
                  <Skeleton className="size-8 rounded-lg" />
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem dir="rtl">
                  <Button
                    onClick={() => {
                      update({ page: page + 1 });
                    }}
                    disabled={!data?.hasNextPage}
                    size={"sm"}
                    variant={"ghost"}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </PaginationItem>
                {[...Array(data?.totalPages)]
                  .map((_, idx) => (
                    <PaginationItem key={idx + 1} dir="rtl">
                      <Button
                        size={"sm"}
                        onClick={() => update({ page: idx + 1 })}
                        variant={data?.page === idx + 1 ? "default" : "ghost"}
                      >
                        {idx + 1}
                      </Button>
                    </PaginationItem>
                  ))
                  .reverse()}
                <PaginationItem dir="rtl">
                  <Button
                    onClick={() => {
                      update({ page: page - 1 });
                    }}
                    disabled={!data?.hasPrevPage}
                    size={"sm"}
                    variant={"ghost"}
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      ) : null}
      {/* Remove the hidden container as we now generate HTML dynamically */}
    </>
  );
};
