"use client";

import { useOrderStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  Home,
  Package,
  Phone,
  MapPin,
  Building2,
  ShoppingBag,
  CreditCard,
  Truck,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const ThankYouPage = () => {
  const { currentOrder, setCurrentOrder } = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    // If no order is found in state, redirect home
    if (!currentOrder) {
      router.push("/");
    }
  }, [currentOrder, router]);

  if (!currentOrder) {
    return null;
  }

  // Calculate Subtotal (Total Price - Shipping Cost if it's included in totalPrice)
  // Backend often sends totalPrice as sum of items + shipping
  const shippingCost = currentOrder.shipping.shippingPrice || 0;
  const subTotal = currentOrder.totalPrice - shippingCost;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-50 overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 flex flex-col items-center gap-6">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20"
            >
              <CheckCircle2 className="size-12 md:size-16 text-green-400" />
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                تم استلام طلبك بنجاح
              </h1>
              <p className="text-slate-400 text-lg font-medium">
                شكراً لتسوقك معنا، سنقوم بالتواصل معك قريباً لتأكيد الطلب
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 mt-2">
              <span className="text-white/60 text-sm">رقم الطلب المرجعي: </span>
              <span className="font-mono font-bold text-primary text-xl tracking-wider">
                #{currentOrder._id.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 space-y-12">
          {/* Products List */}
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-r-4 border-primary pr-4">
              <Package className="size-6 text-primary" />
              محتويات طلبك
            </h2>
            <div className="grid gap-6">
              {currentOrder.items.map((item, idx) => {
                const product = typeof item.productId === "string" ? null : item.productId;
                const itemName = item.name || (product ? product.name : "منتج غير معروف");
                
                // Determine image source
                let imageSrc = "/demo.jpg";
                if (typeof item.image === "string") {
                  imageSrc = item.image;
                } else if (item.image?.secure_url) {
                  imageSrc = item.image.secure_url;
                } else if (product) {
                  // Check various places for image in product object
                  imageSrc = (product as any).image_preview?.secure_url || product.images?.[0]?.secure_url || "/demo.jpg";
                }

                return (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="flex gap-4 md:gap-6 items-center p-4 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-colors duration-300"
                  >
                    <div className="relative size-20 md:size-28 shrink-0 rounded-2xl overflow-hidden border border-slate-200 bg-white">
                      <Image
                        src={imageSrc}
                        alt={itemName}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-black text-slate-900 text-lg md:text-xl line-clamp-1">
                        {itemName}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {item.color && (
                          <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-600">
                            <span className="size-3 rounded-full" style={{ backgroundColor: item.color.hexCode }} />
                            {item.color.name}
                          </div>
                        )}
                        {item.size && (
                          <div className="bg-white px-3 py-1 rounded-full border border-slate-100 text-xs font-bold text-slate-600">
                             المقاس: {item.size.size}
                          </div>
                        )}
                      </div>
                      <p className="text-slate-500 font-bold text-sm">
                        <span className="text-primary">{item.quantity}</span> وحدة × {item.price / item.quantity} EGP
                      </p>
                    </div>
                    <div className="text-left font-black text-slate-900 text-lg md:text-xl">
                      {item.price} <span className="text-xs text-slate-400">EGP</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <Separator className="bg-slate-100" />

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Delivery Info */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-r-4 border-primary pr-4">
                <Truck className="size-6 text-primary" />
                معلومات التوصيل
              </h2>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="space-y-1">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">الاسم بالكامل</p>
                  <p className="text-slate-900 font-black text-lg">{currentOrder.shipping.name}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">رقم الهاتف</p>
                    <p className="text-slate-900 font-bold" dir="ltr">{currentOrder.shipping.phone}</p>
                  </div>
                  {currentOrder.shipping.phone2 && (
                    <div className="space-y-1">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">هاتف بديل</p>
                      <p className="text-slate-900 font-bold" dir="ltr">{currentOrder.shipping.phone2}</p>
                    </div>
                  )}
                </div>

                <Separator className="bg-slate-200/50" />

                <div className="space-y-2">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">عنوان التوصيل</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="size-4 text-primary shrink-0 mt-1" />
                    <p className="text-slate-800 font-bold leading-relaxed">
                      {currentOrder.shipping.governorate}، {currentOrder.shipping.city}
                      <br />
                      {currentOrder.shipping.address}
                      {currentOrder.shipping.building && <span className="block text-slate-500 font-medium">مبنى: {currentOrder.shipping.building}</span>}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Summary */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3 border-r-4 border-primary pr-4">
                <CreditCard className="size-6 text-primary" />
                ملخص الدفع
              </h2>
              <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 size-32 bg-primary/20 rounded-full blur-2xl" />
                
                <div className="space-y-5 relative z-10">
                  <div className="flex justify-between items-center text-slate-400 font-bold">
                    <span>قيمة المشتريات:</span>
                    <span className="text-white">{subTotal} EGP</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400 font-bold">
                    <span>مصاريف الشحن:</span>
                    <span className="text-white">{shippingCost} EGP</span>
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-bold">المبلغ الإجمالي:</span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-primary leading-none block">
                        {currentOrder.totalPrice}
                      </span>
                      <span className="text-sm text-primary/80 font-bold">EGP</span>
                    </div>
                  </div>

                  <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-xl text-center">
                    <p className="text-sm font-bold text-slate-300">طريقة الدفع: الدفع عند الاستلام (COD)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-8 md:p-12 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Button asChild size="lg" className="px-8 rounded-2xl h-14 text-lg font-bold">
              <Link href="/" onClick={() => setCurrentOrder(null)}>
                <Home className="ml-2 size-5" />
                العودة للرئيسية
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 rounded-2xl h-14 text-lg font-bold border-slate-200">
              <Link href="/store" onClick={() => setCurrentOrder(null)}>
                أكمل التسوق
                <ChevronLeft className="mr-2 size-5" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <ShoppingBag className="size-5" />
            <span className="font-bold">استمتعي بطلبيتك الجديدة!</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
