<template>
  <v-col cols="4" class="chatbox-container">
    <div class="chatbox">
      <v-container class="pa-0">
        <v-row no-gutters>
          <v-col cols="11">
            <div>
              <v-badge
                v-if="unreadMessages && !chatExpanded"
                right
                color="primary"
              >
                <span slot="badge">{{ unreadMessages }}</span>
                <v-icon>mdi-message-outline</v-icon>
              </v-badge>
              <span v-else>
                <v-icon>mdi-message-outline</v-icon>
              </span>
            </div>
          </v-col>
          <v-col cols="1">
            <v-btn icon @click="chatExpanded = !chatExpanded">
              <v-icon>{{
                chatExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'
              }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
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
                {{ convertTime(msg.time) }}
              </p>
            </div>
          </div>
          <v-divider></v-divider>
          <v-textarea
            v-model="message"
            class="text-input"
            hint="Spied enter lai nosūtītu"
            rows="2"
            auto-grow
            outlined
            @keyup.enter="write"
          >
          </v-textarea>
        </div>
      </v-expand-transition>
      <!-- {{ messages.length }}
      {{ seenMessages }} -->
    </div>
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
      chatExpanded: true,
      seenMessages: 0,
      messages: [
        {
          message:
            'Šobrīd esam tiešsaistē. Ja Tev ir jautājumi, tad vaicā droši! :)',
        },
      ],
      message: '',
      output: '',
    }
  },
  computed: {
    unreadMessages() {
      if (this.messages.length > this.seenMessages) {
        return this.messages.length - this.seenMessages
      }
      return null
    },
  },
  watch: {
    chatExpanded() {
      this.seenMessages = this.messages.length
    },
  },
  mounted() {
    this.listen()
  },
  methods: {
    write() {
      if (this.message.length > 1) {
        db.collection(`chat/${this.$auth.user.id}|-|admin/messages`)
          .add({
            message: this.message,
            user_id: this.$auth.user.id,
            time: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then((docRef) => {
            // console.log(docRef.id)
          })
          .catch((err) => {
            console.error(err)
          })
      }
      this.message = ''
    },
    listen() {
      db.collection(`chat/${this.$auth.user.id}|-|admin/messages`)
        .orderBy('time')
        .onSnapshot((doc) => {
          const changes = doc.docChanges()
          changes.forEach((change) => {
            console.log(change.type)
            if (change.type === 'added') {
              // console.log(change.doc.data())
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
      if (time) {
        const min = new Date(time.seconds).getMinutes()
        const hr = new Date(time.seconds).getHours()
        return `${hr}:${min}`
      } else {
        return this.now()
      }
    },
    now() {
      const now = new Date()
      const time = now.getHours() + ':' + now.getMinutes()
      return time
    },
  },
}
</script>

<style lang="sass">
.chatbox-container

.chatbox

  .messages-container

  .chat-msg

  .msg-text

  .msg-time

  .myMessage

  .text-input
</style>
