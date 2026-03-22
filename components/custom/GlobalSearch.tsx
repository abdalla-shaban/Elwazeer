"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { motion } from "motion/react";

const GlobalSearch = () => {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");

  const updateSearch = useDebouncedCallback(
    (search: string) => {
      const newParams = new URLSearchParams(params.toString());

      if (search) {
        newParams.set("q", search);
      } else {
        newParams.delete("q");
      }

      router.push(`/?${newParams.toString()}`, {
        scroll: false,
      });
    },
    400, // debounce time
  );

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="absolute pe-1.5 border-e top-1/2 -translate-y-1/2 start-4">
        <Search className="size-5" />
      </div>

      <Input
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          updateSearch(v);
        }}
        className="bg-white ps-12 h-12"
        placeholder="عن اي منتج تبحث؟"
      />
    </motion.div>
  );
};

export default GlobalSearch;
