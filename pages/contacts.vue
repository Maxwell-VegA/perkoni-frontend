<template>
  <v-row>
    <v-col md="6">
      <ps-contact-form to="asd@asd.com" />
      <v-btn color="success" @click="pressed">text</v-btn>
    </v-col>
    <v-col md="6">
      <p>Biedrība Deviņi pērkoni</p>
      <p>Reģ. nr: 40008256199</p>
      <p>Konts ziedojumiem: LV50UNLA0050024418634</p>
      <p>AS SEB banka</p>
      <p>UNLALV2X</p>
      <br />
      <p>E-pasts: veikals@9perkoni.lv</p>
      <p>GSM: +371 2979 2529 / Telegram, WhatsApp</p>
    </v-col>
    {{ mess }}
  </v-row>
</template>

<script>
import pscontactform from '~/components/psContactForm.vue'
// import 'firebase/messaging'
import 'firebase/firestore'

import firebase from 'firebase/app'

// const firebaseConfig = {
//   apiKey: 'AIzaSyBb8WzLvdnvpEM75oF-k1j4Vfo3IZFK5ew',
//   authDomain: 'rt-chat-3902a.firebaseapp.com',
//   projectId: 'rt-chat-3902a',
//   storageBucket: 'rt-chat-3902a.appspot.com',
//   messagingSenderId: '555688664693',
//   appId: '1:555688664693:web:66c57dcfb4952ef8f0e23c',
//   measurementId: 'G-BCQ2HLL4Y6',
// }

// // firebase.firestore().settings({ experimentalForceLongPolling: false })

// const firebaseApp =
//   firebase.apps && firebase.apps.length > 0
//     ? firebase.apps[0]
//     : firebase.initializeApp(config)

const db = firebase.firestore()
// const fb = firebase

export default {
  components: { pscontactform },
  data() {
    return {
      messages: null,
    }
  },
  computed: {
    mess() {
      db.collection('chat').onSnapshot(function (doc) {
        return console.log(`Snapshot: ${doc.data()}`)
      })
    },
  },
  mounted() {
    // this.messages = db(query)
    // db.collection('chat')
    //   .get()
    //   .then((res) => {
    //     const allMessages = []
    //     res.forEach((doc) => {
    //       allMessages.push(doc.data)
    //     })
    //     this.messages = allMessages
    //   })
  },
  methods: {
    pressed() {
      db.collection('chat').add({
        message: 'hello where',
      })
      // const messaging = firebase.messaging
      // Notification.requestPermission()
      //   .then(function () {
      //     return messaging.getToken()
      //   })
      //   .then(function (token) {
      //     console.log(token)
      //   })
      // messaging.requestPermission()
      // messaging.requestPermission().then(function () {
      //   console.log(1222)
      // })
    },
  },
}
</script>

<style></style>
