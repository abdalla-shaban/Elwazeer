"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as pixel from "@/lib/fbPixel";

const FacebookPixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/product/")) {
      pixel.event("ViewContent", {
        content_name: pathname.split("/product/")[1],
      });
    }
    pixel.pageview();
  }, [pathname]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixel.FB_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
};

export default FacebookPixel;
