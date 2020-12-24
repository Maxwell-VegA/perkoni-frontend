<template>
  <v-col cols="4" class="chatbox-container">
    <div class="chatbox">
      <v-row no-gutters align="center">
        <v-col cols="1">
          <v-badge v-if="unreadMessages && !chatExpanded" right color="primary">
            <span slot="badge">{{ unreadMessages }}</span>
            <v-icon>mdi-message-outline</v-icon>
          </v-badge>
          <span v-else>
            <v-icon>mdi-message-outline</v-icon>
          </span>
        </v-col>
        <v-col cols="10">
          <v-tabs v-model="currentChatWindow" center-active show-arrows>
            <v-tab
              v-for="(chat, i) in activeChats"
              :key="i"
              @click=";(chatExpanded = true), (toUser = chat.value), scroll()"
            >
              {{ chat.text }}
            </v-tab>
          </v-tabs>
        </v-col>
        <v-col cols="1">
          <v-btn icon @click="chatExpanded = !chatExpanded">
            <v-icon>
              {{ chatExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-expand-transition>
        <v-tabs-items v-show="chatExpanded" v-model="currentChatWindow">
          <v-tab-item v-for="(chat, idx) in compMessages" :key="idx">
            <div>
              <div class="messages-container">
                <div
                  v-for="(msg, i) in chat"
                  :key="i"
                  class="chat-msg"
                  :class="{ myMessage: $auth.user.username == msg.from }"
                >
                  <p class="msg-text">{{ msg.message }}</p>
                  <p class="msg-time">
                    {{ convertTime(msg.time) }}
                  </p>
                </div>
              </div>
              <v-divider></v-divider>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-expand-transition>
      <v-row v-if="chatExpanded" align="center" no-gutters>
        <v-col cols="11">
          <v-textarea
            v-model="message"
            class="text-input"
            hint="Spied enter lai nosūtītu"
            rows="2"
            auto-grow
            outlined
            @focus="toUser = compMessages[currentChatWindow][0].user_id"
            @keyup.enter="write"
          >
          </v-textarea>
        </v-col>
        <v-col cols="1">
          <v-btn large class="pl-2" icon color="primary">
            <v-icon size="30">mdi-send</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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
      currentChatWindow: 0,
      chatExpanded: true,
      seenMessages: 0,
      toUser: 0,
      activeChats: [],
      messages: [],
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
    compMessages() {
      const arr = []
      this.activeChats.forEach((chat, i) => {
        arr.push([])
        this.messages.forEach((msg) => {
          if (msg.user_id === chat.value) {
            arr[i].push(msg)
          }
        })
      })
      return arr
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
    // toUser(tab) {},
    write() {
      if (this.message.length > 1) {
        if (this.message == '/clearmc\n') {
          if (confirm('Delete all messages?')) {
            alert('Destroying Messages')
            // This is a bit stupid since if you mistyped it the
            // message would get sent out to someone
          }
        } else {
          db.collection(`chat/room/messages`)
            .add({
              message: this.message,
              user_id: this.toUser,
              from: this.$auth.user.username,
              time: firebase.firestore.FieldValue.serverTimestamp(),
            })
            .then((docRef) => {
              // console.log(docRef.id)
            })
            .catch((err) => {
              console.error(err)
            })
        }
      }
      this.message = ''
    },
    listen() {
      db.collection(`chat/room/messages`)
        .orderBy('time')
        .onSnapshot((doc) => {
          const changes = doc.docChanges()
          changes.forEach((change) => {
            console.log(change.type)
            if (change.type === 'added') {
              // console.log(change.doc.data())
              const id = change.doc.data().user_id
              const from = change.doc.data().from
              this.messages.push({
                message: change.doc.data().message,
                user_id: id,
                from,
                time: change.doc.data().time,
              })
              if (this.activeChats.find((chat) => chat.value !== id)) {
                if (this.$auth.user.username !== from) {
                  this.activeChats.push({
                    value: id,
                    text: from,
                  })
                }
              } else if (this.activeChats.length === 0) {
                if (this.$auth.user.username !== from) {
                  this.activeChats.push({
                    value: id,
                    text: from,
                  })
                }
              }
              setTimeout(() => {
                this.scroll()
              }, 150)
            }
          })
        })
    },
    convertTime(time) {
      if (time) {
        let min = new Date(time.seconds * 1000).getMinutes()
        const hr = new Date(time.seconds * 1000).getHours()
        if (min.toFixed().length === 1) {
          min = '0' + min
        }
        return `${hr}:${min}`
      } else {
        return this.now()
      }
    },
    now() {
      const now = new Date()
      let minutes = now.getMinutes()
      console.log('On second entry this gets weird')
      if (minutes.toFixed().length === 1) {
        minutes = '0' + minutes
      }
      const time = now.getHours() + ':' + minutes
      return time
    },
    scroll() {
      const box = document.querySelector('.messages-container')
      box.scrollTop = box.scrollHeight
    },
  },
}
</script>

<style lang="sass" scoped>
.chatbox-container
  left: 0

.chatbox

  .messages-container
    height: 40vh
  .chat-msg

  .msg-text

  .msg-time

  .myMessage

  .text-input
</style>
