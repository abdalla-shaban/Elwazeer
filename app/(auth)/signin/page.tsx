import { AuthForm } from "@/components/authentication/AuthForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "تسجيل الدخول",
};
const SignInPage = () => {
  return (
    <section className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <AuthForm mode="signin" />
    </section>
  );
};

export default SignInPage;
