<template>
  <div>
    <v-row>
      <v-col cols="12" md="6">
        <!-- Basic properties -->
        <div>
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
          <br />
        </div>
      </v-col>

      <v-col cols="12" md="6">
        <!-- pricing -->
        <div>
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
                {{
                  (parseFloat(activePrice) + item.price * header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template v-else #item.0="{ item, header }">
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price + header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.1="{ item, header }"
            >
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price * header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template v-else #item.1="{ item, header }">
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price + header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.2="{ item, header }"
            >
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price * header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template v-else #item.2="{ item, header }">
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price + header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.3="{ item, header }"
            >
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price * header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template v-else #item.3="{ item, header }">
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price + header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template
              v-if="product.operatorIsMultiply"
              #item.4="{ item, header }"
            >
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price * header.price).toFixed(
                    2
                  )
                }}
              </b>
            </template>
            <template v-else #item.4="{ item, header }">
              <b v-if="activePrice">
                {{
                  (parseFloat(activePrice) + item.price + header.price).toFixed(
                    2
                  )
                }}
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

    <v-row>
      <v-col cols="12" md="12" lg="9" xl="6">
        <!-- Images -->
        <div>
          <div v-if="selectedImages[0] != null">
            <v-expansion-panels focusable>
              <v-expansion-panel v-for="(image, i) in selectedImages" :key="i">
                <v-expansion-panel-header ripple>
                  <v-btn
                    depressed
                    outlined
                    left
                    elevation="2"
                    max-width="2"
                    @click="removeImage(image)"
                  >
                    <v-icon size="26" color="white">mdi-close</v-icon>
                  </v-btn>
                  <span class="ml-10">
                    {{ image.title }}
                  </span>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-img
                        aspect-ratio="1"
                        :src="
                          'http://127.0.0.1:8000/storage/product_images/temp/' +
                          image.fileName
                        "
                      >
                        <template #placeholder>
                          <!-- <v-img src="https://source.unsplash.com/random"> </v-img> -->
                          <v-img
                            aspect-ratio="1"
                            src="http://127.0.0.1:8000/storage/product_images/temp/photo_1607002086.jpg"
                          >
                          </v-img>
                        </template>
                      </v-img>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                      <v-row>
                        <v-col cols="12" md="8">
                          <v-text-field
                            v-model="image.title"
                            outlined
                            label="Attela nosaukums"
                            autofocus
                            counter="50"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="4">
                          <v-text-field
                            v-model="image.order"
                            type="number"
                            label="Kartas nummurs"
                            filled
                            persistent-hint
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="12">
                          <v-textarea
                            v-model="image.description"
                            label="Attela apraksts"
                            counter="255"
                            dense
                            outlined
                            no-resize
                          ></v-textarea>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            <br />
          </div>
          <v-file-input
            v-model="files"
            counter
            filled
            label="File input"
            multiple
            persistent-hint
            hint="All images will be displayed square // For some reason axios can't get an immage from the API if it has underscores in the name even though I can get the same image through the browser"
            placeholder="Pievieno produkta fotografijas"
            prepend-icon="mdi-camera"
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
          <!-- @event - loading : while loading images display this dialog -->
          <!-- <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog> -->
          <p v-if="devMode" class="text--disabled">
            {{ selectedImages }}
          </p>
        </div>
      </v-col>
    </v-row>

    <!-- secondary properties -->
    <div>
      <v-combobox
        v-model="product.taggs"
        label="Add product taggs"
        clearable
        chips
        multiple
        persistent-hint
        :items="taggs"
        hint="Taggs will be used for... // Choose from existing taggs or enter your own // Hit enter to separate"
      >
      </v-combobox>
      <p v-if="devMode" class="text--disabled">
        product.taggs - {{ product.taggs }}
      </p>
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
      <v-btn @click="storeProduct">Update Product</v-btn>
      <v-checkbox
        v-model="product.isPublic"
        label="Make product publically visable"
      ></v-checkbox>
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
      errors: [],
      files: [],
      selectedImages: [null],
      product: {
        user_id: 1,
        title: 'Hoodie "Latvia"',
        isPublic: false,
        // isConfirmed: true,
        mainCategory: 'Apgerbi',
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
        'November',
        'Thunder',
        'Autumn',
        'Latvia',
        'Easter',
        'Cool',
        'DIY',
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
    this.setTable()
  },
  methods: {
    getProduct() {
      axios
        .get('http://127.0.0.1:8000/api/products/' + this.productId)
        .then((res) => {
          // console.log(res.data)
          this.product = res.data.data
        })
        .catch((err) => (this.errors = err.response.data.message))
    },
    storeProduct() {
      console.log(this.product)
      axios
        .post('http://127.0.0.1:8000/api/products', {
          user_id: this.product.user_id,
          title: this.product.title,
          isPublic: this.product.isPublic,
          isConfirmed: this.product.isConfirmed,
          mainCategory: this.product.mainCategory,
          subcategory: this.product.subcategory,
          description: this.product.description,
          is_new: this.product.is_new,
          base_price: this.product.base_price,
          sale_price: this.product.sale_price,
          on_sale: this.product.on_sale,
          operatorIsMultiply: this.product.operatorIsMultiply,
          types: this.product.types,
          sizes: this.product.sizes,
          taggs: this.product.taggs,
          gender: this.product.gender,
          images: this.selectedImages,
          // was it not possible to just for loop through this crap?
        })
        .then((res) => console.log(res))
        .catch((err) => this.errors.push(err.response.data.message))
        .catch((err) => this.errors.push(err.response.data.errors))
    },
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
    onImagesSelected(event) {
      if (this.selectedImages[0] == null) {
        this.selectedImages = []
      }
      event.forEach((file) => {
        const fd = new FormData()
        fd.append('image', file)
        const index = this.selectedImages.length
        const imageNameNoExt = file.name.split('.')
        this.selectedImages.push({
          fileName: null,
          title: imageNameNoExt[0],
          description: '',
          order: index + 1,
        })
        axios
          .post('http://127.0.0.1:8000/api/img', fd)
          .then((res) => (this.selectedImages[index].fileName = res.data))
          .catch((err) => (this.errors = JSON.stringify(err)))
      })
      console.log(this.selectedImages)
    },
    removeImage(objectToDelete) {
      // console.log(objectToDelete)
      const removed = this.selectedImages.filter((imgObject) => {
        return imgObject !== objectToDelete
      })
      this.selectedImages = removed
    },
  },
}
</script>

<style scoped>
/* 

Taggs will be used for - this should be explained in some hoverable info
pannel. Each tag should have a tooltip showing how many products already exist
using the tag.

It will be possible to create a product have it approved and then edit it into a completely different product. Changes to products should be logged and displayed somewhere for the admin to see. 

Confirm deleting the product by typing its name. Product will be deleted in 24 hours. If you want to prevent this you will still be able to access this page from your products dasboard. New changes will not be saved. Or maybe they should be changes (person tries to edit a product figures he should delete it then changes his mind but the changes haven't been saved). 

Display loading progress when uploading images

Product brand

Related products

Product shipping (Weight, Size, Available shipping options) Ability to set specific shipping options per size



*/
</style>
