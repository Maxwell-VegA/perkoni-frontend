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
          <v-col v-show="totalPages != 1" sm="12" md="3"></v-col>
          <v-col v-show="totalPages != 1" sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="totalPages"
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
                  <v-col v-for="(prod, i) in products" :key="i" cols="4">
                    <NuxtLink :to="'/products/' + prod.id">
                      <v-card
                        height="100%"
                        style="z-index: 0"
                        @wheel.prevent="prod.cPage += 1"
                        @mouseenter.once="prod.cPage += 1"
                        @mouseenter="
                          ;(prod.hover = true), (prod.interval = 3000)
                        "
                        @mouseleave="
                          ;(prod.hover = false), (prod.interval = 9999999)
                        "
                      >
                        <v-carousel
                          v-model="prod.cPage"
                          height="315px"
                          width="100%"
                          style="z-index: -1"
                          hide-delimiters
                          :interval="prod.interval"
                          :cycle="prod.hover"
                          vertical
                          class="mb-n8"
                          :show-arrows="false"
                        >
                          <v-carousel-item
                            v-for="(image, idx) in prod.images"
                            :key="idx"
                          >
                            <!-- gradient="#1e1e1e00 60%,  #1e1e1e 90%" -->
                            <v-img
                              gradient="#1e1e1e00 65%,  #1e1e1e 95%"
                              height="100%"
                              aspect-ratio="1"
                              :src="
                                'http://127.0.0.1:8000/' +
                                prod.images[idx].fileName
                              "
                            >
                              <template #placeholder>
                                <v-img
                                  aspect-ratio="1"
                                  gradient="#1e1e1e00 65%,  #1e1e1e"
                                  src="http://127.0.0.1:8000/notfound.jpg"
                                >
                                </v-img>
                              </template>
                            </v-img>
                          </v-carousel-item>
                        </v-carousel>
                        <v-row
                          no-gutters
                          align-content="space-between"
                          style="height: 115px"
                          class=""
                        >
                          <v-col cols="12">
                            <v-card-title style="line-height: 1.1" class="py-0">
                              {{ prod.title }}
                            </v-card-title>
                          </v-col>
                          <v-col cols="12" class="mb-n2">
                            <v-card-subtitle
                              class="white--text text-h5 py-0 font-weight-light"
                            >
                              <p v-show="prod.on_sale" class="mb-3">
                                {{ prod.sale_price.toFixed(2) }}
                                <v-icon dense>mdi-currency-eur</v-icon>
                              </p>
                              <p
                                :class="{
                                  'text-decoration-line-through red--text mt-n5 text-h6 font-weight-light':
                                    prod.on_sale,
                                }"
                              >
                                {{ prod.base_price.toFixed(2) }}
                                <v-icon v-show="!prod.on_sale" dense>
                                  mdi-currency-eur
                                </v-icon>
                              </p>
                              <br v-show="!prod.on_sale" />
                            </v-card-subtitle>
                          </v-col>
                        </v-row>
                      </v-card>
                    </NuxtLink>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-col v-show="totalPages != 1" sm="12" md="3"></v-col>
          <v-col v-show="totalPages != 1" sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="totalPages"
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
import callToAction from '~/components/callToAction.vue'
export default {
  components: { callToAction },
  data() {
    return {
      title: 'Products page',
      currentPage: 1,
      currentCategory: 2,
      currentSubcategory: null,
      currentGender: null,
      errors: {},
      totalPages: 1,
      products: [],
      categories: [
        {
          text: 'Jaunumi',
          value: 0,
          subcategories: [],
          genders: [
            'Bezdzimuma',
            'Unisex',
            'Vīriešiem',
            'Sievietēm',
            'Bērniem',
          ],
        },
        {
          text: 'Akcijas',
          value: 1,
          subcategories: [],
          genders: [
            'Bezdzimuma',
            'Unisex',
            'Vīriešiem',
            'Sievietēm',
            'Bērniem',
          ],
        },
        {
          text: 'Apģērbi',
          value: 2,
          subcategories: [
            'Krekli',
            'Džemperi',
            'Jakas',
            'Kleitas',
            'Cepures',
            'Šalles',
            'Bez apdrukas',
          ],
          genders: ['Unisex', 'Vīriešiem', 'Sievietēm', 'Bērniem'],
        },
        {
          text: 'Termouzlīmes',
          value: 3,
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Teksti',
            'Citas',
          ],
          genders: [],
        },
        {
          text: 'Uzlīmes',
          value: 4,
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Citas',
          ],
          genders: [],
        },
        {
          text: 'Tetovējumi',
          value: 5,
          subcategories: [],
          genders: [],
        },
        {
          text: 'Citi',
          value: 6,
          subcategories: ['Rotas', 'Somas', 'Lietussargi'],
          genders: [],
        },
      ],
    }
  },
  computed: {},
  watch: {
    currentPage() {
      this.getProducts()
    },
    currentCategory() {
      this.getProducts()
      this.currentSubcategory = null
      this.currentGender = null
    },
    currentSubcategory() {
      this.getProducts()
    },
    currentGender() {
      this.getProducts()
    },
  },
  created() {
    this.categoryName = this.categories[this.currentCategory]
    this.getProducts()
  },
  methods: {
    // cycleImages(productIndex) {
    //   this.products[productIndex].currentImage =
    //     'http://127.0.0.1:8000/notfound.jpg'
    //   console.log(this.products[productIndex])
    //   // if (this.products[0].images[0] != undefined) {
    //   //   // 'http://127.0.0.1:8000/' + product.images[1].fileName
    //   //   this.products[0].currentImage =
    //   // } else {
    //   //   this.products[productIndex].currentImage =
    //   //     'http://127.0.0.1:8000/notfound.jpg'
    //   //   // product.currentImage =
    //   //   // 'http://127.0.0.1:8000/' + product.images[0].fileName
    //   //   console.log('else')
    //   // }
    //   // console.log(this.product[productIndex].currentImage)
    // },
    getProducts() {
      const categoryName = this.categories[this.currentCategory].text
      const subcategoryName = this.categories[this.currentCategory]
        .subcategories[this.currentSubcategory]
      const genderName = this.categories[this.currentCategory].genders[
        this.currentGender
      ]
      this.$axios
        .get('products', {
          params: {
            page: this.currentPage,
            category: categoryName,
            subcategory: subcategoryName,
            gender: genderName,
          },
        })
        .then((res) => {
          console.log(res.data.data[0])
          this.products = res.data.data
          this.totalPages = res.data.meta.last_page
        })
        .catch((err) =>
          console.log(err.response.data.message, err.response.data.exception)
        )
    },
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

Add the ability to scroll both up and down on product images sometime

Add a green checkmark on the products page to indicate which items have already been placed in the cart (and also as a reminder for the user that they have commited to buying)

 */
</style>
