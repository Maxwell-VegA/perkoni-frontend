<template>
  <v-col cols="4" class="chatbox-container">
    <div class="chatbox">
      <v-expand-transition>
        <v-tabs-items v-show="chatExpanded" v-model="currentChatWindow">
          <v-tab-item
            v-for="(chat, idx) in compMessages"
            :key="idx"
            @mouseenter="clearNotifications()"
          >
            <div>
              <div :id="'1337' + idx" class="messages-container">
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
              <!-- <v-divider></v-divider> -->
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
            @keyup="clearNotifications"
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
      <v-row no-gutters>
        <v-col cols="12">
          <v-tabs
            v-model="currentChatWindow"
            background-color="transparent"
            vertical
          >
            <v-tab
              v-for="(chat, i) in activeChats"
              :key="i"
              :class="{ unreadMsg: chat.notif > 0 }"
              @click="
                ;(chatExpanded = openOrClose(i)),
                  (toUser = chat.value),
                  scroll()
              "
            >
              <v-badge v-if="chat.notif">
                <template v-slot:badge>
                  {{ chat.notif }}
                </template>
                {{ chat.text }}
              </v-badge>
              <span v-else>
                {{ chat.text }}
              </span>
            </v-tab>
          </v-tabs>
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
      chatExpanded: false,
      toUser: 0,
      activeChats: [],
      messages: [],
      message: '',
      output: '',
    }
  },
  computed: {
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
    currentChatWindow() {
      this.clearNotifications()
    },
  },
  mounted() {
    this.listen()
  },
  methods: {
    // toUser(tab) {},
    write() {
      if (this.message.length > 0 && this.message[0] != '\n') {
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
          const arr = this.activeChats
          changes.forEach((change) => {
            // console.log(change.type)
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
              if (arr.find((chat) => chat.value === id)) {
                if (from != this.$auth.user.username) {
                  arr[arr.findIndex((chat) => chat.value === id)].notif++
                }
              } else {
                // if (this.$auth.user.username !== from) {
                arr.push({
                  value: id,
                  text: from,
                  msgs: 1,
                  notif: 1,
                })
                // }
              }

              this.scroll()
            }
          })
          this.activeChats = arr
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
      setTimeout(() => {
        const box = document.getElementById('1337' + this.currentChatWindow)
        box.scrollTop = box.scrollHeight
      }, 100)
    },
    clearNotifications() {
      this.activeChats[this.currentChatWindow].notif = 0
    },
    openOrClose(index) {
      if (this.currentChatWindow === index && this.chatExpanded) {
        return false
      } else {
        this.clearNotifications()
        return true
      }
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
