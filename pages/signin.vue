<template>
  <v-container>
    <h1>Sign in</h1>
    <user-auth-form button-text="Sign in" :submit-form="submit" />
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
        console.log('success ' + this.$auth.user.username)
        // make these into nice looking snackbar messages
      } catch (error) {
        console.log('failed to authenticate')
        // make these into nice looking snackbar messages
      }
    },
  },
}
</script>
