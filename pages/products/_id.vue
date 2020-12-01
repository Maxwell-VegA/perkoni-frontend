<template>
  <div>
    <h1 class="display-3 mt-8 mb-16">{{ product.title }}</h1>
    <div>
      <p>{{ product.description }}</p>
      <h3 class="font-weight-light">
        {{ product.mainCategory }}/{{ product.subcategory }}
      </h3>
      <div v-if="!product.on_sale">
        <h2 class="display-1">{{ product.base_price }}$</h2>
      </div>
      <div v-else>
        <span class="display-1 grey--text text-decoration-line-through">
          {{ product.base_price }}
        </span>
        <span class="display-1"> {{ product.sale_price }}$ </span>
      </div>
      <p>{{ types }}</p>
      <!-- <p v-for="(type, i) in product.types" :key="i">{{ type }}</p> -->
      <v-select v-model="model" label="Product type">
        <!-- <template v-if="selectSlot" v-slot:selection="{ item, index }">
          <v-chip v-if="index === 0">
            <span>{{ item }}</span>
          </v-chip>
        </template> -->
      </v-select>

      <!-- {{ product }} -->
    </div>
    <p>{{ model }}</p>
    <p>{{ errors }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      model: '',
      errors: {},
      productId: 1,
      product: {},
    }
  },
  computed: {
    types() {
      const arr = []
      //   arr.push(this.product.types.split(','))
      //   arr = this.product.types.split(',')
      return arr
    },
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      axios
        .get('http://127.0.0.1:8000/api/products/' + this.productId)
        .then((res) => {
          this.product = res.data.data
          this.lastPage = res.data.last_page
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
  },
}
</script>

<style></style>
