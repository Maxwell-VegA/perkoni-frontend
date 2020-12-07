<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <v-text-field
      v-model="Username"
      label="Username"
      :rules="usernameRules"
      :counter="10"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      label="E-mail"
      :rules="emailRules"
      required
    ></v-text-field>
    <v-checkbox
      v-model="checkbox"
      label="Do you agree?"
      :rules="[(v) => !!v || 'You must agree to continue!']"
      required
    ></v-checkbox>

    <v-btn :disabled="!valid" @click="submit"> submit </v-btn>
  </v-form>
</template>

<script>
import axios from 'axios'

export default {
  data: () => ({
    valid: true,
    username: '',
    usernameRules: [
      (v) => !!v || 'Name is required',
      (v) => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      (v) => !!v || 'E-mail is required',
      (v) =>
        /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/.test(v) ||
        'E-mail must be valid',
    ],
    checkbox: false,
  }),
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
      }
      console.log(1)
    },
  },
}
</script>
