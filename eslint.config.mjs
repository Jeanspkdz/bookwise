import oxlint from 'eslint-plugin-oxlint'
// import * as nuxtLayers from 'eslint-plugin-nuxt-layers'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  // {
  //   plugins: {
  //     'nuxt-layers': nuxtLayers,
  //   },
  //   rules: {
  //     'nuxt-layers/layer-boundaries': [
  //       'error',
  //       {
  //         root: 'layers',

  //         aliases: ['#layers', '@layers'],

  //         layers: {
  //           shared: [],

  //           auth: ['shared'],

  //           'book-catalog': ['shared'],

  //           app: ['*'],
  //         },
  //       },
  //     ],
  //   },
  // },
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
)
