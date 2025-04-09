import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: "__BACKEND_API__", // This will be replaced dynamically
  },
};

// proxy configuration for the auth server
module.exports = {
  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:3001/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
