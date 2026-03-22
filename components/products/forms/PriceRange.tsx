"use client";
import { Slider } from "@/components/ui/slider";
import { useUpdateQuery } from "@/lib/api/hooks";
import { useState } from "react";

const PriceRange = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const { update } = useUpdateQuery({});

  const applyPrice = () => {
    update({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };
  return (
    <div className="space-y-3">
      <Slider
        value={priceRange}
        onValueChange={(e) => {
          setPriceRange(e);
          applyPrice();
        }}
        max={1000}
        step={1}
      />
      <div className="flex items-center justify-between">
        <span>{priceRange[1]} جنية</span>
        <span>{priceRange[0]} جنية</span>
      </div>
    </div>
  );
};

export default PriceRange;
