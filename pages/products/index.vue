<template>
  <div>
    <call-to-action />

    <v-row no-gutters>
      <v-spacer></v-spacer>
      <v-col cols="12" xl="9">
        <v-row>
          <v-tabs v-model="currentCategory" grow>
            <v-tab v-for="category in categories" :key="category.value">
              {{ category.text }}
            </v-tab>
          </v-tabs>
        </v-row>

        <v-row no-gutters>
          <v-col
            v-show="categories[currentCategory].pages != 1"
            sm="12"
            md="3"
          ></v-col>
          <v-col v-show="categories[currentCategory].pages != 1" sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="categories[currentCategory].pages"
            ></v-pagination>
          </v-col>

          <v-col sm="12" md="3">
            <v-col cols="12" class="ml-n3">
              <v-card class="transparent">
                <v-list
                  v-show="categories[currentCategory].subcategories.length > 0"
                  class="mb-6"
                  nav
                >
                  <v-subheader>Subkategorija</v-subheader>
                  <v-list-item-group v-model="currentSubcategory">
                    <v-list-item
                      v-for="(subcategory, i) in categories[currentCategory]
                        .subcategories"
                      :key="i"
                    >
                      {{ subcategory }}
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-list
                  v-show="categories[currentCategory].genders.length > 0"
                  nav
                >
                  <v-subheader>Dzimums</v-subheader>
                  <v-list-item-group v-model="currentGender">
                    <v-list-item
                      v-for="(gender, i) in categories[currentCategory].genders"
                      :key="i"
                    >
                      {{ gender }}
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-col>
          </v-col>

          <v-col sm="12" md="9">
            <v-tabs-items v-model="currentCategory" class="transparent">
              <v-tab-item v-for="cat in categories" :key="cat.value">
                <v-row>
                  <v-col v-for="(prod, i) in cat.products" :key="i" cols="4">
                    <product-card :product="prod" />
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>

          <v-col
            v-show="categories[currentCategory].pages != 1"
            sm="12"
            md="3"
          ></v-col>
          <v-col v-show="categories[currentCategory].pages != 1" sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="categories[currentCategory].pages"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <p>{{ errors }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import callToAction from '~/components/callToAction.vue'
import ProductCard from '~/components/ProductCard.vue'
//

export default {
  components: { callToAction, ProductCard },
  async fetch({ store }) {
    await store.dispatch('getProducts')
  },
  data() {
    return {
      errors: {},
      products: [],
    }
  },
  computed: {
    ...mapState(['categories']),
    currentPage: {
      get() {
        return this.$store.state.currentPage
      },
      set(v) {
        this.$store.commit('UPDATE_PAGE', v)
      },
    },
    currentCategory: {
      get() {
        return this.$store.state.currentCategory
      },
      set(v) {
        this.$store.commit('UPDATE_CATEGORY', v)
      },
    },
    currentSubcategory: {
      get() {
        return this.$store.state.currentSubcategory
      },
      set(v) {
        this.$store.commit('UPDATE_SUBCATEGORY', v)
      },
    },
    currentGender: {
      get() {
        // console.log(this.$store.state.currentGender)
        // console.log(this.$store.state.categories[this.$store.state.currentCategory].genders[this.$store.state.currentGender])
        return this.$store.state.currentGender
      },
      set(v) {
        // console.log(v)
        this.$store.commit('UPDATE_GENDER', v)
      },
    },
  },
  watch: {
    currentPage() {
      this.$store.dispatch('getProducts')
    },
    currentCategory() {
      // if (this.categories[this.currentCategory].products[0] === undefined) {
      //   this.$store.dispatch('getProducts')
      // }
      this.$store.dispatch('getProducts')
      this.currentSubcategory = null
      this.currentGender = null
    },
    currentSubcategory() {
      this.$store.dispatch('getProducts')
    },
    currentGender() {
      this.$store.dispatch('getProducts')
    },
  },
  created() {
    this.categoryName = this.categories[this.currentCategory]
    // this.getProducts()
  },
  head() {
    return {
      title: 'DEVINI X PERKONI',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Store',
        },
      ],
    }
  },
}
</script>

<style>
/* 

Tag sorting could be done client side instead of server. We'll just need to figure out how to deal with pagination.

Perhaps instead of returning only those products that match selected taggs return all but sort those that match first if that's possible then on client side simply highlight them.

Add a green checkmark on the products page to indicate which items have already been placed in the cart (and also as a reminder for the user that they have commited to buying)

 */
</style>
