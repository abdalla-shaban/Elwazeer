import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegram,
  FaTiktok,
  FaWhatsapp,
} from "react-icons/fa";

const socialItems = [
  {
    Icon: FaFacebookF,
    style: "hover:-translate-y-0.5",
    href: "https://www.facebook.com/amaardola?mibextid=ZbWKwL",
  },
  {
    Icon: FaInstagram,
    style: "hover:-translate-y-0.5",
    href: "https://www.instagram.com/yara_stor1?igsh=ZndxYWN4NzZ5czY2",
  },
  {
    Icon: FaTelegram,
    style: "hover:-translate-y-0.5",
    href: "https://t.me/yara33st",
  },
  {
    Icon: FaTiktok,
    style: "hover:-translate-y-0.5",
    href: "https://www.tiktok.com/@yara_stor?_t=8mKPZ7mfw4E&_r=1",
  },
  {
    Icon: FaWhatsapp,
    style: "hover:-translate-y-0.5",
    href: "https://wa.me/+201044882690?text=",
  },
];

const quickLinks = [
  {
    title: "الرئيسية",
    href: "/",
  },
  {
    title: "المتجر",
    href: "/store",
  },
  {
    title: "السلة",
    href: "/cart",
  },
  {
    title: "المفضلة",
    href: "/wishlist",
  },
];
const infoLinks = [
  {
    title: "سياسة الخصوصية",
    href: "/privacy-policy",
  },
  {
    title: "سياسية الاسترجاع والاستبدال",
    href: "/refund-policy",
  },
];
const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-secondary text-[#94A3B8] border-t max-md:pb-20 pt-5 space-y-5"
    >
      <div className="container flex flex-col md:flex-row justify-between gap-10 py-10 px-4 mx-auto">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <Image
              src={"/logo-icon.png"}
              alt="Elena Store"
              width={200}
              height={200}
              className="size-20 object-contain"
            />
            <h2 className="text-3xl font-black text-white">إلينا</h2>
          </div>
          <div className="flex items-center gap-2 max-w-xs">
            <p>
              وجهتك الأولى للأناقة والفخامة فى عالم الموضة العربية.ننتقي لكم
              أجود المنتجات بعناية فائقة.
            </p>
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-lg font-medium text-primary">روابط سريعة</h2>
          <ul className="space-y-2">
            {quickLinks.map(({ title, href }) => (
              <li
                key={title}
                className="flex max-w-fit duration-300 hover:pr-4 items-center gap-2"
              >
                <Dot className="size-4" />
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 flex-1">
          <h2 className="text-lg font-medium text-primary">معلومات</h2>
          <ul className="space-y-2">
            {infoLinks.map(({ title, href }) => (
              <li
                key={title}
                className="flex max-w-fit duration-300 hover:pr-4 items-center gap-2"
              >
                <Dot className="size-4" />
                <Link href={href}>{title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary">تواصل معنا</h2>
          <ul className="flex items-center gap-2">
            {socialItems.map(({ Icon, href, style }) => (
              <li key={href}>
                <Link
                  target="_blank"
                  href={href}
                  className={`flex items-center justify-center size-10 rounded-full text-white transition-all duration-300 bg-white/10 ${style}`}
                >
                  <Icon className="size-5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center max-sm:p-10 border-t border-primary/10 p-3">
        <p className="text-sm">
          تم التصميم والتطوير بواسطة{" "}
          <Link
            target="_blank"
            className="font-semibold underline"
            href={"https://www.linkedin.com/in/abdullahmadkour"}
          >
            Abdullah Madkour
          </Link>{" "}
          و{" "}
          <Link
            target="_blank"
            className="font-semibold underline"
            href={"https://www.linkedin.com/in/gamal-abd-elnaser-6b147530a/"}
          >
            Gamal Abdelnasser
          </Link>
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
