import { defineConfig } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default defineConfig([
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'react/display-name': 'off',
      'react/no-direct-mutation-state': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      'react/no-unknown-property': 'off',
    },
  },
]);
