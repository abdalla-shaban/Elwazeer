import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dbetkghar/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dqnwbhdmn/**",
      },
    ],
  },
};

export default nextConfig;
