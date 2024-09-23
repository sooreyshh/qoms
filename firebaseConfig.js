// firebaseConfig.js
import firebase from '@react-native-firebase/app';

// Add your Firebase configuration here
const firebaseConfig = {
   apiKey: "AIzaSyDn_k5bFOXDVkqu9i4s7QQV_qcR1DHC-SU",
  authDomain: "croms-8a81f.firebaseapp.com",
  projectId: "croms-8a81f",
  storageBucket: "croms-8a81f.appspot.com",
  messagingSenderId: "754652288536",
  appId: "1:754652288536:web:c152774719be616847556d",
  measurementId: "G-82V10RJSRK"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
