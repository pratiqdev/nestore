module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@pratiq/nestore-eslint`
  extends: ["@pratiq/nestore-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  }
};
