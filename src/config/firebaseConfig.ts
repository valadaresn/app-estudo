import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Adicione esta linha
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1vh9rh0NwfyIU4BySPrgfhD-qAdksE3Q",
  authDomain: "estudo-777df.firebaseapp.com",
  projectId: "estudo-777df",
  storageBucket: "estudo-777df.firebasestorage.app",
  messagingSenderId: "898801979610",
  appId: "1:898801979610:web:5cc78372dc1f39949695e3",
  measurementId: "G-JKWKY33YRP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
///const analytics = getAnalytics(app);