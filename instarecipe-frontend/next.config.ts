import type { NextConfig } from "next";
const nextConfig = {
  images: {
    // Only allow local images and placeholder service
    // No remotePatterns needed since we're using local images
  },
};

export default nextConfig;
