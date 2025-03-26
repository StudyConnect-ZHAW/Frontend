import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: "__BACKEND_API__", // This will be replaced dynamically
  },
};

export default nextConfig;
