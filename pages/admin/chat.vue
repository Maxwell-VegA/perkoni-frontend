<template>
  <v-row>
    <v-col offset="2" cols="4">
      <v-col>
        <h3>
          Lidz izslegsanai:
          <br />
          <h1>
            {{ timeLeft }}
          </h1>
        </h3>
      </v-col>
      <v-time-picker
        v-model="time"
        format="24hr"
        :min="new Date().toLocaleTimeString()"
        scrollable
      ></v-time-picker>
      <v-row>
        <v-col>
          <v-btn
            v-if="!chatStatus"
            :disabled="!validTime"
            color="success"
            @click="setChatStatus(true)"
          >
            Ieslegt Catu
          </v-btn>
          <v-btn v-else color="error" @click="setChatStatus(false)">
            Izslegt Catu
          </v-btn>
          <v-btn
            v-if="time != end_time && time != null && chatStatus"
            style="margin-left: 7px"
            color="info"
            @click="setChatStatus(true)"
          >
            Mainit Laiku
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <!-- <v-col class="red" cols="6"> </v-col> -->
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      time: null,
      timeLeft: 0,
      validTime: false,
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
      if (time) {
        this.validTime = true
      } else {
        this.validTime = false
      }
      return time
      return new Date(time).toLocaleString()
    },
  },
  mounted() {
    this.watchChatStatus()
    this.getLeft()
  },
  methods: {
    getLeft() {
      const x = setInterval(() => {
        const distance = this.end_time - new Date().getTime()
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        )
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((distance % (1000 * 60)) / 1000)
        this.timeLeft = `${hours}:${minutes}:${seconds}`
        // this.timeLeft = distance
      }, 1000)
    },
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
