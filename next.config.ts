import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      // TODO: Upload all seed images to Supabase and only whitelist Supabase URL
      "www.artificial-intelligence.store",
      "i.etsystatic.com",
      "www.teez.in",
      "tbmfwqpucvrzldtooihp.supabase.co",
    ],
  },
};

export default nextConfig;
