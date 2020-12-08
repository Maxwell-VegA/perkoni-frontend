<template>
  <v-app>
    <vendor-nav />
    <v-app-bar clipped-left fixed app>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn> -->
      <v-toolbar-title v-text="title" />
      <v-breadcrumbs :items="currentPathArray" divider="/"> </v-breadcrumbs>
      <v-spacer />
      <div v-if="$auth.loggedIn">
        <span class="success mr-4 py-2 px-4"> vendor page </span>
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
  middleware: 'auth-vendor',
  components: { VendorNav },
  data() {
    return {
      title: 'DEVINI X PERKONI',
    }
  },
  computed: {
    currentPathArray() {
      const arr = this.$route.path.split('/')
      const array = [
        {
          text: 'home',
          exact: true,
          to: '/',
        },
        {
          text: arr[1],
          exact: true,
          to: '/' + arr[1],
        },
        {
          text: arr[2],
          exact: true,
          to: '/' + arr[1] + '/' + arr[2],
          // disabled: true,
        },
        {
          text: arr[3],
          exact: true,
          to: '/' + arr[1] + '/' + arr[2] + '/' + arr[3],
        },
      ]
      return array
    },
  },
}
</script>
