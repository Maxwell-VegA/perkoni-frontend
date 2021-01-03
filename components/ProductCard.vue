<template>
  <NuxtLink :to="'/products/' + product.id">
    <!-- @wheel.prevent="product.cPage += 1" -->
    <!-- Perhaps you can show some kind of progress bar indicating the time untill the next image is loaded -->
    <!-- @mouseenter.once="product.cPage += 1" -->
    <v-card height="100%" style="z-index: 0">
      <!-- To make this work you need to be able to cycle the images of only one productuct at a time, display a hover progress bar, prevent the last cycle,  -->
      <!-- check if mouse is on, start loader (fade in) and set timeout, if mouse is still on by the end of the timeout then cycle image -->
      <!-- @mouseenter=" ;(product.hover = true), (product.interval = 2000) " -->
      <!-- @mouseleave=" ;(product.hover = false), (product.interval = 9999999) " -->
      <v-carousel
        v-model="product.cPage"
        :height="carouselHeight"
        width="100%"
        style="z-index: -1"
        hide-delimiters
        :interval="product.interval"
        :cycle="product.hover"
        vertical
        class="mb-n8"
        :show-arrows="false"
      >
        <v-carousel-item v-for="(image, idx) in product.images" :key="idx">
          <!-- gradient="#1e1e1e00 60%,  #1e1e1e 90%" -->
          <v-img
            gradient="#1e1e1e00 65%,  #1e1e1e 95%"
            aspect-ratio="1"
            :src="'http://127.0.0.1:8000/' + product.images[idx].fileName"
          >
            <template #placeholder>
              <v-img
                aspect-ratio="1"
                gradient="#1e1e1e00 65%,  #1e1e1e"
                src="http://127.0.0.1:8000/notfound.gif"
              >
              </v-img>
            </template>
          </v-img>
        </v-carousel-item>
      </v-carousel>
      <v-row
        no-gutters
        align-content="space-between"
        :style="`height: ${cardHeight}px`"
        class=""
      >
        <v-col cols="12">
          <v-card-title
            style="line-height: 1.1"
            class="py-0 px-2 px-sm-3 px-lg-4 subtitle-1 text-sm-h6 text-lg-h5 text-md"
          >
            {{ product.title }}
          </v-card-title>
        </v-col>
        <v-col cols="12" class="mb-n2">
          <v-card-subtitle
            class="white--text text-h6 text-lg-h5 py-0 px-2 px-sm-3 px-lg-4 font-weight-light"
          >
            <p v-show="product.on_sale" class="mb-3">
              {{ salePrice(product.sale_price) }}
              <v-icon dense>mdi-currency-eur</v-icon>
            </p>

            <p
              v-if="product.on_sale"
              class="text-decoration-line-through red--text mt-n5 subtitle-1 text-lg-h6 font-weight-light"
            >
              {{ product.base_price.toFixed(2) }}
            </p>

            <p v-else class="mb-3">
              {{ product.base_price.toFixed(2) }}
              <v-icon dense> mdi-currency-eur </v-icon>
            </p>

            <p
              v-if="!product.on_sale"
              class="transparent--text mt-n5 transparent subtitle-1 text-lg-h6 font-weight-light"
            >
              _
              <!-- {{ product.base_price.toFixed(2) }} -->
            </p>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </NuxtLink>
</template>

<script>
export default {
  props: {
    product: Object,
  },
  computed: {
    carouselHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 180
        case 'sm':
          return 270
        case 'md':
          return 230
        case 'lg':
          return 290
        case 'xl':
          return 315
      }
    },
    cardHeight() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 100
        case 'sm':
          return 108
        case 'md':
          return 100
        case 'lg':
          return 115
        case 'xl':
          return 115
      }
    },
  },
  methods: {
    salePrice(price) {
      let returnThis = null
      if (price != undefined) {
        returnThis = price.toFixed(2)
      }
      return returnThis
    },
  },
}
</script>

<style></style>
