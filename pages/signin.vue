<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="email"
      label="E-pasts"
      :rules="emailRules"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Parole"
      required
    ></v-text-field>
    <v-checkbox v-model="remember" label="Remember me"></v-checkbox>

    <v-btn :disabled="!valid" @click="submit"> submit </v-btn>
  </v-form>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    password: '',
    passwordRules: [(v) => !!v || 'Password is required'],
    email: '',
    emailRules: [(v) => !!v || 'E-mail is required'],
    select: null,
    items: ['Item 1', 'Item 2', 'Item 3', 'Item 4'],
    remember: false,
  }),

  methods: {
    //   if (this.$refs.form.validate()) {
    //       password: this.password,
    //       email: this.email,
    //       remember: this.remember
    //   }
  },
}
</script>

<style></style>
