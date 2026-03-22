"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useDeleteProduct,
  useProducts,
  useToggleAvilability,
  useUpdateQuery,
} from "@/lib/api/hooks";
import { ChevronLeft, ChevronRight, Edit, Loader, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import OfferDialog from "./OfferDialog";

export const ProductsTable = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useUpdateQuery({ targetURL: "admin/products" });
  const [query, setQuery] = useState<string>(searchParams.get("q") ?? "");
  const q = searchParams.get("q") ?? "";
  const page = searchParams.get("page") ?? 1;
  const updateProductQuery = useDebouncedCallback(
    (q: string) => {
      const newParams = new URLSearchParams(searchParams.toString());

      if (q) {
        newParams.set("q", q);
        newParams.set("page", "1");
      } else {
        newParams.delete("q");
      }

      router.push(`/admin/products?${newParams.toString()}`, {
        scroll: false,
      });
    },
    400, // debounce time
  );
  const { data: productsData, isLoading: isProductsDataLoading } = useProducts({
    q,
    page: +page,
  });

  const { mutateAsync: deleteProductById, isPending: isDeleteProductPending } =
    useDeleteProduct();
  const { mutate: toggleStatus, isPending: isToggleStatusPending } =
    useToggleAvilability();
  return (
    <>
      <div className="space-y-4 mb-5">
        <Input
          className="max-w-sm"
          placeholder="ابحث عن المنتج"
          value={query}
          onChange={(e) => {
            const v = e.target.value;
            setQuery(v);
            updateProductQuery(v);
          }}
        />
      </div>
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="text-right w-[320px]">المنتج</TableHead>
            <TableHead className="text-right">السعر</TableHead>
            <TableHead className="text-right">خصم</TableHead>
            <TableHead className="text-center">السعر بعد الخصم</TableHead>
            <TableHead className="text-center">المخزون</TableHead>
            <TableHead className="text-center">الحالة</TableHead>
            <TableHead className="text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isProductsDataLoading
            ? [...Array(7)].map((_, idx) => (
                <TableRow key={idx}>
                  {[...Array(7)].map((_, cellIdx) => (
                    <TableCell key={cellIdx} className="font-medium">
                      <Skeleton className="h-10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : productsData?.data.map(
                ({
                  name,
                  price,
                  isAvailable,
                  finalPrice,
                  offer,
                  slug,
                  stock,
                  images,
                  image_preview,
                  _id,
                }) => (
                  <TableRow key={_id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/product/${slug}`}
                        className="flex w-fit items-center gap-5"
                      >
                        <Image
                          src={ image_preview?.secure_url || images?.[0]?.secure_url}
                          alt={name}
                          width={50}
                          height={50}
                          className="size-10 object-cover rounded-full object-top"
                        />
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell>{price} EGP</TableCell>
                    <TableCell>
                      <OfferDialog product_id={_id} offer={offer} />
                    </TableCell>
                    <TableCell className="text-center">
                      {finalPrice} EGP
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={"outline"}>
                        {" "}
                        {stock?.manageStock ? stock?.stockQuantity : "غير محدد"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className="cursor-pointer"
                        onClick={() => {
                          if (!isToggleStatusPending) {
                            toggleStatus(_id);
                          }
                        }}
                        variant={isAvailable ? "success" : "disable"}
                      >
                        {isToggleStatusPending ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <>{isAvailable ? "نشط" : "معطل"}</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2 flex justify-center">
                        <Button size={"icon-sm"} variant={"warning"} asChild>
                          <Link href={`/admin/product/update/${slug}`}>
                            <Edit />
                          </Link>
                        </Button>
                        <Button
                          disabled={isDeleteProductPending}
                          onClick={() => {
                            toast.warning("هل انت متأكد من حذف هذا المنتج ؟", {
                              description: "لا يمكن التراجع عن هذا الأجراء",
                              action: {
                                label: "نعم",
                                onClick: () => {
                                  toast.promise(deleteProductById(_id), {
                                    loading: "جاري الحذف",
                                    error: (err) => `حدث خطأ ما ${err}`,
                                    success: "تم حذف المنتج بنجاح",
                                  });
                                },
                              },
                            });
                          }}
                          size={"icon-sm"}
                          variant={"destructive"}
                        >
                          {isDeleteProductPending ? (
                            <Loader className="animate-spin" />
                          ) : (
                            <Trash />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )}
        </TableBody>
      </Table>
      {productsData && productsData.pagination.totalPages > 1 ? (
        <Pagination dir="rtl" className="mt-4">
          <PaginationContent dir="rtl">
            {isProductsDataLoading ? (
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
                      update({ page: +page + 1 });
                    }}
                    disabled={
                      productsData?.pagination.page >=
                      productsData?.pagination.totalPages
                    }
                    size={"sm"}
                    variant={"ghost"}
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </PaginationItem>
                {[...Array(productsData?.pagination.totalPages)]
                  .map((_, idx) => (
                    <PaginationItem key={idx + 1} dir="rtl">
                      <Button
                        size={"sm"}
                        onClick={() => update({ page: idx + 1 })}
                        variant={
                          productsData?.pagination.page === idx + 1
                            ? "default"
                            : "ghost"
                        }
                      >
                        {idx + 1}
                      </Button>
                    </PaginationItem>
                  ))
                  .reverse()}
                <PaginationItem dir="rtl">
                  <Button
                    onClick={() => {
                      update({ page: +page - 1 });
                    }}
                    disabled={productsData?.pagination.page <= 1}
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
    </>
  );
};
