import { AuthForm } from "@/components/authentication/AuthForm";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "إنشاء حساب",
};
const SignUpPage = () => {
  return (
    <section className="container mx-auto px-4 flex items-center justify-center min-h-screen">
      <AuthForm mode="signup" />
    </section>
  );
};

export default SignUpPage;
