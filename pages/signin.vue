<template>
  <v-container>
    <h1>Sign in</h1>
    <user-auth-form button-text="Sign in" :submit-form="submit" />
    <v-btn href="http://localhost:8000/api/auth/signin/google">Google</v-btn>
    <v-btn href="http://localhost:8000/api/auth/signin/facebook">
      Facebook
    </v-btn>
  </v-container>
</template>

<script>
import UserAuthForm from '@/components/UserAuthForm'
export default {
  components: { UserAuthForm },
  methods: {
    async submit(logininfo) {
      try {
        await this.$auth.loginWith('local', {
          data: logininfo,
        })
        const local = JSON.parse(localStorage.getItem('cart'))
        if (local) {
          for (const item of Object.values(local)) {
            this.$axios.post('cart', {
              productId: item.product_id,
              title: item.title,
              price: item.price,
              selectedType: item.selected_type,
              selectedSubtype: item.selectedSubtypeIndex,
              selectedSize: item.selected_size,
              quantity: item.quantity,
              key: item.key,
            })
            // I could in php check if product_id, user_id and key of the new addition match any existing entry (set quantity to the higher one if it does), but I could also leave it as is letting it create duplicate entries if the user added an item to cart while logged out though he already had this item in cart while logged in.
          }
          localStorage.setItem('cart', '{}')
        }
      } catch (err) {
        console.log(err, 'failed to authenticate')
        // make these into nice looking snackbar messages
      }
    },
  },
}
</script>
