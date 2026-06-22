import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged as firebaseOnAuthStateChanged 
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDFKsMOOQ_OUsPED4m8qxOuCoCDgcRrGnI",
  authDomain: "authapp-2c420.firebaseapp.com",
  projectId: "authapp-2c420",
  storageBucket: "authapp-2c420.firebasestorage.app",
  messagingSenderId: "648697758619",
  appId: "1:648697758619:web:b4af6baf829b82123a973e"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const auth = {
  onAuthStateChanged: (callback) => {
    return firebaseOnAuthStateChanged(firebaseAuth, callback);
  },

  signInWithGoogle: async () => {
    const result = await signInWithPopup(firebaseAuth, googleProvider);
    return result.user;
  },

  registerWithEmail: async (email, password) => {
    const result = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    await firebaseSignOut(firebaseAuth); // Prevent auto-login
    return result.user;
  },

  signInWithEmail: async (email, password) => {
    const result = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return result.user;
  },

  signOut: async () => {
    return firebaseSignOut(firebaseAuth);
  },

  getCurrentUser: () => firebaseAuth.currentUser
};
