import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/api";

import FilterSheet from "@/components/products/FilterSheet";
import SortList from "@/components/products/SortList";
import { Metadata } from "next";
import StorePagination from "@/components/StorePagination";
import { Suspense } from "react";
import CardsListSkeleton from "@/components/CardsListSkeleton";
import SidebarFilter from "@/components/products/SidebarFilter";

export const metadata: Metadata = {
  title: "المتجر",
};

const StorePage = async ({
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
}) => {
  const data = await getProducts({
    q: (await searchParams).q || "",
    page: (await searchParams).page,
    limit: (await searchParams).limit,
    category: (await searchParams).category,
    fabric: (await searchParams).fabric,
    season: (await searchParams).season,
    minPrice: (await searchParams).minPrice,
    maxPrice: (await searchParams).maxPrice,
    color: (await searchParams).color,
    size: (await searchParams).size,
    range: (await searchParams).range,
    sort: (await searchParams).sort,
    isAvailable: "true",
  });
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar (Desktop) */}
        <SidebarFilter />

        {/* Main Content */}
        <div className="flex-1 w-full space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <h1 className="text-2xl font-black text-slate-800 hidden sm:block">المتجر</h1>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="lg:hidden">
                <FilterSheet />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-sm hidden md:block">ترتيب حسب:</span>
                <SortList />
              </div>
            </div>
          </div>

          <Suspense fallback={<CardsListSkeleton />}>
            <ProductGrid items={data?.data} />
          </Suspense>
          
          <div className="pt-8">
            <StorePagination productsData={data} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorePage;
