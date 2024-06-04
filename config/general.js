// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBvM2ynXzS9wCbDLWL4DeSjeSKAj5Qp1co",
//   authDomain: "practicefunc-4e171.firebaseapp.com",
//   databaseURL: "https://practicefunc-4e171-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "practicefunc-4e171",
//   storageBucket: "practicefunc-4e171.appspot.com",
//   messagingSenderId: "83730416705",
//   appId: "1:83730416705:web:a60d29ddeb4a1c110272c0",
//   measurementId: "G-LKKD18JBGF"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
module.exports = {
  weekEnd: 6,
  secretKey: "rozervivekgpsservice",
  session_expiry: 30,
  api_authentication: false,
  token_expiresIn: { expiresIn: 3000 },
};