<template>
  <v-app>
    <default-view />
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  components: {
    DefaultView: () => import('./View')
  }
}
</script>
