"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAddToCart } from "@/lib/api/hooks";
import * as pixel from "@/lib/fbPixel";
import { Color, Product } from "@/types/productDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, ShoppingCart, CreditCard, X as LucideX } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Separator } from "../ui/separator";
import BuyNow from "./forms/BuyNow";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  colorId: z.string().min(1, "يجب اختيار لون"),
  sizeId: z.string().min(1, "يجب اختيار مقاس"),
});

type FormData = z.infer<typeof formSchema>;

interface ProductDetailsFormActionsProps {
  colors: Color[];
  productId: string;
  item: Product;
  onColorChange?: (color: Color) => void;
  selectedColor?: Color | null;
}

const ProductDetailsFormActions = ({
  colors,
  productId,
  item,
  onColorChange,
  selectedColor: externalSelectedColor,
}: ProductDetailsFormActionsProps) => {
  const [isBuyNowSheetOpen, setIsBuyNowSheetOpen] = useState<boolean>(false);
  const { mutateAsync: addToCart, isPending: isAddingtoCartPending } =
    useAddToCart();

  // Determine initial color and size
  const initialColor = useMemo(() => {
    return externalSelectedColor || colors.find((c) => c.isAvailable) || colors[0];
  }, [externalSelectedColor, colors]);

  const initialSize = useMemo(() => {
    return initialColor?.sizes?.find((s) => s.isAvailable) || initialColor?.sizes?.[0];
  }, [initialColor]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colorId: initialColor?._id || "",
      sizeId: initialSize?._id || "",
    },
  });

  const watchedColorId = useWatch({
    control: form.control,
    name: "colorId",
  });

  // Derived state for the current full color object
  const currentColor = useMemo(
    () => colors.find((c) => c._id === watchedColorId) || initialColor,
    [colors, watchedColorId, initialColor],
  );

  const currentSizes = useMemo(
    () => currentColor?.sizes || [],
    [currentColor],
  );

  const availableSizes = useMemo(
    () => currentSizes.filter((s) => s.isAvailable),
    [currentSizes],
  );

  // Sync color from external change (e.g. gallery thumbnail click)
  useEffect(() => {
    if (externalSelectedColor && externalSelectedColor._id !== watchedColorId) {
      form.setValue("colorId", externalSelectedColor._id);
    }
  }, [externalSelectedColor, watchedColorId, form]);

  // Sync size when color changes
  useEffect(() => {
    const currentSizeId = form.getValues("sizeId");
    const stillAvailable = availableSizes.find((s) => s._id === currentSizeId);
    if (!stillAvailable && availableSizes.length > 0) {
      form.setValue("sizeId", availableSizes[0]._id);
    }
  }, [watchedColorId, availableSizes, form]);

  const handleAddToCart = useCallback((data: FormData) => {
    const color = colors.find((c) => c._id === data.colorId);
    const size = color?.sizes.find((s) => s._id === data.sizeId);

    if (!color || !size) return;

    toast.promise(
      addToCart({
        item: {
          productId,
          sku: size.sku,
          quantity: 1,
          size: {
            _id: size._id,
            size: size.size,
            range: size.range,
          },
          color: {
            _id: color._id,
            name: color.name,
            hexCode: color.hexCode,
          },
        },
      }),
      {
        loading: "جاري إضافة المنتج إلى السلة....",
        success: () => {
          pixel.event("AddToCart", {
            content_category: item.category,
            content_ids: productId,
            content_name: item.name,
            content_type: "product_group",
            contents: item,
            currency: "EGP",
            num_items: 1,
            value: item.finalPrice,
          });
          return "تم إضافة المنتج إلى السلة";
        },
        error: (err) => `حدث خطأ ما: ${err}`,
      },
    );
  }, [addToCart, productId, item, colors]);

  const onFormSubmit = form.handleSubmit(handleAddToCart);

  return (
    <div className="space-y-10">
      <form
        id="add-to-cart-form"
        onSubmit={onFormSubmit}
        className="space-y-8"
      >
        {/* COLOR SELECTION */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xl font-black text-slate-800">
              الألوان المتوفرة:
            </label>
            <span className="text-sm font-bold text-primary bg-primary/5 px-3 py-1 rounded-full">
              {currentColor?.name}
            </span>
          </div>
          <Controller
            name="colorId"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                className="flex flex-wrap gap-4"
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  const color = colors.find((c) => c._id === val);
                  if (color && onColorChange) onColorChange(color);
                }}
              >
                {colors?.map((color) => (
                  <div key={color._id} className="relative group">
                    <RadioGroupItem
                      value={color._id}
                      id={`color-${color._id}`}
                      className="sr-only"
                      disabled={!color.isAvailable}
                    />
                    <label
                      htmlFor={`color-${color._id}`}
                      className={cn(
                        "relative flex size-12 items-center justify-center rounded-full border-4 transition-all duration-300 ring-offset-2",
                        color.isAvailable ? "cursor-pointer hover:scale-110" : "opacity-50 cursor-not-allowed",
                        field.value === color._id && color.isAvailable
                          ? "border-white ring-2 ring-primary scale-110 shadow-lg"
                          : "border-transparent ring-0",
                        color.isAvailable && field.value !== color._id && "hover:ring-2 hover:ring-slate-200"
                      )}
                      style={{ backgroundColor: color.hexCode }}
                      title={color.name}
                    >
                      {!color.isAvailable && (
                        <LucideX className="absolute inset-0 m-auto text-white drop-shadow-md size-6" />
                      )}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        {/* SIZE SELECTION */}
        <div className="space-y-5">
          <label className="text-xl font-black text-slate-800">
            الأحجام المتوفرة:
          </label>
          <Controller
            name="sizeId"
            control={form.control}
            render={({ field }) => (
              <RadioGroup
                className="flex flex-wrap gap-3"
                value={field.value}
                onValueChange={field.onChange}
              >
                {currentSizes.length > 0 ? (
                  currentSizes.map((size) => (
                    <div key={size._id} className="relative flex-1 min-w-[120px]">
                      <RadioGroupItem
                        value={size._id}
                        id={`size-${size._id}`}
                        disabled={!size.isAvailable}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`size-${size._id}`}
                        className={cn(
                          "relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300",
                          size.isAvailable 
                            ? "cursor-pointer hover:bg-slate-50" 
                            : "opacity-50 cursor-not-allowed border-slate-200 bg-slate-50/50",
                          field.value === size._id && size.isAvailable
                            ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                            : "border-slate-200 bg-white"
                        )}
                      >
                        <span
                          className={cn(
                            "text-lg font-black transition-colors relative z-10",
                            field.value === size._id && size.isAvailable
                              ? "text-primary"
                              : "text-slate-800",
                          )}
                        >
                          {size.size}
                        </span>
                        {size.range && (
                          <span className="text-xs text-slate-500 font-medium text-center mt-1 relative z-10">
                            {size.range}
                          </span>
                        )}
                        {!size.isAvailable && (
                          <LucideX className="absolute inset-0 m-auto text-slate-400 opacity-30 drop-shadow-sm size-10 z-0" />
                        )}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="w-full p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 font-bold text-center">
                    لا توجد أحجام متوفرة لهذا اللون حالياً
                  </div>
                )}
              </RadioGroup>
            )}
          />
        </div>
      </form>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Sheet open={isBuyNowSheetOpen} onOpenChange={setIsBuyNowSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="default"
              className="flex-1 h-16 rounded-2xl bg-[#D696B5] hover:bg-[#c485a3] text-white text-xl font-black transition-all active:scale-95 shadow-lg shadow-[#D696B5]/30 group"
            >
              <span>اشترِ الآن</span>
              <CreditCard className="mr-2 size-6 group-hover:translate-x-1" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[95vh] rounded-t-[3rem] overflow-y-auto no-scrollbar pt-10 px-6"
          >
            <div className="max-w-2xl mx-auto space-y-8">
              <SheetHeader>
                <SheetTitle className="text-3xl font-black text-center">
                  أكمل طلبك الآن
                </SheetTitle>
                <SheetDescription className="text-center text-lg font-medium">
                  أدخل بياناتك لإتمام الشراء بسرعة وسهولة
                </SheetDescription>
              </SheetHeader>
              <Separator className="bg-slate-100 h-0.5 rounded-full" />
              <BuyNow
                colors={colors}
                product={item}
                setIsBuyNowSheetOpen={setIsBuyNowSheetOpen}
                defaultColor={currentColor || undefined}
                defaultSize={availableSizes.find(
                  (s) => s._id === form.getValues("sizeId"),
                )}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button
          type="submit"
          form="add-to-cart-form"
          disabled={isAddingtoCartPending}
          className="flex-1 h-16 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white text-xl font-black transition-all active:scale-95 shadow-lg shadow-slate-900/20 group"
        >
          <span>إضافة للسلة</span>
          {isAddingtoCartPending ? (
            <Loader className="mr-2 animate-spin size-6" />
          ) : (
            <ShoppingCart className="mr-2 size-6 group-hover:-translate-y-1" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailsFormActions;

