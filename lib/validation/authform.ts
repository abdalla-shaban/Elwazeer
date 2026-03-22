import z from "zod";

const baseAuth = {
  email: z.email("البريد الألكتروني غير صالح"),
  password: z.string().nonempty("كلمة المرور مطلوبة").trim(),
};

export const signInFormSchema = z.object({
  mode: z.literal("signin"),
  ...baseAuth,
});

export const signUpFormSchema = z
  .object({
    mode: z.literal("signup"),
    ...baseAuth,
    name: z
      .string()
      .trim()
      .nonempty("الأسم مطلوب")
      .min(5, "يجب ان لا يقل الأسم عن 5 أحرف"),
    confirmPassword: z.string().nonempty("كلمة المرور مطلوبة").trim(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ["confirmPassword"],
    message: "كلمة المرور غير متطابقة",
  });
