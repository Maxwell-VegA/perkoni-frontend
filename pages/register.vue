<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="4">
        <h1>Register</h1>

        <v-text-field
          v-model="userInfo.username"
          :rules="[
            required('username'),
            minLength('username', 3),
            maxLength('username', 20),
          ]"
          validate-on-blur
          label="Username"
        ></v-text-field>

        <v-text-field
          v-model="userInfo.email"
          label="Email"
          :rules="[required('email'), emailFormat()]"
          validate-on-blur
        />

        <v-text-field
          v-model="userInfo.password"
          label="Password"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          counter="true"
          :rules="[required('password'), minLength('password', 7)]"
          validate-on-blur
          @click:append="showPassword = !showPassword"
          @keyup.enter="submit(userInfo)"
        />

        <!-- <v-btn :disabled="!valid" @click="submitForm(userInfo)"> Register </v-btn> -->
        <v-btn @click="submit(userInfo)"> Register </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import validations from '@/utils/validations'
export default {
  data() {
    return {
      valid: false,
      showPassword: false,
      confirmPassword: '',
      userInfo: {
        password: '',
        username: '',
        email: '',
      },
      ...validations,
    }
  },
  methods: {
    async submit(registrationInfo) {
      this.$axios
        .post('auth/register', registrationInfo)
        .catch((err) => console.log(err.message))

      await this.$auth.loginWith('local', {
        data: registrationInfo,
      })

      const local = JSON.parse(localStorage.getItem('cart'))
      if (local) {
        for (const item of Object.values(local)) {
          this.$axios
            .post('cart', {
              productId: item.product_id,
              title: item.title,
              price: item.price,
              selectedType: item.selected_type,
              selectedSubtype: item.selectedSubtypeIndex,
              selectedSize: item.selected_size,
              quantity: item.quantity,
              key: item.key,
            })
            .catch((err) => console.log(err.response.data))
        }
        localStorage.setItem('cart', '{}')
      }
    },
  },
}
</script>