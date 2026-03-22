"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Heart, Home, Loader, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { CgProfile } from "react-icons/cg";
import { IoBagHandleOutline } from "react-icons/io5";
import { MdOutlineMenuOpen } from "react-icons/md";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useCart,
  useCurrentUser,
  useLogout,
  useWishlist,
} from "@/lib/api/hooks";
import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiViewList } from "react-icons/ci";
import { toast } from "sonner";
import Logo from "../Logo";
import NavbarLinks from "../NavbarLinks";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
  {
    title: "السلة",
    href: "/cart",
    Icon: IoBagHandleOutline,
  },
];

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [sideBarOpen, setSideBarOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { data: userData, isLoading: isUserDataLoading } = useCurrentUser();
  const { data: cartData, isLoading: isCartDataLoading } = useCart();
  const { data: wishlistData, isLoading: isWishlistDataLoading } =
    useWishlist();
  const { mutateAsync: logout, isPending: isLogoutPending } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed border-b z-50 top-0 w-full transition-all duration-500 end-0 px-4 py-3 ${
        isScrolled
          ? "bg-primary border-b-white/30 backdrop-blur-xl border-b shadow-sm py-2"
          : "bg-white py-4"
      }`}
    >
      <nav className="container flex max-md:flex-row-reverse gap-5 md:gap-10 items-center justify-between mx-auto">
        <Sheet open={sideBarOpen} onOpenChange={setSideBarOpen}>
          <SheetTrigger asChild>
            <Button
              size={"icon-lg"}
              variant={"outline"}
              className="md:hidden rounded-full border-none bg-accent/50 hover:bg-primary/10 transition-all duration-300"
            >
              <MdOutlineMenuOpen className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 border-l-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-right">
                <Logo />
              </SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <div className="py-2">
              <NavbarLinks setSideBarOpen={setSideBarOpen} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex items-center">
          <Logo isScrolled={isScrolled} />
          <ul className="px-4 hidden md:flex items-center gap-2">
            {navLinks.map((link, linkIdx) => {
              const isActive = pathname === link.href;
              return (
                <li key={linkIdx} className="relative group">
                  <Link
                    className={`relative flex items-center text-lg font-medium transition-colors duration-300  px-4 py-2 ${
                      isActive
                        ? "text-secondary"
                        : isScrolled
                          ? "text-white hover:text-secondary"
                          : "text-gray-600 hover:text-primary"
                    }`}
                    href={link.href}
                  >
                    {link.title}
                    {isActive && (
                      <motion.div
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full mx-4"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
            {userData?.data?.email && (
              <li className="relative group">
                <Link
                  className={`relative flex items-center text-lg font-medium transition-colors duration-300 px-4 py-2 ${
                    pathname === "/orders"
                      ? "text-primary"
                      : isScrolled
                        ? "text-white"
                        : "text-gray-600 hover:text-primary"
                  }`}
                  href={"/orders"}
                >
                  الأوردرات
                  {pathname === "/orders" && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full mx-4"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="flex max-md:hidden items-center gap-2">
          <Button
            asChild
            size={"icon-lg"}
            variant={"outline"}
            className={`relative rounded-full border-none  transition-all duration-300 group shadow-none ${isScrolled ? "bg-white" : "bg-accent/50 hover:bg-primary/10"}`}
          >
            <Link href={"/cart"}>
              <Badge
                className="h-5 absolute -top-1 -start-2 min-w-5 rounded-full px-1 font-mono tabular-nums flex items-center justify-center border-2 border-white"
                variant="destructive"
              >
                {isCartDataLoading ? (
                  <Loader className="size-3 animate-spin" />
                ) : (
                  cartData?.data.totalItems
                )}
              </Badge>
              <IoBagHandleOutline className="size-5 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
          <Button
            asChild
            size={"icon-lg"}
            variant={"outline"}
            className={`relative max-md:hidden rounded-full border-none  transition-all duration-300 group shadow-none ${isScrolled ? "bg-white" : "bg-accent/50 hover:bg-primary/10"}`}
          >
            <Link href={"/wishlist"}>
              <Badge
                className="h-5 absolute -top-1 -start-2 min-w-5 rounded-full px-1 font-mono tabular-nums flex items-center justify-center border-2 border-white"
                variant="destructive"
              >
                {isWishlistDataLoading ? (
                  <Loader className="size-3 animate-spin" />
                ) : (
                  wishlistData?.wishlist?.products?.length
                )}
              </Badge>
              <Heart className="size-5 transition-transform group-hover:scale-110" />
            </Link>
          </Button>

          {isUserDataLoading ? (
            <Button variant={"outline"} className="rounded-full">
              <Loader className="animate-spin" />
            </Button>
          ) : (
            <>
              {!isUserDataLoading && userData?.data ? (
                <DropdownMenu dir="rtl">
                  <DropdownMenuTrigger asChild className="outline-0">
                    <Button
                      variant={isScrolled ? "secondary" : "default"}
                      size={"icon-lg"}
                      className="rounded-full"
                    >
                      <CgProfile className="size-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-3xs" align="end">
                    <DropdownMenuLabel>
                      <p className="capitalize">{userData?.data?.name}</p>
                      <p className="text-gray-500">{userData?.data?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link className="cursor-pointer" href={"/orders"}>
                        <CiViewList />
                        الأوردرات
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-0 pb-0">
                      <Button
                        className="w-full justify-start"
                        variant={"destructive"}
                        disabled={isLogoutPending}
                        onClick={() => {
                          toast.promise(logout, {
                            loading: "جاري تسجيل الخروج",
                            success: () => {
                              router.push("/signin");
                              return "تم تسجيل الخروج";
                            },

                            error: (error) => `حدث خطأ ما: ${error}`,
                          });
                        }}
                      >
                        <LogOut className="size-5 text-destructive" />
                        تسجيل الخروج
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="max-md:hidden rounded-full"
                  size={"icon-lg"}
                  variant={"default"}
                  asChild
                >
                  <Link href={"/signin"}>
                    <CgProfile className="size-5" />
                  </Link>
                </Button>
              )}
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
};

export default Navbar;
