// js/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= USER HELPERS ================= */

export async function createUserProfile(user, role = "student") {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    role,
    createdAt: new Date()
  });
}

export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}

const firebaseConfig = {
  apiKey: "AIzaSyA-pGyhQ1aJH1g5X-pPPC5TYrRCshM0_oU",
    authDomain: "student-teacher-appointm-ccbe3.firebaseapp.com",
    projectId: "student-teacher-appointm-ccbe3",
    storageBucket: "student-teacher-appointm-ccbe3.firebasestorage.app",
    messagingSenderId: "503455055058",
    appId: "1:503455055058:web:255f05df2fb063658b810b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// console.log("Firebase initialized");
