// Imports
const fs = require('fs')

module.exports = (api, options) => {
  if (!api.hasPlugin('vuetify')) {
    console.log('`@vuetify/presets` requires the `vue-cli-plugin-vuetify` package.')
    return
  }

  try {
    api.render(`./templates/simple`)
  } catch (e) {
    console.log(e, options)
  }
  const files = { './src/App.vue': `../generator/templates/simple/src/App.vue` }
  try {
    api.render(files)
  } catch (e) {
    console.log(e, options)
  }

  api.extendPackage({
    dependencies: {
      '@holochain/conductor-api': '^0.0.1-dev.15',
      'byte-base64': '^1.1.0',
      'dexie': '^3.0.3-rc.4',
      '@mdi/font': '^5.8.55'
    },
    devDependencies: {
      'rimraf': '^3.0.2',
      'foreman': '^3.0.1',
      'eslint-config-vuetify': '^0.6.1',
      'eslint-plugin-vue': '^6.2.2',
      'eslint-plugin-vuetify': '^1.0.0-beta.6',
      'lodash': '^4.17.15'
    },
    scripts: {
      'serve:agent1': 'vue-cli-service serve --port 44001',
      'serve:agent2': 'vue-cli-service serve --port 44002',
      'serve:agent3': 'vue-cli-service serve --port 44003',
      'serve:agent4': 'vue-cli-service serve --port 44004',
      'start': 'nf start'
    }
  })

  api.onCreateComplete(() => {
    const presetName = `Holochain Simple Application preset`
    const projectName = api.rootOptions.projectName

    const home = api.resolve('src/views/Home.vue')
    if (fs.existsSync(home)) fs.unlinkSync(home)
    const about = api.resolve('src/views/About.vue')
    if (fs.existsSync(about)) fs.unlinkSync(about)

    api.exitLog(`🍣  Successfully generated ${projectName} from the ${presetName}.\n`)
    api.exitLog(`Make sure you have holochain installed.`)
    api.exitLog(`yarn start`)
  })
}
