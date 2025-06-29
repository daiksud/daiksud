import eslintPluginAstro from 'eslint-plugin-astro'
const eslintConfig = [
  ...eslintPluginAstro.configs['recommended'],
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
]
export default eslintConfig
