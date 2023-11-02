// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD2FTaq2I1v7jhNFhldo-3eXP9aJY8Lx2g",
    authDomain: "gap-navigator.firebaseapp.com",
    projectId: "gap-navigator",
    storageBucket: "gap-navigator.appspot.com",
    messagingSenderId: "41565529905",
    appId: "1:41565529905:web:4722cfa832dd2975c6f210",
    measurementId: "G-EK8VTXTT05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
// Initialize Firebase Authentication and get a reference to the service
export const firebaseAuth = getAuth(app)
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)