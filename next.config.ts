import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // This will be taken from .env file
    TENANT_SUBDOMAIN: process.env.TENANT_SUBDOMAIN, // This will be taken from .env file
  },

  // Define whitelisted domains
  images: {
    remotePatterns: [
      {
        // For placeholder avatars
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ]
  }
};

export default nextConfig;
