"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { CustomInput } from "@/components/custom/CustomInput";
import {
  ShippingRatesInput,
  ShippingRatesRef,
} from "@/components/custom/ShippingRatesInput";
import { SizeInput } from "@/components/custom/SizeInput";
import { ConstantsContainer } from "@/components/admin/settings/ConstantsContainer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { convertToBase64 } from "@/constants";
import {
  useCurrentUser,
  useSettings,
  useUpdateSettings,
} from "@/lib/api/hooks";
import { CloudUpload, Loader } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

const formSchema = z.object({
  sizeDescription: z.array(
    z.object({
      size: z.string(),
      range: z.string(),
    })
  ),
  category: z.array(z.string()),
  fabric: z.array(z.string()),
  season: z.string(),
  shippingRates: z.record(z.string(), z.number()),
  banner: z.string(""),
});
// TODO: add guard for the admin only

const SettingsPage = () => {
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const { data: settingsData, isLoading: isSettingsDataLoading } =
    useSettings();
  const { mutateAsync: updateProduct, isPending: isUpdatingPending } =
    useUpdateSettings();
  const shippingRef = useRef<ShippingRatesRef>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      season: "winter",
      category: [],
      fabric: [],
      sizeDescription: [],
      shippingRates: {},
      banner: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise(
      updateProduct({
        ...data,
        banner: {
          base64: data.banner,
        },
      }),
      {
        loading: `جاري تحديث البيانات...`,
        success: () => {
          return `تمت التحديث بنجاح!`;
        },
        error: (err) => `حدث خطأ ما! ${err}`,
      }
    );
  }
  useEffect(() => {
    if (settingsData?.settings) {
      form.reset({
        sizeDescription: settingsData.settings.sizeDescription,
        fabric: settingsData.settings.fabric,
        category: settingsData.settings.category,
        season: settingsData.settings.season,
        shippingRates: settingsData.settings.shippingRates,
        banner:
          settingsData.settings.banner !== null
            ? settingsData.settings.banner?.secure_url
            : "",
      });
    }
  }, [settingsData, form]);
  return (
    <>
      {isSettingsDataLoading || isUserDataLoading ? (
        <div className="flex items-center flex-1 justify-center min-h-screen bg-white rounded-lg border shadow">
          <Loader className="animate-spin text-primary size-24" />
        </div>
      ) : (
        <>
          {userData?.data?.role === "ADMIN" ? (
            <Card className="w-full">
              <CardHeader className="border-b">
                <CardTitle>
                  <h1 className="text-3xl">الاعدادات</h1>
                </CardTitle>
                {/* <CardDescription>ادخل البيانات لإضافة منتج جديد</CardDescription> */}
              </CardHeader>
              <CardContent>
                <form id="form-settings" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <ConstantsContainer>
                      <Field>
                        <FieldLabel className="text-lg font-semibold">التصنيفات</FieldLabel>
                        <Controller
                          name="category"
                          control={form.control}
                          render={({ field }) => (
                            <CustomInput
                              id="category"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="إضافة تصنيف جديد..."
                            />
                          )}
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-lg font-semibold">خامات الأقمشة</FieldLabel>
                        <Controller
                          name="fabric"
                          control={form.control}
                          render={({ field }) => (
                            <CustomInput
                              id="fabric"
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="إضافة خامة جديدة..."
                            />
                          )}
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-lg font-semibold">وصف المقاسات</FieldLabel>
                        <Controller
                          name="sizeDescription"
                          control={form.control}
                          render={({ field }) => (
                            <SizeInput
                              id="sizes"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </Field>

                      <Field>
                        <FieldLabel className="text-lg font-semibold">الموسم الحالي</FieldLabel>
                        <Controller
                          name="season"
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              key={field.value}
                              value={field.value}
                              onValueChange={field.onChange}
                              dir="rtl"
                            >
                              <SelectTrigger className="w-full md:w-[240px]">
                                <SelectValue placeholder="اختر الموسم" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="summer">الصيف (Summer)</SelectItem>
                                <SelectItem value="winter">الشتاء (Winter)</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </Field>
                    </ConstantsContainer>

                    <Separator />
                    <Controller
                      name="banner"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="relative"
                        >
                          <FieldLabel
                            htmlFor="form-settings-image"
                            className="p-10 border border-dashed border-input rounded-md cursor-pointer"
                          >
                            <div className="flex mx-auto justify-center flex-col gap-3 items-center text-center text-gray-500">
                              <CloudUpload className="mx-auto" />
                              <span>حمل صورة المنتج</span>
                              <span className="text-xs">
                                يجب أن يكون حجم الصورة أقل من 5MB
                              </span>

                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </div>

                            <Input
                              id="form-settings-image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              aria-invalid={fieldState.invalid}
                              onChange={async (
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                if (file.size > 5 * 1024 * 1024) {
                                  toast.error(
                                    "يجب أن يكون حجم الصورة أقل من 5MB"
                                  );
                                  return;
                                }

                                const base64 = await convertToBase64(file);
                                field.onChange(base64);

                                e.target.value = "";
                              }}
                            />
                          </FieldLabel>

                          {/* Image Preview */}
                          {field.value && (
                            <div className="relative mt-4 w-40 h-96 rounded-md overflow-hidden border">
                              <Image
                                src={field.value}
                                alt="Product image"
                                width={1920}
                                height={1920}
                                className="w-full h-full object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => field.onChange("")}
                                className="absolute cursor-pointer size-10 flex items-center justify-center top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </Field>
                      )}
                    />

                    <FieldSeparator />
                    <Controller
                      name="shippingRates"
                      control={form.control}
                      render={({ field }) => (
                        <ShippingRatesInput
                          ref={shippingRef}
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </FieldGroup>
                </form>
              </CardContent>
              <CardFooter className="border-t">
                <Field className="w-fit">
                  <Button
                    disabled={isUpdatingPending}
                    type="submit"
                    form="form-settings"
                  >
                    تحديث{" "}
                  </Button>
                </Field>
              </CardFooter>
            </Card>
          ) : (
            <div className="w-full flex-1 rounded-lg shadow bg-white flex items-center justify-center">
              <h1 className="text-4xl font-bold">
                ليس لديك الصلاحية لمحتويات هذه الصفحة
              </h1>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SettingsPage;
