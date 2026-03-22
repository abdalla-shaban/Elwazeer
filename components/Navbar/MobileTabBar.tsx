"use client";
import { Heart, Home, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoBagHandleOutline } from "react-icons/io5";
import { motion } from "motion/react";

const MobileTabBar = () => {
  const pathname = usePathname();
  if (pathname.includes("/admin")) return null;

  const tabs = [
    { name: "الرئيسية", href: "/", icon: Home },
    { name: "المتجر", href: "/store", icon: Store },
    { name: "السلة", href: "/cart", icon: IoBagHandleOutline },
    { name: "المفضلة", href: "/wishlist", icon: Heart },
  ];

  return (
    <div className="fixed z-50 bottom-4 left-4 right-4 sm:hidden">
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl flex items-center justify-around p-2 gap-1">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="relative flex flex-col items-center justify-center py-2 px-1 flex-1 group transition-all duration-300"
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <tab.icon className="size-6" />
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 bg-primary/10 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-gray-500"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabBar;
