"use client";
import { useCart } from "@/lib/api/hooks";
import { Loader } from "lucide-react";

const TotalCartCount = () => {
  const { data: cartData, isLoading: isCartDataLoading } = useCart();
  if (isCartDataLoading)
    return (
      <span>
        <Loader className="animate-spin size-4" />
      </span>
    );
  return <span className="text-primary">({cartData?.data.totalItems})</span>;
};

export default TotalCartCount;
