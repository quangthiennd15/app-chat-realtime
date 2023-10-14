// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCIL_8xnDjMmtwZ_fiW1zIZyAt964am1mM",
    authDomain: "chatapp-realtime-6bc90.firebaseapp.com",
    projectId: "chatapp-realtime-6bc90",
    storageBucket: "chatapp-realtime-6bc90.appspot.com",
    messagingSenderId: "489282082132",
    appId: "1:489282082132:web:55d23908b29a26e9d364c1",
    measurementId: "G-Z9XB6NESYE"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);