import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase configuration
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
const auth = getAuth();

// Reference to the students in the database
const studentsRef = ref(db, "students");

const loginForm = document.getElementById("loginForm");

// loginForm.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const email = document.getElementById("email").value;
//   const password = document.getElementById("password").value;

//   firebase

//     .auth()
//     .signInWithEmailAndPassword(email, password)
//     .then((userCredential) => {
//       // Login successful, redirect to dashboard
//       window.location.href = "studentdashboard.html";
//     })
//     .catch((error) => {
//       console.log(error);
//       // Handle login error
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       console.error(errorMessage);
//       // Display error message to user
//     });
// });

document.getElementById("login-btn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("user-type").value; // Get the selected user type

  if (userType === "student") {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful, redirect student to student dashboard
        window.location.href = "studentdashboard.html";
      })
      .catch((error) => {
        console.log(error);
        // Handle login error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        // Display error message to user
      });
  } else if (userType === "admin") {
    // Use admin credentials for admin login
    const adminEmail = "admin@lkolehiyo.com"; // Update with actual admin email
    const adminPassword = "admin1234"; // Update with actual admin password

    signInWithEmailAndPassword(auth, adminEmail, adminPassword)
      .then((userCredential) => {
        // Login successful, redirect admin to admin dashboard
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.log(error);
        // Handle login error
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorMessage);
        // Display error message to user
      });
  }
};
