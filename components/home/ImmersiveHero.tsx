"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ImmersiveHero = () => {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 blur-3xl rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-secondary/10 translate-y-1/2 blur-3xl rounded-full" />

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-24 pb-12">
        {/* Text Content */}
        <div className="space-y-8 text-right">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase mb-4 border border-primary/20">
              وصل حديثاً • New Arrival
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
              جيل جديد من <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-primary/80 to-secondary animate-gradient">
                العبايات الـ 3D
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 font-medium max-w-xl pr-2 border-r-4 border-primary/20"
          >
            اكتشفي التميز مع مجموعتنا الحصرية من العبايات ثلاثية الأبعاد، المصممة خصيصاً لتمنحكِ إطلالة ملكية تجمع بين العراقة والحداثة.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-6 justify-start"
          >
            <Button
              asChild
              size="lg"
              className="h-16 px-10 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 group"
            >
              <Link href="/store?productType=3d">
                تسوقي الآن
                <ArrowRight className="mr-2 size-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            
            <Link 
              href="/store"
              className="text-lg font-bold text-slate-700 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              عرض كل المجموعات
              <div className="size-1.5 rounded-full bg-slate-300 group-hover:bg-primary transition-colors" />
            </Link>
          </motion.div>

          {/* Stats/Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-8 pt-6 border-t border-slate-100"
          >
            <div>
              <p className="text-3xl font-black text-slate-900">+100</p>
              <p className="text-sm text-slate-500 font-bold">تصميم فريد</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-3xl font-black text-slate-900">24h</p>
              <p className="text-sm text-slate-500 font-bold">توصيل سريع</p>
            </div>
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="relative aspect-[4/5] w-full max-w-[500px] mx-auto "
        >
          {/* Decorative frames */}
          <div className="absolute inset-4 border border-slate-200 rounded-[3rem] -z-10 translate-x-4 translate-y-4" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-[3rem] -z-10 -rotate-3" />
          
          <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden shadow-2xl shadow-primary/10 border-8 border-white">
            <Image
              src="/hero-3d.png"
              alt="Premium 3D Abaya"
              fill
              priority
              className="object-cover object-top hover:scale-105 transition-transform duration-1000"
            />
            
            {/* Visual labels */}
            <div className="absolute bottom-8 left-8 right-8 p-6 backdrop-blur-md bg-white/60 rounded-3xl border border-white/50 shadow-lg animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-tighter">Edition 2026</span>
                  <div className="flex gap-1">
                    <div className="size-2 rounded-full bg-primary" />
                    <div className="size-2 rounded-full bg-slate-400" />
                    <div className="size-2 rounded-full bg-slate-400" />
                  </div>
               </div>
               <p className="text-slate-900 font-black text-xl italic tracking-tight">Handcrafted Excellence</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImmersiveHero;
