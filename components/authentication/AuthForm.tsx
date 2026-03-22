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
    <Card className="w-full relative sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>اهلا بك في يارا ستور</CardTitle>
        <CardDescription>
          ادخل البيانات {mode === "signin" ? " لتسجيل الدخول" : "لإنشاء الحساب"}
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
                          className="absolute cursor-pointer top-1/2 end-4 size-4 -translate-y-1/2"
                        />
                      ) : (
                        <EyeClosed
                          onClick={() => setShowPassword(false)}
                          className="absolute cursor-pointer top-1/2 end-4 size-4 -translate-y-1/2"
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
                            className="absolute cursor-pointer top-1/2 end-4 size-4 -translate-y-1/2"
                          />
                        ) : (
                          <EyeClosed
                            onClick={() => setShowConfirmPassword(false)}
                            className="absolute cursor-pointer top-1/2 end-4 size-4 -translate-y-1/2"
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
      <CardFooter>
        <div className="w-full space-y-4">
          <Button
            className="w-full"
            type="submit"
            form="auth-form"
            disabled={mode === "signin" ? isSigninPending : isSignupPending}
          >
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </Button>
          <div className="text-sm flex items-center justify-center text-center gap-2">
            {mode === "signin" ? (
              <>
                <p>لا تمتلك حساب ؟</p>
                <Link href={"/signup"} className="text-blue-800 underline">
                  إنشاء حساب
                </Link>
              </>
            ) : (
              <>
                <p>تمتلك حساب بالفعل ؟</p>
                <Link href={"/signin"} className="text-blue-800 underline">
                  تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
