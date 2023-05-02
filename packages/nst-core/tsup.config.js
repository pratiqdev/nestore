import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    // minify: !options.watch,
    entryPoints: ['./src/main.ts'],
    format: ['cjs', 'esm'],
    outDir: './dist',
    dts: true,
    dtsBundle: true,
    dtsBundleOutFile: 'types.d.ts',
    sourcemap: false,
    minify: false,
    clean: true,
    legacyOutput: false
  }
})

/*
  "tsup": {
    "name": "nestore",
    "entry": [
      "src/index.ts"
    ],
    "format": [
      "esm"
    ],
    "treeshake": true,
    "sourcemap": false,
    "clean": true,
    "shims": false,
    "target": "es2018",
    "bundle": true,
    "replaceNodeEnv": false,
    "minify": false,
    "minifyWhitespace": false,
    "minifyIdentifiers": false,
    "minifySyntax": false
  }
*/