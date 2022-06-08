import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCo53vx4WIumrBqzQoE7rO9iJvgr-d9Qy8",
    authDomain: "whatsapp-2-7d10a.firebaseapp.com",
    projectId: "whatsapp-2-7d10a",
    storageBucket: "whatsapp-2-7d10a.appspot.com",
    messagingSenderId: "451286724838",
    appId: "1:451286724838:web:50542cef9554de3a22cb27"
  };

  const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };