import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyBStO_IPVxTJoYuP5c2MeUUhxBkPxq_0qU",
  authDomain: "pantry-management-system-552ea.firebaseapp.com",
  projectId: "pantry-management-system-552ea",
  storageBucket: "pantry-management-system-552ea.appspot.com",
  messagingSenderId: "940557450488",
  appId: "1:940557450488:web:ec2fb52fe66d52918a0f0d",
  measurementId: "G-MNYQZ8X6BV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { app, auth, firestore, storage }; // Export storage
