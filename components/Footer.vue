<template>
  <v-row class="mb-n3">
      <v-col class="accent darken-1 pb-8" cols="12" >
          <v-row justify="space-between">
      <v-spacer></v-spacer>
        <v-col  cols="4" style="display: grid">
          <nuxt-link class="accent--text text--lighten-4" to="/payments">Piegade un apmaksa</nuxt-link>
          <nuxt-link class="accent--text text--lighten-4" to="/terms">Noteikumi</nuxt-link>
          <v-divider></v-divider>
          <nuxt-link class="accent--text text--lighten-4" to="/partners">Partneriem</nuxt-link>
          <v-divider></v-divider>
          <nuxt-link class="accent--text text--lighten-4" to="/about">Par mums</nuxt-link>
          <nuxt-link class="accent--text text--lighten-4" to="/contacts">Kontakti</nuxt-link>
        </v-col>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
        <v-col align-self="center" cols="2">
            <a
            target="_blank"
            class="pr-2"
            href="https://www.facebook.com/deviniperkoni"
            ><v-icon size="30">mdi-facebook</v-icon>
            </a>
            <a
            target="_blank"
            class="pr-4"
            href="https://www.instagram.com/deviniperkoni"
            ><v-icon size="30">mdi-instagram</v-icon>
            </a>
        </v-col>
        </v-row>
        <!-- 
            contacts
            terms of service
            shipping and payments

         -->
      </v-col>
      <v-spacer></v-spacer>
  </v-row>
</template>

<script>
export default {

}
</script>

<style>

</style>