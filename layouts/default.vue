<template>
  <v-app>
    <vendor-nav />
    <!-- Could add a background image to this app bar -->
    <!-- Could place both sign in and register under the same profile icon next to the cart which would really clean up that section -->
    <v-app-bar elevate-on-scroll clipped-left fixed app clipped-right>
      <v-col md="3">
        <v-toolbar-title v-text="title" />
        <!-- <v-breadcrumbs :items="currentPathArray" divider="/"> </v-breadcrumbs> -->
      </v-col>
      <v-spacer />
      <v-col md="5">
        <v-row justify="center">
          <v-btn-toggle group tile>
            <v-btn>Veikals</v-btn>
            <v-btn>Razotaji</v-btn>
            <v-btn>Kontakti</v-btn>
            <v-btn @click="searchActive = !searchActive">
              Meklesana
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-row>
      </v-col>
      <v-spacer />
      <v-col md="3">
        <div class="float-right">
          <v-menu open-on-hover close-delay="500" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" class="mr-3" v-on="on">
                <v-icon size="30">mdi-cart-outline</v-icon>
                <!-- badge indicates how many items in cart-->
                <v-badge v-if="cart.length > 0" :content="cart.length"></v-badge>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, i) in cart"
                :key="i"
                :to="'/products/' + item.product_id"
              >
                <v-list-item-title>
                  <span>
                    <span v-show="item.quantity > 1">
                      {{ item.quantity }}&times;
                    </span>
                    {{ item.title }}
                  </span>
                  <p>
                    {{ (parseFloat(item.price) * item.quantity).toFixed(2) }}
                    &#8364;
                  </p>
                </v-list-item-title>
              </v-list-item>
              <!-- for item in cart echo them all here with some minor details, perhaps calculate a total price -->
              <!-- item quantity, price, total price, (on click go to product/id),  -->
              <v-list-item v-if="cart.length > 0">
                <v-list-item-title>Norekinaties</v-list-item-title>
                <v-list-item-action>
                  <v-icon>mdi-cart-arrow-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-title>Grozs tuksh</v-list-item-title>
                <v-list-item-action>
                  <v-icon>mdi-cart-remove</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu
            v-if="$auth.loggedIn"
            open-on-hover
            close-delay="500"
            offset-y
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon size="30">mdi-account-circle-outline</v-icon>
                <v-badge content="7"></v-badge>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item>
                <v-list-item-title>Zinas</v-list-item-title>
                <!-- Notifications for new orders (vendors), publication requests (admins), updates on order progress (buyers) -->
                <v-list-item-action>
                  <v-icon>mdi-android-messages</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Pirkumu vesture</v-list-item-title>
                <v-list-item-action>
                  <v-icon>mdi-format-list-bulleted</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-title> Saglabatie produkti</v-list-item-title>
                <v-icon>mdi-bookmark-check-outline</v-icon>
              </v-list-item>
              <v-list-item @click="$auth.logout()">
                <v-list-item-title> Sign out </v-list-item-title>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>
          <div v-else class="float-right">
            <v-btn to="/signin">Sign In</v-btn>
            <v-btn to="/register">Register</v-btn>
          </div>
        </div>
      </v-col>
    </v-app-bar>
    <!--  -->
    <v-main>
      <!-- <form autocomplete="off"> -->
        <v-container>
          <div style="width: 100%; height: 50%">
            <v-overlay z-index="4" :value="searchActive">
              <v-card @keydown.esc="searchActive = false">
                <v-card-title primary-title>
                  <v-text-field
                    outlined
                    autofocus
                    class="mt-4"
                    label="Meklet produktu"
                    append-icon="mdi-magnify"
                    dense
                  ></v-text-field>
                </v-card-title>
                <!-- list of search results - image, name, price, category -->
                <v-card-text> Dzemperis </v-card-text>
              </v-card>
            </v-overlay>
          </div>
          <nuxt />
          <!--------------------------------------------->
        </v-container>
      <!-- </form> -->
    </v-main>
    <!--  -->
    <admin-nav />
  </v-app>
</template>

<script>
import VendorNav from '@/components/VendorNav'
import AdminNav from '@/components/AdminNav'
// import { mapState } from 'vuex'
//

export default {
  components: { VendorNav, AdminNav },
  middleware: 'load-cart',
  data() {
    return {
      title: 'DEVINI X PERKONI',
      searchActive: false,
      lsTest: false,
      update: false,
    }
  },
  computed: {
    cart() {
      let update = this.update
      if (this.$auth.loggedIn) {
        return this.$store.state.cart
      } else if (!this.$auth.loggedIn && this.lsTest) {
        let val = JSON.parse(localStorage.getItem('cart'))
        if (!val) {
          return []
        } else {
          return Object.values(val)
        }
      } else {
        return []
      }
    },
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
  created() {},
  mounted() {
    this.$root.$on('refreshCart'), () => {
      this.update = !this.update
    }
    // this.getLocalCart()
    this.lsTest = true
    // function checkLS() {
    //   res = this.localStorage.getItem('cart')
    //   if (!res) {
    //     this.localStorage.setItem('cart', '{}')
    //   }
    // }
  },
  methods: {

  },
}
</script>

<style lang="sass">
.v-card__text, .v-card__title
  word-break: normal !important
a
  text-decoration: none
</style>
