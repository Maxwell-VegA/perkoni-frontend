<template>
  <v-col cols="4" class="chatbox-container">
    <div class="chatbox">
      <v-container class="pa-0">
        <v-row no-gutters align="center">
          <v-col cols="1">
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
          <v-col cols="10">
            <span v-if="from" class="ml-4">
              {{ from.from }}
            </span>
          </v-col>
          <v-col cols="1">
            <v-btn icon @click=";(chatExpanded = !chatExpanded), scroll()">
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
              :class="{ myMessage: $auth.user.username == msg.from }"
            >
              <p class="msg-text">{{ msg.message }}</p>
              <p class="msg-time">
                {{ convertTime(msg.time) }}
              </p>
            </div>
          </div>
          <v-divider></v-divider>
          <v-row align="center" no-gutters>
            <v-col md="10" lg="11">
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
            </v-col>
            <v-col cols="1">
              <v-btn large class="pl-2" icon color="primary">
                <v-icon size="30">mdi-send</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-expand-transition>
      <!-- {{ messages.length }}
      {{ seenMessages }} -->
    </div>
  </v-col>
</template>

<script>
// import firebase from 'firebase/app'
// import 'firebase/firestore'

// const config = {
//   apiKey: 'AIzaSyBb8WzLvdnvpEM75oF-k1j4Vfo3IZFK5ew',
//   authDomain: 'rt-chat-3902a.firebaseapp.com',
//   projectId: 'rt-chat-3902a',
//   storageBucket: 'rt-chat-3902a.appspot.com',
//   messagingSenderId: '555688664693',
//   appId: '1:555688664693:web:66c57dcfb4952ef8f0e23c',
//   measurementId: 'G-BCQ2HLL4Y6',
// }

// let app = null
// if (!firebase.apps.length) {
//   app = firebase.initializeApp(config)
// }

// const db = firebase.firestore()
// const db = $fire.firestore

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
    from() {
      if (this.messages.length > 1) {
        return this.messages.find(
          (msg) => msg.from !== this.$auth.user.username && msg.from
        )
      }
      return { from: '' }
    },
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
    async write() {
      if (this.message.length > 0 && this.message[0] != '\n') {
        const time = Date.now()
        await this.$fire.firestore
          .collection(`chat/room/messages`)
          .add({
            message: this.message,
            user_id: this.$auth.user.id,
            from: this.$auth.user.username,
            time,
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
    async listen() {
      await this.$fire.firestore
        .collection(`chat/room/messages`)
        .where('user_id', '==', this.$auth.user.id)
        .orderBy('time')
        .onSnapshot((doc) => {
          const changes = doc.docChanges()
          changes.forEach((change) => {
            console.log(change.type)
            if (change.type === 'added') {
              this.messages.push({
                message: change.doc.data().message,
                user_id: change.doc.data().user_id,
                from: change.doc.data().from,
                time: change.doc.data().time,
              })
            }
          })
          setTimeout(() => {
            this.scroll()
          }, 150)
        })
    },
    convertTime(time) {
      if (time) {
        let min = new Date(time).getMinutes()
        const hr = new Date(time).getHours()
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

<style lang="sass">
// .chatbox-container

// .chatbox

//   .messages-container

//   .chat-msg

//   .msg-text

//   .msg-time

//   .myMessage

//   .text-input
</style>
