"use client";
import { Heart, Loader } from "lucide-react";
import { Button } from "../ui/button";
// TODO: handle fill the red heart if the product is exisit
import { BsHeartFill } from "react-icons/bs";
import { useToggleWishlist, useWishlist } from "@/lib/api/hooks";
import { toast } from "sonner";
import * as pixel from "@/lib/fbPixel";
const WishlistAction = ({ product_id }: { product_id: string }) => {
  const { data } = useWishlist();
  const { mutateAsync: toggleWishlist, isPending } = useToggleWishlist();
  const isInWishlist =
    data?.wishlist.products.some((product) => product._id === product_id) ??
    false;
  if (!data) return null;
  return (
    <Button
      disabled={isPending}
      variant={"outline"}
      className="z-10 size-10 duration-300 backdrop-blur-md flex items-center justify-center rounded-full"
      onClick={() => {
        toast.promise(toggleWishlist({ product_id }), {
          loading: isInWishlist ? "جاري الإزالة..." : "جاري الأضافة...",
          success: () => {
            if (!isInWishlist) {
              pixel.event("AddToWishlist", {
                content_ids: [product_id],
                content_type: "product",
              });
            }
            return isInWishlist ? "تم الإزالة" : "تم الأضافة";
          },
          error: (err) => `حدث خطأ ما : ${err}`,
        });
      }}
    >
      {isPending ? (
        <Loader className="size-4 animate-spin" />
      ) : (
        <>
          {isInWishlist ? <BsHeartFill className="text-red-600" /> : <Heart />}
        </>
      )}
    </Button>
  );
};

export default WishlistAction;
