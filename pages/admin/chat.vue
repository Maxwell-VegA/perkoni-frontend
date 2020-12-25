<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col cols="4">
          <v-time-picker
            v-model="time"
            format="24hr"
            :min="new Date().toLocaleTimeString()"
            scrollable
          ></v-time-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="3">
          <v-btn v-if="!chatStatus" color="success" @click="setChatStatus(true)"
            >Ieslegt Catu</v-btn
          >
          <v-btn v-else color="error" @click="setChatStatus(false)"
            >Izslegt Catu</v-btn
          >
        </v-col>
      </v-row>
      {{ time }}
      {{ chatStatus }}
      {{ compTime }}
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      chatStatus: false,
      end_time: '1608913800000',
      action_by: null,
    }
  },
  computed: {
    compTime() {
      const time = Date.parse(
        `${new Date().toLocaleDateString()}, ${this.time}`
      )
      return new Date(time).toLocaleString()
    },
  },
  mounted() {
    this.watchChatStatus()
  },
  methods: {
    async watchChatStatus() {
      await this.$fire.firestore
        .collection(`chat`)
        .doc('room')
        .onSnapshot((doc) => {
          this.chatStatus = doc.data().chat_status
          this.end_time = doc.data().end_time
          this.action_by = doc.data().action_by
        })
    },
    setChatStatus(on) {
      if (on) {
        this.$fire.firestore
          .collection('chat')
          .doc('room')
          .set({
            chat_status: true,
            end_time: this.compTime,
            action_by: `${this.$auth.user.username}#${this.$auth.user.id}`,
          })
      } else {
        this.$fire.firestore
          .collection('chat')
          .doc('room')
          .set({
            chat_status: false,
            end_time: '1608913800000',
            action_by: `${this.$auth.user.username}#${this.$auth.user.id}`,
          })
      }
    },
  },
}
</script>

<style></style>
