<template>
  <div>
    <h1 class="display-4 mt-8 mb-16">{{ title }}</h1>

    <v-tabs v-model="currentCategory" grow>
      <v-tab v-for="cat in categories" :key="cat.tab">
        {{ cat }}
      </v-tab>
    </v-tabs>

    <!-- <v-tabs v-model="value" vertical>
      <v-tab
        v-for="cat in categoriesMore"
        v-show="showCategoriesMore"
        v-show="showCategoriesMore"
        v-show="showCategoriesMore"
        v-show="showCategoriesMore"
        :key="cat.tab"
      >
        {{ cat }}</v-tab
      >
    </v-tabs> -->
    <!-- <v-tab>
        <b class="invisible-category-name"> Citi </b>
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              class="align-self-center text--darken-4 mr-4"
              v-bind="attrs"
              v-on="on"
            >
              <b>citi</b>
              <v-icon centered>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="item in categoriesMore"
              :key="item"
              @click="categoryNameFinder(item)"
            >
              {{ item }}
            </v-list-item>
          </v-list>
        </v-menu>
      </v-tab> -->

    <v-pagination
      v-model="currentPage"
      class="my-4"
      circle
      total-visible="7"
      :length="lastPage"
    ></v-pagination>

    <v-tabs-items v-model="currentCategory">
      <v-tab-item v-for="cat in categories" :key="cat.tab">
        <div v-for="(prod, i) in products" :key="i">
          <NuxtLink :to="'/products/' + prod.id">
            <h2 class="">{{ prod.title }}</h2>
          </NuxtLink>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <!-- <p>{{ categoryName }}</p> -->
    <p>{{ errors }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      title: 'Products page',
      currentPage: 1,
      currentCategory: 0,
      categoryName: '',
      // currentCategory: 1,
      errors: {},
      lastPage: 1,
      products: [],
      categories: [
        'Jaunumi',
        'Akcijas',
        'Apgerbi',
        'Termouzlimes',
        'Uzlimes',
        'Tetovejumi',
        // { tab: 'Citi', content: 'Tab 7 Content' },
      ],
      categoriesMore: ['Auskari', 'Ziepes', 'Lietussargi', 'Somas'],
      showCategoriesMore: false,
    }
  },
  computed: {},
  watch: {
    currentPage() {
      this.getProducts()
    },
    currentCategory() {
      this.categoryName = this.categories[this.currentCategory]
      this.getProducts()
    },
  },
  created() {
    this.categoryName = this.categories[this.currentCategory]
    this.getProducts()
  },
  methods: {
    getProducts() {
      this.categoryName = this.categories[this.currentCategory]
      axios
        .get('http://127.0.0.1:8000/api/products', {
          params: {
            page: this.currentPage,
            category: this.categoryName,
          },
        })
        .then((res) => {
          // console.log(res.data.data)
          this.products = res.data.data
          this.lastPage = res.data.last_page
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
    categoryNameFinder(name) {
      this.currentCategory = 6
      this.categoryName = name
      this.getProducts
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

<style></style>
