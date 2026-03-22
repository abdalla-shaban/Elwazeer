import { IoBagHandleOutline } from "react-icons/io5";
import { Button } from "../ui/button";
import { Heart } from "lucide-react";
import { useAddToCart } from "@/lib/api/hooks";
import { Size } from "@/types/productDetails";
import { Color } from "@/types/products";
import { toast } from "sonner";

const ProductCartActions = ({
  color,
  product,
  quantity,
  size,
}: {
  color: Color;
  product: string;
  quantity: string | number;
  size: Size;
}) => {
  const { mutateAsync: addToCart, isPending: isAddingtoCartPending } =
    useAddToCart();
  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={isAddingtoCartPending}
        onClick={() => {
          toast.promise(
            addToCart({
              item: {
                productId: product,
                sku: size.sku,
                color,
                size,
                quantity,
              },
            }),
            {
              loading: "جاري إضافة المنتج إلى السلة....",
              success: "تم إضافة المنتج إلى السلة",
              error: (err) => `حدث خطأ ما: ${err}`,
            }
          );
        }}
        className="flex-1"
      >
        أضف إالى السلة
        <IoBagHandleOutline />
      </Button>
      <Button variant={"outline"}>
        <Heart />
      </Button>
    </div>
  );
};

export default ProductCartActions;
