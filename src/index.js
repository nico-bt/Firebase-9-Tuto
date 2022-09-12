// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
    getFirestore, collection, getDocs, 
    addDoc, deleteDoc, 
    doc, onSnapshot,
    query, where,
    orderBy, serverTimestamp,
    getDoc,
    updateDoc } from "firebase/firestore";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    onAuthStateChanged
} from "firebase/auth"

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

// Init Services (Firestore and Auth)
//---------------------------------------------------------------------
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore();
// Init Auth
const auth = getAuth()


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


// Queries
// ***********************************************************************

// By autor
//------------------------------
const q = query(collectionRef, where("autor", "==", "Julio Cortázar"))

onSnapshot(q, (snapshot) => {
    const books = []
    
    snapshot.docs.map(item => {
        books.push({...item.data(), id: item.id})
    })
    console.log("Query: autor == Julio Cortázar")
    console.log(books);
})

// All docs by timeStamp
//------------------------------
const qOrderByCreatedAt = query(collectionRef, orderBy("createdAt"))

onSnapshot(qOrderByCreatedAt, (snapshot) => {
    const books = []

    snapshot.docs.map(item => {
        books.push({...item.data(), id: item.id})
    })
    console.log("Ordered by CreatedAt")
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
    createdAt: serverTimestamp()
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


// Get a single document
// ***********************************************************************

const singleDocRef = doc(db, "books", "3p9SH2duSv1jO0WGlqKr")
getDoc(singleDocRef)
.then(doc=> {
    console.log("Fetching a single document: ");
    console.log(doc.data())
    console.log("id: " + doc.id)
})

// Single doc in real time. Cuando hay algún cambio en el doc, ejecuta la callback auto. 
// onSnapshot(singleDocRef, (doc) => {
    //     console.log(doc.data(), doc.id)
    //     })
    
    
// Update a document
// ***********************************************************************
const updateForm = document.querySelector(".update")

updateForm.addEventListener("submit", (e)=>{
    e.preventDefault()
    
    const id = updateForm.id.value
    const newTitle = updateForm.newTitle.value
    
    //Get doc reference
    const docRef = doc(db, "books", id)
    
    //Update in db
    updateDoc(docRef,{ titulo: newTitle })
    .then(() => {
        console.log("Doc Updated")
        updateForm.reset()
    })
})


// Authentication 
// ***********************************************************************

// signing users up
//------------------
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
  const email = signupForm.email.value
  const password = signupForm.password.value
  
  createUserWithEmailAndPassword(auth, email, password)
  .then(userCredential => {
      console.log('user created:', userCredential.user)
      signupForm.reset()
    })
    .catch(err => {
        console.log(err.message)
    })
})

// Log out
//----------------------
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
    .then(() => {
        console.log('user signed out')
    })
    .catch(err => {
        console.log(err.message)
    })
})

// Log in
//----------------------
const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    
    const email = loginForm.email.value
    const password = loginForm.password.value
    
    signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
        console.log('user logged in:', userCredential.user)
        loginForm.reset()
    })
    .catch(err => {
        console.log(err.message)
    })
})

// Subscribing to Auth Changes (the onAuth function returns a function to unsuscribe en el futuro)
//--------------------------------------------------------------------------------------------------
const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    // user - Will return the user object or null, depending if is logged in/out
    console.log("User status changed: ", user);
    
    if (user) {
        // User is signed in, see docs for a list of available properties
        const uid = user.uid;
        console.log("onAuthStateChanged => callback")
        console.log("id: ", uid)
        console.log("User: ", user.email)
    } else {
        console.log("User is signed out");
    }
});

// Unsubscribing to Auth Changes
//---------------------------------
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
  console.log('Unsubscribing from onAuthStateChanged')
  unsubscribeAuth()
})
  