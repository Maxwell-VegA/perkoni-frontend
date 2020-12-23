<template>
  <div>
    <v-col offset-xl="1">
      <h1 class="display-3 my-8">{{ product.title }}</h1>
      <h3 class="font-weight-light">
        {{ product.mainCategory }} / {{ product.subcategory }} /
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
                  <p>{{ product.description }}</p>
                  <!-- <p> {{ selectedCombination }} </p> -->
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
                    v-if="productSizesArray[0].text"
                    v-model="selectedSize"
                    class="my-n1"
                    :disabled="
                      productSizesArray[0].text == 'Izvelies modeli' ||
                      !productSizesArray[0].text
                    "
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
                <v-col offset="1" cols="9" offset-md="0" md="12" class="pr-8 ml-n1">
                  <v-row no-gutters>
                    <v-col sm="2" md="3" xl="2">
                      <v-combobox
                        :items="qtyOptions"
                        @change="updateQuantity"
                        v-model="quantity"
                        filled
                        height="40px"
                        style="margin-top: -2px"
                        dense
                      >
                      </v-combobox>
                    </v-col>
                    <v-col>
                      <v-btn
                        v-if="!inCart"
                        color="primary"
                        style="margin-top: 0px"
                        class="py-5 ml-1"
                        :loading="addingToCart"
                        v-bind="{ disabled: !isAvailable }"
                        @click="addToCart"
                      >
                        pievienot grozam
                        <v-icon>mdi-cart-plus</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        color="success"
                        style="margin-top: -2px"
                        class="py-5 ml-1"
                      >
                        produkts ir groza
                        <v-icon>mdi-check-circle-outline</v-icon>
                      </v-btn>
                      <!-- {{ quantity + '/' + setQuantity }} -->
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>
            <!-- Long description -->
            <v-col cols="12" class="pr-9">
              <v-card
                v-for="(match, i) in targetMatch"
                :key="i"
                class="primary mb-4"
              >
                <v-card-title class="">
                  {{ match.message }}
                </v-card-title>
                <!-- {{ targetMatch }} -->
              </v-card>
              <v-card>
                <v-card-title>Apraksts:</v-card-title>
                <v-card-text>
                  <p v-html="product.longDescription"></p>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- Related products -->
            <v-col cols="12" class="pr-9">
              <v-row>
                <v-col v-for="(prod, i) in relatedProducts" :key="i" md="4" xl="3">
                  <product-card :product="prod" />
                </v-col>
              </v-row>
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
                    <v-card-subtitle v-if="product.brand_freeShipping">
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ProductCard from '~/components/ProductCard.vue'
//

export default {
  components: { ProductCard },
  async fetch({ store, params }) {
    await store.dispatch('getProduct', { productId: params.id })
  },
  data() {
    return {
      errors: {},
      addingToCart: false,
      cartItemId: 0,
      update: false,
      lsTest: false,
      isAvailable: true,
      typePrice: 0,
      sizePrice: 0,
      quantity: 1,
      setQuantity: 0,
      selectedGender: '',
      selectedSize: 0,
      selectedVariation: '',
      selectedType: 0,
      selectedSubtypeName: null,
      selectedImageIndex: 0,
      fullscreenImage: false,
      brandCardExpanded: false,
      shippingCardExpanded: true,
      bookmarked: false,
      relatedProducts: [],
    }
  },
  computed: {
    ...mapState(['product', 'shippingOptions', 'qtyOptions']),
    selectedCombination() {
      this.addingToCart = false
      let gender = 'ANY-1337'
      let size = 'ANY-1337'
      let variation = 'ANY-1337'
      let type = 'ANY-1337'
      let subtype = 'ANY-1337'

      this.selectedSizes
      // console.log(this.product)

      if (this.selectedGender != '') {
        gender = this.selectedGender
      } else {
        gender = 'ANY-1337'
      }
      if (
        this.productSizesArray[this.selectedSize].text != 'Izvelies modeli' &&
        this.productSizesArray[this.selectedSize].text != null
      ) {
        size = this.productSizesArray[this.selectedSize].text
      } else {
        size = 'ANY-1337'
      }
      if (this.selectedVariation != '') {
        variation = this.selectedVariation
      } else {
        variation = 'ANY-1337'
      }
      if (
        this.productTypesArray[this.selectedType].text != 'singleTypeProduct'
      ) {
        type = this.productTypesArray[this.selectedType].text
      } else {
        type = 'ANY-1337'
      }
      if (this.selectedSubtypeName != null) {
        subtype = this.selectedSubtypeName
      } else {
        subtype = 'ANY-1337'
      }

      const combination =
        gender +
        '_//__' +
        size +
        '_//__' +
        variation +
        '_//__' +
        type +
        '_//__' +
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
      const val = []

      this.product.targets.forEach((t) => {
        let match = true

        const splitKey = t.key.split('_//__')
        const splitCurrent = this.selectedCombination.split('_//__')

        for (let index = 0; index < splitKey.length; ) {
          if (
            splitKey[index] !== 'ANY-1337' &&
            splitKey[index] !== splitCurrent[index]
          ) {
            match = false
            break
          }
          index++
        }

        if (match && t.active) {
          console.log(match)
          val.push(t)
        }
      })

      if (val.length > 0) {
        for (const match of val) {
          if (match.available) {
            this.isAvailable = true
          } else {
            this.isAvailable = false
            break
          }
        }
      } else {
        this.isAvailable = true
      }

      return val
    },
    inCart() {
      let cartItems = []
      if (this.$auth.loggedIn) {
        cartItems = this.$store.state.cart
      } else if (this.lsTest) {
        cartItems = Object.values(JSON.parse(localStorage.getItem('cart')))
      }

      const update = this.update
      let returnThis

      for (const cartItem of cartItems) {
        if (cartItem.key == this.selectedCombination) {
          returnThis = true
          console.log(cartItem)
          this.cartItemId = cartItem.id
          this.quantity = cartItem.quantity
          this.setQuantity = cartItem.quantity
          break
        } else {
          returnThis = false
          this.quantity = 1
          this.setQuantity = 0
        }
      }

      return returnThis
    },
  },
  watch: {
    // update() {
    //   this.$nuxt.$emit('refreshCart')
    // }
    // 'product': function() {
    //   console.log(123)
    // }
  },
  mounted() {
    // this.getProduct()
    this.getRelated()
    // this.localStorage.setItem('cart', "{}")
    this.lsTest = true
    this.isInCartQuestion()
  },
  methods: {
    updateQuantity() {
      if (
        this.inCart &&
        this.quantity !== this.setQuantity &&
        this.setQuantity !== 0
      ) {
        if (this.$auth.loggedIn) {
          this.$store.dispatch('updateCartQuantity', {
            cartItemId: this.cartItemId,
            quantity: this.quantity,
          })
        } else if (this.lsTest) {
          this.addToCart()
        }
      }
    },
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
        this.targetMatch.forEach((match) => {
          if (match.available) {
            if (match.overridePriceType === 'set') {
              val = parseFloat(match.overridePrice)
            } else if (match.overridePriceType === 'add') {
              val = val + parseFloat(match.overridePrice)
            } else if (match.overridePriceType === 'multiply') {
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
      this.setQuantity = this.quantity
      if (this.$auth.loggedIn) {
        this.addingToCart = true
        this.$axios
          .post('cart', {
            productId: this.productId,
            title: this.product.title,
            price: this.displayPrice(this.activePrice),
            selectedType: this.selectedType,
            selectedSubtype: this.selectedSubtypeIndex,
            selectedSize: this.selectedSize,
            quantity: this.quantity,
            key: this.selectedCombination,
          })
          .then((res) => {
            this.$store.dispatch('getCart')
            // this.$nuxt.$emit('refreshCart')
          })
          .catch((err) =>
            console.log(err.response.data.message, err.response.data.exception)
          )
      } else {
        // console.log(1)
        let current = JSON.parse(localStorage.getItem('cart'))
        if (!current) {
          current = {}
        }
        current[`${this.productId}_//__${this.selectedCombination}`] = {
          product_id: this.productId,
          title: this.product.title,
          price: this.displayPrice(this.activePrice),
          selected_type: this.selectedType,
          selectedSubtypeIndex: this.selectedSubtypeIndex,
          selected_size: this.selectedSize,
          quantity: this.quantity,
          key: this.selectedCombination,
        }
        localStorage.setItem('cart', JSON.stringify(current))
        // this.$nuxt.$emit('refreshCart')
        // basically watch the quantity and update cart on change
        // when a product is added to cart some options for heading to checkout should pop up (perhaps only when the user is a guest)
        // Might be I can use a snackbar here
      }
      this.update = !this.update
    },
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
    isInCartQuestion() {
      // let update = this.update
      let res = []
      if (this.$auth.loggedIn) {
        res = this.$store.state.cart
      } else if (this.lsTest) {
        res = JSON.parse(localStorage.getItem('cart'))
        if (!res) {
          localStorage.setItem('cart', '{}')
          res = []
        }
      }
      if (res.length > 0) {
        res.forEach((cartItem) => {
          if (cartItem.product_id == this.productId) {
            this.quantity = cartItem.quantity
            this.setQuantity = cartItem.quantity
            this.selectedSize = cartItem.selected_size
            this.selectedType = cartItem.selected_type
            this.selectedSubtypeIndex = cartItem.selectedSubtypeIndex
          }
        })
      }
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
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
/* 

need to set up the bookmarking mechanism as well as send out a snackbar saying product saved, unsaved or log in to save.

MUST add some link for sharing

Verify that product options have been chosen before the product is added to cart

If product is already in cart get the quantity of it and change the btn to a success version. Will also need an update method for changing the quantity.

Should add like a cool and gratifying animation for adding a product to the cart

If there is a gender which has less than two sizes then do not display sizes at all. Or perhaps to simplify only display sizes after a gender has been selected.

Make the item quantity combobox of the cart and the /id page numbers only and only positive numbers or zero to remove.

If a product is not public and confirmed you shouldn't be able to add it to cart.

*/
</style>
