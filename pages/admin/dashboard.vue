<template>
  <div>
    <v-row>
      <v-col lg="9">
        <v-col lg="12"> </v-col>
      </v-col>
      <v-col lg="3">
        <v-row no-gutters>
          <chat-controlls />
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ChatControlls from '~/components/ChatControlls.vue'
export default {
  components: { ChatControlls },
  data() {
    return {}
  },
}
</script>

<style></style>
