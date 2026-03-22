import { IProductRes } from "@/types/products";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { MdAddShoppingCart } from "react-icons/md";
import { Button } from "../ui/button";
import WishlistAction from "./WishlistAction";

const ProductCard = ({ item, index }: { item: IProductRes; index: number }) => {
  return (
    <motion.div
      layout
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ delay: (index % 12) * 0.05, duration: 0.4, ease: "easeOut" }}
      className="group relative bg-[#F9FAFB] border border-[#F3F4F6] rounded-[24px] overflow-hidden hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50 rounded-[20px] m-1.5">
        <Link href={`/product/${item.slug}`} className="block w-full h-full">
          <Image
            src={item?.image_preview?.secure_url || "/demo.jpg"}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-in-out"
          />
        </Link>
        
        {/* Badges / Actions */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2 pointer-events-auto">
            {item.offer.isAvailable && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm border border-red-400/20">
                %{item.offer.percent} خصم
              </span>
            )}
          </div>
          <div className="pointer-events-auto shadow-sm overflow-hidden size-10 rounded-full flex items-center justify-center bg-white/70 hover:bg-white backdrop-blur-md transition-colors duration-300">
            <WishlistAction product_id={item._id} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex flex-col flex-1 justify-between gap-4">
        <Link href={`/product/${item.slug}`} className="block text-center mt-2">
          <h3 className="font-extrabold text-slate-800 text-lg sm:text-2xl line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {item.name}
          </h3>
        </Link>
      </div>

      {/* Footer (Price & Cart) */}
      <div className="px-5 pb-5 mt-auto">
        <Link href={`/product/${item.slug}`} className="flex items-center justify-between pt-2">
          <Button 
            variant="outline"
            className="rounded-full size-11 sm:size-12 bg-white border-slate-200 hover:text-primary hover:border-primary"
            title="أضف إلى السلة"
          >
            <MdAddShoppingCart className="size-5 sm:size-6" />
          </Button>

          <div className="flex flex-col gap-0 items-end">
            {item.offer.isAvailable && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-bold">
                {item.price} EGP
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-slate-900">
              {item.offer.isAvailable ? item.finalPrice : item.price} <span className="text-xs sm:text-sm text-slate-500 mr-1">EGP</span>
            </span>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
