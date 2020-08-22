import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyD0ovoXha6BKX1dz4_WylnTJNWbprZNhV0",
    authDomain: "insta-clone-25d43.firebaseapp.com",
    databaseURL: "https://insta-clone-25d43.firebaseio.com",
    projectId: "insta-clone-25d43",
    storageBucket: "insta-clone-25d43.appspot.com",
    messagingSenderId: "901816226813",
    appId: "1:901816226813:web:ebe7f83754a65116ddff94",
    measurementId: "G-860YG0HPD9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
