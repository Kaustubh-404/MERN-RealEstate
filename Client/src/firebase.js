// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAg9E_GirUn2ma9IDksntSG3HRHZk5-5f0",//import.meta.env.FIREBASE_API_KEY,
  authDomain: "mern-realestate-3da80.firebaseapp.com",
  projectId: "mern-realestate-3da80",
  storageBucket: "mern-realestate-3da80.appspot.com",
  messagingSenderId: "862525124008",
  appId: "1:862525124008:web:4adbfe20bc92081625019d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);