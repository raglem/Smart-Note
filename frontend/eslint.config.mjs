import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // allow any type
      "@next/next/no-img-element": "off", // allow <img> instead of <Image>
      "react-hooks/exhaustive-deps": "off", // allow missing dependencies in useEffect
    },
  },
];

export default eslintConfig;
