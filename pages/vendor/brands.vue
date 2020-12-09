<template>
  <div>
    <div>
      <v-row>
        <v-col
          v-for="(brand, i) in brands"
          :key="brand.id"
          cols="6"
          sm="4"
          md="4"
          lg="3"
          xl="2"
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
        <v-col cols="6" sm="4" md="4" lg="3" xl="2">
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
            hint="Pievieno linku uz razotaja facebook profilu (nav obligati)"
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
            hint="Pievieno linku uz razotaja instagram profilu (nav obligati)"
            prepend-inner-icon="mdi-instagram"
          ></v-text-field>
          <v-file-input
            filled
            label="File input"
            placeholder="Razotaja logo"
            prepend-icon=""
            dense
            @change="onImageSelected"
          >
          </v-file-input>
          <v-btn width="100%" @click="createBrand">Create brand</v-btn>
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
      },
      brands: [],
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
