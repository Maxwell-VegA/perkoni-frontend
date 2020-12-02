<template>
  <div class="grid-foundation">
    <section class="toggle-box">
      <!-- ======================================================== -->
      <!-- Product basic properties -->
      <label for="product">Produkta nosaukums:</label>
      <input id="title" v-model="product.title" type="text" name="title" />
      <b v-if="errors.title">{{ errors.title }}</b>
      <label for="mainCategory">Produkta kategorija:</label>
      <select id="category" v-model="product.mainCategory" name="category">
        <option
          v-for="(category, index) in Object.keys(categories)"
          :key="index"
        >
          {{ category }}
        </option>
      </select>
      <label for="subcategories">Subkategorija:</label>
      <select
        id="subcategories"
        v-model="product.subcategory"
        name="subcategories"
      >
        <option
          v-for="(sub, index) in categories[product.mainCategory]"
          :key="index"
        >
          {{ sub }}
        </option>
      </select>
      <label for="description">Apraksts:</label>
      <textarea
        id="description"
        v-model="product.description"
        name="description"
      ></textarea>
    </section>
    <section>
      <!-- ======================================================== -->
      <!-- Product types properties-->
      <label>Produkta tipi:</label>
      <button @click="addType">Pievienot tipu (materiālu)</button>
      <div v-for="(type, index) in product.types" :key="index">
        <label>Tipa:</label>
        <input v-model="type.typeName" type="text" />
        <label>Cena:</label>
        <input v-model="type.typePrice" type="number" />
        <label>Variācijas</label>
        <input
          v-model="type.typeSecondary"
          type="text"
          @keyup="type.typeSecondary = type.typeSecondary.split(',')"
        />
        <i class="delete">&times</i>
      </div>
      <br />
      <br />
      <br />
      <br />
    </section>

    <section class="toggle-box">
      <!-- ======================================================== -->
      <!-- Product pricing properties -->
      <label for="price">Base price:</label>
      <input
        id="price"
        v-model="product.base_price"
        type="number"
        name="price"
      />
      <label for="sale-price">Atlaides cena:</label>
      <input
        id="sale-price"
        v-model="product.sale_price"
        type="number"
        name="sale-price"
      />
      <label>On sale:</label>
      <input
        id="switch2"
        v-model="product.on_sale"
        type="checkbox"
        class="switch-i"
      /><label id="switch2" for="switch2" class="switch">Toggle</label>
      <label>Calculation mode:</label>
      <input
        id="switch3"
        v-model="product.operator"
        type="checkbox"
        class="switch-i"
      /><label id="switch3" for="switch3" class="switch">Toggle</label>
      <table>
        <tr>
          <th v-if="product.operator">addition</th>
          <th v-else>multiplication</th>
          <th v-for="(size, i) in product.sizes" :key="i">{{ size.size }}</th>
        </tr>
        <th>
          <tr v-for="(type, i) in product.types" :key="i">
            {{
              type.typeName
            }}
          </tr>
        </th>
        <th v-for="(size, i) in product.sizes" :key="i">
          <div v-if="product.operator">
            <tr v-for="(type, i) in product.types" :key="i">
              {{
                (
                  parseFloat(product.base_price) +
                  parseFloat(type.typePrice) +
                  parseFloat(size.sizePrice)
                ).toFixed(2)
              }}
            </tr>
          </div>
          <div v-else>
            <tr v-for="(type, i) in product.types" :key="i">
              {{
                (
                  parseFloat(product.base_price) +
                  parseFloat(type.typePrice) * parseFloat(size.sizePrice)
                ).toFixed(2)
              }}
            </tr>
            <!-- perhaps I shouldn't be doing all this inline? -->
          </div>
        </th>
      </table>
      <!-- Factor in sale prices -->
      <!-- Will need to make this whole thing work with floats not just ints -->
      <!-- prices, sale prices, sale y/n, sale-from/to -->
    </section>

    <section>
      <!-- ======================================================== -->
      <!-- Product sizes properties -->
      <label>Produkta izmēri:</label>
      <button @click="addSize">Pievienot izmēru</button>
      <i
        v-if="product.mainCategory === 'Drēbes'"
        class="btn-sec"
        @click="addSizeClothing"
        >Standarta izmēri</i
      >
      <div v-for="(size, index) in product.sizes" :key="index">
        <label>Izmērs:</label>
        <input v-model="size.size" type="text" />
        <label>Cena</label>
        <input v-model="size.sizePrice" type="number" />
        <i class="delete">&times</i>
      </div>
    </section>

    <section class="toggle-box">
      <!-- ======================================================== -->
      <!-- Product filter properties -->
      <label for="taggs">Taggs:</label>
      <input
        id="taggs"
        v-model="taggsInput"
        type="text"
        name="taggs"
        placeholder="atdali't ar komatu"
      />
      <p>{{ taggs }}</p>
      <div v-if="product.mainCategory === 'Drēbes'">
        <label for="gender">Dzimums:</label>
        <select id="gender" v-model="product.gender">
          <option value="unisex">Unisex</option>
          <option value="kids">Kids</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
      </div>
      <label>Atzīmēt kā jaunumu:</label>
      <input id="switch1" v-model="product.new" type="checkbox" /><label
        id="switch1"
        for="switch1"
        class="switch"
        >Toggle</label
      >
      <input type="file" @change="onFileSelected" />
    </section>
    <!-- still need to add a section for images and image descriptions -->
    <section>
      <!-- <button @click="directPublish">Direct Publish</button> -->
      <textarea id="" v-model="jsonInput" name="" cols="1" rows="1"></textarea>
      <button @click="input">Input</button>

      <button @click="directPublish">Publish product</button>
      <button @click="uploadImages">Upload images</button>
      {{ product }}
      {{ errors }}
      {{ selectedFile.name }}
      <!-- {{ selectedFile.title }} -->
    </section>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      errors: {},
      jsonInput: '',
      mPrice: '',
      clean: [],
      taggsInput: '',
      selectedFile: 'hey',
      product: {
        user_id: 1,
        title: '',
        mainCategory: '',
        subcategory: '',
        description: '',
        new: false,
        base_price: '',
        sale_price: '',
        // figure out how to pass these as ints instead of strs
        on_sale: false,
        types: [],
        operator: 'addition',
        // something weird with operator starting value
        sizes: [],
        // taggs: [],
        gender: 'genderless',
        // likely if the gender is set with the product as clothing then the category changed to something else it doesn't reset to genderless
      },
      categories: {
        Apgerbi: [
          'Krekli',
          'Džemperi',
          'Jakas',
          'Kleitas',
          'Cepures',
          'Šalles',
          'Bez apdrukas',
        ],
        Uzlīmes: ['Auto', 'Lieldienu', '', '', '', ''],
        Termouzlīmes: [],
        Tetovējumi: [],
      },
    }
  },
  computed: {
    taggs() {
      let arr = []
      arr = this.taggsInput.split(',')
      return arr
    },
    productStringified() {
      return JSON.stringify(this.product)
    },
  },
  methods: {
    input() {
      this.product = JSON.parse(this.jsonInput)
    },
    onFileSelected(event) {
      this.selectedFile = event.target.files[0]
      console.log(this.selectedFile)
    },
    // directPublish() {
    //   const fd = new FormData()
    //   for (const atribute in this.product) {
    //     if (atribute === 'types' || atribute === 'sizes') {
    //       fd.append(atribute, JSON.stringify(this.product[atribute]))
    //     } else {
    //       fd.append(atribute, this.product[atribute])
    //     }
    //   }
    //   // fd.append('image', this.selectedFile, this.selectedFile.name)
    //   fd.append('image', this.selectedFile.name)
    //   axios
    //     .post('http://127.0.0.1:8000/api/products', fd)
    //     .then((res) => console.log(res))
    //     .catch((err) => (this.errors = err.response.data.errors))
    // },
    directPublish() {
      axios
        .post('http://127.0.0.1:8000/api/products', {
          user_id: this.product.user_id,
          title: this.product.title,
          mainCategory: this.product.mainCategory,
          subcategory: this.product.subcategory,
          description: this.product.description,
          is_new: this.product.new,
          base_price: this.product.base_price,
          sale_price: this.product.sale_price,
          on_sale: this.product.on_sale,
          types: this.product.types,
          operator: this.product.operator,
          sizes: this.product.sizes,
          taggs: this.taggs,
          gender: this.product.gender,
        })
        .then((res) => console.log(res))
        .catch((err) => (this.errors = err.response.data.errors))
    },
    addType() {
      const newType = {
        typeName: '',
        typePrice: 0,
        typeSecondary: [],
      }
      this.product.types.push(newType)
    },
    addSize() {
      const newSize = {
        size: '',
        sizePrice: 0,
      }
      this.product.sizes.push(newSize)
    },
    addSizeClothing() {
      const newSizeS = {
        size: 'S',
        sizePrice: 1,
      }
      const newSizeM = {
        size: 'M',
        sizePrice: 1,
      }
      const newSizeL = {
        size: 'L',
        sizePrice: 3,
      }
      const newSizeXL = {
        size: 'XL',
        sizePrice: 3,
      }
      this.product.sizes.push(newSizeS, newSizeM, newSizeL, newSizeXL)
    },
  },
}
</script>

<style lang="sass" scoped>
*
    color: white

.grid-foundation
    display: grid
    grid-template-columns: 1fr 1.5fr
    grid-gap: 1rem
    margin: 3rem
    section
        display: flex
        flex-direction: column
        // background: lightgray

button
    padding: .25rem 1rem
    background: #c0c0c0
    border-radius: 8px

.btn-sec, .delete
    display: inline-block
    font-style: normal
    padding: .25rem .6rem
    margin: 0 1rem
    background: lightblue
    border-radius: 8px
    cursor: pointer

.delete
    font-weight: 900
    padding: 0rem .3rem
    background: red
    border-radius: 0%


// make each section into a window (if the contents go over then resort to scrolling instead of expanding the section)
// add a checkbox which determines weather prices are increased by adding or my multiplying (for clothes by adding since a larger size of clothing item will not increase expenses on material but for stickers by multiplying since a larger size of a more expensive type will result in higher expenses)
</style>
