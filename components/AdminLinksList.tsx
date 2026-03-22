"use client";
import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsBoxes, BsGear } from "react-icons/bs";
import { CiUser, CiViewList } from "react-icons/ci";
const links = [
  {
    title: "اضافة منتج",
    href: "/admin/product/add",
    icon: Plus,
  },
  {
    title: "المنتجات",
    href: "/admin/products",
    icon: BsBoxes,
  },
  {
    title: "الاوردرات",
    href: "/admin/orders",
    icon: CiViewList,
  },
  {
    title: "اوبيرشن",
    href: "/admin/operation",
    icon: CiUser,
  },
  {
    title: "الاعدادات",
    href: "/admin/settings",
    icon: BsGear,
  },
];
const AdminLinksList = () => {
  const pathname = usePathname();
  if (pathname.includes("/product/update")) {
    return null;
  }
  return (
    <aside className="min-w-10 max-lg:hidden lg:min-w-2xs sticky top-24 h-[calc(100vh-10rem)] overflow-hidden bg-white rounded-lg border">
      {links.map(({ href, icon: Icon, title }) => {
        const isActive = href === pathname;
        return (
          <Link
            className={`p-3 lg:p-4 duration-300 rounded-lg flex max-lg:justify-center items-center gap-2 ${
              isActive ? "bg-primary text-white" : "hover:bg-primary/15"
            }`}
            key={title}
            href={href}
          >
            <Icon className="size-4" />
            <span className="max-lg:hidden">{title}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default AdminLinksList;
