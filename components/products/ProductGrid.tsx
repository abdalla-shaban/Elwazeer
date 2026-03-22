"use client";

import { AnimatePresence } from "motion/react";
import ProductCard from "./ProductCard";
import { IProductRes } from "@/types/products";

const ProductGrid = ({ items }: { items: IProductRes[] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[400px]">
      <AnimatePresence mode="popLayout">
        {items?.map((item, idx) => (
          <ProductCard index={idx} key={item._id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
