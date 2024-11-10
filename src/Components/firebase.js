// Import the functions you need from the SDKs you need
import {getAuth} from "firebase/auth";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_wSmzuoiqpumx-IDAXDIffvYmVvLVyXs",
    authDomain: "whatsapp-clone-cb16c.firebaseapp.com",
    projectId: "whatsapp-clone-cb16c",
    storageBucket: "whatsapp-clone-cb16c.firebasestorage.app",
    messagingSenderId: "322933262439",
    appId: "1:322933262439:web:48590f922f047cb256ecc2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
export default app; 