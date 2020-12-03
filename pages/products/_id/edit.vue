<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <div>
          <!-- Basic properties -->
          <v-text-field
            v-model="product.title"
            outlined
            label="Nosaukums"
            :rules="[rules.required]"
            validate-on-blur
          ></v-text-field>
          <!--  -->
          <v-select
            v-model="product.mainCategory"
            :items="categories"
            label="Kategorija"
          ></v-select>
          <p v-if="devMode" class="text--disabled">
            product.mainCategory - {{ product.mainCategory }}
          </p>
          <p v-if="devMode" class="text--disabled">
            product.mainCategoryIndex - {{ product.mainCategoryIndex }}
          </p>
          <!--  -->
          <v-select
            v-model="compSubcategory"
            :items="compSubcategories"
            label="Subkategorija"
            :rules="[rules.required]"
          >
          </v-select>
          <p v-if="devMode" class="text--disabled">
            product.subcategory - {{ product.subcategory }}
          </p>
          <p v-if="devMode" class="text--disabled">
            compSubcategories - {{ compSubcategories }}
          </p>
          <p v-if="devMode" class="text--disabled">
            compSubcategory - {{ compSubcategory }}
          </p>
          <!--  -->
          <v-textarea
            v-model="product.description"
            label="Apraksts"
            :rules="[rules.required]"
            validate-on-blur
            outlined
            rows="8"
            no-resize
          ></v-textarea>
          <p v-if="devMode" class="text--disabled">
            product.description - {{ product.description }}
          </p>
          <br />
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <div>
          <!-- pricing -->
          <v-text-field
            v-model="product.base_price"
            :rules="[rules.required]"
            validate-on-blur
            hide-details
            prepend-icon="mdi-currency-eur"
            filled
            label="Pamatcena"
            type="number"
          />
          <br />
          <v-text-field
            v-model="product.sale_price"
            validate-on-blur
            hide-details
            filled
            prepend-icon="mdi-sale"
            label="Akcijas cena"
            type="number"
          />
          <p v-if="devMode" class="text--disabled">
            product.sale_price - {{ product.sale_price }}
            <!-- Btw currently it is possible to set a sale price which is higher than the base price -->
          </p>
          <v-checkbox
            v-model="product.on_sale"
            :disabled="!product.sale_price"
            label="Akcijas cena"
          ></v-checkbox>
          <p v-if="devMode" class="text--disabled">
            product.on_sale - {{ product.on_sale }}
          </p>
          <v-checkbox
            v-model="product.operatorIsMultiply"
            label="Multiply"
          ></v-checkbox>
          <p v-if="devMode" class="text--disabled">
            product.operatorIsMultiply - {{ product.operatorIsMultiply }}
          </p>
          <br />
          <v-data-table
            :headers="tableSizes"
            :items="tableTypes"
            no-data-text="No data generated"
            disable-filtering
            disable-pagination
            disable-sort
            hide-default-footer
            class="elevation-1"
          >
            <template
              v-if="product.operatorIsMultiply"
              #item.0="{ item, header }"
            >
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price * header.price }}
              </b>
            </template>
            <template v-else #item.0="{ item, header }">
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price + header.price }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.1="{ item, header }"
            >
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price * header.price }}
              </b>
            </template>
            <template v-else #item.1="{ item, header }">
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price + header.price }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.2="{ item, header }"
            >
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price * header.price }}
              </b>
            </template>
            <template v-else #item.2="{ item, header }">
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price + header.price }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.3="{ item, header }"
            >
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price * header.price }}
              </b>
            </template>
            <template v-else #item.3="{ item, header }">
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price + header.price }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.4="{ item, header }"
            >
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price * header.price }}
              </b>
            </template>
            <template v-else #item.4="{ item, header }">
              <b v-if="activePrice">
                {{ parseFloat(activePrice) + item.price + header.price }}
              </b>
            </template>
          </v-data-table>
          <p v-if="devMode" class="text--disabled">
            product.operatorIsMultiply - {{ product.operatorIsMultiply }}
          </p>
          <br />
          <br />
        </div>
      </v-col>
    </v-row>

    <div>
      <!-- Images -->
      <v-file-input
        v-model="files"
        counter
        filled
        label="File input"
        multiple
        placeholder="Pievieno produkta fotografijas"
        prepend-icon=""
        prepend-inner-icon="mdi-camera"
        :show-size="1000"
        @change="onImagesSelected"
      >
        <!-- make this accept immages only -->
        <template #selection="{ index, text }">
          <v-chip v-if="index < 3" outlined text-color="white" label small>
            {{ text }}
          </v-chip>
          <span
            v-else-if="index === 3"
            class="overline grey--text text--darken-3 mx-2"
            >+{{ files.length - 3 }} File(s)
          </span>
        </template>
      </v-file-input>
      <p v-if="devMode" class="text--disabled">
        {{ selectedImages }}
      </p>
      <v-img
        v-for="(image, i) in selectedImages"
        :key="i"
        aspect-ratio="1"
        height="400"
        width="400"
        :src="
          'http://127.0.0.1:8000/storage/product_images/temp/' +
          selectedImages[i]
        "
      >
        <template #placeholder>
          <!-- <v-img src="https://source.unsplash.com/random"> </v-img> -->
          <!-- <v-img
            aspect-ratio="1"
            height="400"
            width="400"
            src="http://127.0.0.1:8000/storage/product_images/temp/photo_1607002086.jpg"
          >
          </v-img> -->
        </template>
      </v-img>
      <!-- A checkbox for marking the main image of the group -->
    </div>

    <div>
      <!-- secondary properties -->
      <v-combobox
        label="Add product taggs"
        clearable
        chips
        multiple
        persistent-hint
        :items="taggs"
        hint="Taggs will be used for... // Choose from existing taggs or enter your own // Hit enter to separate"
      >
      </v-combobox>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>

    <div>
      <!-- controlls -->
      <v-btn @click="devMode = !devMode">Dev Mode</v-btn>
      <v-btn @click="setTable">Set table</v-btn>
      {{ errors }}
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      devMode: false,
      errors: {},
      files: [],
      selectedImages: [null],
      product: {
        user_id: 1,
        title: 'Hoodie "Latvia"',
        mainCategory: 'Apgerbi',
        // mainCategoryIndex: 0,
        subcategory: 'Džemperi',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatem reprehenderit ipsa unde iste, nulla consectetur fugiat, dolor laborum cupiditate aperiam doloribus, eius assumenda a fuga esse adipisci. Magni, laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatem reprehenderit ipsa unde iste, nulla consectetur fugiat, dolor laborum cupiditate aperiam doloribus, eius assumenda a fuga esse adipisci. Magni, laborum.',
        is_new: true,
        base_price: 30,
        sale_price: 20,
        on_sale: false,
        operatorIsMultiply: false,
        taggs: ['Latvia', 'November', 'Autumn'],
        gender: 'unisex',
        // likely if the gender is set with the product as clothing then the category changed to something else it doesn't reset to genderless
        types: [
          { typeName: 'Basic', typePrice: 0, typeSecondary: [null] },
          { typeName: 'Cool', typePrice: 2, typeSecondary: [null] },
          { typeName: 'Extra Cool', typePrice: 3, typeSecondary: [null] },
          { typeName: 'Super Cool', typePrice: 5, typeSecondary: [null] },
          { typeName: 'Ultra Awesome', typePrice: 10, typeSecondary: [null] },
        ],
        sizes: [
          { sizeName: 'S', sizePrice: 0 },
          { sizeName: 'M', sizePrice: 2 },
          { sizeName: 'L', sizePrice: 5 },
          { sizeName: 'XL', sizePrice: 8 },
        ],
      },
      categories: [
        {
          text: 'Apgerbi',
          index: 0,
          subcategories: [
            'Krekli',
            'Džemperi',
            'Jakas',
            'Kleitas',
            'Cepures',
            'Šalles',
            'Bez apdrukas',
          ],
        },
        {
          text: 'Termouzlimes',
          index: 1,
          subcategories: ['Speka zimes', 'Rakstu joslas', 'Teksti'],
        },
        {
          text: 'Uzlimes',
          index: 2,
          subcategories: ['Speka zimes', 'Rakstu joslas', 'Teksti'],
        },
        {
          text: 'Tetovejumi',
          index: 3,
          subcategories: ['Speka zimes', 'Rakstu joslas', 'Teksti'],
        },
      ],
      taggs: [
        //   this should probably be a generated collection of the most popular taggs on the site instead of being a predefined collection
        // Perhaps also try to include the user's previously used taggs for convenience
        { text: 'November' },
        { text: 'Thunder' },
        { text: 'Autumn' },
        { text: 'Latvia' },
        { text: 'Easter' },
        { text: 'Cool' },
        { text: 'DIY' },
      ],
      tableSizes: [],
      tableTypes: [],
      rules: {
        required: (value) => !!value || 'Field is required / can not be empty.',
      },
    }
  },
  computed: {
    // compOperator() {
    //   if (this.product.operatorIsMultiply === true) {
    //     return 'multiplication'
    //   } else {
    //     return 'addition'
    //   }
    // },
    activePrice() {
      if (this.product.on_sale) {
        return this.product.sale_price
      } else {
        return this.product.base_price
      }
    },
    compSubcategories() {
      let arr = []
      this.categories.forEach((category) => {
        if (category.text === this.product.mainCategory) {
          arr = category.subcategories
        }
      })
      return arr
    },
    compSubcategory: {
      get() {
        let returnThis = null
        this.compSubcategories.forEach((subcategory) => {
          if (this.product.subcategory === subcategory) {
            // this.product.subcategory
            returnThis = this.product.subcategory
          }
        })
        return returnThis
      },
      set(input) {
        this.product.subcategory = input
      },
    },
    productId() {
      const arr = this.$route.path.split('/')
      return arr[arr.length - 2]
    },
  },
  mounted() {
    // this.getProduct()
    // this.setTable()
  },
  methods: {
    setTable() {
      this.tableSizes.push({
        text: 'Tipu / izmeeru cenas',
        value: 'name',
        align: 'start',
      })

      this.product.sizes.forEach((size, i) => {
        this.tableSizes.push({
          text: size.sizeName,
          price: size.sizePrice,
          value: i,
        })
      })

      this.product.types.forEach((type, i) => {
        this.tableTypes.push({
          name: type.typeName,
          price: type.typePrice,
          subtypes: type.secondary,
          //   ['column' + 1]: this.product.types[i].typePrice,
        })
      })
    },
    getProduct() {
      axios
        .get('http://127.0.0.1:8000/api/products/' + this.productId)
        .then((res) => {
          // console.log(res.data)
          this.product = res.data.data
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
    onImagesSelected(event) {
      this.selectedImages = []
      event.forEach((file) => {
        const fd = new FormData()
        fd.append('image', file)
        axios
          .post('http://127.0.0.1:8000/api/img', fd)
          .then((res) => this.selectedImages.push(res.data))
          .catch((err) => (this.errors = JSON.stringify(err)))
      })
      console.log(this.selectedImages)
    },
  },
}
</script>
