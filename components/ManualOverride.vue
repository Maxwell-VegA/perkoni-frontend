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
    sort-by="size"
    class="elevation-4"
  >
    <!-- <template #item.data-table-expand></template> -->
    <template #expanded-item="{ headers, item }">
      <td :colspan="headers.length">More info about {{ item.index }}</td>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Manualie noteikumi:</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn @click="onNewItem()" color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }} // {{ editedItem.gender.text + editedItem.size + editedItem.variation + editedItem.type.text + editedItem.subtype}}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :disabled="compGenders[1].text === 'genderUndefined' || compGenders.length < 3"
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
                      label="Izmers"
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
                      label="Aprekina metode"
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
                  {{ editedItem.overridePriceType }}
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="editedItem.message"
                      label="Zina"
                      :items="compSubtypes"
                      no-resize
                      outlined
                      counter="100"
                    ></v-textarea>
                  </v-col>
<!-- on/off, price: auto/custom, price as: multiplicative, addition, constant, message: none/custom, available: t/f, targeted item count (welcome to for loop hell), price -->
<!-- See if you can get any modified prices displayed in the price table and highlighted (what about types and genders?). -->
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancel </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Save </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.type="{ item }">
      <span v-if="item.type.text"> {{ item.type.text }} </span>
      <span v-else> Visi </span>
    </template>
    <template v-slot:item.overridePriceType="{ item }">
      <span>{{ overridePriceOptions.find(opt => opt.value == item.overridePriceType).text }}</span>
    </template>
    <template v-slot:item.overridePrice="{ item }">
      <!-- <span v-if="item.overridePrice">{{ (item.overridePrice).toFixed(2) }}&#8364;</span> -->
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
      <!-- <v-btn color="primary" @click="initialize"> Reset </v-btn> -->
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
      { text: 'Dzimums',    value: 'gender'     },
      { text: 'Izmers',     value: 'size'       },
      { text: 'Variacija',  value: 'variation'  },
      { text: 'Tips',       value: 'type',      },
      { text: 'Subtips',    value: 'subtype'    },
      { text: 'Aprekina metode', value: 'overridePriceType'},
      { text: 'Cena',       value: 'overridePrice'},
      { text: 'Pieejams',   value: 'available'  },
      { text: 'Aktivs',     value: 'active'     },
      { text: 'Rediget',    value: 'actions'    },
    ],
    targets: [],
    editedIndex: -1,
    editedItem: {
      index: 1,
      gender: "Visi",
      size: "Visi",
      variation: "Visi",
      type: "Visi",
      subtype: "Visi",
      active: true,
      available: true,
      overridePriceType: 'false',
      overridePrice: null,
      message: '',
      key: null
      //   normala, noteikt, pielikt, reizinat,
      //   false, set, add, multiply (multiply what exactly?)
      //   combination price
      //   targetted items
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
      key: null
    },
    overridePriceOptions: [
      {
          text: 'Automatiska',
          value: 'false',
      },
      {
          text: 'Noteikta',
          value: 'set',
      },
      {
          text: 'Saskaitita',
          value: 'add',
      },
      {
          text: 'Reizinata',
          value: 'multiply',
      },
    ],
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    compGenders() {
        let arr = ["Visi"]
        this.sizes.forEach(size => {
            arr.push({
                text: size.gender,
                sizes: size.sizes
            })
        });
        return arr
    },
    compSizes() {
        let arr = ["Visi"]
        if (this.editedItem.gender === "Visi") {
            this.sizes.forEach(gen => {
                gen.sizes.forEach(size => {
                    arr.push(size.sizeName)
                })
            })
        } else if (this.editedItem.gender != '') {
            this.editedItem.gender.sizes.forEach(size => {
                arr.push(size.sizeName)
        })
        }
        return arr
    },
    compTypes() {
        let arr = ["Visi"]
        this.types.forEach(type => {
            arr.push({
                text: type.typeName,
                subtypes: type.typeSecondary,
            })
        })
        return arr
    },
    compSubtypes() {
        let arr = ["Visi"]
        if (this.editedItem.type === "Visi") {
            this.types.forEach(type => {
                type.typeSecondary.forEach(subtype => {
                    arr.push(subtype)
                })
            });
        } else if (this.editedItem.type != 0) {
            this.editedItem.type.subtypes.forEach(subtype => {
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
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    targets() {
        this.$emit('updateRules', this.targets)
    }
  },

  created() {
    this.initialize()
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
    initialize() {
      this.targets = [
        // {
        //   gender: 'Frozen Yogurt',
        //   size: 159,
        //   variation: 6.0,
        //   type: 24,
        //   subtype: 4.0,
        //   active: true,
        //   available: true,
        //   overridePriceType: 'false',
        //   overridePrice: null,
        //   message: '',
        // },
      ]
    },

    onNewItem() {
      this.editedItem = {
      index: this.compIndex,
      gender: this.compGenders[0],
      size: "Visi",
      variation: "Visi",
      type: this.compTypes[0],
      subtype: "Visi",
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

<style>
/* 

What about rules overriding each other?

 */
</style>

