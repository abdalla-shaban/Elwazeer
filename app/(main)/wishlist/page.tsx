"use client";
import CardsListSkeleton from "@/components/CardsListSkeleton";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/api/hooks";
import Image from "next/image";
import Link from "next/link";

const WishlistPage = () => {
  const { data: wishlistData, isLoading: isWishlistDataLoading } =
    useWishlist();
  return (
    <section className="container mt-7 p-5 md:p-10 space-y-5 md:space-y-10 bg-white rounded-lg border shadow">
      <h1 className="text-xl md:text-3xl font-bold">قائمة المفضلة</h1>
      {!isWishlistDataLoading && wishlistData ? (
        wishlistData.wishlist.products.length ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-sm:gap-x-2 gap-5 pb-10">
            {wishlistData.wishlist.products.map((item, idx) => (
              <ProductCard index={idx} key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            <Image
              src={"/empty-whislist.svg"}
              alt="Empty Wishlist"
              width={450}
              height={450}
              className="size-[250px] mx-auto object-contain object-center md:size-[450px]"
            />
            <div className="text-center space-y-5 text-lg">
              <p>قائمة المفضلات فارغه اكمل التسوق</p>
              <Button size={"lg"} asChild>
                <Link href={"/store"}>اكمل التسوق</Link>
              </Button>
            </div>
          </div>
        )
      ) : (
        <CardsListSkeleton />
      )}
    </section>
  );
};

export default WishlistPage;
