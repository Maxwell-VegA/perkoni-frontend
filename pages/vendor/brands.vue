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
          {{ brand.description }}
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
            hint="Pievieno linku uz razotaja websaiti"
            prepend-inner-icon="mdi-link-variant"
            class="mt-n3"
          ></v-text-field>
          <v-text-field
            v-model="brand.email"
            type="email"
            label="E-pasts"
            hint="E-pasts klientu jautajumiem"
            prepend-inner-icon="mdi-email"
            class="mt-0"
          ></v-text-field>
          <v-text-field
            v-model="brand.facebook"
            type="url"
            label="Facebook"
            prepend-inner-icon="mdi-facebook"
            class="mt-0"
          ></v-text-field>
          <!-- Links must be full (include the https://www. part) so I'll need some validation for that -->
          <v-text-field
            v-model="brand.instagram"
            type="url"
            label="Instagram"
            prepend-inner-icon="mdi-instagram"
            class="mt-0"
          ></v-text-field>
          <v-text-field
            label="Piegade (LV) par brivu no:"
            type="number"
            v-model="brand.freeShipping"
            outlined
            dense
            class="mt-n1"
            prepend-inner-icon="mdi-currency-eur"
          ></v-text-field>
          <!-- Note: if two shipping partners have different free shipping minimums then the heighest one will be used -->
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
            class="mt-n2"
          ></v-select>
          <!-- Note: both brands must list each other as shipping partners -->
          <v-file-input
            v-if="changeLogo || !editing"
            filled
            label="File input"
            placeholder="Razotaja logo"
            prepend-icon=""
            dense
            class="my-n2"
            @change="onImageSelected"
          >
          </v-file-input>
          <v-btn v-else @click="changeLogo = true" width="100%" outlined class="mt-n2 mb-4 py-6">Nomainit logo</v-btn>
          <v-btn v-if="!editing" width="100%" @click="createBrand">Izveidot razotaju</v-btn>
          <div v-else style="display: flex; justify-content: space-between">
          <v-btn class="py-5" width="49%" color="" @click="cancelEditing">Atcelt izmainas</v-btn>
          <v-btn class="py-5" :disabled="changesMade" width="49%" @click="updateBrand">Saglabat izmainas</v-btn>
          </div>
          <!-- A btn to cancel editing and clear data -->
          </form>
        </v-col>
        <v-col
          v-for="(brand, i) in brands"
          :key="brand.id"
          cols="6"
          sm="6"
          md="6"
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
            <v-card-text v-if="brand.freeShipping">
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
  created() {
    this.cancelEditing()
    this.getUserBrands()
  },
  methods: {
    createBrand() {
      const { freeShipping, email, facebook, instagram, description, name, custom_link,shippingPartners } = this.brand
      const fd = new FormData()
      fd.append('image', this.selectedFile)
      // if (this.selectedFile != null) {
      // } else {
      //   fd.append('logo', this.brand.logo)
      // }
      if (shippingPartners) {
        fd.append('shippingPartners', shippingPartners)
      }
      fd.append('name', name)
      fd.append('description', description)
      fd.append('email', email)
      fd.append('facebook', facebook)
      fd.append('instagram', instagram)
      fd.append('custom_link', custom_link)
      if (freeShipping) {
        fd.append('freeShipping', parseFloat(freeShipping))
      }
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
      this.cancelEditing()
      this.brand = this.brands[index]
      this.editing = true
      this.changeLogo = false
      this.selectedFile = null
    },
    cancelEditing() {
      this.brand = {
        id: null,
        logo: '',
        name: '',
        description: '',
        email: null,
        facebook: 'https://www.facebook.com/',
        instagram: 'https://www.instagram.com/',
        custom_link: '',
        freeShipping: null,
        shippingPartners: [],
      },
      this.editing = false
      this.changeLogo = false
      this.selectedFile = null
    },
    updateBrand() {
      const { freeShipping, email, facebook, instagram, description, name, custom_link, shippingPartners } = this.brand
      const fd = new FormData()
      if (this.selectedFile != null) {
        fd.append('image', this.selectedFile)
      }
      if (shippingPartners != null) {
        fd.append('shippingPartners', shippingPartners)
      }
      if(email) {
        fd.append('email', email)
      }
      fd.append('name', name)
      fd.append('description', description)
      fd.append('facebook', facebook)
      fd.append('instagram', instagram)
      if (freeShipping) {
        fd.append('freeShipping', parseFloat(freeShipping))
      }
      fd.append('custom_link', custom_link)
      this.$axios.post(`brand/${this.brand.id}`, fd)
        .then(res => this.cancelEditing())
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
