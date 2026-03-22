"use client";
import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDeleteCartProduct } from "@/lib/api/hooks";
import { toast } from "sonner";

const DeleteItemFromCart = ({ sku }: { sku: string }) => {
  const { mutateAsync: deleteItemById, isPending: isDeletingItemPending } =
    useDeleteCartProduct();
  return (
    <Button
      disabled={isDeletingItemPending}
      type="button"
      variant={"outline"}
      size={"icon-sm"}
      onClick={() =>
        toast.warning("هل انت متأكد من حذف هذا المنتج من السلة؟", {
          description: "لا يمكن التراجع عن هذا الأجراء",
          action: {
            label: "نعم",
            onClick: () => {
              toast.promise(deleteItemById({ sku }), {
                loading: "جاري الحذف",
                error: (err) => `حدث خطأ ما ${err}`,
                success: "تم حذف المنتج بنجاح",
              });
            },
          },
        })
      }
    >
      <Trash />
    </Button>
  );
};

export default DeleteItemFromCart;
