import Image from "next/image";
import Link from "next/link";
import * as motion from "motion/react-client";

const Logo = ({ isScrolled = false }: { isScrolled?: boolean }) => {
  return (
    <motion.div
      whileHover={{ scale: [0.9, 1.1, 1] }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link href={"/"} className="text-center flex items-center gap-2">
        <Image
          src={isScrolled ? "/dark-text-logo.png" : "/light-text-logo.png"}
          alt="Elwazeer Store"
          width={300}
          height={300}
          className="w-fit max-h-[62px] object-contain object-center"
        />
      </Link>
    </motion.div>
  );
};

export default Logo;
