
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-blog-6d456.firebaseapp.com",
    projectId: "mern-blog-6d456",
    storageBucket: "mern-blog-6d456.appspot.com",
    messagingSenderId: "916431222120",
    appId: "1:916431222120:web:9bfa950ac5e897d6e752dd",
    measurementId: "G-FDZF9F76D4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
