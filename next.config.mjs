import data from "./package.json" with { type: "json" };

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
  publicRuntimeConfig: {
    version: data.version,
  },
};

import { withVercelToolbar } from "@vercel/toolbar/plugins/next";

export default withVercelToolbar()(nextConfig);
