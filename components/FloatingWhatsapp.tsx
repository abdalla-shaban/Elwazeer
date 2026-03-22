import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const FloatingWhatsapp = () => {
  return (
    <Link
      href={"https://wa.me/+201044882690?text="}
      target="_blank"
      className="fixed bottom-20 z-9999999 md:bottom-5 right-5 md:right-10 shadow-xl bg-[#0FBD5F] size-14 flex items-center justify-center rounded-full"
    >
      <FaWhatsapp className="text-4xl text-white" />
    </Link>
  );
};

export default FloatingWhatsapp;
