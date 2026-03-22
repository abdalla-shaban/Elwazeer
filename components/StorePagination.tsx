"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { useUpdateQuery } from "@/lib/api/hooks";
import { Skeleton } from "./ui/skeleton";
import { IProductsResponse } from "@/types/products";
import { useSearchParams } from "next/navigation";

const StorePagination = ({
  productsData,
}: {
  productsData: IProductsResponse;
}) => {
  const searchParams = useSearchParams();
  const { update } = useUpdateQuery({ targetURL: "store" });
  const page = searchParams.get("page") ?? 1;
  return (
    <>
      {productsData && productsData.totalPages > 1 ? (
        <Pagination dir="rtl" className="mt-4">
          <PaginationContent dir="rtl">
            {!productsData ? (
              [...Array(5)].map((_, idx) => (
                <PaginationItem key={idx} dir="rtl">
                  <Skeleton className="size-8 rounded-lg" />
                </PaginationItem>
              ))
            ) : (
              <>
                <PaginationItem dir="rtl">
                  <Button
                    onClick={() => {
                      update({ page: +page + 1 });
                    }}
                    disabled={!productsData?.hasNextPage}
                    variant={"outline"}
                    className="rounded-full size-10 p-0 border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </PaginationItem>
                {[...Array(productsData?.totalPages)]
                  .map((_, idx) => (
                    <PaginationItem key={idx + 1} dir="rtl">
                      <Button
                        onClick={() => update({ page: idx + 1 })}
                        className={`rounded-full size-10 p-0 text-sm font-bold transition-all duration-300 ${
                          productsData?.page === idx + 1 
                            ? "bg-[#D696B5] hover:bg-[#c485a3] text-white shadow-md scale-110" 
                            : "bg-transparent text-slate-600 hover:bg-slate-100"
                        }`}
                        variant={productsData?.page === idx + 1 ? "default" : "ghost"}
                      >
                        {idx + 1}
                      </Button>
                    </PaginationItem>
                  ))
                  .reverse()}
                <PaginationItem dir="rtl">
                  <Button
                    onClick={() => {
                      update({ page: +page - 1 });
                    }}
                    disabled={!productsData?.hasPrevPage}
                    variant={"outline"}
                    className="rounded-full size-10 p-0 border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                </PaginationItem>
              </>
            )}
          </PaginationContent>
        </Pagination>
      ) : null}
    </>
  );
};

export default StorePagination;
