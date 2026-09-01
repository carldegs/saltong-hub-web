import nextDefault from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import nextPlugin from "@next/eslint-plugin-next";

const nextCoreWebVitals = [
  ...nextDefault,
  nextPlugin.configs["core-web-vitals"],
];

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      ".pnpm-store/**",
      ".worktrees/**",
      "src/components/ui/*",
      "src/components/magicui/*",
      "src/lib/supabase/types.ts",
    ],
  },
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error", "info"] }],
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
