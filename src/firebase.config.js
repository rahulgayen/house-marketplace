// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA68azOK5lVvwJdrwU3VQShRuoIfQIl-8A",
    authDomain: "marketplace-app-20704.firebaseapp.com",
    projectId: "marketplace-app-20704",
    storageBucket: "marketplace-app-20704.appspot.com",
    messagingSenderId: "21303349389",
    appId: "1:21303349389:web:5f6e2cb71436d1b660d2c4"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();