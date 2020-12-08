<template>
  <div>
    <v-col offset-xl="1">
      <h1 class="display-3 my-8">{{ product.title }}</h1>
    </v-col>
    <div>
      <!-- <h3 class="font-weight-light">
        {{ product.mainCategory }}/{{ product.subcategory }}
      </h3> -->

      <v-dialog v-model="fullscreenImage" width="80vh" height="100vh">
        <v-card>
          <v-carousel
            v-model="selectedImageIndex"
            style="width: 100%"
            height="100%"
            progress-color="white"
            progress
            continuous
            hide-delimiters
          >
            <v-carousel-item v-for="(image, i) in compImages" :key="i">
              <v-sheet height="100%" width="100%">
                <v-img
                  :src="
                    'http://127.0.0.1:8000/storage/product_images/temp/' +
                    image.fileName
                  "
                  aspect-ratio="1"
                >
                  <v-card-title primary-title>
                    {{ compImages[selectedImageIndex].title }}
                  </v-card-title>
                  <template #placeholder>
                    <v-img
                      aspect-ratio="1"
                      src="http://127.0.0.1:8000/storage/product_images/temp/photo_1607002086.jpg"
                    >
                    </v-img>
                  </template>
                </v-img>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <v-card-text>
            {{ compImages[selectedImageIndex].description }}
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-col cols="12" lg="9" xl="8">
          <v-row>
            <v-col cols="12" md="6" xl="5">
              <v-card>
                <v-carousel
                  v-model="selectedImageIndex"
                  style="width: 100%"
                  height="100%"
                  progress-color="white"
                  progress
                  continuous
                >
                  <v-carousel-item
                    v-for="(image, i) in compImages"
                    :key="i"
                    @click="fullscreenImage = true"
                  >
                    <v-sheet height="100%" width="100%">
                      <v-img
                        :src="
                          'http://127.0.0.1:8000/storage/product_images/temp/' +
                          image.fileName
                        "
                        aspect-ratio="1"
                      >
                        <!-- <v-card-title primary-title>
                      {{ compImages[selectedImageIndex].title }}
                    </v-card-title> -->
                        <template #placeholder>
                          <v-img
                            aspect-ratio="1"
                            src="http://127.0.0.1:8000/storage/product_images/temp/photo_1607002086.jpg"
                          >
                          </v-img>
                        </template>
                      </v-img>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
                <v-card-title primary-title>
                  {{ compImages[selectedImageIndex].title }}
                </v-card-title>
                <v-card-text>
                  {{ compImages[selectedImageIndex].description }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6" xl="7">
              <v-row align-content="center">
                <v-col offset="1" cols="10" offset-md="0" md="11">
                  <p>{{ product.description }}</p>
                </v-col>

                <v-col offset="1" cols="10" offset-md="0" md="8">
                  <v-select
                    v-model="selectedSize"
                    :items="productSizesArray"
                    label="Produkta izmeeri"
                  ></v-select>

                  <v-select
                    v-model="selectedType"
                    :items="productTypesArray"
                    label="Produkta tipi"
                    @change="selectedSubtypeName = null"
                  ></v-select>

                  <v-select
                    v-model="selectedSubtypeName"
                    :items="productSubtypesArray"
                    label="Produkta subtipi"
                  ></v-select>
                </v-col>

                <v-col
                  v-if="
                    computedDisplayNormalPrice !== null &&
                    computedDisplaySalePrice !== null
                  "
                  class="text-h4"
                  offset="1"
                  offset-md="0"
                  cols="12"
                >
                  <v-row>
                    <v-col cols="12" md="5" xl="4">
                      <div v-show="!product.on_sale">
                        <p class="header">
                          {{ computedDisplayNormalPrice.toFixed(2) }}$
                          <v-icon>mdi-currency-eur</v-icon>
                        </p>
                      </div>
                      <div v-show="product.on_sale">
                        <p class="text-h4">
                          {{ computedDisplaySalePrice.toFixed(2) }}
                          <v-icon size="26">mdi-currency-eur</v-icon>
                        </p>
                        <p class="text-h5">
                          <span class="text-decoration-line-through grey--text">
                            {{ computedDisplayNormalPrice.toFixed(2) }}
                          </span>
                          <v-icon dense disabled>mdi-currency-eur</v-icon>
                        </p>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <v-btn color="primary">Add to cart</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="3" xl="2">
          <v-card>
            <v-card-subtitle class="mb-n8" primary-title>
              Razotajs:
            </v-card-subtitle>
            <v-card-title>
              {{ product.brand_name }}
              <v-spacer></v-spacer>
              <v-btn icon @click="brandCardExpanded = !brandCardExpanded">
                <v-icon>{{
                  brandCardExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
                }}</v-icon>
              </v-btn>
            </v-card-title>
            <v-expand-transition>
              <div v-show="brandCardExpanded">
                <v-divider></v-divider>
                <v-img
                  aspect-ratio="1"
                  :src="
                    'http://127.0.0.1:8000/storage/product_images/' +
                    product.brand_logo
                  "
                >
                </v-img>
                <v-card-text>
                  {{ product.brand_description }}
                </v-card-text>
                <v-card-actions>
                  <v-btn> Citi produkti no {{ product.brand_name }} </v-btn>
                </v-card-actions>
                <v-card-subtitle> {{ product.user_username }} </v-card-subtitle>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <p>{{ errors }}</p>
    <p>{{ product.base_price }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      errors: {},
      selectedSize: 0,
      selectedType: 0,
      selectedSubtypeName: null,
      selectedImageIndex: 0,
      fullscreenImage: false,
      brandCardExpanded: false,
      product: {
        brand_id: null,
        brand_name: null,
        brand_logo: null,
        title: '',
        mainCategory: '',
        subcategory: '',
        description: '',
        is_new: false,
        base_price: null,
        sale_price: null,
        on_sale: false,
        operatorIsMultiply: false,
        taggs: [null],
        gender: null,
        types: [{ typeName: null, typePrice: null, typeSecondary: [null] }],
        sizes: [{ sizeName: null, sizePrice: null }],
        taggs: [null],
        images: [
          { fileName: null, title: null, description: null, order: null },
        ],
      },
    }
  },
  computed: {
    compImages() {
      const arr = []
      this.product.images.forEach((image) => {
        arr.push({})
      })
      this.product.images.forEach((image) => {
        arr[image.order - 1] = image
      })
      return arr
    },
    computedDisplayNormalPrice() {
      // The actual price of the order must be calculated server-side
      // Don't pass this into the order as the price
      // This is for display only
      // Seems like there is a problem with the database not supporting floats in base_price and likely sale_price as well
      if (this.product.operator == false) {
        // multiplication
        return (
          this.product.base_price +
          parseFloat(this.productTypesArray[this.selectedType].price) *
            parseFloat(this.productSizesArray[this.selectedSize].price)
        )
      } else {
        return (
          this.product.base_price +
          parseFloat(this.productTypesArray[this.selectedType].price) +
          parseFloat(this.productSizesArray[this.selectedSize].price)
        )
      }
    },
    computedDisplaySalePrice() {
      if (this.product.on_sale == true) {
        if (this.product.operator == false) {
          // multiplication
          return (
            this.product.sale_price +
            parseFloat(this.productTypesArray[this.selectedType].price) *
              parseFloat(this.productSizesArray[this.selectedSize].price)
          )
        } else {
          return (
            this.product.sale_price +
            parseFloat(this.productTypesArray[this.selectedType].price) +
            parseFloat(this.productSizesArray[this.selectedSize].price)
          )
        }
      } else {
        return null
      }
    },
    productSizesArray() {
      const arr = []
      this.product.sizes.forEach((size, i) => {
        arr.push({
          text: size.sizeName,
          price: size.sizePrice,
          value: i,
        })
      })
      console.log(arr)
      return arr
    },
    selectedSizeName() {
      return this.product.sizes[this.selectedSize].size
    },
    selectedTypeName() {
      return this.product.types[this.selectedType].typeName
    },
    productTypesArray() {
      const arr = []
      this.product.types.forEach((type, i) => {
        arr.push({
          text: type.typeName,
          price: type.typePrice,
          subtypes: type.typeSecondary,
          value: i,
        })
      })
      // console.log(arr)
      return arr
    },
    productSubtypesArray() {
      const arr = []
      this.productTypesArray[this.selectedType].subtypes.forEach((subtype) => {
        if (subtype != null) {
          arr.push({
            text: subtype,
          })
        }
      })
      return arr
    },
    productId() {
      const arr = this.$route.path.split('/')
      return arr[arr.length - 1]
    },
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    addToCart() {},
    // resetSelectedSubtype() {
    //   let match = false
    //   this.product.types[this.selectedType].typeSecondary.forEach((subtype) => {
    //     if (this.selectedSubtypeName === subtype) {
    //       match = true
    //     }
    //     if (match === false) {
    //       this.selectedSubtypeName = null
    //     }
    //   })
    // },
    getProduct() {
      axios
        .get('http://127.0.0.1:8000/api/products/' + this.productId)
        .then((res) => {
          console.log(res.data.data)
          this.product = res.data.data
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
  },
}
</script>
