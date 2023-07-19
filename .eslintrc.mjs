module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@nestate/eslint`
  extends: ["@pratiq/nestore-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  }
};
