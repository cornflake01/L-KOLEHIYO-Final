// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js"; // Import Firebase Auth module

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-W9ZBwlkefbJjicz9Mw0OuUrWI6FHnWk",
    authDomain: "l-kolehiyo-8b253.firebaseapp.com",
    databaseURL: "https://l-kolehiyo-8b253-default-rtdb.firebaseio.com",
    projectId: "l-kolehiyo-8b253",
    storageBucket: "l-kolehiyo-8b253.appspot.com",
    messagingSenderId: "289094522635",
    appId: "1:289094522635:web:5db3616b0468d52888b40e",
    measurementId: "G-P8QC5255QR"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Auth

document.getElementById("submit").addEventListener('click', function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const lrn = document.getElementById("lrn_number").value;
    const email = document.getElementById("email").value;
    const strand = document.getElementById("strand").value;
    const grade = document.getElementById("grade").value;
    const section = document.getElementById("section").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    addStudent(name, lrn, email, strand, grade, section, username, password);
});

function addStudent(name, lrn, email, strand, grade, section, username, password) {
    createUserWithEmailAndPassword(auth, email, password) // Use createUserWithEmailAndPassword method from Firebase Auth
        .then((userCredential) => {
            const user = userCredential.user;    
            set(ref(db, 'students/' + user.email), {
                name: name,
                lrn: lrn,
                email: email,
                strand: strand,
                grade: grade,
                section: section,
                username: username,
                password: password
            }).then(() => {
                console.log("Student added successfully.");
                document.getElementById("createForm").reset();
                window.location.href = "studentinfo.html"; // Redirect to studentinfo.html
            }).catch((error) => {
                console.error("Error adding student: ", error);
            });
        })
        .catch((error) => {
            console.error("Error creating user: ", error);
        });
}
