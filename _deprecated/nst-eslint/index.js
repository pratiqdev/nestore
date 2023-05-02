module.exports = {
  extends: [
    // "next", 
    "eslint:recommended",
    'plugin:@typescript-eslint/recommended',
    "turbo", 
    "prettier"
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parser: '@typescript-eslint/parser',
  plugins: ["@typescript-eslint"],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: [
        // require.resolve("next/babel")
      ],
    },
  },
};
