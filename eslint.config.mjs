import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ['next'],
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'react/no-unknown-property': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-no-comment-textnodes': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/jsx-no-duplicate-props': 'off',
      'react/jsx-no-script-url': 'off',
      'react/jsx-no-target-blank': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'react/jsx-no-script-url': 'off',
    },
  }),
]

export default eslintConfig;
