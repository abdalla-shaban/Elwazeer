"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Layers,
  Loader,
  Palette,
  Plus,
  Settings2,
  Tag,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import {
  Control,
  Controller,
  Path,
  Resolver,
  useFieldArray,
  useForm,
  useWatch,
  useFormState,
} from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { KeywordsInput } from "@/components/custom/KeywordsInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { convertToBase64, seasons } from "@/constants";
import { useAddProduct, useCurrentUser, useSettings } from "@/lib/api/hooks";
import { IProductBody } from "@/types/products";
import Image from "next/image";

// --- Schemas ---

export const colorSchema = z.object({
  name: z.string().min(1, "اسم اللون مطلوب"),
  hexCode: z.string().min(1, "كود اللون مطلوب"),
  images: z.array(z.string()).min(1, "يجب رفع صورة واحدة على الأقل لهذا اللون"),
  sizes: z
    .array(
      z.object({
        size: z.string().min(1, "المقاس مطلوب"),
        range: z.string().optional(),
        manageStock: z.boolean().default(false),
        stock: z.coerce
          .number()
          .min(0, "الكمية لا يمكن أن تكون أقل من 0")
          .default(0),
        isAvailable: z.boolean().default(true),
      }),
    )
    .min(1, "يجب إضافة مقاس واحد على الأقل لهذا اللون"),
});

export const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم المنتج لا يقل عن حرفين")
    .max(200, "اسم المنتج لا يزيد عن 200 حرف")
    .nonempty("اسم المنتج مطلوب"),
  image_preview: z
    .union([z.string(), z.object({ secure_url: z.string() })])
    .refine((val) => {
      if (typeof val === "string") return val.length > 0;
      return val.secure_url.length > 0;
    }, "صورة المنتج الأساسية مطلوبة"),
  price: z.coerce.number().min(1, "السعر مطلوب"),
  category: z.string().nonempty("قسم المنتج مطلوب"),
  fabric: z.string().nonempty("خامة المنتج مطلوبة"),
  season: z.string().nonempty("موسم المنتج مطلوب"),
  brand: z.string().default("Elena Fashion Store"),
  metaDescription: z.string().trim().nonempty("وصف المنتج مطلوب"),
  metaKeywords: z
    .array(z.string())
    .min(5, "يرجي اختيار 5 كلمات مفتاحية على الأقل"),
  offer: z.object({
    isAvailable: z.boolean().default(false),
    percent: z.coerce.number().min(0).max(100).default(0),
  }),
  colors: z.array(colorSchema).min(1, "يجب إضافة لون واحد على الأقل"),
});

export type FormData = z.infer<typeof formSchema>;

// --- Components ---

interface ColorVariantProps {
  index: number;
  control: Control<FormData>;
  remove: (index: number) => void;
  settingsData:
    | {
        settings: {
          sizeDescription: { size: string; range: string }[];
        };
      }
    | undefined;
}

