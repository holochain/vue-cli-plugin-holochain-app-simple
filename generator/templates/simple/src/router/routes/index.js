// https://medium.com/locale-ai/architecting-vuex-store-for-large-scale-vue-js-applications-24c36137e251
const requireRoutes = require.context('.', false, /\.routes\.js$/)
let routes = []
requireRoutes.keys().forEach(filename => {
  routes = routes.concat(requireRoutes(filename).default)
})
export default routes
