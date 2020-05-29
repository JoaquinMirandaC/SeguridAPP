import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDEFTO8J1NEblj0lI6F4XxwlmAkSUqZ8uU",
  authDomain: "nwo-security.firebaseapp.com",
  databaseURL: "https://nwo-security.firebaseio.com",
  projectId: "nwo-security",
  storageBucket: "nwo-security.appspot.com",
  messagingSenderId: "55985306771",
  appId: "1:55985306771:web:4c6ad9cc275d18114ee166",
  measurementId: "G-RLPWD2JKGB"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
