import Link from "next/link";
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
    style:
      "hover:-translate-y-0.5 shadow shadow-transparent hover:shadow-primary bg-blue-600",
    href: "#",
  },
  {
    Icon: FaInstagram,
    style:
      "hover:-translate-y-0.5 shadow shadow-transparent hover:shadow-primary bg-red-700",
    href: "#",
  },
  {
    Icon: FaTelegram,
    style:
      "hover:-translate-y-0.5 shadow shadow-transparent hover:shadow-primary bg-sky-600",
    href: "#",
  },
  {
    Icon: FaTiktok,
    style:
      "hover:-translate-y-0.5 shadow shadow-transparent hover:shadow-primary bg-black",
    href: "#",
  },
  {
    Icon: FaWhatsapp,
    style:
      "hover:-translate-y-0.5 shadow shadow-transparent hover:shadow-primary bg-green-600",
    href: "#",
  },
];

const SocialMediaIcons = () => {
  return (
    <div className="flex items-center gap-1">
      {socialItems.map(({ Icon, style, href }, idx) => (
        <Link
          key={idx}
          href={href}
          target="_blank"
          className={`size-8 flex flex-wrap items-center justify-center border rounded-md text-white duration-300 ${style}`}
        >
          <Icon />
        </Link>
      ))}
    </div>
  );
};

export default SocialMediaIcons;
