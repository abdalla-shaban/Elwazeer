"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddOrUpdateOffer } from "@/lib/api/hooks";
import { Offer } from "@/types/productDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Badge } from "../ui/badge";
import { Field, FieldError, FieldLabel } from "../ui/field";
const formSchema = z.object({
  percent: z.string().trim().nonempty("أدخل النسبة"),
});
const OfferDialog = ({
  product_id,
  offer,
}: {
  product_id: string;
  offer: Offer;
}) => {
  const { mutateAsync: updateOffer, isPending } = useAddOrUpdateOffer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      percent: String(offer.percent),
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    toast.promise(
      updateOffer({
        product_id: product_id,
        offerBody: {
          isAvailable: +data.percent > 0 ? true : false,
          percent: data.percent,
        },
      }),
      {
        loading: `جاري إضافة المنتج...`,
        success: () => {
          return `تمت الاضافه بنجاح!`;
        },
        error: (err) => `حدث خطأ ما! ${err}`,
      }
    );
  }

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {offer.isAvailable ? (
          <Badge>{offer.percent}%</Badge>
        ) : (
          <Badge variant={"outline"}>{offer.percent}%</Badge>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader dir="rtl">
          <DialogTitle>الخصومات</DialogTitle>
          <DialogDescription className="flex flex-col">
            أدخل البيانات لإضافة أو تعديل الخصم الحالي
            <span>ملحوظة: النسبة (0%) تعني انه لا يوجد خصم</span>
          </DialogDescription>
        </DialogHeader>
        <form id="offer-form" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="percent"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="offer-form-percent">
                  النسبة المؤية{" "}
                </FieldLabel>
                <Input
                  {...field}
                  id="offer-form-percent"
                  aria-invalid={fieldState.invalid}
                  placeholder="ادخل النسبة"
                  autoComplete="off"
                  type="number"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">إلغاء</Button>
          </DialogClose>
          <Button disabled={isPending} form="offer-form" type="submit">
            {isPending ? <Loader className="animate-spin" /> : "موافقة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default OfferDialog;
