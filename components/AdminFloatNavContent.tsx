"use client";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { MdOutlineAdminPanelSettings } from "react-icons/md";

const AdminFloatNavContent = () => {
  const pathname = usePathname();
  if (pathname.includes("/admin")) return null;
  return (
    <Button className="size-14 rounded-full" asChild>
      <Link href={"/admin/settings"}>
        <MdOutlineAdminPanelSettings className="size-10" />
      </Link>
    </Button>
  );
};

export default AdminFloatNavContent;
