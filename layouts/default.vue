/* eslint-disable prettier/prettier */
<template>
  <v-app>
    <vendor-nav />
    <!-- Could add a background image to this app bar -->
    <v-app-bar elevate-on-scroll clipped-left fixed app clipped-right>
      <v-col md="3">
        <v-toolbar-title v-text="title" />
        <!-- <v-breadcrumbs :items="currentPathArray" divider="/"> </v-breadcrumbs> -->
      </v-col>
      <v-spacer />
      <v-col md="5">
        <v-row justify="center">
          <v-btn-toggle group tile>
            <v-btn to="/products">Veikals</v-btn>
            <v-btn to="/brands">Ražotaji</v-btn>
            <v-btn to="/contacts">Kontakti</v-btn>
            <v-btn @click="searchActive = !searchActive">
              Meklēšana
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-row>
      </v-col>
      <v-spacer />
      <v-col md="3">
        <div class="float-right">
          <v-menu min-width="220" open-on-hover close-delay="100" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" class="mr-3" v-on="on">
                <v-icon size="30">mdi-cart-outline</v-icon>
                <v-badge
                  v-if="cart.length > 0"
                  :content="cart.length"
                ></v-badge>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-for="(item, i) in cart" :key="i" class="py-2">
                <!-- :to="'/products/' + item.product_id" -->
                <v-list-item-content>
                  <v-list-item-title>
                    <span class="text-h6">
                      {{ item.title }}
                    </span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span
                      v-for="(property, i) in decodedKey(item.key)"
                      :key="i"
                    >
                      <span v-if="property !== 'ANY-1337'">
                        {{ property }} /
                      </span>
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{
                      (parseFloat(item.price) * item.quantity).toFixed(2)
                    }}&#8364;
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-combobox
                    v-model="item.quantity"
                    :items="qtyOptions"
                    height="40px"
                    style="width: 64px"
                    dense
                    @change="updateQuantity(item.id, item.key)"
                  >
                  </v-combobox>
                </v-list-item-action>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item v-if="cart.length > 0">
                <v-list-item-title>Norēķināties</v-list-item-title>
                <v-list-item-action>
                  <v-icon>mdi-cart-arrow-right</v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item v-else>
                <v-list-item-title>Grozs tukš</v-list-item-title>
                <v-list-item-action>
                  <v-icon>mdi-cart-remove</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu open-on-hover close-delay="100" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon size="30">mdi-account-circle-outline</v-icon>
                <!-- <v-badge content="7"></v-badge> -->
              </v-btn>
            </template>
            <v-list v-if="$auth.loggedIn" dense>
              <v-list-item>
                <v-list-item-title>Ziņas</v-list-item-title>
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
                <v-list-item-title> Saglabātie produkti</v-list-item-title>
                <v-icon>mdi-bookmark-check-outline</v-icon>
              </v-list-item>
              <v-list-item @click="$auth.logout()">
                <v-list-item-title> Sign out </v-list-item-title>
                <v-icon>mdi-exit-to-app</v-icon>
              </v-list-item>
            </v-list>
            <v-list v-else>
              <v-list-item to="/signin">
                <v-list-item-title> Sign In</v-list-item-title>
                <v-icon>mdi-login-variant</v-icon>
              </v-list-item>
              <v-list-item to="/register">
                <v-list-item-title class="mr-8"> Register </v-list-item-title>
                <v-icon>mdi-account-plus-outline</v-icon>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-col>
    </v-app-bar>
    <admin-nav />
    <chat-router />
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
              <v-card-text> Džemperis </v-card-text>
            </v-card>
          </v-overlay>
        </div>
        <nuxt />
      </v-container>
      <!-- </form> -->
    </v-main>
    <v-footer>
      <!-- <v-row style="bottom: 0; width: 100vw; position: relative"> -->
      <n_footer />
      <!-- </v-row> -->
    </v-footer>
  </v-app>
</template>

<script>
import VendorNav from '@/components/VendorNav'
import AdminNav from '@/components/AdminNav'
import n_footer from '@/components/Footer'
import ChatRouter from '~/components/ChatRouter.vue'
//

export default {
  components: { VendorNav, AdminNav, n_footer, ChatRouter },
  middleware: ['load-cart'],
  data() {
    return {
      title: 'DEVIŅI X PĒRKONI',
      searchActive: false,
      lsTest: false,
      update: false,
    }
  },
  computed: {
    qtyOptions() {
      return this.$store.state.qtyOptions
    },
    cart() {
      const update = this.update
      if (this.$auth.loggedIn) {
        return this.$store.state.cart
      } else if (!this.$auth.loggedIn && this.lsTest) {
        const val = JSON.parse(localStorage.getItem('cart'))
        if (!val) {
          return []
        } else {
          return Object.values(val)
        }
      } else {
        return []
      }
    },
  },
  created() {},
  mounted() {
    this.$root.$on('refreshCart'),
      () => {
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
    decodedKey(key) {
      return key.split('_//__')
    },
  },
}
</script>

<style lang="sass">
*
  scroll-behavior: smooth

.v-card__text, .v-card__title
  word-break: normal !important
a
  text-decoration: none

.chatbox-container
  z-index: 100
  bottom: 0
  right: 0
  position: fixed
  margin: -0.5rem 3.5rem

.chatbox
  padding: 1.25rem
  border-radius: 7px
  background: rgba(30, 30, 30, 0.96)
  border: 1px solid gray
  // could try glassmorphism here as well

  .messages-container
    position: relative
    display: flex
    flex-direction: column
    max-height: 40vh
    overflow-y: scroll
    padding-right: 1rem
    // overflow-y: hidden

  .chat-msg
    position: relative
    max-width: 90%
    align-self: flex-end
    border-radius: 4px
    margin: .5rem 0
    border: 2px solid #363636

  .msg-text
    margin: .5rem 1rem

  .msg-time
    font-size: .85rem
    margin: -0.5rem 0 .6rem 0
    padding: 0 1rem
    opacity: 70%

  .myMessage
    align-self: start
    background: rgba(54, 54, 54, 0.8)
    border: none

  .text-input
    width: 100%
    margin-bottom: -1.5rem

  .unreadMsg
    background: linear-gradient(135deg, rgba(212, 32, 14, 0.31) 0%, rgba(212, 32, 14, 0.05) 110%)
</style>
