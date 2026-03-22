"use client";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useUserOrders } from "@/lib/api/hooks";
import { Loader, PackageSearch, MapPin, Phone, CreditCard, CalendarDays, ChevronDown, Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import * as motion from "motion/react-client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Item, Order } from "@/types/orders";

const OrderStatus = [
  { lable: "جديد", value: "new" },
  { lable: "جاري الشحن", value: "confirmed" },
  { lable: "تم الشحن", value: "shipped" },
  { lable: "تم التسليم", value: "delivered" },
  { lable: "ملغي", value: "cancelled" },
  { lable: "فشل", value: "failed" },
];

const UserOrdersPage = () => {
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const { data: ordersData, isLoading: isOrdersDataLoading } = useUserOrders();
  const router = useRouter();

  const detectCurrentStatus = (value: string) => {
    return OrderStatus.filter((item) => item.value === value)[0];
  };

  const detectCurrentBadgeColor = (value: string) => {
    switch (value) {
      case "new": return "new";
      case "confirmed": return "confirmed";
      case "shipped": return "shipped";
      case "delivered": return "delivered";
      case "cancelled": return "cancelled";
      case "failed": return "failed";
      default: return "new";
    }
  };

  useEffect(() => {
    if (!userData?.data && !isUserDataLoading) {
      router.push("/signin");
    }
  }, [router, userData, isUserDataLoading]);

  return (
    <>
      {!isUserDataLoading && userData ? (
        <section className="container max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
              <PackageSearch className="size-6 text-primary" />
            </div>
            <h1 className="font-black text-2xl md:text-4xl text-slate-800">طلباتي</h1>
          </div>
          
          <div className="space-y-6">
            {isOrdersDataLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-[24px] border border-slate-100 p-6 space-y-4 shadow-sm">
                  <div className="flex justify-between"><Skeleton className="h-6 w-32" /><Skeleton className="h-6 w-24" /></div>
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : ordersData?.data?.length === 0 ? (
              <div className="bg-white rounded-[32px] border border-slate-100 p-12 text-center flex flex-col items-center justify-center">
                <Package className="size-16 text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-700">لا توجد طلبات سابقة</h3>
                <p className="text-slate-500 mt-2">لم تقم بإجراء أي طلبات حتى الآن.</p>
              </div>
            ) : (
              ordersData?.data?.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white rounded-[24px] border border-slate-100 shadow-[0_2px_15px_-5px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-slate-50/50 p-5 sm:px-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {new Date(order.createdAt).toLocaleDateString("ar-EG", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 mb-0.5">الإجمالي</p>
                        <p className="font-black text-lg text-slate-800">{order.totalPrice} <span className="text-sm font-bold text-slate-500">EGP</span></p>
                      </div>
                      <Badge variant={detectCurrentBadgeColor(order.status)} className="px-3 py-1 shadow-sm text-sm">
                        {detectCurrentStatus(order.status)?.lable}
                      </Badge>
                    </div>
                  </div>

                  {/* Order Body - Products */}
                  <div className="p-5 sm:p-8 space-y-6">
                    <div className="space-y-5">
                      {order.items.map((item, idx) => {
                        const { name, image, color, quantity, size, price, productId } = item;
                        const productData = (productId && typeof productId !== 'string') ? (productId as import('@/types/orders').ProductId) : null;
                        const itemName = name || productData?.name || "Product";
                        const itemImage = typeof image === 'string' ? image : image?.secure_url || productData?.images?.[0]?.secure_url || "/demo.jpg";
                        
                        return (
                        <Fragment key={idx}>
                          <div className="flex items-start md:items-center gap-4 sm:gap-6">
                            <div className="relative shrink-0">
                              <Image
                                src={itemImage}
                                alt={itemName}
                                width={120}
                                height={150}
                                className="w-20 h-24 sm:w-24 sm:h-32 object-cover object-top rounded-xl border border-slate-100 shadow-sm"
                              />
                              <span className="absolute -top-2 -right-2 bg-slate-800 text-white font-bold text-xs size-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                {quantity}
                              </span>
                            </div>
                            
                            <div className="flex-1 space-y-2">
                              <h3 className="font-bold text-base sm:text-lg text-slate-800 line-clamp-2 leading-snug">
                                {itemName}
                              </h3>
                              
                              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                  <span
                                    className="size-3 rounded-full border border-slate-200"
                                    style={{ backgroundColor: color?.hexCode || "#000" }}
                                  />
                                  <span className="font-medium text-slate-600">{color?.name || "N/A"}</span>
                                </span>
                                
                                <span className="bg-slate-50 px-2 py-1 rounded-md border border-slate-100 font-medium text-slate-600">
                                  مقاس: <strong className="text-slate-800">{size.size}</strong> <span className="text-slate-400">({size.range})</span>
                                </span>
                              </div>
                              
                              <div className="pt-1">
                                <p className="font-bold text-primary">{price} <span className="text-xs font-normal text-slate-500">EGP</span> <span className="text-slate-400 text-xs font-normal">/ للقطعة</span></p>
                              </div>
                            </div>
                          </div>
                          {order.items.length - 1 !== idx && (
                            <Separator className="bg-slate-50" />
                          )}
                        </Fragment>
                        );
                      })}
                    </div>

                    {/* Delivery Info Accordion */}
                    <Collapsible className="bg-slate-50/50 border border-slate-100 rounded-2xl group">
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-bold text-slate-700 hover:text-primary transition-colors">
                        <span className="flex items-center gap-2">
                          <MapPin className="size-4" />
                          تفاصيل التوصيل
                        </span>
                        <span className="flex items-center gap-2 text-sm text-slate-400 font-normal">
                          <CreditCard className="size-4" /> {order.payment.method}
                          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
                        </span>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <Separator className="mb-4 bg-slate-100" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-slate-400 text-xs">المستلم</p>
                            <p className="font-bold text-slate-800 capitalize">{order.shipping.name}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400 text-xs">رقم الهاتف</p>
                            <p className="font-medium text-slate-700 dir-ltr text-right sm:text-left">{order.shipping.phone} {order.shipping.phone2 && `/ ${order.shipping.phone2}`}</p>
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <p className="text-slate-400 text-xs">عنوان التوصيل</p>
                            <p className="font-medium text-slate-700">
                              {order.shipping.governorate} - {order.shipping.city}
                              <br />
                              <span className="text-slate-500">{order.shipping.address} {order.shipping.building && ` - ${order.shipping.building}`}</span>
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>
      ) : (
        <section className="flex min-h-screen items-center justify-center">
          <Loader className="animate-spin text-primary size-12" />
        </section>
      )}
    </>
  );
};

export default UserOrdersPage;
