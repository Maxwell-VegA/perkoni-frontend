<template>
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          label="Vards:"
          id="id"
          v-model="compName"
        ></v-text-field>
      </v-col>
        {{ name }}
      <v-col cols="12">
        <v-text-field
          label="E-pasts:"
          v-model="compMail"
        ></v-text-field>
      </v-col>
      <v-col class="" cols="12">
        <v-textarea
          outlined
          label="Zina:"
          v-model="message"
        ></v-textarea>
      </v-col>
      <v-col class="mt-n2 d-flex justify-end" cols="12">
        <v-btn class="accent" >Sutit</v-btn>
      </v-col>
      <!-- {{ to }} -->
    </v-row>
</template>

<script>
export default {
    props: {
        to: String || Number
    },
    data() {
      return {
        name: '',
        email: '',
        message: '',
      }
    },
    computed: {
      compName: {
        get() {
          if (this.$auth.loggedIn) {
            return this.$auth.user.username
          }
          return this.name
        },
        set(val) {
          this.name =  val
        }
      },
      compMail: {
        get() {
          if (this.$auth.loggedIn) {
            return this.$auth.user.email
          }
          return this.email
        },
        set(val) {
          this.email =  val
        }
      }
    }
}
</script>

<style>

</style>