// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW59-zNxIvefp99ptPiiSHtJkZqnV3X6s",
  authDomain: "freshman-year.firebaseapp.com",
  projectId: "freshman-year",
  storageBucket: "freshman-year.appspot.com",
  messagingSenderId: "277534010170",
  appId: "1:277534010170:web:3e6c5a2fb116ac3c76fe03",
  measurementId: "G-TR7PVCH020"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);