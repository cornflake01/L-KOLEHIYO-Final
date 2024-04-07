import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

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

// Reference to the events in the database
const eventsRef = ref(db, 'events');

// Function to fetch and display events
function displayEvents() {
    const eventBody = document.getElementById("eventBody");

    // Listen for changes to the data at this reference
    onValue(eventsRef, (snapshot) => {
        eventBody.innerHTML = ""; // Clear previous event list

        // Iterate through each child node (event) in the database
        snapshot.forEach((childSnapshot) => {
            const event = childSnapshot.val(); // Get the event data
            const tr = document.createElement("tr"); // Create a table row
            tr.innerHTML = `
                <td>${event.title}</td>
                <td>${event.date}</td>
                <td>${event.description}</td>
                <td><input type="checkbox" name="selectedEvent" value="${childSnapshot.key}"></td>
            `; // Set the HTML content for the row
            eventBody.appendChild(tr); // Append the row to the table body
        });
    });
}

// Call the displayEvents function when the page loads
displayEvents();

// Function to navigate to the add event page
document.getElementById('addEventBtn').addEventListener('click', function() {
    window.location.href = 'calendar.html';
});

// Function to delete selected event
document.getElementById('deleteEventBtn').addEventListener('click', function() {
    const selectedEvents = document.querySelectorAll('input[name="selectedEvent"]:checked');
    if (selectedEvents.length === 0) {
        alert("Please select at least one event to delete.");
        return;
    }
    if (confirm("Are you sure you want to delete the selected events?")) {
        selectedEvents.forEach(selectedEvent => {
            remove(ref(db, `events/${selectedEvent.value}`)).then(() => {
                console.log("Event deleted successfully.");
            }).catch((error) => {
                console.error("Error deleting event: ", error);
            });
        });
    }
});
