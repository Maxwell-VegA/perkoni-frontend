<template>
  <!-- <v-row> -->
  <v-data-table
    :headers="headers"
    :items="targets"
    :expanded.sync="expanded"
    item-key="index"
    show-expand
    single-expand
    :items-per-page="5"
    sort-by="index"
    class="elevation-4"
  >
    <template #expanded-item="{ headers, item }">
      <td :colspan="headers.length">{{ item.message }}</td>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manuālie noteikumi:</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              @click="onNewItem()"
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              Jauns noteikums
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="
                        compGenders[1].text === 'genderUndefined' ||
                        compGenders.length < 3
                      "
                      v-model="editedItem.gender"
                      label="Dzimums"
                      :items="compGenders"
                      return-object
                      @change="editedItem.size = compSizes[0]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="compSizes.length < 3"
                      v-model="editedItem.size"
                      label="Izmērs"
                      :items="compSizes"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="variations.length < 2"
                      v-model="editedItem.variation"
                      :label="varName"
                      :items="['Visi', ...variations]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="compTypes.length < 3"
                      v-model="editedItem.type"
                      :label="typesName"
                      :items="compTypes"
                      return-object
                      @change="editedItem.subtype = compSubtypes[0]"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="compSubtypes.length < 3"
                      v-model="editedItem.subtype"
                      :label="subtypesName"
                      :items="compSubtypes"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-checkbox
                      v-model="editedItem.available"
                      label="Ir pieejams"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-select
                      v-model="editedItem.overridePriceType"
                      label="Aprēķina metode"
                      :items="overridePriceOptions"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field
                      :disabled="editedItem.overridePriceType === 'false'"
                      :required="editedItem.overridePriceType !== 'false'"
                      v-model="editedItem.overridePrice"
                      validate-on-blur
                      label="Cena"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.message"
                      label="Ziņa"
                      :items="compSubtypes"
                      no-resize
                      outlined
                      counter="144"
                    ></v-textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Atcelt </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Saglabāt </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.gender="{ item }">
      <span v-if="item.gender.text"> {{ item.gender.text }} </span>
      <span v-else> Visi </span>
    </template>
    <template v-slot:item.type="{ item }">
      <span v-if="item.type.text"> {{ item.type.text }} </span>
      <span v-else> Visi </span>
    </template>
    <template v-slot:item.overridePriceType="{ item }">
      <span>{{
        overridePriceOptions.find((opt) => opt.value == item.overridePriceType)
          .text
      }}</span>
    </template>
    <template v-slot:item.overridePrice="{ item }">
      <span v-if="item.overridePrice">{{ compPrice(item) }}&#8364;</span>
    </template>
    <template v-slot:item.available="{ item }">
      <v-checkbox v-model="item.available"></v-checkbox>
    </template>
    <template v-slot:item.active="{ item }">
      <v-checkbox v-model="item.active"></v-checkbox>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <span>Nav izveidoti noteikumi</span>
    </template>
  </v-data-table>
  <!-- </v-row> -->
</template>

<script>
export default {
  props: {
    sizes: Array,
    variations: Array,
    types: Array,
    varName: String,
    typesName: String,
    subtypesName: String,
  },
  data: () => ({
    expanded: [],
    dialog: false,
    headers: [
      { text: 'Dzimums', value: 'gender' },
      { text: 'Izmērs', value: 'size' },
      { text: 'Variācija', value: 'variation' },
      { text: 'Tips', value: 'type' },
      { text: 'Subtips', value: 'subtype' },
      { text: 'Aprēķina metode', value: 'overridePriceType' },
      { text: 'Cena', value: 'overridePrice' },
      { text: 'Pieejams', value: 'available' },
      { text: 'Aktīvs', value: 'active' },
      { text: 'Rediģēt', value: 'actions', sortable: false },
    ],
    targets: [],
    editedIndex: -1,
    editedItem: {
      index: 1,
      gender: 'Visi',
      size: 'Visi',
      variation: 'Visi',
      type: 'Visi',
      subtype: 'Visi',
      active: true,
      available: true,
      overridePriceType: 'false',
      overridePrice: null,
      message: '',
      key: null,
    },
    defaultItem: {
      index: 1,
      gender: '',
      size: 0,
      variation: 0,
      type: 0,
      subtype: 505,
      active: true,
      available: true,
      overridePriceType: 'false',
      overridePrice: null,
      message: '',
      key: null,
    },
    overridePriceOptions: [
      {
        text: 'Automātiska',
        value: 'false',
      },
      {
        text: 'Noteikta',
        value: 'set',
      },
      {
        text: 'Saskaītita',
        value: 'add',
      },
      {
        text: 'Reizināta',
        value: 'multiply',
      },
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    compGenders() {
      let arr = ['Visi']
      this.sizes.forEach((size) => {
        arr.push({
          text: size.gender,
          sizes: size.sizes,
        })
      })
      return arr
    },
    compSizes() {
      let arr = ['Visi']
      if (this.editedItem.gender === 'Visi') {
        this.sizes.forEach((gen) => {
          gen.sizes.forEach((size) => {
            arr.push(size.sizeName)
          })
        })
      } else if (this.editedItem.gender != '') {
        this.editedItem.gender.sizes.forEach((size) => {
          arr.push(size.sizeName)
        })
      }
      return arr
    },
    compTypes() {
      let arr = ['Visi']
      this.types.forEach((type) => {
        arr.push({
          text: type.typeName,
          subtypes: type.typeSecondary,
        })
      })
      return arr
    },
    compSubtypes() {
      let arr = ['Visi']
      if (this.editedItem.type === 'Visi') {
        this.types.forEach((type) => {
          type.typeSecondary.forEach((subtype) => {
            arr.push(subtype)
          })
        })
      } else if (this.editedItem.type != 0) {
        this.editedItem.type.subtypes.forEach((subtype) => {
          arr.push(subtype)
        })
      }
      return arr
    },
    compIndex() {
      let lastIndex = 0
      if (this.targets[this.targets.length - 1] != undefined) {
        lastIndex = this.targets[this.targets.length - 1].index
      }
      return 1 + lastIndex
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    targets() {
      this.$emit('updateRules', this.targets)
    },
  },
  methods: {
    compPrice(item) {
      let orpt = item.overridePriceType
      let returnThis
      if (orpt === 'false') {
        returnThis = ''
      } else if (orpt === 'set') {
        returnThis = item.overridePrice
      } else if (orpt === 'add') {
        returnThis = `+${item.overridePrice}`
      } else if (orpt === 'multiply') {
        returnThis = `*${item.overridePrice}`
      } else {
        returnThis = 'ELSE'
      }
      return returnThis
    },
    onNewItem() {
      this.editedItem = {
        index: this.compIndex,
        gender: this.compGenders[0],
        size: 'Visi',
        variation: 'Visi',
        type: this.compTypes[0],
        subtype: 'Visi',
        active: true,
        available: true,
        overridePriceType: 'false',
        overridePrice: null,
        message: '',
        key: null,
      }
    },

    editItem(item) {
      this.editedIndex = this.targets.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.targets.indexOf(item)
      confirm('Are you sure you want to delete this item?') &&
        this.targets.splice(index, 1)
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.targets[this.editedIndex], this.editedItem)
      } else {
        this.targets.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>