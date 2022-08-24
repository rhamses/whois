module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "quotes": "off",
    "object-curly-spacing": "off",
  },

  parserOptions: {
    ecmaVersion: 8,
  },
};
