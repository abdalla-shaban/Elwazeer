"use client";
import CheckOutForm from "@/components/CheckOutForm";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/lib/api/hooks";
import { useShippingPrice } from "@/store";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";

const CheckoutPage = () => {
  const router = useRouter();
  const { data: cartData, isLoading: isCartDataLoading } = useCart();
  const { price } = useShippingPrice();

  useEffect(() => {
    if (cartData) {
      if (cartData.data.items.length < 1) {
        router.push("/");
      }
    }
  }, [router, cartData]);
  return (
    <>
      {!isCartDataLoading && cartData ? (
        <>
          {cartData.data.items.length > 0 ? (
            <section className="container pt-7 flex max-xl:flex-col-reverse gap-5">
              <div className="flex flex-2 flex-col shadow bg-white rounded-lg">
                <div className="p-5 w-full">
                  <div className="space-y-2">
                    <h1 className="text-xl flex items-center gap-2 md:text-3xl font-medium">
                      اتمام الطلب
                    </h1>
                    <p className="text-gray-500">أدخل البيانات لاتمام طلبك</p>
                  </div>
                </div>
                <Separator />
                <div className="p-5">
                  <CheckOutForm />
                </div>
              </div>
              <ScrollArea dir="rtl" className="flex-1 lg:h-[calc(100vh-140px)]">
                <div className="flex gap-5 h-fit p-5 flex-col shadow bg-white rounded-lg">
                  {isCartDataLoading ? (
                    <Skeleton className="h-96 rounded" />
                  ) : (
                    <>
                      {cartData?.data.items.map((item) => {
                        return (
                          <Fragment key={item.sku}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4 flex-1">
                                {/* IMAGE */}
                                <div className="relative">
                                  <Image
                                    src={item.image || ""}
                                    alt={item.name}
                                    width={80}
                                    height={80}
                                    className="size-16 rounded-md object-cover object-top border border-slate-100 bg-slate-50"
                                  />
                                  <Badge className="absolute top-0 translate-x-1/2">
                                    {item.quantity}
                                  </Badge>
                                </div>
                                {/* DETAILS */}
                                <div className="space-y-1">
                                  <h4>{item.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    <span>{item.size.size}</span>
                                  </p>
                                  {item.color && (
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="size-4 rounded border"
                                        style={{
                                          backgroundColor: item.color.hexCode,
                                        }}
                                      ></div>
                                      <p className="text-xs">
                                        {item.color.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <p className="font-medium">
                                  {item.total} EGP
                                </p>
                              </div>
                            </div>
                            <Separator />
                          </Fragment>
                        );
                      })}
                      <div className="space-y-3 mt-5">
                        <div className="flex items-center justify-between">
                          <h4>سعر الشحن</h4>
                          <p className="font-medium">{price} EGP</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <h4>إجمالي السعر</h4>
                          <p className="font-medium">
                            {cartData?.data.totalPrice
                              ? cartData?.data.totalPrice + price
                              : cartData?.data.totalPrice}{" "}
                            EGP
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </section>
          ) : (
            <section className="flex min-h-screen items-center justify-center">
              <Loader className="animate-spin text-primary size-24" />
            </section>
          )}
        </>
      ) : (
        <section className="container pt-7 flex min-h-screen items-center justify-center">
          <Loader className="animate-spin text-primary size-24" />
        </section>
      )}
    </>
  );
};

export default CheckoutPage;
