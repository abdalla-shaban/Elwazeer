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
const AdminLinksListMobile = () => {
  const pathname = usePathname();
  if (pathname.includes("/product/update")) {
    return null;
  }
  return (
    <aside className="bg-white w-[calc(100%-2rem)] lg:hidden z-10 fixed bottom-2 left-1/2 justify-center -translate-x-1/2 p-4 flex items-center gap-2 rounded-lg border">
      {links.map(({ href, icon: Icon, title }) => {
        const isActive = href === pathname;
        return (
          <Link
            className={`p-3 duration-300 rounded-lg flex max-lg:justify-center items-center gap-2 ${
              isActive ? "bg-primary text-white" : "hover:bg-primary/15"
            }`}
            key={title}
            href={href}
          >
            <Icon className="size-4" />
            <span className="max-sm:hidden">{title}</span>
          </Link>
        );
      })}
    </aside>
  );
};

export default AdminLinksListMobile;
