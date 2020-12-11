<template>
  <div>
    <v-col offset-xl="1">
      <h1 class="display-3 my-8">{{ product.title }}</h1>
      <!-- <h3 class="font-weight-light">
        {{ product.mainCategory }}/{{ product.subcategory }}
      </h3> -->
    </v-col>
    <div>
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
                    v-show="productSizesArray[0].text != 'singleSizeProduct'"
                    v-model="selectedSize"
                    :items="productSizesArray"
                    label="Produkta izmeeri"
                  ></v-select>

                  <v-select
                    v-show="productTypesArray[0].text != 'singleTypeProduct'"
                    v-model="selectedType"
                    :items="productTypesArray"
                    label="Produkta tipi"
                    @change="selectedSubtypeName = null"
                  ></v-select>

                  <v-select
                    v-show="productSubtypesArray[0] != undefined"
                    v-model="selectedSubtypeName"
                    :items="productSubtypesArray"
                    label="Produkta subtipi"
                  ></v-select>
                </v-col>

                <v-col
                  v-if="product.base_price !== null"
                  class="text-h4"
                  offset="1"
                  offset-md="0"
                  cols="12"
                >
                  <v-row>
                    <v-col cols="12" md="5" xl="4">
                      <div v-show="!product.on_sale">
                        <p class="header">
                          {{ displayPrice(product.base_price) }}
                          <v-icon size="26">mdi-currency-eur</v-icon>
                        </p>
                      </div>
                      <div v-show="product.on_sale">
                        <p class="text-h4">
                          {{ displayPrice(product.sale_price) }}
                          <v-icon size="26">mdi-currency-eur</v-icon>
                        </p>
                        <p class="text-h5">
                          <span class="text-decoration-line-through grey--text">
                            {{ displayPrice(product.base_price) }}
                          </span>
                          <v-icon dense disabled>mdi-currency-eur</v-icon>
                        </p>
                      </div>
                    </v-col>
                    <v-col md="3">
                      <v-btn color="primary" @click="addToCart">
                        pievienot grozam
                        <v-icon>mdi-cart-plus</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        color="primary"
                        @click="bookmarked = !bookmarked"
                      >
                        <v-icon v-if="!bookmarked" large>
                          mdi-bookmark-outline
                        </v-icon>
                        <v-icon v-else large>
                          mdi-bookmark-check-outline
                        </v-icon>
                      </v-btn>
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
                    'http://127.0.0.1:8000/storage/logos/' + product.brand_logo
                  "
                >
                </v-img>
                <v-card-text>
                  {{ product.brand_description }}
                </v-card-text>
                <v-card-actions>
                  <v-btn> Citi produkti </v-btn>
                  <v-spacer></v-spacer>
                  <a
                    v-show="product.brand_facebook"
                    target="_blank"
                    class="pr-2"
                    :href="product.brand_facebook"
                    ><v-icon size="30">mdi-facebook</v-icon>
                  </a>
                  <a
                    v-show="product.brand_instagram"
                    target="_blank"
                    class="pr-4"
                    :href="product.brand_instagram"
                    ><v-icon size="30">mdi-instagram</v-icon>
                  </a>
                </v-card-actions>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <p>{{ errors }}</p>
  </div>
</template>

<script>
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
      bookmarked: false,
      product: {
        id: null,
        brand_id: null,
        brand_name: null,
        brand_logo: null,
        brand_facebook: null,
        brand_instagram: null,
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
    activePrice() {
      let returnThis = 0
      if (this.product.on_sale) {
        returnThis = this.product.sale_price
      } else {
        returnThis = this.product.base_price
      }
      return returnThis
    },
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
    selectedSubtypeIndex() {
      let returnThis
      this.product.types[this.selectedType].typeSecondary.forEach(
        (subtype, i) => {
          if (subtype == this.selectedSubtypeName) {
            returnThis = i
          }
        }
      )
      return returnThis
    },
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    displayPrice(price) {
      const typePrice = 0
      const sizePrice = 0
      if (this.product.types[0] != undefined) {
        const typePrice = parseFloat(
          this.productTypesArray[this.selectedType].price
        )
      }
      if (this.product.sizes[0] != undefined) {
        const sizePrice = parseFloat(
          this.productSizesArray[this.selectedSize].price
        )
      }
      if (price != null) {
        if (this.product.operatorIsMultiply == true) {
          return (price + typePrice * sizePrice).toFixed(2)
        } else {
          return (price + typePrice + sizePrice).toFixed(2)
        }
      } else {
        return null
      }
    },
    addToCart() {
      this.$axios
        .post('cart', {
          productId: parseInt(this.productId),
          title: this.product.title,
          price: this.displayPrice(this.activePrice),
          selectedType: this.selectedType,
          selectedSubtype: this.selectedSubtypeIndex,
          selectedSize: this.selectedSize,
          quantity: 1,
        })
        .then((res) => console.log(res.data))
        .catch((err) =>
          console.log(err.response.data.message, err.response.data.exception)
        )
        .catch((err) => console.log(err.message))
      // when a product is added to cart some options for heading to checkout should pop up (perhaps only when the user is a guest)
      // Might be I can use a snackbar here
    },
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
      this.$axios
        .get('products/' + this.productId)
        .then((res) => {
          console.log(res.data.data)
          this.product = res.data.data
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
  },
}
</script>
<style>
/* 


need to set up the bookmarking mechanism as well as send out a snackbar saying product saved, unsaved or log in to save.

MUST add some link for sharing

Verify that product options have been chosen before the product is added to cart

 */
</style>
