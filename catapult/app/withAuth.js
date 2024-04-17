
import firebase from 'firebase/app';
import 'firebase/auth';
import { useEffect } from 'react';
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
  
  export default function withAuth(WrappedComponent) {
    return function WithAuth(props) {
      useEffect(() => {
        if (typeof window !== 'undefined') {
         
          import('next/router').then((nextRouter) => {
            const router = nextRouter.default();
  
            // Initialize Firebase
            if (!firebase.apps.length) {
              firebase.initializeApp(firebaseConfig);
            }
  
            // Check if user is signed in
            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
              if (!user) {
                // If user is not signed in, redirect to login page
                router.replace('/login');
              }
            });
  
            return () => {
              unsubscribe();
            };
          });
        }
      }, []);
  
      return <WrappedComponent {...props} />;
    };
  }