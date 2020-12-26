var firebase = require('firebase/app');
require('firebase/storage');


// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDOwgGmM760AoyWMVCOxSUgv7S3y2diTFk",
    authDomain: "thotprime-54ea2.firebaseapp.com",
    projectId: "thotprime-54ea2",
    storageBucket: "thotprime-54ea2.appspot.com",
    messagingSenderId: "746989515418",
    appId: "1:746989515418:web:bf25a0a028000a04f2e523"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default {firebase};
