import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMMR5ju9HCkf0HLI_7Hwf72Q2fG_Sp6ZM",
  authDomain: "conexao-em-3-minutos-1dd4d.firebaseapp.com",
  projectId: "conexao-em-3-minutos-1dd4d",
  storageBucket: "conexao-em-3-minutos-1dd4d.firebasestorage.app",
  messagingSenderId: "291942122284",
  appId: "1:291942122284:web:2fd147152f1badae252289",
  measurementId: "G-PXLK5EF6FF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Erro no login com Google", error);
        throw error;
    }
}

export const logoutUser = async () => {
    await signOut(auth);
}
