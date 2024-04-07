document.addEventListener('DOMContentLoaded', function() {
    const ratings = document.querySelectorAll('.rating');
    const sendBtn = document.querySelector('#send');
    const panel = document.querySelector('#panel');

    let selectedRating = '';

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
    const firebaseApp = firebase.initializeApp(firebaseConfig);
    const database = firebaseApp.database();

    if (ratings) {
        ratings.forEach(button => {
            button.addEventListener('click', () => {
                selectedRating = button.value;
                removeActive();
                button.classList.add('active');
            });
        });
    }

    if (sendBtn) {
        sendBtn.addEventListener('click', (e) => {
            const name = document.querySelector('#name').value; // Get the value of the name input field
            const email = document.querySelector('#email').value; // Get the value of the email input field
            const description = document.querySelector('#message').value; // Get the value of the description textarea

            // Push data to Firebase
            const feedbackRef = database.ref('feedbacks').push();
            feedbackRef.set({
                name: name,
                email: email,
                rating: selectedRating,
                description: description,
                timestamp: firebase.database.ServerValue.TIMESTAMP // Add timestamp
            }).then(function () {
                panel.innerHTML = `
                Thank you!\n
                Name: ${name}\n
                Email: ${email}\n
                Feedback : ${selectedRating}\n
                Description: ${description}\n
                We'll use your feedback to improve our school system.`;
            }).catch(function (error) {
                console.error('Error submitting feedback:', error);
                panel.innerHTML = "An error occurred while submitting feedback. Please try again later.";
            });
        });
    }

    function removeActive() {
        ratings.forEach(button => {
            button.classList.remove('active');
        });
    }
});
