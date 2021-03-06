export const state = () => ({
    currentPage: 1,
    currentCategory: 0,
    currentSubcategory: undefined,
    currentGender: null,
    product: {},
    cart: [],
    qtyOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30],
    categories: [
        {
          text: 'Jaunumi',
          value: 0,
          subcategories: [],
          genders: [
            'Bezdzimuma',
            'Unisex',
            'Vīriešiem',
            'Sievietēm',
            'Bērniem',
          ],
          products: [],
          pages: 0,
        },
        {
          text: 'Akcijas',
          value: 1,
          subcategories: [],
          genders: [
            'Bezdzimuma',
            'Unisex',
            'Vīriešiem',
            'Sievietēm',
            'Bērniem',
          ],
          products: [],
          pages: 0,
        },
        {
          text: 'Apģērbi',
          value: 2,
          subcategories: [
            'Krekli',
            'Džemperi',
            'Jakas',
            'Kleitas',
            'Cepures',
            'Šalles',
            'Bez apdrukas',
          ],
          genders: ['Unisex', 'Vīriešiem', 'Sievietēm', 'Bērniem'],
          products: [],
          loadedSubcategories: [],
          pages: 0,
        },
        {
          text: 'Termouzlīmes',
          value: 3,
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Teksti',
            'Citas',
          ],
          genders: [],
          products: [],
          loadedSubcategories: [],
          pages: 0,
        },
        {
          text: 'Uzlīmes',
          value: 4,
          subcategories: [
            'Spēka zīmes',
            'Rakstu joslas',
            'Latvija / Rīga / latvietis',
            'Citas',
          ],
          genders: [],
          products: [],
          loadedSubcategories: [],
          pages: 0,
        },
        {
          text: 'Tetovējumi',
          value: 5,
          subcategories: [],
          genders: [],
          products: [],
          pages: 0,
        },
        {
          text: 'Citi',
          value: 6,
          subcategories: ['Rotas', 'Somas', 'Lietussargi'],
          genders: [],
          products: [],
          loadedSubcategories: [],
          pages: 0,
        },
    ],
    shippingOptions: [
        {
          locale: 'Latvija',
          options: [
            {
              text: 'Sanemt ofisa',
              price: 0,
              weight: 1000000,
              value: 0,
            },
            {
              text: 'Vestule',
              price: 1.5,
              weight: 100,
              value: 1,
            },
            {
              text: 'Izsekojama vestule',
              price: 2.5,
              weight: 100,
              value: 2,
            },
            {
              text: 'Pasta pacina',
              price: 4.0,
              weight: 3000,
              value: 3,
            },
            {
              text: 'Pakomats',
              price: 2.5,
              weight: 30000,
              value: 4,
            },
          ],
        },
        {
          locale: 'Baltija',
          options: [
            {
              text: 'Pakomats (Baltija)',
              price: 5,
              weight: 30000,
              value: 5,
            },
          ],
        },
    ],
})

export const mutations = {
  SET_PRODUCTS (state, products) {
      state.categories[state.currentCategory].products = products.data
      state.categories[state.currentCategory].pages = products.meta.last_page
      
      // if (state.categories[state.currentCategory].loadedSubcategories[0] == undefined) {
      //     state.categories[state.currentCategory].subcategories.forEach(
      //         (subcategory) => {
      //             state.categories[state.currentCategory].loadedSubcategories.push([null])
      //     });
      // }

      // if (state.currentSubcategory !== undefined && 
      //     state.categories[state.currentCategory].loadedSubcategories[state.currentSubcategory] == [null]
      // ) {
      //     state.categories[state.currentCategory].loadedSubcategories[state.currentSubcategory] = "Hey"
      // }
  },
  SET_PRODUCT (state, product) {
    state.product = {}
    state.product = product
    
      // state.product.related.forEach(id => {
      // async () => {
      //   await actions.getRelated({productId: 10})
      // }
      // });
  },
  SET_CART (state, cart) {
      state.cart = cart
  },
  UPDATE_PAGE(state, data) {
      state.currentPage = data
  },
  UPDATE_CATEGORY(state, data) {
      state.currentCategory = data
  },
  UPDATE_SUBCATEGORY(state, data) {
      state.currentSubcategory = data
  },
  UPDATE_GENDER(state, data) {
      state.currentGender = data
  },
  // SET_RELATED (state, products) {
  //     state.relatedProducts = products
  // },
  // SET_CHAT_STATUS(state, status) {
  //     state.chatStatus = status.chat_status
  // }
}

export const actions = {
  async getProducts({commit}) {    
      let requestName = {
          params: {
              page: this.state.currentPage,
              category: this.state.categories[this.state.currentCategory].text,
              subcategory: this.state.categories[this.state.currentCategory].subcategories[this.state.currentSubcategory],
              gender: this.state.categories[this.state.currentCategory].genders[this.state.currentGender],
          }
      }
      
      // if (this.state.categories[1].products[0] == undefined) {
      //     let akcijas = await this.$axios('products', {params: {category: 'Akcijas'}})
      //     commit('SET_PRODUCTS', akcijas.data)
      // }  
      
      let res = await this.$axios('products', requestName)
      let products = res.data

      commit('SET_PRODUCTS', products)
  },
  async getProduct({commit}, {productId}) {
    // let {data} = await getData(this.$axios, `products/${productId}`)
    let res
    try {
      res = await this.$axios(`products/${productId}`)
    } catch (err) {
      console.log(err.response.data)
      // router push?
    }
    commit('SET_PRODUCT', res.data.data)
  },
  async getCart({commit}) {
      // let {data} = await getData(this.$axios, `cart`)
    if (this.$auth.loggedIn) {
      let res = await this.$axios(`cart`)
      commit('SET_CART', res.data)
    }
  },
  async updateCartQuantity({ commit }, { cartItemId, quantity }) {
    this.$axios
      .patch(`cart/${cartItemId}`, { quantity: quantity })
      .then((res) => {
        this.dispatch('getCart')
        console.log(res)
      })
      .catch((err) => console.log(err.response.data))

  },
  // async checkChat({ commit }) {
  //   await this.$fire.firestore
  //     .collection(`chat`)
  //     .doc('room')
  //     .get()
  //     .then(doc => {
  //       commit('SET_CHAT_STATUS', doc.data())
  //     })
  // }
  // updateCart({ request }) {
  //   if (this.$auth.loggedIn) {
  //     this.$axios[request.method](`cart/${requestUrl}`, { data: request.data })
  //   }
  // }


}

export const getters = {
    
}

export const modules = {

}

// const getData = async function(axios, url) {
//     let res = await axios(url)
//     return {
//         data: res.data
//     }
// }