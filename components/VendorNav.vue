<template>
  <v-navigation-drawer
    v-if="$auth.loggedIn && $auth.user.is_vendor"
    :mini-variant="miniVariant"
    clipped
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
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      fixed: false,
      miniVariant: false,
      items: [
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'Welcome',
        //   to: '/',
        // },
        {
          icon: 'mdi-chart-bubble',
          title: 'products (dev)',
          to: '/products',
        },
        // {
        //   icon: 'mdi-chart-bubble',
        //   title: 'product',
        //   to: '/products/4',
        // },
        {
          icon: 'mdi-view-dashboard-variant',
          title: 'Dashbord',
          to: '/vendor',
        },
        {
          icon: 'mdi-order-bool-descending-variant',
          title: 'Orders',
          to: '/vendor/orders',
        },
        {
          icon: 'mdi-shopping-outline',
          title: 'Products',
          to: '/vendor/products',
        },
        {
          icon: 'mdi-chart-areaspline',
          title: 'Statistics',
          to: '/vendor/statistics',
        },
        {
          icon: 'mdi-github',
          title: 'Brands',
          to: '/vendor/brands',
        },
        // mdi-truck-outline - for shipping
        // mdi-badge-account-horizontal-outline - driver's license
      ],
    }
  },
}
</script>

<style></style>
