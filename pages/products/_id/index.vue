<template>
  <div>
    <v-col offset-xl="1">
      <h1 class="display-3 my-8">{{ product.title }}</h1>
      <h3 class="font-weight-light">
        {{ product.mainCategory }} / {{ product.subcategory }} /
        {{ product.gender }} /
      </h3>
    </v-col>
    <div>
      <!-- Fullscreen carousel -->
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
            <v-carousel-item v-for="(image, i) in product.images" :key="i">
              <v-sheet height="100%" width="100%">
                <v-img
                  :src="'http://127.0.0.1:8000/' + image.fileName"
                  aspect-ratio="1"
                >
                  <v-card-title primary-title>
                    {{ product.images[selectedImageIndex].title }}
                  </v-card-title>
                  <template #placeholder>
                    <v-img
                      aspect-ratio="1"
                      src="http://127.0.0.1:8000/notfound.jpg"
                    >
                    </v-img>
                  </template>
                </v-img>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
          <v-card-text>
            {{ product.images[selectedImageIndex].description }}
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row no-gutters>
        <v-spacer></v-spacer>
        <v-col cols="12" lg="9" xl="8">
          <v-row>
            <!-- Carousel -->
            <v-col cols="12" md="6" xl="5">
              <v-card>
                <v-carousel
                  v-model="selectedImageIndex"
                  style="cursor: pointer; width: 100%"
                  height="100%"
                  progress-color="white"
                  progress
                  hide-delimiters
                  continuous
                >
                  <v-carousel-item
                    v-for="(image, i) in product.images"
                    :key="i"
                    @click="fullscreenImage = true"
                  >
                    <v-sheet height="100%" width="100%">
                      <v-img
                        :src="'http://127.0.0.1:8000/' + image.fileName"
                        aspect-ratio="1"
                      >
                        <template #placeholder>
                          <v-img
                            aspect-ratio="1"
                            src="http://127.0.0.1:8000/notfound.jpg"
                          >
                          </v-img>
                        </template>
                      </v-img>
                    </v-sheet>
                  </v-carousel-item>
                </v-carousel>
                <v-card-title primary-title>
                  {{ product.images[selectedImageIndex].title }}
                </v-card-title>
                <v-card-text>
                  {{ product.images[selectedImageIndex].description }}
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="6" xl="7">
              <v-row>
                <!-- short description -->
                <v-col
                  class="mt-n3"
                  offset="1"
                  cols="10"
                  offset-md="0"
                  md="11"
                  lg="11"
                  xl="9"
                >
                  <!-- <p>{{ product.description }}</p> -->
                  <p> {{ selectedCombination }} </p>
                </v-col>

                <!-- Selects -->
                <v-col class="mt-n5" offset="1" cols="10" offset-md="0" md="8">
                  <v-select
                    v-show="product.gender[1] != undefined"
                    v-model="selectedGender"
                    class="my-n1"
                    :items="product.gender"
                    label="Modelis"
                    @change="selectedSize = 0"
                  ></v-select>
                    <!-- @change="productSizesArray = 0" -->
                  <!-- should be if selectedSize on the new gender doesn't exist then it gets reset -->

                  <v-select
                    v-show="productSizesArray[0].text != 'singleSizeProduct'"
                    v-model="selectedSize"
                    class="my-n1"
                    v-if="productSizesArray[0].text"
                    :disabled="productSizesArray[0].text == 'Izvelies modeli' || !productSizesArray[0].text"
                    :items="productSizesArray"
                    label="Izmers"
                  ></v-select>
                    <!-- v-if="productSizesArray[0].text != 'Izvelies modeli' && productSizesArray[0].text" -->
                  <v-select
                    v-show="product.variations[1] != undefined"
                    v-model="selectedVariation"
                    class="my-n1"
                    :items="product.variations"
                    :label="product.variationsName"
                  ></v-select>

                  <v-select
                    v-show="productTypesArray[0].text != 'singleTypeProduct'"
                    v-model="selectedType"
                    class="my-n1"
                    :items="productTypesArray"
                    :label="product.typesName"
                    @change="selectedSubtypeName = null"
                  ></v-select>

                  <v-select
                    v-show="productSubtypesArray[selectedType] != undefined"
                    v-model="selectedSubtypeName"
                    class="my-n1"
                    :items="productSubtypesArray"
                    :label="product.subtypesName"
                  ></v-select>
                </v-col>

                <!-- Price -->
                <v-col
                  v-if="product.base_price !== null"
                  class="text-h4 my-n6"
                  offset="1"
                  offset-md="0"
                  cols="12"
                >
                  <v-row>
                    <v-col cols="12" md="5" xl="4" class="pa-0 pl-4">
                      <div v-show="!product.on_sale">
                        <p class="header">
                          {{ displayPrice(product.base_price) }}
                          <v-icon size="26">mdi-currency-eur</v-icon>
                        </p>
                      </div>
                      <div v-show="product.on_sale">
                        <p class="text-h4 mb-0">
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
                  </v-row>
                </v-col>
                <!-- Add to cart -->
                <v-col cols="12" class="pr-8 ml-n1">
                  <!-- <v-card class="mb-2">
                    <v-card-actions> -->
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <input
                        v-model="quantity"
                        v-bind="attrs"
                        type="number"
                        class="white--text px-2 py-2 ml-2 accent"
                        style="width: 60px; border-radius: 3px"
                        v-on="on"
                      />
                    </template>
                    <span>Daudzums</span>
                  </v-tooltip>
                  <v-btn
                    v-if="!inCart"
                    color="primary"
                    style="margin-top: -2px"
                    class="py-5 ml-1"
                    @click="addToCart"
                  >
                    pievienot grozam
                    <v-icon>mdi-cart-plus</v-icon>
                  </v-btn>
                  <v-btn v-else color="success">
                    produkts ir groza
                    <v-icon>mdi-check-circle-outline</v-icon>
                  </v-btn>
                  <!-- </v-card-actions>
                  </v-card> -->
                </v-col>
              </v-row>
            </v-col>
            <!-- Long description -->
            <v-col cols="6" xl="5">
              <v-card v-for="(match, i) in targetMatch" :key="i">
                <v-card-title>
                  {{ match.message }}
                </v-card-title>
                  {{ targetMatch }}
              </v-card>
              <v-card>
                <v-card-title>Apraksts:</v-card-title>
                <v-card-text>
                  <p v-html="product.longDescription"></p>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Related products -->
            <v-col cols="6" xl="7" class="pr-9">
              <v-card>
                <v-card-title> Lidzigie produkti </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col v-for="(prod, i) in relatedProducts" :key="i" md="4">
                      <v-card>
                        <v-card-title class="">
                          {{ prod.title }}
                        </v-card-title>
                        <v-img
                          aspect-ratio="1"
                          :src="
                            'http://localhost:8000/' + prod.images[0].fileName
                          "
                        >
                        </v-img>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <!-- Sidebar --------------------------------------------------- -->
        <v-col cols="12" lg="3" xl="2">
          <v-row>
            <v-col>
              <!-- Bookmark / Share -->
              <v-card class="mb-2">
                <v-card-actions>
                  <v-tooltip bottom close-delay="500">
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        class="ml-2"
                        icon
                        color="primary"
                        v-on="on"
                        @click="bookmarked = !bookmarked"
                      >
                        <v-icon v-if="!bookmarked" large>
                          mdi-bookmark-outline
                        </v-icon>
                        <v-icon v-else large>
                          mdi-bookmark-check-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span v-if="!bookmarked">Saglabat produktu</span>
                    <span v-else>Saglabats!</span>
                  </v-tooltip>
                  <v-tooltip right close-delay="500">
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        class="ml-2"
                        icon
                        color="primary"
                        v-on="on"
                      >
                        <v-icon large> mdi-share-outline </v-icon>
                      </v-btn>
                    </template>
                    <span>Dalities</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
              <!-- Brand -->
              <v-card class="mb-2">
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
                        'http://127.0.0.1:8000/storage/logos/' +
                        product.brand_logo
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
              <!-- Shipping -->
              <v-card>
                <v-card-title>
                  Piegades iespejas
                  <v-spacer></v-spacer>
                  <v-btn
                    icon
                    @click="shippingCardExpanded = !shippingCardExpanded"
                  >
                    <v-icon>{{
                      shippingCardExpanded
                        ? 'mdi-chevron-up'
                        : 'mdi-chevron-down'
                    }}</v-icon>
                  </v-btn>
                </v-card-title>
                <v-expand-transition>
                  <div v-show="shippingCardExpanded">
                    <v-divider></v-divider>
                    <v-card-subtitle>
                      Pirkumiem virs
                      {{ product.brand_freeShipping }}
                      &#8364; no
                      {{ product.brand_name }}
                      piegade par brivu.
                    </v-card-subtitle>
                    <v-card-text>
                      <div
                        v-if="!productSizesArray[selectedSize].customShipping"
                      >
                        <v-list v-for="(locale, i) in shippingOptions" :key="i">
                          <v-subheader>{{ locale.locale }}</v-subheader>
                          <v-list-item
                            v-for="(opt, i) in product.shipping"
                            v-if="
                              shippingProperties(opt, locale.locale).text !=
                              undefined
                            "
                            :key="i"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{
                                  shippingProperties(opt, locale.locale).text
                                }}
                              </v-list-item-title>
                              <v-list-item-subtitle
                                v-if="
                                  shippingProperties(opt, locale.locale)
                                    .weight == 1000000
                                "
                              >
                                {{ product.address }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle
                                v-else-if="
                                  shippingProperties(opt, locale.locale)
                                    .weight /
                                    product.weight <
                                  51
                                "
                              >
                                Lidz
                                {{
                                  (
                                    shippingProperties(opt, locale.locale)
                                      .weight / product.weight
                                  ).toFixed()
                                }}
                                gb
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-else>
                                50+ gb
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              {{ shippingProperties(opt, locale.locale).price }}
                              &#8364;
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </div>
                      <div v-else>
                        <v-list v-for="(locale, i) in shippingOptions" :key="i">
                          <v-subheader>{{ locale.locale }}</v-subheader>
                          <v-list-item
                            v-for="(opt, i) in productSizesArray[selectedSize]
                              .shippingOptions"
                            v-if="
                              shippingProperties(opt, locale.locale).text !=
                              undefined
                            "
                            :key="i"
                          >
                            <v-list-item-content>
                              <v-list-item-title>
                                {{
                                  shippingProperties(opt, locale.locale).text
                                }}
                              </v-list-item-title>
                              <v-list-item-subtitle
                                v-if="
                                  shippingProperties(opt, locale.locale)
                                    .weight == 1000000
                                "
                              >
                                {{ product.address }}
                              </v-list-item-subtitle>
                              <v-list-item-subtitle
                                v-else-if="
                                  shippingProperties(opt, locale.locale)
                                    .weight /
                                    product.weight <
                                  51
                                "
                              >
                                Lidz
                                {{
                                  (
                                    shippingProperties(opt, locale.locale)
                                      .weight / product.weight
                                  ).toFixed()
                                }}
                                gb
                              </v-list-item-subtitle>
                              <v-list-item-subtitle v-else>
                                50+ gb
                              </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                              {{ shippingProperties(opt, locale.locale).price }}
                              &#8364;
                            </v-list-item-action>
                          </v-list-item>
                        </v-list>
                      </div>
                    </v-card-text>
                  </div>
                </v-expand-transition>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>
    </div>
    <v-btn @click="getRelated()">text</v-btn>
    <p>{{ errors }}</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
//

export default {
  async fetch({ store, params }) {
    await store.dispatch('getProduct', { productId: params.id })

    // await store.dispatch('getRelated')
  },
  data() {
    return {
      errors: {},
      inCart: false,
      typePrice: 0,
      sizePrice: 0,
      quantity: 1,
      selectedGender: '',
      selectedSize: 0,
      selectedVariation: '',
      selectedType: 0,
      selectedSubtypeName: null,
      selectedImageIndex: 0,
      fullscreenImage: false,
      brandCardExpanded: false,
      shippingCardExpanded: false,
      bookmarked: false,
      relatedProducts: [],
    }
  },
  computed: {
    ...mapState(['product', 'shippingOptions']),
    // product() {
    //   return this.products.find(
    //     (product) => product.id == this.$route.params.id
    //   )
    // },
    selectedCombination() {
      let gender      = 'G'
      let size        = 'S'
      let variation   = 'V'
      let type        = 'T'
      let subtype     = 'Y'

      this.selectedSizes
      console.log(this.product)
      
      if (this.selectedGender != '') {
        gender = this.selectedGender
      } else {
        gender = 'G'
      }
      if (this.productSizesArray[this.selectedSize].text != 'Izvelies modeli' && this.productSizesArray[this.selectedSize].text != null) {
        size = this.productSizesArray[this.selectedSize].text
      } else {
        size = 'S'
      }
      if(this.selectedVariation != '') {
        variation = this.selectedVariation
      } else {
        variation = 'V'
      }
      if (this.productTypesArray[this.selectedType].text != 'singleTypeProduct') {
        type = this.productTypesArray[this.selectedType].text
      } else {
        type = 'T'
      }
      if (this.selectedSubtypeName != null) {
        subtype = this.selectedSubtypeName
      } else {
        subtype = 'Y'
      }

      let combination = 
        gender      + '_//__' + 
        size        + '_//__' +
        variation   + '_//__' +
        type        + '_//__' +
        subtype

       return combination
    },
    activePrice() {
      let returnThis = 0
      if (this.product.on_sale) {
        returnThis = this.product.sale_price
      } else {
        returnThis = this.product.base_price
      }
      return returnThis
    },
    selectedSizes() {
      if (this.product.gender[1] == undefined) {
        this.selectedGender = this.product.gender[0]
      }
      return this.product.sizes.find((gen) => gen.gender == this.selectedGender)
    },
    productSizesArray: {
      get() {
      const arr = []
      if (this.selectedSizes != undefined) {
        this.selectedSizes.sizes.forEach((size, i) => {
          arr.push({
            text: size.sizeName,
            price: size.sizePrice,
            value: i,
            weight: size.weight,
            customShipping: size.customShipping,
            shippingOptions: size.shippingOptions,
          })
        })
      } else {
        arr.push({
          text: 'Izvelies modeli',
          price: 0,
          value: 0,
          weight: 0,
          customShipping: false,
          shippingOptions: 0,
        })
      }
      // console.log(arr)
      return arr
      },
      // set(num) {
      //   const arr = [{
      //     text: 'Izvelies modeli',
      //     price: 0,
      //     value: 0,
      //     weight: 0,
      //     customShipping: false,
      //     shippingOptions: 0,
      //   }]
      //   return arr
      // }
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
    // productId() {
    //   const arr = this.$route.path.split('/')
    //   return arr[arr.length - 1]
    // },
    selectedSubtypeIndex: {
      get() {
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
      set(index) {
        this.selectedSubtypeName = this.product.types[
          this.selectedType
        ].typeSecondary[index]
      },
    },
    // compShipping() {
    //   let arr = this.product.shipping
    //   if (this.productSizesArray[this.selectedSize].customShipping) {
    //     console.log(this.productSizesArray)
    //     arr = this.productSizesArray[this.selectedSize].shippingOptions
    //   }
    //   return arr
    // },
    targetMatch() {
      let val = []

      this.product.targets.forEach(t => {
        let match = true

        const splitKey = t.key.split('_//__')
        const splitCurrent = this.selectedCombination.split('_//__')
        
        for (let index = 0; index < splitKey.length;) {
          if (splitKey[index] !== "ANY-1337" && splitKey[index] !== splitCurrent[index]) {
            match = false
            break
          }
          index ++
        }

        if (match && t.active) {
          console.log(match)
          val.push(t)
        }

      })

      return val
    },
  },
  // watch: {
  //   'product': function() {
  //     console.log(123)
  //   }
  // },
  mounted() {
    // this.getProduct()
    this.isInCart()
  },
  methods: {
    displayPrice(price) {
      if (this.product.types[0] != undefined) {
        this.typePrice = parseFloat(
          this.productTypesArray[this.selectedType].price
        )
      }
      if (this.product.sizes[0] != undefined) {
        this.sizePrice = parseFloat(
          this.productSizesArray[this.selectedSize].price
        )
      }

      let val
      // toFixed
      if (price != null) {
        if (this.product.operatorIsMultiply == true) {
          val = price + this.typePrice * this.sizePrice
        } else if (this.product.operatorIsMultiply == false) {
          val = price + this.typePrice + this.sizePrice
        }
      } else {
        return null
      }

      if (this.targetMatch.length > 0) {
        this.targetMatch.forEach(match => {
          if (match.available) {
            if (match.overridePriceType === "set") {
              val = parseFloat(match.overridePrice)
            } else if (match.overridePriceType === "add") {
              val = val + parseFloat(match.overridePrice)
            } else if (match.overridePriceType === "multiply") {
              val = val * parseFloat(match.overridePrice)
            }
          }
        })
      }

    return val.toFixed(2)
    // Under this setup a SET price can be altered by another later targetMatch.
    // It can be added to or multiplied but most dangerously it can 
    // be set to something completly different.
    // Two set prices should never be allowed to overlap
    // The likeliest solution to this is some kind of checking and validation on /create
    },
    addToCart() {
      this.$axios
        .post('cart', {
          productId: this.productId,
          title: this.product.title,
          price: this.displayPrice(this.activePrice),
          selectedType: this.selectedType,
          selectedSubtype: this.selectedSubtypeIndex,
          selectedSize: this.selectedSize,
          quantity: this.quantity,
        })
        .then((res) => {
          // console.log(res.data)
          this.inCart = true
          this.$nuxt.$emit('refreshCart')
        })
        .catch((err) =>
          console.log(err.response.data.message, err.response.data.exception)
        )
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
    shippingProperties(idx, loc) {
      const properties = {}
      this.shippingOptions.forEach((locale) => {
        if (locale.locale === loc) {
          locale.options.forEach((option) => {
            if (option.value === idx) {
              properties.text = option.text
              properties.price = option.price
              properties.weight = option.weight
            }
          })
        }
      })
      return properties
    },
    isInCart() {
      this.$axios
        .get('cart')
        .then((res) => {
          // console.log(res.data)
          res.data.forEach((cartItem) => {
            if (cartItem.product_id == this.productId) {
              this.quantity = cartItem.quantity
              this.selectedSize = cartItem.selected_size
              this.selectedType = cartItem.selected_type
              this.selectedSubtypeIndex = cartItem.selectedSubtypeIndex
              this.inCart = true
            }
          })
        })
        .catch((err) =>
          console.log(err.response.data.message, err.response.data.exception)
        )
    },
    getRelated() {
      this.relatedProducts = []
      this.product.related.forEach((id) => {
        this.$axios
          .get('products/' + id)
          .then((res) => this.relatedProducts.push(res.data.data))
      })
      console.log(this.relatedProducts)
    },
  },
}
</script>
<style>
/* 

need to set up the bookmarking mechanism as well as send out a snackbar saying product saved, unsaved or log in to save.

MUST add some link for sharing

Verify that product options have been chosen before the product is added to cart

If product is already in cart get the quantity of it and change the btn to a success version. Will also need an update method for changing the quantity.

Should add like a cool and gratifying animation for adding a product to the cart

If there is a gender which has less than two sizes then do not display sizes at all. Or perhaps to simplify only display sizes after a gender has been selected.

 */
</style>
