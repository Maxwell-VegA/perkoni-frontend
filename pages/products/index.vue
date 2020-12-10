<template>
  <div>
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
          <v-col v-show="lastPage != 1" sm="12" md="3"></v-col>
          <v-col v-show="lastPage != 1" sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="lastPage"
            ></v-pagination>
          </v-col>

          <v-col sm="12" md="3">
            <v-col cols="12" class="ml-n3">
              <v-card class="transparent">
                <v-list nav>
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
                <v-list nav class="mt-6">
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
                      <v-card height="100%" style="z-index: 0">
                        <v-img
                          style="z-index: -1"
                          class="mb-n7"
                          aspect-ratio="1"
                          gradient="#1e1e1e00 65%,  #1e1e1e"
                          :src="
                            'http://127.0.0.1:8000/storage/product_images/temp/' +
                            prod.images
                          "
                        >
                          <!-- somehow you will need to get the image that was ordered as number one. There was some kind of sorting algo that you used in the product/id page. Perhaps you shold apply it before you submit to the db instead of afterwards -->
                          <template #placeholder>
                            <v-img
                              aspect-ratio="1"
                              gradient="#1e1e1e00 65%,  #1e1e1e"
                              src="http://127.0.0.1:8000/storage/product_images/temp/photo_1607002086.jpg"
                            >
                            </v-img>
                          </template>
                        </v-img>
                        <v-card-title>
                          {{ prod.title }}
                        </v-card-title>
                        <v-card-subtitle
                          class="white--text text-h5 font-weight-light"
                        >
                          <p v-show="prod.on_sale">
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
                        </v-card-subtitle>
                      </v-card>
                    </NuxtLink>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs-items>
          </v-col>
          <v-col sm="12" md="3"></v-col>
          <v-col sm="12" md="9">
            <v-pagination
              v-model="currentPage"
              class="my-4"
              circle
              total-visible="7"
              :length="lastPage"
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
export default {
  data() {
    return {
      title: 'Products page',
      currentPage: 1,
      currentCategory: 2,
      currentSubcategory: null,
      currentGender: null,
      errors: {},
      lastPage: 1,
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
          // console.log(res.data.data)
          this.products = res.data.data
          this.lastPage = res.data.last_page
        })
        .catch((err) => (this.errors = err.response.data.message))
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
