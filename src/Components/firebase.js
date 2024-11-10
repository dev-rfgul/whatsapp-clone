// Import the functions you need from the SDKs you need
import { getAuth ,GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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
const auth = getAuth();
const  googleProvider=new GoogleAuthProvider()

export {auth,googleProvider}
export const db = getFirestore(app);
export default app;


