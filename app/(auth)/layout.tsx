import { BASE_URL } from "@/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await currentUser();
  if (data?.data) {
    redirect("/");
  }
  return <main className="bg-gray-200">{children}</main>;
}
