import { ShoppingBag, Sparkles, Star, Zap } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "مجموعة الـ 3D",
    subtitle: "تصاميم بارزة وفريدة",
    href: "/store?productType=3d",
    icon: Sparkles,
    className: "md:col-span-2 md:row-span-2 bg-slate-900 text-white",
    image: "/hero-3d.png", // Reusing the high-quality image
  },
  {
    title: "الأكثر مبيعاً",
    subtitle: "اختيارات عملائنا",
    href: "/store?sort=best_selling",
    icon: Star,
    className: "md:col-span-1 md:row-span-1 bg-primary text-white",
  },
  {
    title: "وصل حديثاً",
    subtitle: "اكتشفي الجديد",
    href: "/store?sort=latest",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1 bg-white border border-slate-100",
  },
  {
    title: "كل المنتجات",
    subtitle: "تصفحي المتجر بالكامل",
    href: "/store",
    icon: ShoppingBag,
    className: "md:col-span-2 md:row-span-1 bg-secondary text-slate-800",
  },
];

const BentoCategories = () => {
  return (
    <section className="container py-24">
      <div className="flex flex-col items-center mb-16 text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-primary font-bold tracking-widest uppercase text-sm mb-4"
        >
          اكتشفي مجموعتنا
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-slate-900"
        >
          تسوقي حسب الفئة
        </motion.h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[800px] md:h-[600px]">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className={`relative group rounded-[2.5rem] overflow-hidden p-8 flex flex-col justify-end transition-all ${cat.className}`}
          >
            {cat.image && (
              <div className="absolute inset-0 z-0">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
              </div>
            )}

            <div className="relative z-10 space-y-2">
              <div
                className={`size-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${cat.image ? "bg-white/10 backdrop-blur-md" : "bg-black/5"}`}
              >
                <cat.icon className="size-6" />
              </div>
              <h3 className="text-2xl font-black">{cat.title}</h3>
              <p className="opacity-80 font-medium">{cat.subtitle}</p>

              <Link
                href={cat.href}
                className="inline-flex items-center gap-2 pt-4 font-bold text-sm uppercase tracking-wider group/link"
              >
                استكشفي الآن
                <div className="size-1 rounded-full bg-current group-hover/link:scale-[3] transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BentoCategories;
