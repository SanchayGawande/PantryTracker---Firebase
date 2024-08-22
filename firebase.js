// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANIn9ZZWFB8dq-u5mWrwMzU8TmS7te_dc",
  authDomain: "pantry-27100.firebaseapp.com",
  projectId: "pantry-27100",
  storageBucket: "pantry-27100.appspot.com",
  messagingSenderId: "1079018606402",
  appId: "1:1079018606402:web:4e8883b0c2e6179a9ec2db",
  measurementId: "G-NVLR5KLTQY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// Export the necessary Firebase services
export { firebaseConfig, app, firestore };
