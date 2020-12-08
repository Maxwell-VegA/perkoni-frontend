<template>
  <div>
    <div>
      <v-row>
        <v-col v-for="(brand, i) in brands" :key="brand.id" cols="3">
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
              <v-icon @click="edit(i)">mdi-pen</v-icon>
            </v-card-title>
            <v-card-text>
              {{ brand.description }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <div>
      <v-text-field
        v-model="brand.name"
        outlined
        label="Nosaukums:"
      ></v-text-field>
      <v-textarea
        v-model="brand.description"
        label="Apraksts:"
        outlined
      ></v-textarea>
      <v-file-input
        filled
        label="File input"
        placeholder="Logo"
        prepend-icon=""
        @change="onImageSelected"
      >
      </v-file-input>
      <v-btn @click="createBrand">Create brand</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'vendor',
  data() {
    return {
      selectedFile: null,
      brand: {
        id: null,
        logo: '',
        name: '',
        description: '',
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

 */
</style>
