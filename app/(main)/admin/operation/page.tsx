"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  useCurrentUser,
  useOpeartionRoleUsers,
  useToggleUserRole,
} from "@/lib/api/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
const formSchema = z.object({
  email: z.email("ادخل بريد الكتروني صالح").nonempty("البريد الإلكتروني مطلوب"),
});
// TODO: add loading ui
const OpearationPage = () => {
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const { mutateAsync: toggleUserRole, isPending: isToggleUserRolePending } =
    useToggleUserRole();
  const { data: operationUsers, isLoading: isOperationUsersLoading } =
    useOpeartionRoleUsers();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  function onSubmit({ email }: z.infer<typeof formSchema>) {
    if (userData?.data?.email === email) {
      toast.error("لا يمكن تغيير الصلاحية الخاصة بك");
    } else {
      toast.promise(toggleUserRole({ email }), {
        loading: "جاري تعديل الصلاحية",
        success: ({ user }: { user: { name: string } }) =>
          `تم تعديل صلاحية ${user.name.toUpperCase()}`,
        error: (err) => `حدث خطأ ما ${err}`,
      });
    }
  }
  return (
    <>
      {isUserDataLoading ? (
        <div className="flex items-center flex-1 justify-center min-h-screen bg-white rounded-lg border shadow">
          <Loader className="animate-spin text-primary size-24" />
        </div>
      ) : (
        <>
          {userData?.data?.role === "ADMIN" ? (
            <Card className="w-full">
              <CardHeader className="border-b">
                <CardTitle>
                  <h1 className="text-3xl">إضافة اوبيرشن</h1>
                </CardTitle>
                <CardDescription>
                  أدخل البريد الإلكتروني لتعديل صلاحية المستخدم
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <form
                  className="max-w-sm space-y-4"
                  id="add-opeartion-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FieldGroup>
                    <Controller
                      name="email"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="add-opeartion-form-email">
                            أدخل البريد الإلكتروني{" "}
                          </FieldLabel>
                          <Input
                            {...field}
                            id="add-opeartion-form-email"
                            aria-invalid={fieldState.invalid}
                            placeholder="أدخل البريد الإلكتروني"
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                  <Button type="submit" form="add-opeartion-form">
                    تأكيد
                  </Button>
                </form>
                <Separator />
                <div className="max-w-fit space-y-4 mb-5">
                  {operationUsers?.users.map(({ _id, email, name }) => (
                    <div
                      className="flex bg-white shadow items-center gap-5 p-5 border rounded-lg"
                      key={_id}
                    >
                      <Button
                        onClick={() => {
                          toast.promise(toggleUserRole({ email }), {
                            loading: "جاري تعديل الصلاحية",
                            success: ({ user }: { user: { name: string } }) =>
                              `تم تعديل صلاحية ${user.name.toUpperCase()}`,
                            error: (err) => `حدث خطأ ما ${err}`,
                          });
                        }}
                        size={"icon-sm"}
                        variant={"destructive"}
                      >
                        <X />
                      </Button>
                      <div>
                        <h4 className="capitalize">{name}</h4>
                        <p className="text-primary">{email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
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

export default OpearationPage;
