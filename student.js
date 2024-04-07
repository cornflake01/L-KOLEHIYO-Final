// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

// Reference to the student data in Firebase
const studentRef = ref(db, 'students');

// Function to fetch and display student data in the table
function displayStudents() {
    onValue(studentRef, (snapshot) => {
        const students = snapshot.val();
        const studentTableBody = document.querySelector('#studentTable tbody');
        studentTableBody.innerHTML = '';

        for (const key in students) {
            const student = students[key];
            const row = `
                <tr>
                    <td>${student.name}</td>
                    <td>${student.lrn}</td>
                    <td>${student.email}</td>
                    <td>${student.strand}</td>
                    <td>${student.grade}</td>
                    <td>${student.section}</td>
                    <td>${student.username}</td>
                </tr>
            `;
            studentTableBody.innerHTML += row;
        }
    });
}

// Call the function to display students when the page loads
window.onload = displayStudents;
