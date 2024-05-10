// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useEffect, useState} from 'react';
import firebase from 'firebase/app';
import 'firebase/database';

import { getDatabase, onValue, ref, connectDatabaseEmulator} from 'firebase/database';
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBjo2S0AXFndM6RBMB4BmdcFA3YxqI3kAg",
  authDomain: "catapult-nu.firebaseapp.com",
  projectId: "catapult-nu",
  storageBucket: "catapult-nu.appspot.com",
  messagingSenderId: "252650628713",
  appId: "1:252650628713:web:5d34b1360599a0000164f8",
  measurementId: "G-5C4Y1K8PEP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase()

export default firebase;