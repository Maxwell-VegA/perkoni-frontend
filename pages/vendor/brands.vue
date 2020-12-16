<template>
  <div>
    <div>
      <v-row>
        <v-col offset-md="0" cols="6" sm="6" md="6" lg="4" xl="3">
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
            v-model="brand.facebook"
            outlined
            dense
            placeholder="https://www.facebook.com/deviniperkoni"
            label="Facebook"
            hint="Pievieno linku uz razotaja facebook profilu"
            prepend-inner-icon="mdi-facebook"
          ></v-text-field>
          <!-- Links must be full (include the https://www. part) so I'll need some validation for that -->
          <!-- Perhaps I should force prepend the site links and only allow sublinks to their profiles to be added so as to prevent anything else than facebook and instagram links being placed in there -->
          <v-text-field
            v-model="brand.instagram"
            aria-autocomplete="off"
            outlined
            dense
            placeholder="https://www.instagram.com/deviniperkoni"
            label="Instagram"
            hint="Pievieno linku uz razotaja instagram profilu"
            prepend-inner-icon="mdi-instagram"
          ></v-text-field>
          <v-text-field
            label="Piegade (LV) par brivu no:"
            type="number"
            v-model="brand.freeShipping"
            outlined
            prepend-inner-icon="mdi-currency-eur"
          ></v-text-field>
          <!-- Note: if two shipping partners have different free shipping minimums then the heighest one will be used -->
          <!-- Note: free shipping only applies to Latvia -->
          <v-select
            :items="allBrands"
            v-model="shippingPartners"
            prepend-inner-icon="mdi-truck-outline"
            label="Piegades partneri:"
            hint="Citi razotaji ar kuriem kopa iespejams izsutit pasutijumus"
            multiple
            outlined
          ></v-select>
          <!-- Note: both brands must list each other as shipping partners -->
          <v-file-input
            filled
            label="File input"
            placeholder="Razotaja logo"
            prepend-icon=""
            dense
            @change="onImageSelected"
          >
          </v-file-input>
          <v-btn width="100%" @click="createBrand">Izveidot razotaju</v-btn>
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
  </div>
</template>

<script>
export default {
  // middleware: 'auth-vendor',
  data() {
    return {
      selectedFile: null,
      brand: {
        id: null,
        logo: '',
        name: '',
        description: '',
        facebook: '',
        instagram: '',
        freeShipping: null,
      },
        shippingPartners: [],
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
    }
  },
  mounted() {
    this.getUserBrands()
  },
  methods: {
    createBrand() {
      const fd = new FormData()
      if (this.brand.id != null) {
        fd.append('id', this.brand.id)
      }
      if (this.selectedFile != null) {
        fd.append('image', this.selectedFile)
      } else {
        fd.append('logo', this.brand.logo)
      }
      fd.append('user_id', this.$auth.user.id)
      fd.append('name', this.brand.name)
      fd.append('description', this.brand.description)
      fd.append('facebook', this.brand.facebook)
      fd.append('instagram', this.brand.instagram)
      fd.append('freeShipping', parseFloat(this.brand.freeShipping))
      fd.append('shippingPartners', this.brand.shippingPartners)
      this.$axios.post('brand', fd).catch((err) => console.log(err))
      this.getUserBrands()
    },
    onImageSelected(event) {
      this.selectedFile = event
    },
    getUserBrands() {
      this.$axios
        .get('brand', {
          headers: { Authorization: this.$auth.getToken('local') },
        })
        .then((res) => (this.brands = res.data))
    },
    edit(index) {
      this.brand = this.brands[index]
    },
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
