// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot, enableIndexedDbPersistence } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_CkH43TpN834XKvFmsEPQFDr3jmBz2WY",
    authDomain: "leave-calendar-8b702.firebaseapp.com",
    projectId: "leave-calendar-8b702",
    storageBucket: "leave-calendar-8b702.firebasestorage.app",
    messagingSenderId: "918031402202",
    appId: "1:918031402202:web:1ba574e54e4f1bad6891e3",
    measurementId: "G-0XF81FM9XE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
        console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
        console.warn('The current browser does not support offline persistence');
    }
});

// Export for use in other files
window.firebaseApp = app;
window.firebaseDb = db;
window.firebaseAuth = auth;
window.signInAnonymously = signInAnonymously;
window.onAuthStateChanged = onAuthStateChanged;
window.firestoreDoc = doc;
window.firestoreSetDoc = setDoc;
window.firestoreOnSnapshot = onSnapshot;
