/* eslint-disable import/no-extraneous-dependencies */
import { nodeResolve } from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
// import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import nodeGlobals from 'rollup-plugin-node-globals'
import nodeBuiltIns from 'rollup-plugin-node-builtins'
import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.ts',
    external: [ 'debug' ],
    output: {
      // globals: {
      //   'lodash-es': 'lodash-es',
      //   eventemitter2: 'EventEmitter2'
      // },
      name: 'nestore',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      nodeResolve({
        browser: true
      }), // so Rollup can find `ms`
      typescript({ tsconfig: 'tsconfig.umd.json' }),
      babel({
        babelHelpers: 'inline',
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
              corejs: '3.22'
            }
          ]
        ]
      })
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.ts',
    external: [ 'debug' ],
    plugins: [

      nodeGlobals(), // required for some shims
      nodeBuiltIns(),
      nodeResolve(),
      typescript({ tsconfig: 'tsconfig.json' }), // so Rollup can convert TypeScript to JavaScript
      babel({
        babelHelpers: 'inline',
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'entry',
              corejs: '3.22'
            }
          ]
        ]
      })
    ],
    output: [
      // { file: pkg.main, format: 'cjs', exports: 'default' },
      { file: pkg.module, format: 'esm' } // handle the es module build with tsc
    ]
  }

]
