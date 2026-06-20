import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "*.generated.*",
    ],
  },
  ...nextCoreWebVitals,
  { rules: { curly: ["error", "all"] } },
  eslintConfigPrettier,
];

export default eslintConfig;
