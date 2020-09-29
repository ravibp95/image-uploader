import firebase from "firebase/app";
import "firebase/storage";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyASetqdfAowX2PddkTDQ4dZfYg7DTVj9qs",
    authDomain: "image-uploader-1f738.firebaseapp.com",
    databaseURL: "https://image-uploader-1f738.firebaseio.com",
    projectId: "image-uploader-1f738",
    storageBucket: "image-uploader-1f738.appspot.com",
    messagingSenderId: "477178754788",
    appId: "1:477178754788:web:294b589c2928fee6871ef1",
    measurementId: "G-Z33SQ1EZ6R"
  };

  firebase.initializeApp(firebaseConfig);
  export const storage = firebase.storage();
  export const database = firebase.database();