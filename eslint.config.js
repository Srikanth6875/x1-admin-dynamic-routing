import globals from "globals";
import { fixupPluginRules } from "@eslint/compat";
import reactRefresh from "eslint-plugin-react-refresh";
import reactHooks from "eslint-plugin-react-hooks";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-duplicates": "error",
      "no-duplicate-imports": "off",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
  },
  { settings: { react: { version: "detect" } } },
  {
    ignores: [
      "**/build/",
      "**/dist/",
      "**/cache/",
      "**/.vite/",
      "**/node_modules/",
      "**/*.min.js",
      ".react-router/types/**/*", // auto-generated types
    ],
  },
  //Base TypeScript + Prettier rules
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true, allowTernary: true, allowTaggedTemplates: true },
      ],
      "no-console": ["error", { allow: ["warn", "error"] }],
      "prettier/prettier": "warn",
    },
  },
  //Test files
  {
    files: ["**/*.spec.ts", "**/*.step.ts"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": "off",
    },
  },
  //React Router App (UI + Route Modules)
  {
    files: ["app/**/*.{ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-refresh": reactRefresh,
      "react-hooks": fixupPluginRules(reactHooks),
    },
    rules: {
      "react-refresh/only-export-components": [
        "error",
        {
          allowExportNames: [
            "loader",
            "clientLoader",
            "action",
            "clientAction",
            "ErrorBoundary",
            "HydrateFallback",
            "headers",
            "handle",
            "links",
            "meta",
            "shouldRevalidate",
          ],
        },
      ],
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "react/jsx-key": "error",
      "react/prop-types": "off",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "eol-last": ["error", "always"],
      semi: ["error", "always"],
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      ...pluginReact.configs["jsx-runtime"].rules,
    },
  },
  configPrettier,
  // Disable import/no-duplicates & no-explicit-any in service, type, and config files
  {
    files: [
      "eslint.config.js",
      "vite.config.ts",
      "react-router.config.ts",
      "app/**/*.service.ts",
      "app/**/*.types.ts",
      "app/**/*.enums.ts",
      "app/**/*.constants.ts",
    ],
    rules: {
      "import/no-duplicates": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
