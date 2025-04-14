import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: "http://localhost:8080/api/", // This will be replaced dynamically
    TENANT_SUBDOMAIN: "studyconnectpm4",
  },
};

export default nextConfig;
