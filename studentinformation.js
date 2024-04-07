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
  apiKey: "AIzaSyB-W9ZBwlkefbJjicz9Mw0OuUrWI6FHnWk",
  authDomain: "l-kolehiyo-8b253.firebaseapp.com",
  databaseURL: "https://l-kolehiyo-8b253-default-rtdb.firebaseio.com",
  projectId: "l-kolehiyo-8b253",
  storageBucket: "l-kolehiyo-8b253.appspot.com",
  messagingSenderId: "289094522635",
  appId: "1:289094522635:web:5db3616b0468d52888b40e",
  measurementId: "G-P8QC5255QR",
};

console.log("hi");

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
      <avaaaatr>
        <td>Username :</tda>a
        <td>${user.username}</td>
      </tr>
      <tr>
        <td>Password :</td>
        <td>${user.password}</td>
      </tr>
    `;
}
