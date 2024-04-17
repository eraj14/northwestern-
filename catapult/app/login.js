// pages/login.js

import { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useRouter } from 'next/router';

const firebaseConfig = {
    apiKey: "AIzaSyBjo2S0AXFndM6RBMB4BmdcFA3YxqI3kAg",
    authDomain: "catapult-nu.firebaseapp.com",
    databaseURL: "https://catapult-nu-default-rtdb.firebaseio.com",
    projectId: "catapult-nu",
    storageBucket: "catapult-nu.appspot.com",
    messagingSenderId: "252650628713",
    appId: "1:252650628713:web:5d34b1360599a0000164f8",
    measurementId: "G-5C4Y1K8PEP"
  };

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Check if user is already signed in
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // Redirect to homepage if user is signed in
        router.push('/');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSignInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({
        hd: 'u.northwestern.edu', // Restrict sign-in to @u.northwestern.edu domain
      });
      await firebase.auth().signInWithPopup(provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleSignInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
