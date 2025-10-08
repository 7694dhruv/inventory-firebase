import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, set, onValue, remove, update } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUSEFk29-a8kxnYdazfhnF29Tn2lPY5CQ",
  authDomain: "inventory-track-7e3fb.firebaseapp.com",
  databaseURL: "https://inventory-track-7e3fb-default-rtdb.firebaseio.com/",
  projectId: "inventory-track-7e3fb",
  storageBucket: "inventory-track-7e3fb.firebasestorage.app",
  messagingSenderId: "680616214193",
  appId: "1:680616214193:web:91af62a6023f2d019c6c90",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, push, set, onValue, remove, update };
