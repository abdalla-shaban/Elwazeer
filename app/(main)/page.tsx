import CardsListSkeleton from "@/components/CardsListSkeleton";
import Banner from "@/components/products/Banner";
import ProductsList from "@/components/products/ProductsList";
import ProductSlider from "@/components/products/ProductSlider";
import { getProducts } from "@/lib/api";
import { Headset, Truck, Verified } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "الرئيسية",
  description:
    "يارا ستور هو متجر ملابس حريمي أونلاين يوفر أحدث صيحات الموضة من فساتين، بلايز، وتيشيرتات بجودة عالية وأسعار مناسبة مع توصيل سريع داخل مصر.",
  keywords: [
    "يارا ستور",
    "ملابس حريمي",
    "فساتين حريمي",
    "ملابس نسائية أونلاين",
    "متجر ملابس مصر",
    "شراء ملابس أونلاين",
    "فساتين",
    "ملابس كاجوال حريمي",
  ],
  alternates: {
    canonical: "https://elenastoreofficial.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const servicesContent = [
  {
    icon: Truck,
    title: "شحن سريع وآمن",
    desc: "نصلك أينما كنت في أسرع وقت ممكن وبكل عناية",
  },
  {
    icon: Verified,
    title: "جودة مضمونة 100%",
    desc: "جميع منتجاتنا أصلية وتخضع لأعلى معايير الجودة",
  },
  {
    icon: Headset,
    title: "خدمة عملاء على مدار 24 ساعة",
    desc: "فريق متخصص للرد على استفسارتكم ومساعدتكم",
  },
];

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
  // Fetch products for sliders
  const [bestSellers, latestProducts] = await Promise.all([
    getProducts({ limit: 8, isAvailable: "true" }), // Using default sort for both as backend limit is 12 and default sort is latest
    getProducts({ limit: 8, isAvailable: "true", category: "دريس" }), // Just to show different products for now
  ]);

  return (
    <section>
      <Banner />
      <div className="container relative space-y-10 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {servicesContent.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="space-y-4 text-center p-10 rounded-3xl bg-primary text-gray-300 border shadow"
            >
              <div className="size-14 mx-auto flex items-center justify-center rounded-lg bg-white/10">
                <Icon className="size-10 text-secondary" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg text-white font-medium">{title}</h3>
                <p className="text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <ProductSlider
          title="الاكثر مبيعا"
          subtitle="مجموعة من أرقى التصاميم التي لاقت استحسان الجميع"
          products={bestSellers.data}
        />

        <ProductSlider
          title="أحدث المنتجات"
          subtitle="استكشفي أحدث صيحات الموضة من تشكيلتنا الجديدة"
          products={latestProducts.data}
        />

        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 border-r-4 border-primary pr-4">
            تصفح جميع المنتجات
          </h2>
          <Suspense fallback={<CardsListSkeleton />}>
            <ProductsList searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
