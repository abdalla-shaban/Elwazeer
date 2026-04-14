"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Textarea } from "@/components/ui/textarea";
import { useCart, useCheckout, useSettings } from "@/lib/api/hooks";
import * as pixel from "@/lib/fbPixel";
import { useOrderStore, useShippingPrice } from "@/store";
import { Item } from "@/types/orders";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";

type RawItem = Omit<Item, "productId"> & { productId: string };

const shippingSchema = z.object({
  shipping: z.object({
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
  }),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

const CheckOutForm = () => {
  const { setPrice } = useShippingPrice();
  const { mutateAsync: checkout, isPending } = useCheckout();
  const { data: settingsData } = useSettings();
  const { data: cartData } = useCart();
  const { setCurrentOrder } = useOrderStore();
  const router = useRouter();

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      shipping: {
        name: "",
        phone: "",
        phone2: "",
        address: "",
        building: "",
        city: "",
        governorate: "",
        email: "",
        note: "",
      },
    },
  });

  const watchedGovernorate = useWatch({
    control: form.control,
    name: "shipping.governorate",
  });

  useEffect(() => {
    form.setValue("shipping.city", "", { shouldValidate: !!watchedGovernorate });
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
    if (cartData) {
      pixel.event("InitiateCheckout", {
        content_ids: cartData.data.items.map((item) => item.productId),
        content_type: "product",
        value: cartData.data.totalPrice,
        currency: "EGP",
      });
    }
  }, [cartData]);

  const onSubmit = async (data: ShippingFormValues) => {
    toast.promise(checkout(data), {
      loading: "جاري اتمام الطلب...",
      error: (err) => `حدث خطأ ما ${err}`,
      success: (res) => {
        pixel.event("Purchase", {
          value: cartData?.data?.totalPrice,
          currency: "EGP",
          content_ids: cartData?.data?.items?.map((item) => item.productId),
          content_type: "product",
          contents: cartData?.data?.items?.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
          })),
        });

        // Construct rich order for Thank You page
        const richOrder = {
          ...res.order,
          items: (res.items || []).map((item: RawItem & { productName?: string }) => {
            const cartItem = cartData?.data?.items?.find(
              (ci: Item) => ci.productId === item.productId,
            );
            const itemImage = item.image && typeof item.image === "object" ? item.image : null;
            return {
              ...item,
              name: item.name || item.productName || cartItem?.name || "منتج",
              productId: cartItem
                ? {
                    _id: cartItem.productId,
                    name: cartItem.name,
                    price: cartItem.price,
                    // Use item image (if available) or fallback to cart item image
                    images: itemImage?.secure_url 
                      ? [{ secure_url: itemImage.secure_url, public_id: itemImage.public_id || "" }] 
                      : [{ secure_url: cartItem.image, public_id: "" }],
                  }
                : { _id: item.productId },
            };
          }),
        };

        // Small delay to ensure state is committed and user see success toast briefly
        setTimeout(() => {
          setCurrentOrder(richOrder);
          router.push("/thank-you");
        }, 500);

        return "تم اتمام الطلب بنجاح";
      },
    });
  };

  return (
    <Form {...form}>
      <form
        id="checkout-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        {/* Shipping Info Card */}
        <div className="bg-white p-5 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] space-y-6">
          <h3 className="text-xl font-black text-slate-800 mb-2 border-b border-slate-50 pb-4">
            بيانات المستلم
          </h3>
          
          <FormField
            control={form.control}
            name="shipping.name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-slate-600 font-bold">الأسم بالكامل</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ادخل اسمك" 
                    {...field} 
                    className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="shipping.phone"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-bold">رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="ادخل رقم الهاتف"
                      type="tel"
                      {...field}
                      className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipping.phone2"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-bold">
                    رقم هاتف اخر <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      dir="rtl"
                      placeholder="ادخل رقم هاتف احتياطي"
                      type="tel"
                      {...field}
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
            name="shipping.email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-slate-600 font-bold">
                  البريد الإلكتروني <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    dir="rtl"
                    placeholder="ادخل بريدك الإلكتروني"
                    type="email"
                    {...field}
                    className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        {/* Delivery Details Card */}
        <div className="bg-white p-5 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] space-y-6">
          <h3 className="text-xl font-black text-slate-800 mb-2 border-b border-slate-50 pb-4">
            بيانات التوصيل
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="shipping.governorate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-bold">المحافظة</FormLabel>
                  <SearchableSelect
                    id="checkout-governorate"
                    options={governorates}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                      form.clearErrors("shipping.governorate");
                      setPrice(
                        settingsData?.settings.shippingRates[value] as number,
                      );
                    }}
                    placeholder="اختر المحافظة"
                    searchPlaceholder="ابحث عن المحافظة..."
                    emptyMessage="لا توجد نتائج"
                  />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shipping.city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-slate-600 font-bold">المدينة</FormLabel>
                  <FormControl>
                    <SearchableSelect
                      id="checkout-city"
                      options={cities}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        form.clearErrors("shipping.city");
                      }}
                      disabled={!watchedGovernorate}
                      placeholder="اختر المدينة"
                      searchPlaceholder="ابحث عن المدينة..."
                      emptyMessage="لا توجد نتائج"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="shipping.address"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-slate-600 font-bold">تفاصيل العنوان</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none min-h-[100px] bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    placeholder="ادخل تفاصيل العنوان"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shipping.building"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-slate-600 font-bold">رقم الشقة والدور</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="ادخل رقم الشقة والدور" 
                    {...field} 
                    className="h-12 bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shipping.note"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-slate-600 font-bold">
                  ملاحظات إضافية <span className="text-xs font-normal text-slate-400">(اختياري)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none min-h-[100px] bg-slate-50/50 rounded-xl focus-visible:ring-primary/20"
                    placeholder="ادخل اي ملاحظات تود اضافتها للطلب"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <Button
          disabled={isPending}
          form="checkout-form"
          type="submit"
          size="lg"
          className="w-full h-14 mt-8 text-lg font-bold shadow-lg shadow-primary/25 rounded-xl transition-all"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin ml-2 size-5" />
              جاري اتمام الطلب...
            </>
          ) : (
            "تأكيد الطلب الآن"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CheckOutForm;
