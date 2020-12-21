<template>
<v-row>
  <v-col md="6">
    <ps-contact-form to="asd@asd.com" />
  </v-col>
  <v-col md="6">
    <p> Biedrība Deviņi pērkoni </p>
    <p> Reģ. nr: 40008256199 </p>
    <p> Konts ziedojumiem: LV50UNLA0050024418634 </p>
    <p> AS SEB banka </p>
    <p> UNLALV2X </p>
    <br />
    <p> E-pasts: veikals@9perkoni.lv </p>
    <p> GSM: +371 2979 2529 / Telegram, WhatsApp </p>
  </v-col>
</v-row>
</template>

<script>
import pscontactform from '~/components/psContactForm.vue'

export default {
    components: { pscontactform }
}
</script>

<style>

</style>