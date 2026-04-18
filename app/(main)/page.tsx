import CardsListSkeleton from "@/components/CardsListSkeleton";
import BentoCategories from "@/components/home/BentoCategories";
import GlassFeatureSection from "@/components/home/GlassFeatureSection";
import ProductSlider from "@/components/products/ProductSlider";
import ProductsList from "@/components/products/ProductsList";
import { getProducts } from "@/lib/api";
import * as motion from "motion/react-client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "وزير العباية ستور هو متجر ملابس حريمي أونلاين يوفر أحدث صيحات الموضة من فساتين، بلايز، وتيشيرتات بجودة عالية وأسعار مناسبة مع توصيل سريع داخل مصر.",
  keywords: [
    "وزير العباية ستور",
    "ملابس حريمي",
    "فساتين حريمي",
    "ملابس نسائية أونلاين",
    "متجر ملابس مصر",
    "شراء ملابس أونلاين",
    "فساتين",
    "ملابس كاجوال حريمي",
  ],
  alternates: {
    canonical: "https://wazeerstoreofficial.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    page: number;
    limit: number;
    category: string;
    fabric: string;
    season: string;
    minPrice: number;
    maxPrice: number;
    color: string;
    size: string;
    range: string;
    q: string;
    sort: string;
  }>;
}) {
  // Fetch products for different sections
  const [bestSellers, latestProducts, featured3D] = await Promise.all([
    getProducts({ limit: 8, isAvailable: "true", sort: "best_selling" }),
    getProducts({ limit: 8, isAvailable: "true", sort: "latest" }),
    getProducts({ limit: 8, isAvailable: "true", sort: "3d" }),
  ]);

  return (
    <>
      {/* 6. Custom Brand Banner */}
      <section className="container mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[200px] md:h-[400px] rounded-lg md:rounded-xl overflow-hidden group shadow-2xl shadow-primary/20"
        >
          <Link href="/store?productType=3d">
            <Image
              src="/newBanner.jpeg"
              alt="Wazeer 3D Banner"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
          </Link>
        </motion.div>
      </section>

      {/* 4. Bento Category Navigation */}
      <BentoCategories />

      <div className="space-y-32">
        {/* 3. Featured 3D Abayas Section */}
        {featured3D.data.length > 0 && (
          <section className="relative">
            <div className="absolute inset-0 bg-slate-50/50 -z-10 skew-y-1" />
            <ProductSlider
              title="مجموعة الـ 3D الفاخرة"
              subtitle="تصاميم ثلاثية الأبعاد تأخذكِ لعالم من الأناقة والتميز"
              products={featured3D.data}
            />
          </section>
        )}

        {/* 5. Best Sellers */}
        <div className="container">
          <ProductSlider
            title="الأكثر رواجاً"
            subtitle="القطع التي عشقها الجميع وتصدرت مبيعاتنا"
            products={bestSellers.data}
          />
        </div>

        {/* 7. Latest Arrivals */}
        <div className="container">
          <ProductSlider
            title="أحدث الإضافات"
            subtitle="جديدنا لهذا الموسم، اختاري ما يناسب ذوقك الرفيع"
            products={latestProducts.data}
          />
        </div>
        {/* 2. Brand Features (Glass Style) */}
        <GlassFeatureSection />

        {/* 8. Browse All Products with Infinite Scroll/Grid */}
        <div className="container pb-24 space-y-12">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-4 px-6 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1.5 after:bg-primary after:rounded-full pb-4">
              اكتشفي تشكيلتنا الكاملة
            </h2>
            <p className="text-slate-500 font-medium">
              كل ما تحتاجينه في مكان واحد
            </p>
          </div>
          <Suspense fallback={<CardsListSkeleton />}>
            <ProductsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </>
  );
}
