import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      ".(jsx|tsx)$": [
        {
          loader: "@dyad-sh/nextjs-webpack-component-tagger",
        },
      ],
    },
  }
};

export default nextConfig;
