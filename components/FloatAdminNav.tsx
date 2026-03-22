"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { useCurrentUser } from "@/lib/api/hooks";

const FloatAdminNav = () => {
  const pathname = usePathname();
  const {
    data: userData,
    isLoading: isUserDataLoading,
    error,
  } = useCurrentUser();
  if (isUserDataLoading) return null;
  if (pathname.includes("/admin")) return null;
  if (
    !userData ||
    error ||
    (userData?.data?.role !== "ADMIN" && userData?.data?.role !== "OPERATOR")
  )
    return null;
  return (
    <div className="fixed rounded-lg bottom-20 z-9999999 md:bottom-5 left-5 md:left-10">
      <Button className="size-14 rounded-full" variant={"secondary"} asChild>
        <Link
          href={
            userData?.data?.role !== "ADMIN"
              ? "/admin/products"
              : "/admin/settings"
          }
        >
          <MdOutlineAdminPanelSettings className="size-10" />
        </Link>
      </Button>
    </div>
  );
};

export default FloatAdminNav;
