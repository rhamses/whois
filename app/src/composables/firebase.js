// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCx6jMoeKTRQ0giBvJ3B6QYPhupXJDAxA0",
  authDomain: "whois-8130c.firebaseapp.com",
  projectId: "whois-8130c",
  storageBucket: "whois-8130c.appspot.com",
  messagingSenderId: "257230160804",
  appId: "1:257230160804:web:01d1bd62c644b0a33bf731",
  measurementId: "G-B111WFZ085",
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const provider = new GoogleAuthProvider();

export function fireLogin(cb) {
  console.log("asdasd");
  const auth = getAuth(app);
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      cb(null, user);
    })
    .catch((error) => {
      console.log(error);
      cb(error, null);
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
    });
}
