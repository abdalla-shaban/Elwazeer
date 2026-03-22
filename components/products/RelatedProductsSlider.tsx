"use client";

import { IProductRes } from "@/types/products";
import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

interface RelatedProductsSliderProps {
  products: IProductRes[];
}

const RelatedProductsSlider = ({ products }: RelatedProductsSliderProps) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-20 px-4 md:px-8 rounded-[4rem] mt-20">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 text-center md:text-right">
          <div className="space-y-4">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl md:text-4xl font-black text-slate-900 leading-[1.1]"
            >
    منتجات قد تعجبك ايضاً
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-500 text-lg md:text-xl max-w-2xl"
            >
              قطع مختارة بعناية لتكمل إطلالتك وتناسب ذوقك الرفيع في عالم الأناقة
            </motion.p>
          </div>
        </div>

        <Carousel
          opts={{
            align: "start",
            direction: "rtl",
            dragFree: true,
          }}
          className="w-full relative"
        >
          <div className="flex flex-row-reverse justify-center md:justify-start gap-4 mb-10 md:absolute md:-top-28 md:left-4">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-full border-2 border-slate-100 bg-white hover:bg-primary hover:border-primary hover:text-white transition-all shadow-md active:scale-90" />
            <CarouselNext className="static translate-y-0 h-14 w-14 rounded-full border-2 border-slate-100 bg-white hover:bg-primary hover:border-primary hover:text-white transition-all shadow-md active:scale-90" />
          </div>

          <CarouselContent className="-ml-4 md:-ml-8 cursor-grab active:cursor-grabbing">
            <AnimatePresence mode="popLayout">
              {products.map((product, index) => (
                <CarouselItem
                  key={product._id}
                  className="pl-4 md:pl-8 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? 1 : -1 }}
                    whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.1,
                      type: "spring",
                      bounce: 0.3
                    }}
                    whileHover={{ 
                      y: -15,
                      transition: { duration: 0.3 }
                    }}
                    className="h-full py-4"
                  >
                    <ProductCard index={index} item={product} />
                  </motion.div>
                </CarouselItem>
              ))}
            </AnimatePresence>
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default RelatedProductsSlider;
