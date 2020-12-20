<template>
  <div>
    <div>
      <v-row>
        <v-col offset-md="0" cols="6" sm="6" md="6" lg="4" xl="3">
          <form autocomplete="off">
          <v-text-field
            v-model="brand.name"
            outlined
            label="Nosaukums:"
            counter="20"
          ></v-text-field>
          <v-textarea
            v-model="brand.description"
            label="Apraksts:"
            outlined
            dense
            no-resize
            counter="86"
          ></v-textarea>
          <v-text-field
            v-model="brand.custom_link"
            type="url"
            placeholder="https://www.rotapats.lv"
            label="Razotaja websaite"
            hint="Pievieno linku uz razotaja facebook profilu"
            prepend-inner-icon="mdi-link-variant"
            class="mt-n2"
          ></v-text-field>
          <v-text-field
            v-model="brand.facebook"
            type="url"
            label="Facebook"
            hint="Pievieno linku uz razotaja facebook profilu"
            prepend-inner-icon="mdi-facebook"
            class="mt-n1"
          ></v-text-field>
          <!-- Links must be full (include the https://www. part) so I'll need some validation for that -->
          <!-- Perhaps I should force prepend the site links and only allow sublinks to their profiles to be added so as to prevent anything else than facebook and instagram links being placed in there -->
          <v-text-field
            v-model="brand.instagram"
            type="url"
            label="Instagram"
            hint="Pievieno linku uz razotaja instagram profilu"
            prepend-inner-icon="mdi-instagram"
            class="mt-n1"
          ></v-text-field>
          <v-text-field
            label="Piegade (LV) par brivu no:"
            type="number"
            v-model="brand.freeShipping"
            outlined
            dense
            prepend-inner-icon="mdi-currency-eur"
          ></v-text-field>
          <!-- Note: if two shipping partners have different free shipping minimums then the heighest one will be used -->
          <!-- Note: free shipping only applies to Latvia -->
          <v-select
            :items="allBrands"
            :disabled="allBrands.length == 0"
            v-model="brand.shippingPartners"
            prepend-inner-icon="mdi-truck-outline"
            label="Piegades partneri:"
            hint="Citi razotaji ar kuriem kopa iespejams izsutit pasutijumus"
            multiple
            outlined
            dense
          ></v-select>
          <!-- Note: both brands must list each other as shipping partners -->
          <v-file-input
            v-if="changeLogo || !editing"
            filled
            label="File input"
            placeholder="Razotaja logo"
            prepend-icon=""
            dense
            @change="onImageSelected"
          >
          </v-file-input>
          <v-btn v-else @click="changeLogo = true" width="100%" outlined class="mt-n1 mb-6 py-7">Nomainit logo</v-btn>
          <v-btn v-if="!editing" width="100%" @click="createBrand">Izveidot razotaju</v-btn>
          <v-btn class="py-5" v-else :disabled="changesMade" width="100%" @click="updateBrand">Saglabat izmainas</v-btn>
          <!-- A btn to cancel editing and clear data -->
          </form>
        </v-col>
        <v-col
          v-for="(brand, i) in brands"
          :key="brand.id"
          cols="6"
          sm="6"
          md="5"
          lg="4"
          xl="3"
        >
          <v-card height="100%">
            <v-img
              aspect-ratio="1"
              :src="'http://127.0.0.1:8000/storage/logos/' + brand.logo"
            >
            </v-img>
            <v-card-title>
              <span>
                {{ brand.name }}
              </span>
              <v-spacer></v-spacer>
              <v-btn icon @click="edit(i)">
                <v-icon>mdi-pen</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              {{ brand.description }}
            </v-card-text>
            <v-card-text>
              Piegade par brivu no {{ brand.freeShipping }} &#8364;
            </v-card-text>
            <v-card-text>
            <v-select
              :items="brand.shippingPartnersByName"
              multiple
              chips
              small-chips
              readonly
              label="Piegades partneri:"
            ></v-select>
            </v-card-text>
            <v-card-subtitle>
              <a :href="brand.facebook">
                <v-icon v-if="brand.facebook">mdi-facebook</v-icon>
              </a>
              <a :href="brand.instagram">
                <v-icon v-if="brand.instagram">mdi-instagram</v-icon>
              </a>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </div>
    {{ brand.id }}
    {{ brand.name }}
    {{ brand.shippingPartners }}
  </div>
</template>

<script>
export default {
  middleware: 'auth-vendor',
  // works
  data() {
    return {
      editing: false,
      changeLogo: false,
      selectedFile: null,
      brand: {
        id: null,
        logo: '',
        name: '',
        description: '',
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        custom_link: '',
        freeShipping: null,
        shippingPartners: [],
      },
      brands: [],
    }
  },
  computed: {
    allBrands() {
      let arr = []
      this.brands.forEach( brand => {
        arr.push({
          text: brand.name,
          value: brand.id,
        })
      })
      return arr
    },
    changesMade() {
      return false
    },
  },
  mounted() {
    this.getUserBrands()
  },
  methods: {
    createBrand() {
      const fd = new FormData()
      fd.append('image', this.selectedFile)
      // if (this.selectedFile != null) {
      // } else {
      //   fd.append('logo', this.brand.logo)
      // }
      if (this.brand.shippingPartners) {
        fd.append('shippingPartners', this.brand.shippingPartners)
      }
      fd.append('name', this.brand.name)
      fd.append('description', this.brand.description)
      fd.append('facebook', this.brand.facebook)
      fd.append('instagram', this.brand.instagram)
      if (this.brand.freeShipping) {
        fd.append('freeShipping', parseFloat(this.brand.freeShipping))
      }
      fd.append('custom_link', this.brand.custom_link)
      this.$axios.post('brand', fd)
        .catch(err => console.log(err.response.data))
      this.getUserBrands()
    },
    onImageSelected(event) {
      this.selectedFile = event
    },
    getUserBrands() {
      this.$axios
        .get('brand')
        .then((res) => (this.brands = res.data))
    },
    edit(index) {
      this.brand = this.brands[index]
      this.editing = true
      this.changeLogo = false
      this.selectedFile = null
    },
    updateBrand() {
      const fd = new FormData()
      if (this.selectedFile != null) {
        fd.append('image', this.selectedFile)
      }
      if (this.brand.shippingPartners != null) {
        fd.append('shippingPartners', this.brand.shippingPartners)
      }
      fd.append('name', this.brand.name)
      fd.append('description', this.brand.description)
      fd.append('facebook', this.brand.facebook)
      fd.append('instagram', this.brand.instagram)
      if (this.brand.freeShipping) {
        fd.append('freeShipping', parseFloat(this.brand.freeShipping))
      }
      fd.append('custom_link', this.brand.custom_link)
      this.$axios.post(`brand/${this.brand.id}`, fd)
        .catch(err => console.log(err.response.data))
      this.getUserBrands()
    }
  },
}
</script>

<style>
/* 

hint: to change logo upload a new image otherwise the logo will remain unchanged

Place rules on the input fields as well as limit the characters

Warning: deleting a brand will also delete all products listed under this brand *list out the products* else *this brand has no products* / or maybe allow deleting only when a brand has no products 

 */
</style>
