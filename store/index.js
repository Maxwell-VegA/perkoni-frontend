export const state = () => ({
    product: {},
    cart: [],
    // relatedProducts: [],
})

export const mutations = {
    SET_PRODUCT (state, product) {
        state.product = product
    },
    SET_CART (state, cart) {
        state.cart = cart
    },
    // SET_RELATED (state, products) {
    //     state.relatedProducts = products
    // },
}

export const actions = {
    async getProduct({commit}, {productId}) {
        let res = await this.$axios.get(`products/${productId}`)
        let product = res.data.data

        commit('SET_PRODUCT', product)
    },
    async getCart({commit}) {
        let res = await this.$axios.get('cart')
        let cart = res.data

        commit('SET_CART', res)
    },
    // async getRelated({commit}) {
        // function getter(id) {
        //     return new Promise ((resolve) => {
        //         let res = this.$axios.get('products/' + id)
        //         resolve (res.data)
        //     })
        // }

        // async function delayed(arr) {
        //     var newArr = [];
        //     for (const elem of arr) {
        //         const newElem = await getter(elem)
        //         newArr.push(newElem);
        //     }
        //     return newArr
        // }

        // commit('SET_RELATED', delayed(this.state.product.related))
        
        // let arr = []
        
        // this.state.product.related.forEach(id => {
        //     this.$axios('products' + id)
        //     .then(res => arr.push(res))
        // });

        // commit('SET_RELATED', arr)
    // }
} 

export const modules = {

}