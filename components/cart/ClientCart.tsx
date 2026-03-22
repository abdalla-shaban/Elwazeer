"use client";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/api/hooks";
import { Loader, ShoppingCart, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import CartItemActions from "./CartItemActions";
import DeleteItemFromCart from "./DeleteItemFromCart";
import { Separator } from "../ui/separator";
import { Item } from "@/types/cart";

const ClientCart = () => {
  const { data: cartData, isLoading: isCartDataLoading } = useCart();
  return (
    <>
      <div className="flex max-xl:flex-col xl:items-start gap-10">
        {isCartDataLoading ? (
          <div className="flex-1 w-full space-y-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-6 rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                <Skeleton className="size-32 rounded-xl" />
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <div className="flex justify-between items-center pt-4 mt-auto">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {cartData?.data.items.length ? (
              <div className="flex-1 w-full flex flex-col gap-6">
                {cartData.data.items.map(
                  ({ productId, sku, name, image, color, size, price, quantity, total }: Item) => {
                    const primaryColor = color || null;

                    return (
                      <div 
                        key={sku} 
                        className="group flex flex-col md:flex-row gap-6 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 items-start md:items-center relative overflow-hidden"
                      >
                        {/* Image */}
                        <div className="relative shrink-0 w-full md:w-36 h-36 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
                          {image ? (
                            <Image
                              src={image}
                              alt={name}
                              width={150}
                              height={150}
                              className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <ShoppingCart className="text-slate-300 size-12" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col justify-between h-full w-full">
                          <div className="flex justify-between items-start w-full">
                            <div>
                              <Link href={`/product/${productId}`} className="hover:text-primary transition-colors">
                                <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-tight">{name}</h3>
                              </Link>
                              
                              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-medium text-slate-500">
                                {primaryColor && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-400">اللون:</span>
                                    <div className="flex items-center gap-1.5 bg-slate-50 pr-1.5 pl-3 py-1 rounded-full border border-slate-100">
                                      <div 
                                        className="size-4 rounded-full border shadow-sm"
                                        style={{ backgroundColor: primaryColor.hexCode }}
                                      />
                                      <span className="text-xs font-semibold text-slate-700">{primaryColor.name || "لا يوجد اللون"}</span>
                                    </div>
                                  </div>
                                )}
                                
                                {size && size.size && (
                                  <>
                                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs uppercase tracking-wider text-slate-400">المقاس:</span>
                                      <span className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700">{size.size}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>

                            <p className="text-xl font-black text-slate-800 hidden md:block">
                              {price?.toLocaleString()} <span className="text-sm font-bold text-slate-500">ج.م</span>
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 w-full">
                            <CartItemActions
                              sku={sku}
                              quantity={quantity}
                              stock={{ manageStock: false, stockQuantity: 999 }} // TODO: bind from product details when available
                            />
                            
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                              <p className="text-xl font-black text-slate-800 md:hidden block">
                                {price?.toLocaleString()} <span className="text-sm font-bold text-slate-500">ج.م</span>
                              </p>
                              
                              <p className="text-lg font-bold text-primary hidden md:block">
                                الإجمالي: {total?.toLocaleString()} ج.م
                              </p>

                              <DeleteItemFromCart sku={sku} />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            ) : null}
          </>
        )}

        {/* SUMMARY CARD */}
        {cartData?.data.items.length ? (
          <div className="xl:w-[400px] shrink-0 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 sticky top-24">
            <h2 className="text-2xl font-black mb-6 text-slate-800">ملخص الطلب</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-slate-600 font-medium">
                <span>إجمالي عدد المنتجات</span>
                <span>{cartData?.data.totalQuantity} منتج</span>
              </div>
              
              <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                <Info className="size-5 shrink-0 text-slate-400 mt-0.5" />
                <p>الشحن يتم حسابه في صفحة إتمام الطلب.</p>
              </div>
            </div>

            <Separator className="my-6 bg-slate-100 h-0.5" />

            <div className="flex justify-between items-end mb-8">
              <span className="text-lg font-bold text-slate-800">الإجمالي النهائي</span>
              <div className="text-right">
                {isCartDataLoading ? (
                  <Loader className="animate-spin text-slate-400 size-6" />
                ) : (
                  <p className="text-3xl font-black text-slate-900">
                    {cartData?.data.totalPrice?.toLocaleString()} <span className="text-base text-slate-500 mr-1">ج.م</span>
                  </p>
                )}
              </div>
            </div>

            <Button size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-slate-900 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0" asChild>
              <Link href={"/cart/checkout"}>
                المتابعة لإتمام الطلب
              </Link>
            </Button>
            
          </div>
        ) : null}

        {!isCartDataLoading && !cartData?.data.items.length ? (
          <div className="flex flex-col items-center justify-center p-12 w-full min-h-[500px] bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <div className="relative size-64 md:size-80 mb-8 opacity-90 drop-shadow-xl animate-in fade-in zoom-in duration-500">
              <Image
                src={"/empty-cart.svg"}
                alt="Empty Cart"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">سلة التسوق فارغة</h2>
            <p className="text-slate-500 text-lg max-w-md mb-8">
              يبدو أنك لم تضف أي منتجات إلى سلتك حتى الآن. استكشف متجرنا للعثور على ما يناسبك!
            </p>
            <Button size="lg" className="h-14 px-10 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" asChild>
              <Link href={"/store"}>ابدأ التسوق الآن</Link>
            </Button>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ClientCart;
