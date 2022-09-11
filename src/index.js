// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";

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
// ***********************************************************************
// ------------ obs: Bloque prog comentado para usar onSnapshot() en vez de getDocs()-----------
// getDocs(collectionRef)
//     .then((snapshot) =>{
    
    //         const books = []
    
    //         snapshot.docs.map(item => {
        //             // id in the doc.id
        //             console.log("id: " + item.id)
        //             // To get de document hay que usar la funcion data()
        //             console.log(item.data())
        
        //             // Para armarse un doc:
        //             books.push({ ...item.data(), id: item.id})
        //         })
        //         console.log("Book array: ");
        //         console.log(books)
        //     })
        //     .catch(err => console.log(err))
// ------------------------- obs: Bloque prog comentado --------------------------------------
        
    // Real time collection. Add an eventlistener, refresh data onChange with the onSnapShot() func from firebase
    // En vez de getDocs() usamos onSnapShot(ref, ()=>{callback})
    onSnapshot(collectionRef, (snapshot) =>{
        const books = []

        snapshot.docs.map(item => {
            books.push({...item.data(), id: item.id})
        })
        console.log(books);
    })

// Adding docs
// ***********************************************************************
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(collectionRef, {
    titulo: addBookForm.titulo.value,
    autor: addBookForm.autor.value,
  })
    .then(() => {
        addBookForm.reset()
    })
    .then(() => console.log("Book added"))
    .catch(err => console.log(err))
})


// Deleting docs
// ***********************************************************************
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() => {
      deleteBookForm.reset()
    })
    .then(() => console.log("Book deleted"))
    .catch(err => console.log(err))
})