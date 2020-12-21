// import firebase from "firebase"

import * as firebase from 'firebase/app'
// import 'firebase/messaging'
// import 'firebase/firestore'
// import 'firebase/database'


const config = {
  apiKey: "AIzaSyBb8WzLvdnvpEM75oF-k1j4Vfo3IZFK5ew",
  authDomain: "rt-chat-3902a.firebaseapp.com",
  projectId: "rt-chat-3902a",
  storageBucket: "rt-chat-3902a.appspot.com",
  messagingSenderId: "555688664693",
  appId: "1:555688664693:web:66c57dcfb4952ef8f0e23c",
  measurementId: "G-BCQ2HLL4Y6"
}

let app = null;
if (!firebase.apps.length) {
  app = firebase.initializeApp(config);
}
// const app = firebase.app && firebase.app.length > 0 ? firebase.app[0] : firebase.initializeApp(config)

// const db = firebase.firestore()
// const fb = firebase

export default app

// import firebase from 'firebase/app'
// import 'firebase/firestore'

// firebase.firestore().settings({ experimentalForceLongPolling: false })
// export { db, fb }