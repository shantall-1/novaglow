// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqkQYQiIzCYFOZkqrNFJWiSDABHS_Y6O4",
  authDomain: "novaglow-498e9.firebaseapp.com",
  projectId: "novaglow-498e9",
  storageBucket: "novaglow-498e9.firebasestorage.app",
  messagingSenderId: "167294777917",
  appId: "1:167294777917:web:1b27387755e68e0349c854",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Lista de correos con permisos de administrador
export const ADMIN_EMAILS = [
  "valchinininmayhuasca@crackthecode.la",   // (admin principal)
  "fundadora@novaglow.com",
  "hylromeroduran@crackthecode.la",
  "editor@novaglow.com"
  "s@gmail.com"
];

console.log("Firebase inicializado correctamente");
