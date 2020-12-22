<template>
  <v-col cols="4" class="chatbox-container">
    <!-- <v-row align-content="end">
      <v-spacer></v-spacer>
      <v-col cols="6"> -->
    <div class="chatbox">
      <v-container>
        <p>Hey</p>
        <!-- <v-spacer></v-spacer> -->
        <v-btn icon @click="chatExpanded = !chatExpanded">
          <v-icon>{{
            chatExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
          }}</v-icon>
        </v-btn>
      </v-container>
      <v-divider></v-divider>
      <v-expand-transition>
        <div v-show="chatExpanded">
          <div class="messages-container">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              class="chat-msg"
              :class="{ myMessage: $auth.user.id == msg.user_id }"
            >
              <p class="msg-text">{{ msg.message }}</p>
              <p class="msg-time">
                {{ convertTime(msg.time) }} // {{ msg.user_id }}
              </p>
            </div>
          </div>
          <v-divider></v-divider>
          <v-textarea
            v-model="message"
            class="text-input"
            rows="1"
            auto-grow
            outlined
            @keyup.enter="write"
          >
          </v-textarea>
        </div>
      </v-expand-transition>
    </div>
    <!-- </v-col>
    </v-row> -->
  </v-col>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'

const config = {
  apiKey: 'AIzaSyBb8WzLvdnvpEM75oF-k1j4Vfo3IZFK5ew',
  authDomain: 'rt-chat-3902a.firebaseapp.com',
  projectId: 'rt-chat-3902a',
  storageBucket: 'rt-chat-3902a.appspot.com',
  messagingSenderId: '555688664693',
  appId: '1:555688664693:web:66c57dcfb4952ef8f0e23c',
  measurementId: 'G-BCQ2HLL4Y6',
}

let app = null
if (!firebase.apps.length) {
  app = firebase.initializeApp(config)
}

const db = firebase.firestore()

export default {
  data() {
    return {
      chatExpanded: false,
      messages: [],
      message: '',
      output: '',
    }
  },
  computed: {},
  mounted() {
    this.listen()
  },
  methods: {
    write() {
      const today = new Date()
      const date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate()
      const time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
      const dateTime = date + ' ' + time
      db.collection(`chat/${this.$auth.user.id}|-|admin/messages`).add({
        message: this.message,
        user_id: this.$auth.user.id,
        time: dateTime,
      })
      this.message = ''
    },
    listen() {
      db.collection(`chat/${this.$auth.user.id}|-|admin/messages`)
        .orderBy('time')
        .onSnapshot((doc) => {
          // if (doc && doc.exists) {
          const changes = doc.docChanges()
          // console.log(changes)
          changes.forEach((change) => {
            console.log(change.doc.data())
            if (change.type === 'added') {
              this.messages.push({
                message: change.doc.data().message,
                user_id: change.doc.data().user_id,
                time: change.doc.data().time,
              })
            }
          })
        })
    },
    convertTime(time) {
      const split = time.split(' ')
      return split[1]
    },
  },
}
</script>

<style lang="sass" scoped>
.chatbox-container
  z-index: 100
  bottom: 0
  right: 0
  position: fixed
  margin: 0 3.5rem

.chatbox
  padding: 1.25rem
  border-radius: 5px
  background: rgba(30, 30, 30, 0.85)

  .messages-container
    position: relative
    display: flex
    flex-direction: column
    max-height: 40vh
    overflow-y: scroll
    padding-right: 1rem
    // overflow-y: hidden

  .chat-msg
    position: relative
    max-width: 90%
    align-self: flex-end
    border-radius: 4px
    margin: .5rem 0
    border: 2px solid #363636
    // right: 0
    // float: right

  .msg-text
    margin: .5rem 1rem

  .msg-time
    font-size: .85rem
    padding: 0 1rem
    opacity: 70%

  .myMessage
    align-self: start
    background: rgba(54, 54, 54, 0.9)
    border: none

  .text-input
    width: 100%
    margin-top: 2rem
</style>
