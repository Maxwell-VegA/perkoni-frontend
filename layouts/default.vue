<template>
  <v-app>
    <vendor-nav />
    <v-app-bar clipped-left fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <div v-if="$auth.loggedIn">
        <span class="primary mr-4 py-2 px-4"> user page </span>
        <v-btn @click="$auth.logout()">Sign Out</v-btn>
      </div>
      <div v-else>
        <v-btn to="/signin">Sign In</v-btn>
        <v-btn to="/register">Register</v-btn>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import VendorNav from '@/components/VendorNav'
export default {
  components: { VendorNav },
  data() {
    return {
      title: 'DEVINI X PERKONI',
    }
  },
}
</script>
