"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { useProducts } from "@/lib/api/hooks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
const ProductsPagination = () => {
  const { data, isLoading } = useProducts({});

  return (
    <Pagination dir="rtl">
      {data?.totalPages !== data?.page && (
        <PaginationContent dir="rtl">
          {isLoading ? (
            [...Array(5)].map((_, idx) => (
              <PaginationItem key={idx} dir="rtl">
                <Skeleton className="size-8 rounded-lg" />
              </PaginationItem>
            ))
          ) : (
            <>
              <PaginationItem dir="rtl">
                <Button
                  onClick={() => {}}
                  disabled={data?.page === data?.totalPages}
                  size={"sm"}
                  variant={"ghost"}
                >
                  <ChevronRight className="size-5" />
                </Button>
              </PaginationItem>
              {[...Array(data?.totalPages)]
                .map((_, idx) => (
                  <PaginationItem key={idx + 1} dir="rtl">
                    <Button
                      size={"sm"}
                      variant={data?.page === idx + 1 ? "default" : "ghost"}
                    >
                      {idx + 1}
                    </Button>
                  </PaginationItem>
                ))
                .reverse()}
              <PaginationItem dir="rtl">
                <Button
                  onClick={() => {}}
                  disabled={data?.page === data?.totalPages}
                  size={"sm"}
                  variant={"ghost"}
                >
                  <ChevronLeft className="size-5" />
                </Button>
              </PaginationItem>
            </>
          )}
        </PaginationContent>
      )}
    </Pagination>
  );
};

export default ProductsPagination;
