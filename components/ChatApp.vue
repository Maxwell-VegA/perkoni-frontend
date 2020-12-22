<template>
  <v-col cols="4" class="chatbox-container">
    <div class="chatbox">
      <v-container>
        <v-row no-gutters>
          <v-col cols="11">
            <p>
              <v-badge
                v-if="unreadMessages && !chatExpanded"
                right
                color="primary"
              >
                <span slot="badge">{{ unreadMessages }}</span>
                <span> Čats </span>
              </v-badge>
              <span v-else> Čats </span>
            </p>
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
      <v-btn color="primary" @click="get">text</v-btn>
      {{ messages.length }}
      {{ seenMessages }}
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
      activeChats: [],
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
        // if (this.messages.length === 1) {
        //   db.collection(`chat`).add({
        //     user_id: this.$auth.user.id,
        //   })
        // }
      }
      this.message = ''
    },
    get() {
      db.collection('chat')
        .get()
        .then((snapshot) => {
          this.activeChats = []
          snapshot.forEach((chat) => {
            // console.log(chat.id)
            this.activeChats.push(chat.id)
          })
          console.log(this.activeChats)
        })
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
  background: rgba(30, 30, 30, 0.93)

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
