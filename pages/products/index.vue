<template>
  <div>
    <call-to-action />
    <v-row class="mt-n4 mt-sm-n2 mt-md-0" no-gutters>
      <v-spacer></v-spacer>
      <v-col cols="12" xl="9">
        <v-row>
          <v-col>
            <v-tabs v-model="currentCategory" grow center-active>
              <v-tab
                v-for="category in categories"
                :key="category.value"
                class="pa-0 px-sm-2 px-md-4"
              >
                <span class="tab-text">
                  {{ category.text }}
                </span>
              </v-tab>
            </v-tabs>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col
            v-show="categories[currentCategory].pages != 1"
            cols="12"
            md="3"
          ></v-col>
          <v-col
            v-show="categories[currentCategory].pages != 1"
            cols="12"
            md="9"
          >
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="categories[currentCategory].pages"
            ></v-pagination>
          </v-col>

          <v-col cols="12" md="3">
            <v-row>
              <v-col>
                <v-card class="transparent mt-n4 mt-md-0 mb-n2">
                  <v-list
                    v-show="
                      categories[currentCategory].subcategories.length > 0
                    "
                    class="mb-2"
                    nav
                  >
                    <v-subheader
                      style="transition: 0.15s"
                      :class="{ 'my-n2': !subcatExpanded }"
                    >
                      Subkategorija
                      <v-spacer></v-spacer>
                      <v-btn icon @click="subcatExpanded = !subcatExpanded">
                        <v-icon>{{
                          subcatExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
                        }}</v-icon>
                      </v-btn>
                    </v-subheader>
                    <v-expand-transition>
                      <v-list-item-group
                        v-show="subcatExpanded"
                        v-model="currentSubcategory"
                      >
                        <v-list-item
                          v-for="(subcategory, i) in categories[currentCategory]
                            .subcategories"
                          :key="i"
                        >
                          {{ subcategory }}
                        </v-list-item>
                      </v-list-item-group>
                    </v-expand-transition>
                  </v-list>
                  <v-list
                    v-show="categories[currentCategory].genders.length > 0"
                    nav
                  >
                    <v-subheader
                      style="transition: 0.15s"
                      :class="{ 'my-n2': !genderExpanded }"
                    >
                      Modelis
                      <v-spacer></v-spacer>
                      <v-btn icon @click="genderExpanded = !genderExpanded">
                        <v-icon>
                          {{
                            genderExpanded
                              ? 'mdi-chevron-up'
                              : 'mdi-chevron-down'
                          }}
                        </v-icon>
                      </v-btn>
                    </v-subheader>
                    <v-expand-transition>
                      <v-list-item-group
                        v-show="genderExpanded"
                        v-model="currentGender"
                      >
                        <v-list-item
                          v-for="(gender, i) in categories[currentCategory]
                            .genders"
                          :key="i"
                        >
                          {{ gender }}
                        </v-list-item>
                      </v-list-item-group>
                    </v-expand-transition>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

          <v-col sm="12" md="9">
            <v-tabs-items v-model="currentCategory" class="transparent">
              <v-tab-item v-for="cat in categories" :key="cat.value">
                <v-row
                  :dense="$vuetify.breakpoint.xsOnly"
                  class="ml-md-3 mr-md-n3"
                >
                  <v-col
                    v-for="(prod, i) in cat.products"
                    :key="i"
                    cols="6"
                    sm="4"
                  >
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
      products: [],
      subcatExpanded: true,
      genderExpanded: true,
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
    breakpoints() {
      return this.$vuetify.breakpoint.name
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
    breakpoints() {
      if (
        this.$vuetify.breakpoint.name === 'xs' ||
        this.$vuetify.breakpoint.name === 'sm'
      ) {
        this.genderExpanded = false
        this.subcatExpanded = false
      } else {
        this.genderExpanded = true
        this.subcatExpanded = true
      }
    },
  },
  created() {
    this.categoryName = this.categories[this.currentCategory]
    if (
      this.$vuetify.breakpoint.name === 'xs' ||
      this.$vuetify.breakpoint.name === 'sm'
    ) {
      this.genderExpanded = false
      this.subcatExpanded = false
    }

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
@media only screen and (max-width: 600px) {
  .tab-text {
    /* background: red !important; */
    letter-spacing: normal;
  }
  .v-slide-group__next,
  .v-slide-group__prev {
    flex: 0 1 0px;
    min-width: 0px;
  }
}
/* 

Tag sorting could be done client side instead of server. We'll just need to figure out how to deal with pagination.

Perhaps instead of returning only those products that match selected taggs return all but sort those that match first if that's possible then on client side simply highlight them.

Add a green checkmark on the products page to indicate which items have already been placed in the cart (and also as a reminder for the user that they have commited to buying)

 */
</style>
