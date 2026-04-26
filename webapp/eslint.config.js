import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["**/www/", "**/dist/", "**/scripts/"]),
  { files: ["src/**/*.{ts,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["src/**/*.{ts,tsx}"], languageOptions: { globals: globals.browser } },
  // @ts-expect-error default tseslint comes with error and they ignore in their docs
  tseslint.configs.recommended,
  { ...pluginReact.configs.flat.recommended, files: ["src/**/*.{ts,tsx}"] },
]);
