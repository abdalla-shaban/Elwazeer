import ClientCart from "@/components/cart/ClientCart";
import TotalCartCount from "@/components/cart/TotalCartCount";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "السلة",
};

const CartPage = () => {
  return (
    <section className="container pt-7 space-y-5">
      <div className="flex p-5 shadow bg-white rounded-lg items-center justify-between gap-5">
        <h1 className="text-xl flex items-center gap-2 md:text-3xl font-medium">
          السلة
          <TotalCartCount />
        </h1>
        <Button asChild>
          <Link href={"/store"}>
            اكمل التسوق
            <ArrowLeft />
          </Link>
        </Button>
      </div>
      <Separator />
      <ClientCart />
    </section>
  );
};

export default CartPage;
