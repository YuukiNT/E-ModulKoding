/* firebase-init.js — inisialisasi Firebase, dipakai bersama oleh semua halaman online.
   Memakai Firebase JS SDK v10 (modular) langsung dari CDN resmi Google.
   Bagian "online" ini SELALU butuh internet (berbeda dari e-modul offline yang terpisah). */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, setPersistence, browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig, STUDENT_EMAIL_DOMAIN } from "../firebase-config.js";

// App utama — dipakai untuk sesi login yang sedang aktif (admin ATAU siswa, tergantung halaman).
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Sesi login disimpan per-TAB (bukan dibagi ke semua tab di browser yang sama).
// Ini penting supaya login admin di satu tab tidak menimpa/mengeluarkan sesi
// login siswa di tab lain, dan sebaliknya.
export const persistenceReady = setPersistence(auth, browserSessionPersistence).catch(() => {});

// App kedua khusus untuk ADMIN membuat akun siswa baru — dipisah supaya sesi login admin
// tidak ikut ter-replace saat Firebase otomatis login sebagai akun siswa yang baru dibuat.
export const secondaryApp = getApps().some(a => a.name === "secondary")
  ? getApp("secondary")
  : initializeApp(firebaseConfig, "secondary");
export const secondaryAuth = getAuth(secondaryApp);

export {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword,
  setPersistence, browserSessionPersistence,
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, serverTimestamp,
  STUDENT_EMAIL_DOMAIN
};
