// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrftwuu52jaaZGUd3VLwnE-3t7PLlkBD8",
  authDomain: "fir-9-tuto-3b278.firebaseapp.com",
  projectId: "fir-9-tuto-3b278",
  storageBucket: "fir-9-tuto-3b278.appspot.com",
  messagingSenderId: "115951987441",
  appId: "1:115951987441:web:fd6ea560a9836b6afd5750"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore();

// Collection reference
const collectionRef = collection(db,"books")

// Get collection data
getDocs(collectionRef)
    .then((snapshot) =>{
        
        const books = []

        snapshot.docs.map(item => {
            // id in the doc.id
            console.log("id: " + item.id)
            // To get de document hay que usar la funcion data()
            console.log(item.data())

            // Para armarse un doc:
            books.push({ ...item.data(), id: item.id})
        })
        console.log("Book array: ");
        console.log(books)
    })
    .catch(err => console.log(err))