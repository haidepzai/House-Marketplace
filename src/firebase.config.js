import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6sgXnIASPcQ563vmrRoczjZfLY2N5BCs",
  authDomain: "house-marketplace-app-8eff6.firebaseapp.com",
  projectId: "house-marketplace-app-8eff6",
  storageBucket: "house-marketplace-app-8eff6.appspot.com",
  messagingSenderId: "758336902937",
  appId: "1:758336902937:web:655e4a442afcdf2dc95788"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();