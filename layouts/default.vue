<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
      <v-breadcrumbs :items="currentPathArray" divider="/"> </v-breadcrumbs>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-chart-bubble',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'products',
          to: '/products',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'product create',
          to: '/products/create',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'product',
          to: '/products/4',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'dashboard',
          to: '/dashboard',
        },
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
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
