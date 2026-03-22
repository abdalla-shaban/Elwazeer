import AdminLinksList from "@/components/AdminLinksList";
import AdminLinksListMobile from "@/components/AdminLinksListMobile";
import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/constants";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
async function currentUser() {
  const cookieStore = cookies();
  try {
    const res = await fetch(`${BASE_URL}/user/authMe`, {
      method: "GET",
      headers: {
        Cookie: (await cookieStore).toString(),
      },
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    throw new Error(`${error}`);
  }
}
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const userData = await currentUser();
  if (userData?.data?.role !== "ADMIN" && userData?.data?.role !== "OPERATOR")
    return (
      <section className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] gap-2 md:gap-5 bg-white rounded-lg border shadow">
        <Image
          src={"/unauth.svg"}
          alt="Unauthorized"
          width={300}
          height={300}
          className="size-96"
        />
        <h1 className="text-2xl text-center font-medium">
          لا يمكن الوصول لمحتوى هذة الصفحة
        </h1>
        <Button asChild>
          <Link href={"/"}>الرجوع إلى الصفحة الرئيسية</Link>
        </Button>
      </section>
    );
  return (
    <section className="container pt-5 lg:flex relative max-lg:pb-20 min-h-[calc(100vh-140px)] gap-2 md:gap-4">
      <AdminLinksListMobile />
      <AdminLinksList />
      {children}
    </section>
  );
};

export default AdminLayout;
