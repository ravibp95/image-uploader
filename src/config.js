import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const env = process.env;
const firebaseConfig = {
  
    apiKey: env.REACT_APP_API_KEY,
    authDomain: env.REACT_APP_AUTH_DOMAIN,
    databaseURL: env.REACT_APP_DB_URL,
    projectId: env.REACT_APP_PROJECT_ID,
    storageBucket: env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_MSG_SENDER_ID,
    appId: env.REACT_APP_ID,
    measurementId: env.REACT_APP_MEASUREMENT_ID
  };

  firebase.initializeApp(firebaseConfig);
  export const storage = firebase.storage();
  export const database = firebase.database();