<template>
  <div>
    <v-row style="border-bottom: white solid 2px">
      <!-- Basic properties -->
      <v-col cols="12" md="6">
        <div>
          <v-text-field
            v-model="product.title"
            outlined
            label="Nosaukums"
            :rules="[rules.required]"
            validate-on-blur
          ></v-text-field>
          <v-row class="mt-n8">
            <v-col md="6">
              <v-select
                v-model="product.mainCategory"
                :items="categories"
                label="Kategorija"
                return-object
                @change="
                  ;(product.gender = [product.mainCategory.genders[0]]),
                    sizeGenders()
                "
              ></v-select>
            </v-col>
            <v-col md="6">
              <v-select
                v-model="product.subcategory"
                :items="product.mainCategory.subcategories"
                label="Subkategorija"
                :rules="[rules.required]"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-select
            v-model="product.gender"
            :items="product.mainCategory.genders"
            :disabled="!categoryHasGenders"
            multiple
            label="Dzimumi"
            @change="sizeGenders()"
          >
          </v-select>
          <v-textarea
            v-model="product.description"
            label="Apraksts"
            :rules="[rules.required]"
            validate-on-blur
            outlined
            rows="5"
            no-resize
            counter="200"
          ></v-textarea>
          <v-textarea
            v-model="product.longDescription"
            label="Garais apraksts (opcionāls)"
            validate-on-blur
            outlined
            rows="6"
            no-resize
            counter="16000"
          ></v-textarea>
        </div>
      </v-col>
      <!-- pricing -->
      <v-col cols="12" md="6">
        <v-row no-gutters class="mb-3">
          <v-col cols="6">
            <v-text-field
              v-model="product.base_price"
              class="pr-4"
              :rules="[rules.required]"
              validate-on-blur
              hide-details
              outlined
              append-icon="mdi-currency-eur"
              label="Pamatcena"
              type="number"
            />
            <v-checkbox
              v-model="product.operatorIsMultiply"
              label="Reizināt izmēru un tipu cenas"
            ></v-checkbox>
            <p v-if="devMode" class="text--disabled">
              product.operatorIsMultiply - {{ product.operatorIsMultiply }}
            </p>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="6">
            <v-text-field
              v-model="product.sale_price"
              class="pl-4"
              validate-on-blur
              hide-details
              outlined
              append-icon="mdi-sale"
              label="Akcijas cena"
              type="number"
            />
            <v-checkbox
              v-model="product.on_sale"
              :disabled="!product.sale_price"
              class="pl-4"
              label="Izmantot akcijas cenu"
            ></v-checkbox>
            <p v-if="devMode" class="text--disabled">
              product.on_sale - {{ product.on_sale }}
            </p>
          </v-col>
        </v-row>
        <p v-if="devMode" class="text--disabled">
          product.sale_price - {{ product.sale_price }}
          <!-- Btw currently it is possible to set a sale price which is higher than the base price -->
        </p>
        <v-select
          v-model="selectedGender"
          style="margin-top: 14px"
          :items="tableSelectGender"
        ></v-select>
        <v-data-table
          class="product-createpage-table"
          style="background: transparent"
          :headers="tableSizes"
          :items="tableTypes"
          no-data-text="No pricing data generated"
          disable-filtering
          disable-sort
          :items-per-page="6"
        >
        </v-data-table>
        <p v-if="devMode" class="text--disabled">
          product.operatorIsMultiply - {{ product.operatorIsMultiply }}
        </p>
      </v-col>
    </v-row>

    <v-row style="border-bottom: white solid 2px">
      <!-- sizes -->
      <v-col
        v-if="product.sizes[0].gender != 'genderUndefined'"
        md="12"
        class="px-8"
      >
        <v-checkbox
          label="Rādīt svara-specifiskās piegades iespējas "
          @click="showCustomShipping = !showCustomShipping"
        >
        </v-checkbox>
        <p v-if="product.sizes[0] == null">Viena izmera produkts</p>
        <v-row v-for="(gender, i) in product.sizes" v-else :key="i">
          <v-col>
            <v-row>
              <v-col cols="4">
                <h3>{{ gender.gender }}</h3>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="4">
                <v-btn class="mr-8" absolute right @click="addSize(i)"
                  >Pievienot izmeru</v-btn
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col
                v-for="(size, index) in gender.sizes"
                :key="index"
                md="4"
                lg="3"
                xl="2"
              >
                <v-row v-if="gender.sizes.length > 1" dense>
                  <v-col cols="8">
                    <v-text-field
                      v-model="size.sizeName"
                      outlined
                      dense
                      label="Nosaukums"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="3">
                    <v-text-field
                      v-model="size.sizePrice"
                      type="number"
                      outlined
                      dense
                      label="Koeficents"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="1">
                    <v-btn class="ml-n1" icon @click="removeSize(i, index)">
                      <v-icon color="error">mdi-close</v-icon>
                    </v-btn>
                  </v-col>

                  <v-col
                    v-show="size.customShipping && showCustomShipping"
                    cols="8"
                  >
                    <v-select
                      v-model="size.shippingOptions"
                      outlined
                      chips
                      small-chips
                      dense
                      multiple
                      :items="allShippingOptions"
                      label="Piegāde"
                    ></v-select>
                  </v-col>
                  <v-col
                    v-show="size.customShipping && showCustomShipping"
                    cols="3"
                  >
                    <v-text-field
                      v-model="size.weight"
                      label="Svars"
                      outlined
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    v-show="!size.customShipping && showCustomShipping"
                    cols="8"
                  >
                    <v-text-field
                      value="Noklusējuma"
                      disabled
                      outlined
                      dense
                      label="Piegāde"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    v-show="!size.customShipping && showCustomShipping"
                    cols="3"
                  >
                    <v-text-field
                      v-model="product.weight"
                      disabled
                      label="Svars"
                      outlined
                      dense
                      type="number"
                    ></v-text-field>
                  </v-col>
                  <v-col v-show="showCustomShipping" class="ml-n1" cols="1">
                    <v-btn
                      icon
                      @click="size.customShipping = !size.customShipping"
                    >
                      <v-icon :disabled="!size.customShipping"
                        >mdi-truck-outline</v-icon
                      >
                    </v-btn>
                  </v-col>
                </v-row>
                <v-row v-else> Dzimums are vienu izmeru </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <!-- types -->
      <v-col md="12" class="px-8">
        <v-row>
          <v-col md="4" lg="3">
            <v-text-field
              v-model="product.typesName"
              label="Selekcijas nosaukums"
              placeholder="E.g. Uzlīmes matereāli, Fakturas"
              max="20"
              min="3"
              clearable
            ></v-text-field>
          </v-col>
          <v-col md="4" lg="3">
            <v-spacer></v-spacer>
            <v-text-field
              v-model="product.subtypesName"
              label="Subselekcijas nosaukums"
              placeholder="E.g. Uzlīmes krāsas"
              max="20"
              min="3"
              clearable
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="4" lg="3">
            <v-btn class="mr-8" absolute right @click="addType">
              Pievienot "{{ product.typesName }}" tipu
            </v-btn>
          </v-col>
        </v-row>
        <p v-if="product.types[0] == null">Beztipu produkts</p>
        <v-row v-else>
          <!-- style="height: 150px" -->
          <v-col v-for="(type, i) in product.types" :key="i" md="4" lg="3">
            <v-row dense>
              <v-col cols="8">
                <v-text-field
                  v-model="type.typeName"
                  outlined
                  dense
                  :label="product.typesName + ' tips'"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="type.typePrice"
                  type="number"
                  outlined
                  dense
                  label="Koeficents"
                ></v-text-field>
              </v-col>
              <v-col class="ml-n2" cols="1">
                <v-btn icon @click="removeType(i)">
                  <v-icon color="error">mdi-close</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-combobox
              v-model="type.typeSecondary"
              :label="type.typeName + ' ' + product.subtypesName"
              hint="Spied 'enter' lai atdalitu "
              clearable
              dense
              small-chips
              deletable-chips
              single-line
              allow-overflow
              outlined
              multiple
              chips
              :items="allSubtypes"
            >
            </v-combobox>
          </v-col>
        </v-row>
      </v-col>
      <!-- variations -->
      <v-col md="12" xl="12" class="px-8">
        <v-row>
          <v-col v-show="showVariations" md="6">
            <v-combobox
              v-model="product.variations"
              :label="product.variationsName + ':'"
              clearable
              deletable-chips
              chips
              multiple
              outlined
              hide-selected
              height="65"
            >
            </v-combobox>
          </v-col>
          <v-col v-show="showVariations" md="3">
            <v-text-field
              v-model="product.variationsName"
              placeholder="E.g. Krekla krāsa, Uzraksts, Veidi"
              label="Nosaukums"
              height="65"
              max="20"
              min="3"
              outlined
              clearable
            ></v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col md="3" xl="2">
            <v-checkbox
              label="Papildus variācijas"
              @click="showVariations = !showVariations"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row style="border-bottom: white solid 2px">
      <!-- Images -->
      <v-col cols="12" md="12" lg="9" xl="6">
        {{ currentExpandedImage }}
        <div v-if="selectedImages[0] != null">
          <v-expansion-panels v-model="currentExpandedImage" focusable>
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
                        <v-img
                          aspect-ratio="1"
                          src="http://127.0.0.1:8000/notfound.gif"
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
                          label="Attēla nosaukums"
                          autofocus
                          counter="50"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="4">
                        <v-text-field
                          v-model="image.order"
                          type="number"
                          label="Kārtas nummurs"
                          filled
                          persistent-hint
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12">
                        <v-textarea
                          v-model="image.description"
                          label="Attēla apraksts"
                          counter="86"
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
          placeholder="Pievieno produkta fotogrāfijas"
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
      </v-col>
    </v-row>

    <v-row>
      <!-- secondary properties -->
      <v-col md="6">
        <v-select
          v-model="product.brand_id"
          :items="compUserBrands"
          label="Ražotājs"
          @change="getUserProducts"
        >
        </v-select>
        <v-select
          v-model="compRelatedProducts"
          v-bind="{ disabled: !product.brand_id }"
          label="Līdzīgie produkti"
          clearable
          deletable-chips
          chips
          multiple
          counter="9"
          :items="relatedProducts"
        >
        </v-select>
        <v-combobox
          v-model="product.taggs"
          label="Produkta tagi"
          clearable
          auto-select-first
          :delimiters="[',', ';']"
          chips
          multiple
          deletable-chips
          hide-selected
          :items="taggs"
        >
        </v-combobox>

        <br />
        <br />
        <br />
      </v-col>
      <!-- shipping -->
      <v-col md="6">
        <v-text-field
          v-model="product.weight"
          label="Svars"
          type="number"
        ></v-text-field>
        <v-select
          v-for="(locale, i) in shippingOptions"
          :key="i"
          v-model="product.shipping"
          :items="locale.options"
          multiple
          chips
          :label="'Iespējamie piegādes veidi: ' + locale.locale"
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="product.address"
          label="Adrese kur var saņemt produktu"
        ></v-text-field>
        {{ product.shipping.Latvija }}
      </v-col>
    </v-row>

    <v-row>
      <!-- manual override -->
      <v-col md="12">
        <manual-override
          :sizes="product.sizes"
          :variations="product.variations"
          :types="product.types"
          :var-name="product.variationsName"
          :types-name="product.typesName"
          :subtypes-name="product.subtypesName"
          @updateRules="updateOverrideRules($event)"
        ></manual-override>
      </v-col>
    </v-row>

    <v-row>
      <v-col offset-xl="1" cols="12">
        <v-checkbox
          v-model="product.isPublic"
          label="Make product publically visable"
        ></v-checkbox>
      </v-col>
      <v-col offset-xl="1">
        <!-- controlls -->
        <!-- <v-btn to="/info#shipping"> Piegades cenu tabula </v-btn> -->
        <v-btn color="primary" @click="storeProduct">Create Product</v-btn>
        <!-- <v-btn @click="computeTargetsKeys(product.targets)">Keys</v-btn> -->
        <!-- <v-btn @click="log(product.shipping)">Shipping</v-btn> -->
        <!-- <v-btn v-if="$auth.user.is_admin">Mark as approved</v-btn>
      <v-btn>Submit for review</v-btn> -->

      </v-col>
    </v-row>

  </div>
