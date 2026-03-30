
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAnqCaN9erAYl0nqyIMk5xd3_AbyiFz3cM",
  authDomain: "ujinn-rvn.firebaseapp.com",
  projectId: "ujinn-rvn",
  storageBucket: "ujinn-rvn.firebasestorage.app",
  messagingSenderId: "620847904951",
  appId: "1:620847904951:web:93a96ce14c3d7347b5b532",
  measurementId: "G-QFWDPRCHBD"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
