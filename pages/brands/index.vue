<template>
  <div>
    <v-row v-for="(brand, i) in brands" :key="i">
      {{ brand }}
      <v-col md="4" lg="3">
        <v-card>
          <v-card-title>
            {{ brand.name }}
          </v-card-title>
        </v-card>
      </v-col>
      <v-col md="8" lg="9">
        <v-row>
          <v-col v-for="(product, idx) in brand.products" :key="idx" md="4">
            {{ product.title }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      brands: [],
    }
  },
  created() {
    this.getBrands()
  },
  mounted() {
    // this.getProducts()
  },
  methods: {
    async getBrands() {
      const res = await this.$axios('brands')
      this.brands = res.data.data
      this.currentPage = res.data.current_page
      this.lastPage = res.data.lastPage
      this.getProducts()
    },
    async getProducts() {
      this.brands.forEach((brand, i) => {
        console.log(brand.id)
        // brand.products = []
        this.$axios('products', {
          params: {
            brandId: brand.id,
          },
        })
          // .then((res) => console.log(res.data.data))
          //   .then((res) => (this.brands[i].products = res.data.data))
          .then((res) => (brand.products = res.data.data))
      })
    },
  },
}
</script>

<style>
/* 

The data is being asigned but only after everything has been rendered and vue isn't detecting the change

Don't load more pages of brands but rather just load in more and keep scrolling

This page would be a good candidate for sg instead of ssr.

 */
</style>
