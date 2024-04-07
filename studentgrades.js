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
  measurementId: "G-P8QC5255QR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth();

// Reference to the students in the database
const gradesRef = ref(db, "grades");
const studentsRef = ref(db, "students");

const gradesTableElFirstSemMidterm = document.getElementById(
  "grades-table-firstSem-midterm"
);
const gradesTableElFirstSemFinals = document.getElementById(
  "grades-table-firstSem-finals"
);
const gradesTableElSecondSemMidterm = document.getElementById(
  "grades-table-secondSem-midterm"
);
const gradesTableElSecondSemFinals = document.getElementById(
  "grades-table-secondSem-finals"
);

onValue(studentsRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    if (childSnapshot.val().email === auth.currentUser.email) {
      renderGrades(childSnapshot.val().lrn);
    }
  });
});

function renderGrades(lrn) {
  onValue(gradesRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.val().lrn === lrn) {
        const gradesInfo = childSnapshot.val();

        console.log(gradesInfo);

        if (gradesInfo?.firstSem?.midterm) {
          // FIRST SEM MIDTERM
          const tableHeadersFirstSemMidterm = `
          <thead>
          <tr>
          <th scope="col">LRN</th>
          <th scope="col">STUDENT</th>
          ${Object.keys(gradesInfo.firstSem?.midterm)
            .map((subject) => `<th scope="col">${subject}</th>`)
            .join("")}
            </tr>
            </thead>
            `;

          const tableBodyFirstSemMidterm = `
            <tbody>
            <tr>
            <td scope="row">${gradesInfo.lrn}</td>
            <td scope="row">${gradesInfo.student}</td>
            ${Object.values(gradesInfo.firstSem?.midterm)
              .map((grade) => `<td>${grade}</td>`)
              .join("")}
              </tr>
              </tbody>
              `;

          gradesTableElFirstSemMidterm.innerHTML =
            tableHeadersFirstSemMidterm + tableBodyFirstSemMidterm;
        }

        if (gradesInfo?.firstSem?.finals) {
          // FIRST SEM FINALS
          const tableHeadersFirstSemFinals = `
              <thead>
              <tr>
              <th scope="col">LRN</th>
              <th scope="col">STUDENT</th>
              ${Object.keys(gradesInfo.firstSem?.finals)
                .map((subject) => `<th scope="col">${subject}</th>`)
                .join("")}
              </tr>
              </thead>
              `;

          const tableBodyFirstSemFinals = `
              <tbody>
              <tr>
              <td scope="row">${gradesInfo.lrn}</td>
              <td scope="row">${gradesInfo.student}</td>
              ${Object.values(gradesInfo.firstSem?.finals)
                .map((grade) => `<td>${grade}</td>`)
                .join("")}
                </tr>
                </tbody>
              `;

          gradesTableElFirstSemFinals.innerHTML =
            tableHeadersFirstSemFinals + tableBodyFirstSemFinals;
        }

        if (gradesInfo?.secondSem?.midterm) {
          // SECOND SEM MIDTERM
          const tableHeadersSecondSemMidterm = `
            <thead>
              <tr>
                <th scope="col">LRN</th>
                <th scope="col">STUDENT</th>
                ${Object.keys(gradesInfo.secondSem?.midterm)
                  .map((subject) => `<th scope="col">${subject}</th>`)
                  .join("")}
              </tr>
            </thead>
          `;

          const tableBodySecondSemMidterm = `
            <tbody>
              <tr>
                <td scope="row">${gradesInfo.lrn}</td>
                <td scope="row">${gradesInfo.student}</td>
                ${Object.values(gradesInfo.secondSem?.midterm)
                  .map((grade) => `<td>${grade}</td>`)
                  .join("")}
              </tr>
            </tbody>
          `;

          gradesTableElSecondSemMidterm.innerHTML =
            tableHeadersSecondSemMidterm + tableBodySecondSemMidterm;
        }

        if (gradesInfo?.secondSem?.finals) {
          // SECOND SEM FINALS
          const tableHeadersSecondSemFinals = `
            <thead>
              <tr>
                <th scope="col">LRN</th>
                <th scope="col">STUDENT</th>
                ${Object.keys(gradesInfo.secondSem?.finals)
                  .map((subject) => `<th scope="col">${subject}</th>`)
                  .join("")}
              </tr>
            </thead>
            `;

          const tableBodySecondSemFinals = `
            <tbody>
              <tr>
                <td scope="row">${gradesInfo.lrn}</td>
                <td scope="row">${gradesInfo.student}</td>
                ${Object.values(gradesInfo.secondSem?.finals)
                  .map((grade) => `<td>${grade}</td>`)
                  .join("")}
              </tr>
            </tbody>
            `;

          gradesTableElSecondSemFinals.innerHTML =
            tableHeadersSecondSemFinals + tableBodySecondSemFinals;
        }
      }
    });
  });
}