function ColorVariant({
  index,
  control,
  remove,
  settingsData,
}: ColorVariantProps) {
  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: `colors.${index}.sizes`,
  });

  const sizes = useWatch({
    control,
    name: `colors.${index}.sizes`,
  }) as FormData["colors"][0]["sizes"];

  const { errors } = useFormState({ control });
  const sizesError = errors?.colors?.[index]?.sizes;
  const sizesRootError = !Array.isArray(sizesError)
    ? sizesError?.message
    : (sizesError as { root?: { message?: string } })?.root?.message;

  return (
    <Card className="border-2 border-muted bg-muted/30 mb-6 overflow-hidden transition-all hover:border-primary/20">
      <CardHeader className="bg-muted/50 py-3 flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Badge
            variant="outline"
            className="h-6 w-6 shrink-0 flex items-center justify-center rounded-full p-0 bg-background"
          >
            {index + 1}
          </Badge>
          <Controller
            name={`colors.${index}.name`}
            control={control}
            render={({ field }) => (
              <span className="font-semibold truncate">
                {field.value || "لون جديد"}
              </span>
            )}
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => remove(index)}
          className="text-destructive hover:bg-destructive/10 shrink-0"
        >
          <Trash2 className="w-4 h-4 md:ml-2" />
          <span className="hidden md:inline">حذف هذا اللون</span>
        </Button>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Controller
            name={`colors.${index}.name`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>اسم اللون (مثلاً: أسود، أحمر) <span className="text-destructive">*</span></FieldLabel>
                <Input {...field} placeholder="ادخل اسم اللون" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={`colors.${index}.hexCode`}
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>كود اللون (Hex)</FieldLabel>
                <div className="flex gap-2">
                  <Input
                    {...field}
                    type="color"
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input {...field} placeholder="#000000" className="flex-1" />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <FieldLabel className="mb-3 block text-lg font-medium">
            صور هذا اللون <span className="text-destructive">*</span>
          </FieldLabel>
          <Controller
            name={`colors.${index}.images`}
            control={control}
            render={({ field, fieldState }) => (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {field.value?.map((img: string, imgIdx: number) => (
                    <div
                      key={imgIdx}
                      className="relative aspect-square rounded-lg border-2 border-muted overflow-hidden group shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Image
                        src={img}
                        alt="preview"
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...field.value];
                          newImages.splice(imgIdx, 1);
                          field.onChange(newImages);
                        }}
                        className="absolute top-1 right-1 bg-destructive/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:bg-primary/5 transition-all hover:border-primary">
                    <CloudUpload className="w-8 h-8 text-primary mb-2" />
                    <span className="text-xs text-muted-foreground font-medium">
                      أضف صور
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        const base64s = await Promise.all(
                          files.map((f) => convertToBase64(f)),
                        );
                        field.onChange([...(field.value || []), ...base64s]);
                        e.target.value = ""; // reset input
                      }}
                    />
                  </label>
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </div>
            )}
          />
        </div>

        <Separator className="my-6" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <FieldLabel className="text-lg font-medium">
              المقاسات المتاحة لهذا اللون <span className="text-destructive">*</span>
            </FieldLabel>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendSize({
                  size: "",
                  range: "",
                  manageStock: false,
                  stock: 0,
                  isAvailable: true,
                })
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة مقاس مخصص
            </Button>
          </div>

          <div className="space-y-4">
            {/* Suggested Sizes from Settings */}
            <div className="flex flex-wrap gap-2 mb-4 p-4 border rounded-lg bg-background/50">
              <span className="text-sm text-muted-foreground w-full mb-1">
                اقتراحات الأبعاد:
              </span>
              {settingsData?.settings.sizeDescription.map(
                (sizeItem: { size: string; range: string }) => {
                  const isSelected = sizes?.some(
                    (s) => s.range === sizeItem.range,
                  );
                  return (
                    <Button
                      key={sizeItem.range}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="h-auto py-1 px-3"
                      onClick={() => {
                        if (isSelected) {
                          const idxToRemove = sizes.findIndex(
                            (s) => s.range === sizeItem.range,
                          );
                          removeSize(idxToRemove);
                        } else {
                          appendSize({
                            ...sizeItem,
                            manageStock: false,
                            stock: 0,
                            isAvailable: true,
                          });
                        }
                      }}
                    >
                      <div className="flex flex-col items-start leading-tight">
                        <span className="text-xs font-bold">
                          {sizeItem.size}
                        </span>
                        <span className="text-[10px] opacity-70">
                          {sizeItem.range}
                        </span>
                      </div>
                    </Button>
                  );
                },
              )}
            </div>

            {sizeFields.map((sizeField, sizeIdx) => (
              <div
                key={sizeField.id}
                className="flex flex-col md:flex-row items-start md:items-end gap-4 p-4 border rounded-lg bg-background"
              >
                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                  <Controller
                    name={`colors.${index}.sizes.${sizeIdx}.size`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">المقاس <span className="text-destructive">*</span></FieldLabel>
                        <Input {...field} size={1} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name={`colors.${index}.sizes.${sizeIdx}.range`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel className="text-xs">
                          الأبعاد (اختياري)
                        </FieldLabel>
                        <Input {...field} />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div className="flex items-center gap-4 h-10 md:pt-4">
                    <Controller
                      name={`colors.${index}.sizes.${sizeIdx}.manageStock`}
                      control={control}
                      render={({ field }) => (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id={`manageStock-${index}-${sizeIdx}`}
                          />
                          <FieldLabel
                            htmlFor={`manageStock-${index}-${sizeIdx}`}
                            className="text-xs mt-0"
                          >
                            مخزون
                          </FieldLabel>
                        </div>
                      )}
                    />
                  </div>
                  <Controller
                    name={`colors.${index}.sizes.${sizeIdx}.stock`}
                    control={control}
                    render={({ field, fieldState }) => {
                      const manage = sizes?.[sizeIdx]?.manageStock;
                      return (
                        <Field
                          data-slot="stock-field"
                          data-invalid={fieldState.invalid}
                          data-disabled={!manage}
                          className={!manage ? "opacity-50" : ""}
                        >
                          <FieldLabel className="text-xs">الكمية</FieldLabel>
                          <Input {...field} type="number" disabled={!manage} />
                          {fieldState.invalid && manage && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-10 w-10 shrink-0"
                  onClick={() => removeSize(sizeIdx)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {sizesRootError && (
              <p className="text-sm font-semibold text-destructive mt-2">
                {sizesRootError}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Form ---

const seasonMap: Record<string, string> = {
  Winter: "الشتاء",
  Summer: "الصيف",
};

export function AddProductForm() {
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const [step, setStep] = useState(1);

  const { data: settingsData, isLoading: isSettingsDataLoading } =
    useSettings();
  const { mutateAsync: addProduct, isPending: isAddingPorductPending } =
    useAddProduct();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema) as Resolver<FormData>,
    mode: "onChange",
    defaultValues: {
      name: "",
      image_preview: "",
      price: 0,
      fabric: "",
      season: "",
      brand: "Elena Fashion Store",
      metaDescription: "",
      metaKeywords: [],
      category: "",
      offer: {
        isAvailable: false,
        percent: 0,
      },
      colors: [
        {
          name: "",
          hexCode: "#000000",
          images: [],
          sizes: [],
        },
      ],
    },
  });

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: "colors",
  });

  const offerActive = useWatch({
    control: form.control,
    name: "offer.isAvailable",
  });

  const onSubmit = async (data: FormData) => {
    toast.promise(addProduct(data as IProductBody), {
      loading: `جاري إضافة المنتج...`,
      success: () => {
        form.reset();
        setStep(1);
        return `تمت الاضافة بنجاح!`;
      },
      error: (err) => `حدث خطأ ما! ${err}`,
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: Path<FormData>[] = [];
    if (step === 1) {
      fieldsToValidate = [
        "name",
        "image_preview",
        "price",
        "category",
        "fabric",
        "season",
        "brand",
      ];
    } else if (step === 2) {
      fieldsToValidate = ["colors"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  if (isUserDataLoading) {
    return (
      <div className="flex items-center flex-1 justify-center min-h-[400px]">
        <Loader className="animate-spin text-primary size-12" />
      </div>
    );
  }

  if (userData?.data?.role !== "ADMIN") {
    return (
      <div className="w-full rounded-lg shadow flex-1 h-full bg-white flex items-center justify-center min-h-[400px]">
        <h1 className="text-2xl font-bold">
          ليس لديك الصلاحية لمحتويات هذه الصفحة
        </h1>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-5xl mx-auto shadow-xl border-t-4 border-t-primary">
      <CardHeader className="bg-muted/30 pb-0 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <CardTitle className="text-3xl font-bold">
              إضافة منتج جديد
            </CardTitle>
            <CardDescription className="text-lg">
              ادخل تفاصيل المنتج المتنوعة بعناية
            </CardDescription>
          </div>
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Layers className="size-10 text-primary" />
          </div>
        </div>

        {/* Stepper */}
        <div className="relative flex justify-between items-center max-w-md mx-auto mb-8 px-4">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0" />
          {[
            { n: 1, label: "الأساسيات", icon: Settings2 },
            { n: 2, label: "المتغيرات", icon: Palette },
            { n: 3, label: "التسويق", icon: Tag },
          ].map((s) => (
            <div
              key={s.n}
              className="relative z-10 flex flex-col items-center gap-2"
            >
              <div
                className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step >= s.n
                    ? "bg-primary border-primary text-white"
                    : "bg-background border-muted text-muted-foreground"
                } ${step === s.n ? "ring-4 ring-primary/20 scale-110" : ""}`}
              >
                {step > s.n ? (
                  <Check className="size-5" />
                ) : (
                  <s.icon className="size-5" />
                )}
              </div>
              <span
                className={`text-xs font-bold ${step >= s.n ? "text-primary" : "text-muted-foreground"}`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-8 px-8">
        <form id="form-add-product" onSubmit={form.handleSubmit(onSubmit)}>
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Product Thumbnail */}
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl bg-muted/20 transition-all hover:bg-muted/30">
                <Controller
                  name="image_preview"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col items-center gap-4 w-full">
                      <FieldLabel className="text-lg font-bold">
                        الصورة المصغرة للمنتج (Preview) <span className="text-destructive">*</span>
                      </FieldLabel>
                      {field.value ? (
                        <div className="relative group size-48 rounded-xl overflow-hidden border-2 border-primary/20 shadow-lg">
                          <Image
                            src={
                              typeof field.value === "string"
                                ? field.value
                                : field.value.secure_url
                            }
                            alt="preview"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => field.onChange("")}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="text-white size-8" />
                          </button>
                        </div>
                      ) : (
                        <label className="size-48 flex flex-col items-center justify-center border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 transition-all hover:border-primary group">
                          <CloudUpload className="size-12 text-primary/50 group-hover:text-primary transition-colors" />
                          <span className="mt-2 text-sm font-medium text-muted-foreground group-hover:text-primary">
                            ارفع صورة المنتج الأساسية
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const base64 = await convertToBase64(file);
                                field.onChange(base64);
                              }
                            }}
                          />
                        </label>
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </div>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-base">اسم المنتج <span className="text-destructive">*</span></FieldLabel>
                      <Input
                        {...field}
                        placeholder="ادخل اسم المنتج"
                        className="h-12"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="price"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel className="text-base">
                        السعر الأساسي <span className="text-destructive">*</span>
                      </FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          type="number"
                          placeholder="0.00"
                          className="h-12 pl-12"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                          EGP
                        </span>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>القسم <span className="text-destructive">*</span></FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        dir="rtl"
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر القسم" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSettingsDataLoading ? (
                            <Skeleton className="h-20 w-full" />
                          ) : (
                            settingsData?.settings.category.map((c: string) => (
                              <SelectItem key={c} value={c}>
                                {c}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="fabric"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>الخامة <span className="text-destructive">*</span></FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        dir="rtl"
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الخامة" />
                        </SelectTrigger>
                        <SelectContent>
                          {isSettingsDataLoading ? (
                            <Skeleton className="h-20 w-full" />
                          ) : (
                            settingsData?.settings.fabric.map((f: string) => (
                              <SelectItem key={f} value={f}>
                                {f}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="season"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>الموسم <span className="text-destructive">*</span></FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        dir="rtl"
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="اختر الموسم" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasons.map((s) => (
                            <SelectItem key={s} value={s}>
                              {seasonMap[s] || s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Controller
                  name="brand"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>العلامة التجارية</FieldLabel>
                      <Input {...field} disabled className="h-12" />
                    </Field>
                  )}
                />
              </div>
            </div>
          )}

          {/* STEP 2: VARIANTS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Palette className="text-primary" />
                  الألوان والمتغيرات
                </h3>
                <Button
                  type="button"
                  onClick={() =>
                    appendColor({
                      name: "",
                      hexCode: "#000000",
                      images: [],
                      sizes: [],
                    })
                  }
                  className="bg-primary hover:bg-primary/90 shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة لون جديد
                </Button>
              </div>

              <div className="min-h-[200px]">
                {colorFields.map((field, index) => (
                  <ColorVariant
                    key={field.id}
                    index={index}
                    control={form.control}
                    remove={removeColor}
                    settingsData={settingsData}
                  />
                ))}
                {colorFields.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl bg-muted/20">
                    <Palette className="size-16 text-muted mb-4" />
                    <p className="text-muted-foreground font-medium text-lg">
                      لم يتم إضافة أي ألوان بعد
                    </p>
                    <p className="text-sm text-muted-foreground">
                      يجب إضافة لون واحد على الأقل للمنتج
                    </p>
                  </div>
                )}
                {form.formState.errors.colors?.message && (
                  <p className="text-destructive font-bold text-center mt-4">
                    {form.formState.errors.colors.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: SEO & PROMOTION */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="text-primary" />
                    عرض خاص (خصم)
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8 items-center">
                  <Controller
                    name="offer.isAvailable"
                    control={form.control}
                    render={({ field }) => (
                      <Field orientation="horizontal" className="w-auto gap-4">
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="offer-available"
                        />
                        <FieldLabel
                          htmlFor="offer-available"
                          className="mb-0 text-lg"
                        >
                          تفعيل عرض خصم
                        </FieldLabel>
                      </Field>
                    )}
                  />

                  <Controller
                    name="offer.percent"
                    control={form.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field
                          data-disabled={!offerActive}
                          className={`w-full md:w-48 ${!offerActive ? "opacity-50" : ""}`}
                        >
                          <FieldLabel>نسبة الخصم (%) <span className="text-destructive">*</span></FieldLabel>
                          <Input
                            {...field}
                            type="number"
                            placeholder="0"
                            className="h-12"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2 border-r-4 border-primary pr-3">
                  تحسين النتائج (SEO)
                </h3>

                <Controller
                  name="metaDescription"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>
                        وصف محركات البحث (Meta Description) <span className="text-destructive">*</span>
                      </FieldLabel>
                      <Textarea
                        {...field}
                        rows={4}
                        className="resize-none text-base"
                        placeholder="اكتب وصفاً جذاباً للمنتج ليظهر في نتائج البحث..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="metaKeywords"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>الكلمات المفتاحية <span className="text-destructive">*</span></FieldLabel>
                      <KeywordsInput
                        id="metaKeywords"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="اضغط Enter لإضافة كلمة..."
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </div>
          )}
        </form>
      </CardContent>

      <CardFooter className="bg-muted/10 p-8 border-t flex justify-between gap-4">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="h-12 px-8 font-bold border-2"
          >
            <ChevronRight className="w-5 h-5 ml-2" />
            السابق
          </Button>
        ) : (
          <div />
        )}

        {step <= 2 && (
          <Button
            type="button"
            onClick={nextStep}
            className="h-12 px-8 font-bold bg-primary hover:bg-primary/90 shadow-lg"
          >
            التالي
            <ChevronLeft className="w-5 h-5 mr-2" />
          </Button>
        )}
        {step === 3 && (
          <Button
            disabled={isAddingPorductPending}
            type="submit"
            form="form-add-product"
            className="h-12 px-12 font-bold text-lg bg-green-600 hover:bg-green-700 shadow-xl"
          >
            {isAddingPorductPending ? (
              <>
                <Loader className="animate-spin w-5 h-5 ml-2" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 ml-2" />
                إتمام وإضافة المنتج
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
