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
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4SI2yXymjL4cwtVvKtCxGTQOeMvU968w",
  authDomain: "l-kolehiyo-capstone.firebaseapp.com",
  databaseURL: "https://l-kolehiyo-capstone-default-rtdb.firebaseio.com",
  projectId: "l-kolehiyo-capstone",
  storageBucket: "l-kolehiyo-capstone.appspot.com",
  messagingSenderId: "1032233320347",
  appId: "1:1032233320347:web:109c19d37aec6d0364eb3e",
  measurementId: "G-D5R84EF8KY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const auth = getAuth();

// Reference to the students in the database
const studentsRef = ref(db, "students");

onValue(studentsRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    console.log(childSnapshot.val());
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    onValue(
      studentsRef,
      (snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if (childSnapshot.val().email === user.email) {
            renderStudentInfo(childSnapshot.val());
          }
        });
      }
      // {
      //   onlyOnce: true, // This ensures that the listener is only triggered once
      // }
    );

    console.log("User is logged in:", user.email);
  } else {
    console.log("User is logged out");
  }
});

function renderStudentInfo(user) {
  document.getElementById("studentinformation-table").innerHTML = `
      <tr>
        <td>Name :</td>
        <td>${user.name}</td>
      </tr>
      <tr>
        <td>LRN :</td>
        <td>${user.lrn}</td>
      </tr>
      <tr>
        <td>Email :</td>
        <td>${user.email}</td>
      </tr>
      <tr>
        <td>Strand :</td>
        <td>${user.strand}</td>
      </tr>
      <tr>
        <td>Grade Level :</td>
        <td>${user.grade}</td>
      </tr>
      <tr>
        <td>Section :</td>
        <td>${user.section}</td>
      </tr>
      <tr>
        <td>Username :</td>
        <td>${user.username}</td>
      </tr>
      <tr>
        <td>Password :</td>
        <td>${user.password}</td>
      </tr>
    `;
}
