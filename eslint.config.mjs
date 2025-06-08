import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: "eslint:recommended",
});

const eslintConfig = [
  // Use recommended rules
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.recommended),

  ...compat.extends("next", "next/core-web-vitals", "next/typescript"),

  // Custom rules
  {
    rules: {
      // Error Prevention
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "warn",
      "no-useless-assignment": "warn",
      "use-isnan": "error",
      "valid-typeof": "error",

      // Best Practices
      //"no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn",
      "no-alert": "warn",
      eqeqeq: ["warn", "always"],
      curly: ["warn", "all"],

      // Code Style & Readability
      semi: ["warn", "always"],
      indent: ["warn", 2, { SwitchCase: 1 }],
      "comma-dangle": ["warn", "only-multiline"],
      "object-curly-spacing": ["warn", "always"],
      "array-bracket-spacing": ["warn", "never"],
      "space-before-blocks": "warn",
      "no-multiple-empty-lines": ["warn", { max: 1 }],
      "max-len": ["warn", { code: 120 }], // Warn if lines exceed max number of characters
      "newline-before-return": "warn",
    },
  },
];

export default eslintConfig;
