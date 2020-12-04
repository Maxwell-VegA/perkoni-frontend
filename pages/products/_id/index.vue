<template>
  <div>
    <h1 class="display-3 mt-8 mb-16">{{ product.title }}</h1>
    <div>
      <p>{{ product.description }}</p>
      <h3 class="font-weight-light">
        {{ product.mainCategory }}/{{ product.subcategory }}
      </h3>

      <div v-if="!product.on_sale">
        <h2 class="display-1">{{ computedDisplayNormalPrice }}$</h2>
      </div>
      <div v-else>
        <span class="display-1 grey--text text-decoration-line-through">
          {{ computedDisplayNormalPrice }}
        </span>
        <span class="display-1"> {{ computedDisplaySalePrice }}$ </span>
      </div>

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

      <v-row>
        <v-col cols="12" lg="4">
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

        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selectedSize"
            :items="productSizesArray"
            label="Produkta izmeeri"
          ></v-select>
          <br />
          <br />
          <br />
          <br />
          <v-spacer></v-spacer>
          <v-select
            v-model="selectedType"
            :items="productTypesArray"
            label="Produkta tipi"
            @change="selectedSubtypeName = null"
          ></v-select>
          <!-- @change="resetSelectedSubtype()" -->
          <!-- Perhaps I can find the time to make this keep the previous subtype arround when the user has switched to another type and immedietly display the previously selected subtype when the user reverts to the type for which he already had selected the subtype -->
          <!-- The resetter doesn't seem to be working correctly -->

          <v-select
            v-model="selectedSubtypeName"
            :items="productSubtypesArray"
            label="Produkta subtipi"
          ></v-select>
        </v-col>
      </v-row>
    </div>
    <p>{{ errors }}</p>
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
      product: {
        user_id: null,
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
          text: size.size,
          price: size.sizePrice,
          value: i,
        })
      })
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
      // console.log(this.product.types)
      this.product.types.forEach((type, i) => {
        arr.push({
          text: type.typeName,
          value: i,
          price: type.typePrice,
          subtypes: type.typeSecondary,
        })
      })
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
    createOrder() {},
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
          console.log(res.data)
          this.product = res.data.data
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
  },
}
</script>