</template>

<script>
import ManualOverride from '~/components/ManualOverride'
//

export default {
  components: { ManualOverride },
  data() {
    return {
      errors: [],
      showErrorsSnackbar: false,
      userBrands: [],
      files: [],
      currentExpandedImage: null,
      selectedImages: [null],
      selectedGender: 0,
      showCustomShipping: false,
      showVariations: false,
      devMode: false,
      product: {
        brand_id: 0,
        title: 'Hoodie "Latvia"',
        isPublic: false,
        isConfirmed: true,
        mainCategory: {
          text: 'Apģērbi',
          subcategories: [
            'Krekli',
            'Džemperi',
            'Jakas',
            'Kleitas',
            'Cepures',
            'Šalles',
            'Bez apdrukas'
          ],
          genders: ['Unisex', 'Vīriešiem', 'Sievietēm', 'Bērniem']
        },
        subcategory: '',
        description:
          'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat voluptatem reprehenderit ipsa unde iste, nulla consectetur fugiat, dolor laborum cupiditate aperiam doloribus, eius assumenda a fuga.',
        longDescription: '',
        is_new: true,
        base_price: 30,
        sale_price: 20,
        on_sale: false,
        operatorIsMultiply: false,
        taggs: ['Latvia', 'November', 'Autumn'],
        gender: [],
        variationsName: 'Variacijas',
        typesName: 'Matreali',
        subtypesName: 'Krasas',
        variations: [],
        types: [],
        sizes: [
          {
            gender: 'genderUndefined',
            sizes: [
              {
                sizeName: 'singleSizeProduct',
                sizePrice: 0,
                weight: 0,
                customShipping: false,
                shippingOptions: []
              }
            ]
          }
        ],
        related: [],
        weight: 0,
        shipping: [],
        address: '',
        targets: []
      },
      categories: [
        {
          text: 'Apģērbi',
          subcategories: [
            'Krekli',
            'Džemperi',
            'Jakas',
            'Kleitas',
            'Cepures',
            'Šalles',
            'Bez apdrukas'
          ],
          genders: ['Unisex', 'Vīriešiem', 'Sievietēm', 'Bērniem']
        },
        {
          text: 'Termouzlīmes',
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Teksti',
            'Citas'
          ],
          genders: ['Bezdzimuma']
        },
        {
          text: 'Uzlīmes',
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Citas'
          ],
          genders: ['Bezdzimuma']
        },
        {
          text: 'Tetovējumi',
          subcategories: [],
          genders: ['Bezdzimuma']
        },
        {
          text: 'Citi',
          subcategories: ['Rotas', 'Somas', 'Lietussargi'],
          genders: ['Unisex', 'Vīriešiem', 'Sievietēm', 'Bērniem', 'Bezdzimuma']
        }
      ],
      taggs: [
        'November',
        'Thunder',
        'Autumn',
        'Latvia',
        'Easter',
        'Cool',
        'DIY'
      ],
      relatedProducts: [],
      rules: {
        required: (value) => !!value || 'Field is required / can not be empty.'
      }
    }
  },
  computed: {
    shippingOptions() {
      return this.$store.state.shippingOptions
    },
    categoryHasGenders() {
      return this.product.mainCategory.genders.length > 1 ? true : false
    },
    allShippingOptions() {
      const arr = []
      this.shippingOptions.forEach((locale) =>
        locale.options.forEach((option) => arr.push(option))
      )
      return arr
    },
    compRelatedProducts: {
      get() {
        return []
      },
      set(input) {
        const arr = []
        input.forEach((element) => {
          arr.push(element.value)
        })
        this.product.related = arr
        return input
      }
    },
    allSubtypes() {
      const arr = []
      this.product.types.forEach((type) => {
        type.typeSecondary.forEach((subtype) => {
          arr.push(subtype)
        })
      })
      return arr
    },
    compUserBrands() {
      const arr = []
      this.userBrands.forEach((brand) => {
        arr.push({
          text: brand.name,
          value: brand.id
        })
      })
      return arr
    },
    activePrice() {
      return this.product.on_sale
        ? this.product.sale_price
        : this.product.base_price
    },
    productId() {
      const arr = this.$route.path.split('/')
      return arr[arr.length - 2]
    },
    tableTypes() {
      const arr = []
      this.product.types.forEach((i) => arr.push({}))
      this.product.types.forEach(
        (type, i) => (
          (arr[i].name = type.typeName),
          this.product.sizes[this.selectedGender].sizes.forEach(
            (size, idx) =>
              (arr[i]['price' + idx] = this.product.types[i].typePrice)
          )
        )
      )
      this.product.types.forEach((type, i) =>
        this.product.sizes[this.selectedGender].sizes.forEach(
          (size, idx) =>
            (arr[i]['price' + idx] = this.calculate(
              arr[i]['price' + idx],
              size.sizePrice
            ))
        )
      )
      let shipping = {
        name: 'Custom shipping'
      }
      let weight = {
        name: 'Svars'
      }
      let output = undefined
      this.product.sizes[this.selectedGender].sizes.forEach(
        (size, i) =>
          // this.shippingOptions.forEach((locale) => (locale.options.find(option => option.value === size.shippingOptions)))
          (shipping['price' + i] = size.customShipping)
      )
      arr.push(shipping)
      return arr
    },
    tableSizes() {
      const arr = [
        {
          text: 'Tipu / izmeeru cenas',
          value: 'name',
          align: 'start'
        }
      ]
      this.product.sizes[this.selectedGender].sizes.forEach((size, i) =>
        arr.push({
          text: size.sizeName,
          price: size.sizePrice,
          value: 'price' + i
        })
      )
      return arr
    },
    tableSelectGender() {
      const arr = []
      this.product.gender.forEach((gen, i) => {
        arr.push({
          text: gen,
          value: i
        })
      })
      return arr
    }
  },
  mounted() {
    // this.getProduct()
    this.getUserBrands()
  },
  methods: {
    sizeGenders() {
      const arr = []
      if (this.product.gender[0] != undefined) {
        this.product.gender.forEach((gen, i) => {
          arr.push({
            gender: gen,
            sizes: [
              {
                sizeName: '',
                sizePrice: 0,
                weight: 0,
                customShipping: false,
                shippingOptions: []
              }
            ]
          })
        })
      } else {
        arr.push({
          gender: 'genderUndefined',
          sizes: [
            {
              sizeName: 'singleSizeProduct',
              sizePrice: 0,
              weight: 0,
              customShipping: false,
              shippingOptions: []
            }
          ]
        })
      }
      this.product.sizes = arr
    },
    multilined(string) {
      const split = string.split('\n')
      return split.join('<br />')
    },
    sortSelectedImages() {
      this.selectedImages.sort((a, b) => {
        return a.order - b.order
      })
    },
    calculate(type, size) {
      if (this.product.operatorIsMultiply === true) {
        return (
          parseFloat(type) * parseFloat(size) +
          parseFloat(this.activePrice)
        ).toFixed(2)
      } else {
        return (
          parseFloat(type) +
          parseFloat(size) +
          parseFloat(this.activePrice)
        ).toFixed(2)
      }
    },
    // getProduct() {
    //   this.$axios
    //     .get('http://127.0.0.1:8000/api/products/' + this.productId + '/edit)
    //     .then((res) => {
    //       // console.log(res.data)
    //       this.product = res.data.data
    //     })
    //     .catch((err) => (this.errors = err.response.data.message))
    // },
    storeProduct() {
      this.computeTargetsKeys(this.product.targets)
      this.sortSelectedImages()
      console.log(this.product)
      this.errors = []
      let typesFound = this.product.types
      let sizesFound = this.product.sizes

      if (typesFound.length <= 1) {
        typesFound = [
          {
            typeName: 'singleTypeProduct',
            typePrice: 0,
            typeSecondary: [null]
          }
        ]
      }
      sizesFound.forEach((gen) => {
        if (gen.sizes.length <= 1) {
          gen = [
            {
              sizeName: 'singleSizeProduct',
              sizePrice: 0,
              weight: 0,
              customShipping: false,
              shippingOptions: []
            }
          ]
        }
      })
      this.$axios
        .post('products', {
          // user_id: this.product.user_id,
          brand_id: this.product.brand_id,
          title: this.product.title,
          isPublic: this.product.isPublic,
          isConfirmed: this.product.isConfirmed,
          mainCategory: this.product.mainCategory.text,
          subcategory: this.product.subcategory,
          description: this.product.description,
          longDescription: this.multilined(this.product.longDescription),
          is_new: this.product.is_new,
          base_price: this.product.base_price,
          sale_price: this.product.sale_price,
          on_sale: this.product.on_sale,
          operatorIsMultiply: this.product.operatorIsMultiply,
          variationsName: this.product.variationsName,
          typesName: this.product.typesName,
          subtypesName: this.product.subtypesName,
          variations: this.product.variations,
          types: typesFound,
          sizes: sizesFound,
          taggs: this.product.taggs,
          gender: this.product.gender,
          images: this.selectedImages,
          related: this.product.related,
          weight: this.product.weight,
          shipping: this.product.shipping,
          address: this.product.address,
          targets: this.product.targets
        })
        .then((res) => console.log(res))
        .catch((err) =>
          console.log(err.response.data.errors, err.response.data.message)
        )
        .catch((err) =>
          this.errors.push(err.response.data.message, err.response.data.errors)
        )
        .catch((err) => this.errors.push(err.response.data.errors))
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
          order: (index + 1) 
        })
        this.$axios
          .post('img', fd)
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
    getUserBrands() {
      this.$axios
        .get('brand', {
          headers: { Authorization: this.$auth.getToken('local') }
        })
        .then((res) => (this.userBrands = res.data))
    },
    getUserProducts() {
      this.$axios
        .get('products/related', {
          headers: { Authorization: this.$auth.getToken('local') }
        })
        .then((res) => {
          res.data.forEach((product) => {
            if (product.brand_id === this.product.brand_id) {
              this.relatedProducts.push({
                text: product.title,
                value: product.id
              })
            }
          })
          res.data.forEach((product) => {
            if (product.brand_id !== this.product.brand_id) {
              this.relatedProducts.push({
                text: product.title,
                value: product.id
              })
            }
          })
        })
        // .then((res) => console.log(res))
        .catch((err) => (this.errors = err.response.data.message))
    },
    addType() {
      this.product.types.push({
        typeName: 'New Type',
        typePrice: 0,
        typeSecondary: []
      })
    },
    removeType(i) {
      this.product.types = this.product.types.filter(function (value, index) {
        return index != i
      })
    },
    addSize(index) {
      this.product.sizes[index].sizes.push({
        sizeName: 'New Size',
        sizePrice: 0,
        weight: 0,
        customShipping: false,
        shippingOptions: []
      })
    },
    removeSize(idx, i) {
      this.product.sizes[idx].sizes = this.product.sizes[idx].sizes.filter(
        function (value, index) {
          return index != i
        }
      )
    },
    updateOverrideRules(targets) {
      this.product.targets = targets
    },
    computeTargetsKeys(targets) {
      targets.forEach((t) => {
        let gender = 'ANY-1337'
        let size = 'ANY-1337'
        let variation = 'ANY-1337'
        let type = 'ANY-1337'
        let subtype = 'ANY-1337'

        if (t.gender.text) {
          gender = t.gender.text
        } else {
          gender = 'ANY-1337'
        }
        if (t.size != 'Visi') {
          size = t.size
        } else {
          size = 'ANY-1337'
        }
        if (t.variation != 'Visi') {
          variation = t.variation
        } else {
          variation = 'ANY-1337'
        }
        if (t.type.text) {
          type = t.type.text
        } else {
          type = 'ANY-1337'
        }
        if (t.subtype != 'Visi') {
          subtype = t.subtype
        } else {
          subtype = 'ANY-1337'
        }

        let key =
          gender +
          '_//__' +
          size +
          '_//__' +
          variation +
          '_//__' +
          type +
          '_//__' +
          subtype

        t.key = key

        console.log(t.key)
      })
    }
  }
}

</script>

<style lang="scss">
.product-createpage-table {
  .v-data-footer__select {
    visibility: hidden !important;
    z-index: -1000 !important;
  }
}

</style>
