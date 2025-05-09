import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAP7FWlN9OkgEMA27r-A4fIKhYtTrH3gPo",
  authDomain: "attt-f09c4.firebaseapp.com",
  projectId: "attt-f09c4",
  storageBucket: "attt-f09c4.firebasestorage.app",
  messagingSenderId: "417182243430",
  appId: "1:417182243430:web:a44d33c0066620d53feba7",
 };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };