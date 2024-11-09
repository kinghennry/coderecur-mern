// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// TODO: Hide this api key in env file before deploying
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'mern-realestate-89da2.firebaseapp.com',
  projectId: 'mern-realestate-89da2',
  storageBucket: 'mern-realestate-89da2.appspot.com',
  messagingSenderId: '1064829863853',
  appId: '1:1064829863853:web:a98f304b93027133d2c324',
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
