// https://medium.com/locale-ai/architecting-vuex-store-for-large-scale-vue-js-applications-24c36137e251
const requireModule = require.context('.', false, /\.store\.js$/)
const modules = {}
requireModule.keys().forEach(filename => {
  const moduleName = filename.replace(/(\.\/|\.store\.js)/g, '')
  modules[moduleName] = requireModule(filename).default || requireModule(filename)
})
export default modules
