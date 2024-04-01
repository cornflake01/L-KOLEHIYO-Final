import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA4SI2yXymjL4cwtVvKtCxGTQOeMvU968w",
    authDomain: "l-kolehiyo-capstone.firebaseapp.com",
    databaseURL: "https://l-kolehiyo-capstone-default-rtdb.firebaseio.com",
    projectId: "l-kolehiyo-capstone",
    storageBucket: "l-kolehiyo-capstone.appspot.com",
    messagingSenderId: "1032233320347",
    appId: "1:1032233320347:web:109c19d37aec6d0364eb3e",
    measurementId: "G-D5R84EF8KY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Reference to the students in the database
const studentsRef = ref(db, 'students');

// Fetch student data from Firebase
onValue(studentsRef, (snapshot) => {
    const studentsData = snapshot.val();
    const studentTableBody = document.querySelector('#studentTable tbody');
    studentTableBody.innerHTML = ''; // Clear existing data

    // Iterate over each student and add to the table
    for (const key in studentsData) {
        if (Object.hasOwnProperty.call(studentsData, key)) {
            const student = studentsData[key];
            const studentRow = document.createElement('tr');
            studentRow.innerHTML = `
                <td>${student.name}</td>
                <td>${student.lrn}</td>
                <td>${student.email}</td>
                <td>${student.strand}</td>
                <td>${student.grade}</td>
                <td>${student.section}</td>
                <td>${student.username}</td>
                <td>
                    <button class="editBtn" data-id="${key}">Edit</button>
                    <input type="checkbox" name="selectedStudents" value="${key}">
                </td>
            `;
            studentTableBody.appendChild(studentRow);
        }
    }

    // Add event listeners to edit buttons
    const editButtons = document.querySelectorAll('.editBtn');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEdit);
    });
});

// Function to handle edit button click
function handleEdit(event) {
    const studentId = event.target.getAttribute('data-id');
    // You can navigate to the edit page or implement inline editing as per your requirements
}

// Function to navigate to the dashboard
function goToDashboard() {
    window.location.href = 'dashboard.html';
}

// Function to navigate to the add student page
document.getElementById('addStudentBtn').addEventListener('click', function() {
    window.location.href = 'addstudent.html';
});

// Function to delete selected students
document.getElementById('deleteSelectedBtn').addEventListener('click', function() {
    const selectedCheckboxes = document.querySelectorAll('input[name="selectedStudents"]:checked');
    const selectedKeys = [];
    selectedCheckboxes.forEach(checkbox => {
        selectedKeys.push(checkbox.value);
    });
    if (selectedKeys.length === 0) {
        alert("Please select at least one student to delete.");
        return;
    }
    if (confirm("Are you sure you want to delete the selected students?")) {
        selectedKeys.forEach(key => {
            remove(ref(db, 'students/' + key)).then(() => {
                console.log("Student deleted successfully.");
            }).catch((error) => {
                console.error("Error deleting student: ", error);
            });
        });
    }
});

