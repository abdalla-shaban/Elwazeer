"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useSignin, useSignup } from "@/lib/api/hooks";
import { signInFormSchema, signUpFormSchema } from "@/lib/validation/authform";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

type SignInType = z.infer<typeof signInFormSchema>;
type SignUpType = z.infer<typeof signUpFormSchema>;
type AuthFormType = SignInType | SignUpType;

export function AuthForm({ mode }: { mode: "signin" | "signup" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const schema = z.discriminatedUnion("mode", [
    signInFormSchema,
    signUpFormSchema,
  ]);

  const { mutateAsync: signin, isPending: isSigninPending } = useSignin();

  const {
    mutateAsync: signup,
    isPending: isSignupPending,
    error: signupError,
  } = useSignup();

  const form = useForm<AuthFormType>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "signin"
        ? { mode, email: "", password: "" }
        : { mode, name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(data: AuthFormType) {
    if (data.mode === "signin") {
      const signinBoyd = {
        email: data.email,
        password: data.password,
      };
      toast.promise(signin(signinBoyd), {
        loading: `جاري تسجيل الدخول...`,
        success: () => {
          router.push("/");
          return `تم تسجيل الدخول بنجاح`;
        },
        error: (err) => `حدث خطأ ما! ${err}`,
      });
    } else {
      const signUpBoyd = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      toast.promise(signup(signUpBoyd), {
        loading: `جاري تسجيل الحساب...`,
        success: () => {
          router.replace("/signin");
          return `تم التسجيل بنجاح`;
        },
        error: `حدث خطأ ما ${signupError}`,
      });
    }
  }

  return (
    <Card className="w-full relative sm:max-w-md border-0 shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden p-2 sm:p-4">
      <CardHeader className="text-center space-y-3 pb-6">
        <div className="flex justify-center mb-2">
          <Link href="/">
            <Image
              src="/logo-icon.png"
              width={70}
              height={70}
              alt="Elena Fashion"
              className="object-contain hover:opacity-90 transition-opacity"
              priority
            />
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          مرحباً بك في إلينا
        </CardTitle>
        <CardDescription className="text-muted-foreground font-medium text-sm">
          {mode === "signin"
            ? "قم بتسجيل الدخول للمتابعة"
            : "قم بإنشاء حساب جديد للبدء"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="auth-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FieldGroup>
            {mode === "signup" && (
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-form-name">الأسم </FieldLabel>
                    <Input
                      {...field}
                      id="auth-form-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="ادخل الأسم"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="auth-form-email">
                    البريد الألكتروني
                  </FieldLabel>
                  <Input
                    {...field}
                    id="auth-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="ادخل بريدك الألكتروني"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="auth-form-password">
                    كلمة المرور
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      id="auth-form-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="ادخل كلمة المرور"
                      autoComplete="off"
                      type={showPassword ? "text" : "password"}
                    />
                    {field.value !== "" ? (
                      !showPassword ? (
                        <Eye
                          onClick={() => setShowPassword(true)}
                          className="absolute cursor-pointer top-1/2 inset-e-4 size-4 -translate-y-1/2"
                        />
                      ) : (
                        <EyeClosed
                          onClick={() => setShowPassword(false)}
                          className="absolute cursor-pointer top-1/2 inset-e-4 size-4 -translate-y-1/2"
                        />
                      )
                    ) : null}
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  {/* {mode === "signin" && (
                    <div>
                      <Link
                        href={"#"}
                        className="text-sm hover:underline text-gray-500 hover:text-black
                      "
                      >
                        هل نسيت كلمة المرور ؟
                      </Link>
                    </div>
                  )} */}
                </Field>
              )}
            />
            {mode === "signup" && (
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="auth-form-confirm-password">
                      تأكيد كلمة المرور
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="auth-form-confirm-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="ادخل كلمة المرور"
                        autoComplete="off"
                        type={showConfirmPassword ? "text" : "password"}
                      />
                      {field.value !== "" ? (
                        !showConfirmPassword ? (
                          <Eye
                            onClick={() => setShowConfirmPassword(true)}
                            className="absolute cursor-pointer top-1/2 inset-e-4 size-4 -translate-y-1/2"
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => setShowConfirmPassword(false)}
                            className="absolute cursor-pointer top-1/2 inset-e-4 size-4 -translate-y-1/2"
                          />
                        )
                      ) : null}
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="pt-2 pb-6">
        <div className="w-full space-y-6">
          <Button
            className="w-full h-12 text-base font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
            type="submit"
            form="auth-form"
            disabled={mode === "signin" ? isSigninPending : isSignupPending}
          >
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
          <div className="text-sm flex flex-col items-center justify-center text-center gap-3 mt-4 text-muted-foreground">
            {mode === "signin" ? (
              <p>
                لا تمتلك حساب ؟{" "}
                <Link
                  href={"/signup"}
                  className="text-black font-semibold hover:underline underline-offset-4 transition-all"
                >
                  إنشاء حساب
                </Link>
              </p>
            ) : (
              <p>
                تمتلك حساب بالفعل ؟{" "}
                <Link
                  href={"/signin"}
                  className="text-black font-semibold hover:underline underline-offset-4 transition-all"
                >
                  تسجيل الدخول
                </Link>
              </p>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
