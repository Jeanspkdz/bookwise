import oxlint from 'eslint-plugin-oxlint'

// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
)
