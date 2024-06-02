import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyCXPGeCnttMdqm7Awl7tzv1Iyb4C-SYJMk",
    authDomain: "nu-catapult.firebaseapp.com",
    projectId: "nu-catapult",
    storageBucket: "nu-catapult.appspot.com",
    messagingSenderId: "585223183820",
    appId: "1:585223183820:web:78e0308819e54652ed9169",
    measurementId: "G-1J57FPGSQ0"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };