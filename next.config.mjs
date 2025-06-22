/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

export default withVercelToolbar()(nextConfig);
