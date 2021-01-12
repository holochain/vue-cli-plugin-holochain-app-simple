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
  created () {
    this.$vuetify.theme.dark = true
    if (localStorage.getItem('agentPubKey')) {
      this.holo = false
      this.$store.dispatch('initialiseStore')
        .then(() => this.$store.dispatch('simple/initialise'))
        .then(() => this.$store.dispatch('simple/fetchThings'))
    }
  }
}
</script>
