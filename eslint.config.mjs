import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "src/components/ui/*",
      "src/components/magicui/*",
      "src/lib/supabase/types.ts",
    ],
  },
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
    },
  },
];

export default eslintConfig;
