module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-nst`
  extends: ["nst"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  }
};
