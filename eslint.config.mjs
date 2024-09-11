import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import security from "eslint-plugin-security";
import prettier from "eslint-config-prettier";

export default [
  // ESLint processes configurations in order, with the last setting taking precedence
  { languageOptions: { globals: { ...globals.node } } },
  { ignores: [".husky", "dist", "node_modules", "tests", ".eslintcache"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  security.configs.recommended,
  {
    // These file-matching rules will be processed after the above configs
    files: ["**/*.{js,ts}"],
  },
  prettier, // placed last to ensure Prettier formatting wins
];
