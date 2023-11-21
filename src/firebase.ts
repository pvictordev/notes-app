// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4yrA4xYMUzyFAeDIKDPnorEIM3BVOqcc",
  authDomain: "notes-app-1403e.firebaseapp.com",
  projectId: "notes-app-1403e",
  storageBucket: "notes-app-1403e.appspot.com",
  messagingSenderId: "843267637222",
  appId: "1:843267637222:web:ead7c52866e81b90c36027",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCollection = collection(db, "notes");
