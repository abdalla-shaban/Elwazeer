"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useBuyNow, useSettings } from "@/lib/api/hooks";
import * as pixel from "@/lib/fbPixel";
import { useOrderStore, useShippingPrice } from "@/store";
import { Item } from "@/types/orders";
import { Color, Product } from "@/types/productDetails";
import { SizeDescription } from "@/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Palette } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type RawItem = Omit<Item, "productId"> & { productId: string };

const formSchema = z.object({
  name: z.string().min(2, "الأسم مطلوب"),
  phone: z.string().max(11, "رقم هاتف غير صحيح").min(11, "رقم هاتف غير صحيح"),
  phone2: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .refine((val) => !val || val.length === 11, "رقم هاتف غير صحيح")
    .optional(),
  address: z.string().min(3, "العنوان مطلوب"),
  building: z.string(),
  city: z.string().min(2, "المدينة مطلوبة"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  email: z
    .string()
    .email("بريد إلكتروني غير صحيح")
    .optional()
    .or(z.literal("")),
  note: z.string().optional(),
  colors: z
    .array(
      z.object({
        name: z.string(),
        hexCode: z.string(),
        _id: z.string().optional(),
        id: z.string().optional(),
      })
    )
    .min(1, "يجب اختيار لون"),
  sizes: z
    .array(
      z.object({
        size: z.string(),
        range: z.string(),
        _id: z.string().optional(),
      })
    )
    .min(1, "يجب اختيار مقاس"),
});

const BuyNow = ({
  colors,
  product,
  setIsBuyNowSheetOpen,
  defaultColor,
  defaultSize,
}: {
  colors: Color[];
  product: Product;
  setIsBuyNowSheetOpen: Dispatch<SetStateAction<boolean>>;
  defaultColor?: Color;
  defaultSize?: any;
}) => {
  const { price: shippingPrice, setPrice } = useShippingPrice();
  const { mutateAsync: buyNow, isPending: isBuyNowPending } = useBuyNow();
  const { data: settingsData } = useSettings();
  const { setCurrentOrder } = useOrderStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      colors: defaultColor ? [defaultColor] : colors?.length > 0 ? [colors[0]] : [],
      sizes: defaultSize ? [defaultSize] : [],
      address: "",
      building: "",
      city: "",
      governorate: "",
      name: "",
      phone: "",
      phone2: "",
      email: "",
      note: "",
    },
  });

  const watchedColors = useWatch({ control: form.control, name: "colors" });
  const watchedGovernorate = useWatch({
    control: form.control,
    name: "governorate",
  });

  const selectedColorHex = watchedColors?.[0]?.hexCode;

  const availableSizes = useMemo(() => {
    if (!selectedColorHex || !product.colors) return [];
    const colorObj = product.colors.find((c) => c.hexCode === selectedColorHex);
    return colorObj?.sizes || [];
  }, [selectedColorHex, product.colors]);

  // Sync size selection when color changes
  useEffect(() => {
    const currentSize = form.getValues("sizes")?.[0];
    if (currentSize && availableSizes.length > 0) {
      const isStillAvailable = availableSizes.find(
        (s: any) =>
          s._id === currentSize._id ||
          (s.size === currentSize.size && s.range === currentSize.range)
      );
      if (!isStillAvailable) {
        form.setValue("sizes", [availableSizes[0]]);
      }
    } else if (availableSizes.length > 0 && (!watchedColors || watchedColors.length === 0)) {
       // if no color selected (shouldnt happen based on defaults)
    }
  }, [availableSizes, form]);

  useEffect(() => {
    form.setValue("city", "", { shouldValidate: !!watchedGovernorate });
  }, [watchedGovernorate, form]);

  const governorates = settingsData?.settings.areas
    ? Object.keys(settingsData.settings.areas)
    : settingsData?.settings.shippingRates
      ? Object.keys(settingsData.settings.shippingRates)
      : [];

  const cities =
    watchedGovernorate && settingsData?.settings.areas?.[watchedGovernorate]
      ? settingsData.settings.areas[watchedGovernorate]
      : [];

  useEffect(() => {
    pixel.event("InitiateCheckout", {
      content_ids: [product._id],
      content_type: "product",
      value: product.finalPrice,
      currency: "EGP",
    });
  }, [product._id, product.finalPrice]);

  function onSubmit(data: z.infer<typeof formSchema>) {
    const selectedColor = data.colors[0];
    const selectedSize = data.sizes[0];

    const productActiveColor = product.colors?.find(
      (c) => c.hexCode === selectedColor.hexCode
    );
    const productActiveSize = productActiveColor?.sizes?.find(
      (s) =>
        s._id === selectedSize._id ||
        (s.size === selectedSize.size && s.range === selectedSize.range)
    );
    const sku = productActiveSize?.sku || "";

    toast.promise(
      buyNow({
        color: {
          name: selectedColor.name,
          hexCode: selectedColor.hexCode,
        },
        size: {
          size: selectedSize.size,
          range: selectedSize.range,
        },
        productId: product._id,
        sku: sku,
        quantity: 1,
        shipping: {
          address: data.address,
          building: data.building,
          city: data.city,
          governorate: data.governorate,
          name: data.name,
          phone: data.phone,
          phone2: data.phone2,
          email: data.email,
          note: data.note,
        },
      }),
      {
        loading: "جاري اتمام الطلب...",
        success: (res) => {
          pixel.event("Purchase", {
            value: product.finalPrice,
            currency: "EGP",
            content_ids: [product._id],
            content_type: "product",
            contents: [
              {
                id: product._id,
                quantity: 1,
              },
            ],
          });
          setTimeout(() => {
            const richOrder = {
              ...res.order,
              items: res.items.map((item: RawItem) => ({
                ...item,
                productId: product,
              })),
            };
            setCurrentOrder(richOrder);
            setIsBuyNowSheetOpen(false);
            router.push("/thank-you");
          }, 500);
          return "تم اتمام الطلب بنجاح";
        },
        error: (err) => `حدث خطأ ما: ${err}`,
      }
    );
  }

  const selectedImage =
    colors?.find((c) => c.hexCode === watchedColors?.[0]?.hexCode)?.images?.[0]
      ?.secure_url ||
    product.image_preview?.secure_url ||
    "";

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6 bg-slate-50 p-3 rounded-2xl border border-slate-100">
        <Image
          src={selectedImage}
          alt={product.name}
          width={100}
          height={100}
          className="size-20 object-cover object-top rounded-xl shadow-sm border border-slate-200"
        />
        <div className="flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-primary font-black text-lg mt-1">
            {product.finalPrice} <span className="text-xs text-slate-500">EGP</span>
          </p>
        </div>
      </div>

      <Form {...form}>
        <form
          id="buy-now-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 pb-20 sm:pb-4"
        >
          {/* Variants Selection Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] space-y-6">
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
                    <Palette className="size-4 text-slate-400" />
                    اللون المطلوب
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      dir="rtl"
                      className="flex flex-wrap gap-3"
                      value={field.value?.[0]?.hexCode}
                      onValueChange={(val) => {
                        const selected = colors.find((c) => c.hexCode === val);
                        field.onChange(selected ? [selected] : []);
                      }}
                    >
                      {colors?.map((color) => (
                        <FormItem key={color._id} className="relative">
                          <FormControl>
                            <RadioGroupItem
                              value={color.hexCode}
                              className="peer sr-only"
                            />
                          </FormControl>
                          <FormLabel
                            className="flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-transparent bg-white shadow-sm ring-1 ring-slate-200 transition-all hover:scale-110 peer-data-[state=checked]:border-white peer-data-[state=checked]:ring-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:scale-110"
                            style={{ backgroundColor: color.hexCode }}
                            title={color.name}
                          >
                            <span className="sr-only">{color.name}</span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <Separator className="bg-slate-50" />

            <FormField
              control={form.control}
              name="sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-slate-800 mb-3 block">
                    المقاس المناسب
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      dir="rtl"
                      className="flex flex-wrap gap-2.5"
                      value={field.value?.[0]?._id}
                      onValueChange={(val) => {
                        const selected = availableSizes.find(
                          (s: any) => s._id === val
                        );
                        field.onChange(selected ? [selected] : []);
                      }}
                    >
                      {availableSizes?.map(({ size, range, _id }: any) => (
                        <FormItem key={_id}>
                          <FormControl>
                            <RadioGroupItem value={_id!} className="peer sr-only" />
                          </FormControl>
                          <FormLabel className="flex flex-col items-center justify-center min-w-[70px] px-3 py-2 cursor-pointer rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/50 hover:bg-slate-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary text-center">
                            <span className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-1 w-full relative">
                              {size}
                            </span>
                            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
                              {range}
                            </span>
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Shipping Info Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] space-y-5">
            <h3 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-50 pb-3">
              بيانات المستلم
            </h3>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">الأسم بالكامل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ادخل اسمك"
                      className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-bold">رقم الهاتف</FormLabel>
                    <FormControl>
                      <Input
                        dir="rtl"
                        type="tel"
                        {...field}
                        placeholder="ادخل رقم الهاتف"
                        className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-bold">
                      رقم هاتف احتياطي <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        dir="rtl"
                        type="tel"
                        {...field}
                        placeholder="ادخل رقم هاتف احتياطي"
                        className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">
                    البريد الإلكتروني <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      type="email"
                      {...field}
                      placeholder="ادخل بريدك الإلكتروني"
                      className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] space-y-5">
            <h3 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-50 pb-3">
              بيانات التوصيل
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormField
                control={form.control}
                name="governorate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-bold">المحافظة</FormLabel>
                    <SearchableSelect
                      id="buy-now-governorate"
                      options={governorates}
                      value={field.value}
                      onChange={(value) => {
                        setPrice(
                          settingsData?.settings.shippingRates[value] as number
                        );
                        field.onChange(value);
                      }}
                      placeholder="اختر المحافظة"
                      searchPlaceholder="ابحث..."
                      emptyMessage="لا توجد نتائج"
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-600 font-bold">المدينة</FormLabel>
                    <SearchableSelect
                      id="buy-now-city"
                      options={cities}
                      disabled={!watchedGovernorate}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="اختر المدينة"
                      searchPlaceholder="ابحث..."
                      emptyMessage="لا توجد نتائج"
                    />
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">تفاصيل العنوان</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="ادخل تفاصيل العنوان"
                      className="resize-none min-h-[100px] bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="building"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">رقم الشقة والدور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ادخل رقم الشقة والدور"
                      className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-600 font-bold">
                    ملاحظات إضافية <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="ادخل اي ملاحظات تود اضافتها للطلب"
                      className="resize-none min-h-[80px] bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 mt-8">
            <div className="flex justify-between items-center text-slate-600 mb-2">
              <span>سعر المنتج:</span>
              <strong className="text-slate-800">{product.finalPrice} EGP</strong>
            </div>
            
            {shippingPrice !== 0 && (
              <div className="flex justify-between items-center text-slate-600 mb-3 pb-3 border-b border-slate-200">
                <span>مصاريف الشحن:</span>
                <strong className="text-slate-800">{shippingPrice} EGP</strong>
              </div>
            )}

            <div className="flex justify-between items-center text-lg mt-3">
              <span className="font-bold text-slate-800">الإجمالي:</span>
              <strong className="font-black text-primary text-2xl">
                {+product.finalPrice + shippingPrice} <span className="text-sm">EGP</span>
              </strong>
            </div>
            
            <Button
              type="submit"
              size="lg"
              disabled={isBuyNowPending}
              className="w-full h-14 mt-6 text-lg font-bold shadow-lg shadow-primary/25 rounded-xl transition-all"
            >
              {isBuyNowPending ? (
                <>
                  <Loader2 className="animate-spin ml-2 size-5" />
                  جاري التنفيذ...
                </>
              ) : (
                "تأكيد الطلب الآن"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BuyNow;
