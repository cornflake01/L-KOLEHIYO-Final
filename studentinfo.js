import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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
                    <button class="btn btn-custom editBtn" data-id="${key}">Edit</button>
                    <input type="checkbox" name="selectedStudents" value="${key}">
                </td>
            `;
            studentTableBody.appendChild(studentRow);

            // Add event listener to the dynamically generated edit button
            const editButton = studentRow.querySelector('.editBtn');
            editButton.addEventListener('click', handleEdit);
        }
    }
});

// Function to handle edit button click
function handleEdit(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const studentId = event.target.getAttribute('data-id');
    const studentRef = ref(db, `students/${studentId}`);

    // Fetch the student data from Firebase
    onValue(studentRef, (snapshot) => {
        const studentData = snapshot.val();

        // Set the form field values with the student data
        document.getElementById('name').value = studentData.name || '';
        document.getElementById('lrn').value = studentData.lrn || '';
        document.getElementById('email').value = studentData.email || '';
        document.getElementById('strand').value = studentData.strand || '';
        document.getElementById('grade').value = studentData.grade || '';
        document.getElementById('section').value = studentData.section || '';
        document.getElementById('username').value = studentData.username || '';

        // Set the data-id attribute of the form for reference during submission
        document.getElementById('editForm').setAttribute('data-id', studentId);

        // Display the edit form
        document.getElementById('editFormContainer').style.display = 'block';
    });
}

// Function to handle form submission for editing student information
document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Retrieve form field values
    const name = document.getElementById('name').value;
    const lrn = document.getElementById('lrn').value;
    const email = document.getElementById('email').value;
    const strand = document.getElementById('strand').value;
    const grade = document.getElementById('grade').value;
    const section = document.getElementById('section').value;
    const username = document.getElementById('username').value;

    // Retrieve the student ID
    const studentId = document.getElementById('editForm').getAttribute('data-id');

    // Reference to the specific student node in Firebase
    const studentRef = ref(db, `students/${studentId}`);

    // Prepare an object to hold the updated fields
    const updatedFields = {};
    if (name !== '') updatedFields.name = name;
    if (lrn !== '') updatedFields.lrn = lrn;
    if (email !== '') updatedFields.email = email;
    if (strand !== '') updatedFields.strand = strand;
    if (grade !== '') updatedFields.grade = grade;
    if (section !== '') updatedFields.section = section;
    if (username !== '') updatedFields.username = username;

    // Update the student information in Firebase
    update(studentRef, updatedFields).then(() => {
        alert("Student information updated successfully.");
        // Hide the edit form after submission
        document.getElementById('editFormContainer').style.display = 'none';
    }).catch((error) => {
        console.error("Error updating student information: ", error);
    });
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
