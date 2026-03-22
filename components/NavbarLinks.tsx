"use client";
import { useCurrentUser, useLogout } from "@/lib/api/hooks";
import { Home, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CiViewList } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Dispatch, SetStateAction } from "react";

const navLinks = [
  {
    title: "الرئيسية",
    href: "/",
    Icon: Home,
  },
  {
    title: "المتجر",
    href: "/store",
    Icon: Store,
  },
  // {
  //   title: "معلومات عنا",
  //   href: "/about",
  //   Icon: Info,
  // },
  // {
  //   title: "اتصل بنا",
  //   href: "/contact",
  //   Icon: Phone,
  // },
  {
    title: "السلة",
    href: "/cart",
    Icon: IoBagHandleOutline,
  },
];
const NavbarLinks = ({
  setSideBarOpen,
}: {
  setSideBarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const { mutateAsync: logout, isPending: isLogoutPending } = useLogout();
  return (
    <div className="space-y-6 pt-4">
      <ul className="px-4 space-y-3">
        {navLinks.map((link, linkIdx) => {
          const isActive = pathname === link.href;
          return (
            <li key={linkIdx}>
              <Link
                className={`flex items-center group gap-4 p-4 rounded-2xl transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "hover:bg-primary/5 text-gray-700 hover:text-primary"
                }`}
                href={link.href}
                onClick={() => {
                  setSideBarOpen(false);
                }}
              >
                <div
                  className={`p-2 rounded-xl transition-colors duration-300 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 group-hover:bg-primary/10 text-gray-500 group-hover:text-primary"
                  }`}
                >
                  <link.Icon className="size-5" />
                </div>
                <span className="font-medium text-lg">{link.title}</span>
              </Link>
            </li>
          );
        })}
        {userData?.data?.email ? (
          <li>
            <Link
              className={`flex items-center group gap-4 p-4 rounded-2xl transition-all duration-300 ${
                pathname === "/orders"
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "hover:bg-primary/5 text-gray-700 hover:text-primary"
              }`}
              href={"/orders"}
              onClick={() => {
                setSideBarOpen(false);
              }}
            >
              <div
                className={`p-2 rounded-xl transition-colors duration-300 ${
                  pathname === "/orders"
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 group-hover:bg-primary/10 text-gray-500 group-hover:text-primary"
                }`}
              >
                <CiViewList className="size-5" />
              </div>
              <span className="font-medium text-lg">الأوردرات</span>
            </Link>
          </li>
        ) : null}
      </ul>

      <div className="px-4 mt-auto">
        {isUserDataLoading ? (
          <Skeleton className="h-20 w-full rounded-2xl" />
        ) : (
          <div className="mt-8 pt-8 border-t border-gray-100">
            {userData?.data?.email ? (
              <div className="bg-gray-50/50 p-4 rounded-2xl flex items-center justify-between gap-4 border border-gray-100">
                <div className="flex-1 min-w-0 text-right">
                  <h5 className="font-bold text-gray-900 truncate">
                    {userData?.data?.name}
                  </h5>
                  <p className="text-sm text-gray-500 truncate">
                    {userData?.data?.email}
                  </p>
                </div>
                <Button
                  size="icon"
                  disabled={isLogoutPending}
                  onClick={() => {
                    toast.promise(logout, {
                      loading: "جاري تسجيل الخروج",
                      success: () => {
                        setSideBarOpen(false);
                        router.push("/signin");
                        return "تم تسجيل الخروج";
                      },
                      error: (error) => `حدث خطأ ما: ${error}`,
                    });
                  }}
                  variant="destructive"
                  className="rounded-xl shrink-0"
                >
                  <LogOut className="size-5" />
                </Button>
              </div>
            ) : (
              <Button
                asChild
                className="w-full text-lg h-12 rounded-xl shadow-lg shadow-primary/20"
              >
                <Link href={"/signin"} onClick={() => setSideBarOpen(false)}>
                  تسجيل الدخول
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarLinks;
