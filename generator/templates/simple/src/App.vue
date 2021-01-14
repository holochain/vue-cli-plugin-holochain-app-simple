<template>
  <v-app>
    <v-main>
      <v-fade-transition mode="out-in">
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  mounted () {
    this.$vuetify.theme.dark = true
  },
  watch: {
    $route (to) {
      Object.keys(this.$route.query).forEach(key => {
        localStorage.setItem(key, this.$route.query[key])
      })
    }
  }
}
</script>
