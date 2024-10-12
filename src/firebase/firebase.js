import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCRQDXWy9c7mLCW2B6TsnbSBorrcni6A5A",
  authDomain: "stpl-c4b13.firebaseapp.com",
  projectId: "stpl-c4b13",
  storageBucket: "stpl-c4b13.appspot.com",
  messagingSenderId: "1051911627874",
  appId: "1:1051911627874:web:bcbf8d879c319711b39d3b",
  measurementId: "G-CLVEB8LQHV"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getDatabase(app)


export { app, auth ,db};
