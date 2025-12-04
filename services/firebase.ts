import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2PWMJYdiTTaJ1v9lbSpV6FJ_7FaPuje8",
  authDomain: "conexao-em-3-minutos.firebaseapp.com",
  projectId: "conexao-em-3-minutos",
  storageBucket: "conexao-em-3-minutos.firebasestorage.app",
  messagingSenderId: "614044599616",
  appId: "1:614044599616:web:440f13d1c6e509b223a6a5",
  measurementId: "G-XNKY1Q844Z"
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