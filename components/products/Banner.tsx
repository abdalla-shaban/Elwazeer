"use client";

import { useSettings } from "@/lib/api/hooks";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { motion } from "motion/react";

const Banner = () => {
  const { data, isLoading } = useSettings();
  return (
    <section className="container pt-7">
      {data?.settings.banner.secure_url ? (
        <Link href={"/store"} className={isLoading ? "p-5 bg-white" : ""}>
          {isLoading ? (
            <Skeleton className="h-48 sm:h-[571px] rounded-md" />
          ) : (
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Image
                src={"/banner.jpeg"}
                width={1920}
                height={1920}
                alt="Banner"
                className="w-full h-48 sm:h-[400px] object-cover max-md:object-[65%] rounded-md"
              />
            </motion.div>
          )}
        </Link>
      ) : !isLoading ? null : (
        <div className={isLoading ? "p-5 bg-white" : ""}>
          <Skeleton className="h-48 sm:h-[571px] rounded-md" />
        </div>
      )}
    </section>
  );
};

export default Banner;
