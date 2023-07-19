import { defineConfig } from 'tsup'

export default defineConfig((options) => {
  return {
    // minify: !options.watch,
    entryPoints: ['./src/main.ts'],
    format: ['esm'],
    shims: false,
    outDir: './dist',
    dts: true,
    // dtsBundle: true,
    // dtsBundleOutFile: 'types.d.ts',
    sourcemap: false,
    minify: false,
    clean: true,
    legacyOutput: true,

    splitting: true,
    // sourcemap: false,
    // clean: true,
    // shims: false,
    target: "es2020",
    bundle: false,
    // dts: true,
    replaceNodeEnv: false,
    // minify: false,
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: false,
    // legacyOutput: true
  }
})

/*
  tsup: {
    name: nestore,
    entry: [
      src/index.ts
    ],
    format: [
      esm
    ],
    treeshake: true,
    sourcemap: false,
    clean: true,
    shims: false,
    target: es2018,
    bundle: true,
    replaceNodeEnv: false,
    minify: false,
    minifyWhitespace: false,
    minifyIdentifiers: false,
    minifySyntax: false
  }
*/