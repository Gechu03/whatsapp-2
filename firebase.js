import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDe55jW5EXAmdfFdqUKAPZ-0rGJZqA10YA",
  authDomain: "whatsapp-2-289e6.firebaseapp.com",
  projectId: "whatsapp-2-289e6",
  storageBucket: "whatsapp-2-289e6.appspot.com",
  messagingSenderId: "111132949854",
  appId: "1:111132949854:web:70ddbe6e95f50fa08823cf",
  measurementId: "G-DR8YERW1P0"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };