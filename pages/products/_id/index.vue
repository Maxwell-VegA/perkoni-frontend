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

      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selectedSize"
            :items="productSizesArray"
            label="Produkta izmeeri"
          ></v-select>
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
          <v-select
            v-model="selectedType"
            :items="productTypesArray"
            label="Produkta tipi"
            @change="selectedSubtypeName = null"
          ></v-select>
          <!-- @change="resetSelectedSubtype()" -->
          <!-- Perhaps I can find the time to make this keep the previous subtype arround when the user has switched to another type and immedietly display the previously selected subtype when the user reverts to the type for which he already had selected the subtype -->
          <!-- The resetter doesn't seem to be working correctly -->
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col class="d-flex" cols="12" sm="6">
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
      product: {
        types: [
          {
            typeName: null,
            typePrice: null,
            typeSecondary: [null],
          },
        ],
        sizes: [
          {
            size: null,
            sizePrice: null,
          },
        ],
      },
    }
  },
  computed: {
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
          // console.log(res.data)
          this.product = res.data.data
          this.lastPage = res.data.last_page
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
  },
}
</script>
