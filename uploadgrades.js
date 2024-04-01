import {
  ICT_SUBJECTS,
  HUMSS_SUBJECTS,
  STEM_SUBJECTS,
  ABM_SUBJECTS,
} from "./subjects.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  update,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

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
const gradesRef = ref(db, "grades");
const subjectSelect = document.getElementById("subject-select");
const semesterSelect = document.getElementById("semester-select");
const quarterSelect = document.getElementById("quarter-select");
const gradeLevelSelect = document.getElementById("grade-level-select");
const strandSelect = document.getElementById("strand-select");
const sectionSelect = document.getElementById("section-select");
const fileUpload = document.getElementById("fileUpload");

const uploadBtn = document.getElementById("upload-btn");

// Disable the selects
function checkInputs() {
  if (
    subjectSelect.value !== "SUBJECT" &&
    quarterSelect.value !== "QUARTER" &&
    semesterSelect.value !== "SEMESTER" &&
    gradeLevelSelect.value !== "GRADE LEVEL" &&
    strandSelect.value !== "STRAND" &&
    sectionSelect.value !== "SECTION" &&
    fileUpload.files.length > 0
  ) {
    uploadBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
  }
}

subjectSelect.addEventListener("change", checkInputs);
semesterSelect.addEventListener("change", checkInputs);
quarterSelect.addEventListener("change", checkInputs);
gradeLevelSelect.addEventListener("change", checkInputs);
strandSelect.addEventListener("change", () => {
  populateSubjectSelect();
  checkInputs();
});
sectionSelect.addEventListener("change", checkInputs);
fileUpload.addEventListener("change", checkInputs);

uploadBtn.onclick = () => {
  uploadGrades();
};

async function uploadGrades() {
  let reader = new FileReader();

  const file = fileUpload.files[0];
  if (file) {
    reader.readAsText(file);
  }

  reader.onload = async () => {
    let csv = reader.result;

    let cols = csv.split("\r\n");
    cols.shift();

    for (let col of cols) {
      let row = col.match(/(?:\"([^\"]*(?:\"\"[^\"]*)*)\")|([^\",]+)/g);

      if (row != null) {
        const studentRow = row.map((col) => col.replace(/(^"|"$)/g, ""));

        try {
          const dbRef = ref(getDatabase());
          const snapshot = await get(child(dbRef, `grades/${studentRow[0]}`));

          if (snapshot.exists()) {
            if (
              (semesterSelect.value === "1" &&
                (snapshot.val()?.firstSem?.finals ||
                  snapshot.val()?.firstSem?.midterm)) ||
              (semesterSelect.value === "2" &&
                (snapshot.val()?.secondSem?.finals ||
                  snapshot.val()?.secondSem?.midterm))
            ) {
              await updateGrades(studentRow);
            } else {
              createStudentGrades(studentRow);
            }
          } else {
            createStudentGrades(studentRow);
          }
        } catch (error) {
          alert("Something went wrong!");
          console.error("Error uploading grades: ", error);
        }
      }
    }
  };
}

// CREATE
async function createStudentGrades(studentRow) {
  if (subjectSelect.value !== "SUBJECT") {
    const isGrade11 = gradeLevelSelect.value === "11" ? true : false;
    const gradeLvl = isGrade11 ? "grade11" : "grade12";
    const isFirstSem = semesterSelect.value === "1" ? true : false;
    const sem = isFirstSem ? "firstSem" : "secondSem";
    const newValue =
      quarterSelect.value === "FINALS" ? studentRow[3] : studentRow[2];

    await changeSubjectValue(
      gradeLvl,
      sem,
      subjectSelect.value.toUpperCase(),
      newValue
    );
  }

  const { firstSem, secondSem } = await getSubjectsPerSem();

  try {
    await set(ref(db, "grades/" + studentRow[0]), {
      lrn: studentRow[0],
      student: studentRow[1],
      grade: gradeLevelSelect.value,
      section: sectionSelect.value,
      strand: strandSelect.value,
      firstSem: firstSem,
      secondSem: secondSem,
    });

    console.log("New grades added successfully.");
  } catch (error) {
    alert("Something went wrong!");
    console.log("Error creating grades: " + error);
  }
}

async function updateGrades(studentRow) {
  const dbRef = ref(getDatabase());
  const snapshot = await get(child(dbRef, `grades/${studentRow[0]}`));

  const previousGrades = snapshot.val();

  if (subjectSelect.value !== "SUBJECT") {
    const isGrade11 = gradeLevelSelect.value === "11" ? true : false;
    const gradeLvl = isGrade11 ? "grade11" : "grade12";
    const isFirstSem = semesterSelect.value === "1" ? true : false;
    const sem = isFirstSem ? "firstSem" : "secondSem";
    const newValue =
      quarterSelect.value === "FINALS" ? studentRow[3] : studentRow[2];

    await changeSubjectValue(
      gradeLvl,
      sem,
      subjectSelect.value.toUpperCase(),
      newValue
    );
  }

  let { firstSem, secondSem } = await getSubjectsPerSem();

  console.log(firstSem);
  console.log(secondSem);
  console.log({
    [subjectSelect.value.toUpperCase()]:
      firstSem?.midterm[subjectSelect.value.toUpperCase()],
  });
  console.log(subjectSelect.value.toUpperCase());

  try {
    await update(ref(db, "grades/" + studentRow[0]), {
      lrn: studentRow[0],
      student: studentRow[1],
    });

    if (firstSem && semesterSelect.value === "1") {
      if (firstSem?.midterm && quarterSelect.value === "MIDTERM") {
        const prevMidterm =
          previousGrades?.firstSem?.midterm || firstSem?.midterm;
        const prevFinals = previousGrades?.firstSem?.finals || firstSem?.finals;

        await update(ref(db, "grades/" + studentRow[0]), {
          firstSem: {
            midterm: {
              ...prevMidterm,
              [subjectSelect.value.toUpperCase()]:
                firstSem?.midterm[subjectSelect.value.toUpperCase()],
            },
            finals: {
              ...prevFinals,
            },
          },
        });
      }

      if (firstSem?.finals && quarterSelect.value === "FINALS") {
        const prevFinals = previousGrades?.firstSem?.finals || firstSem?.finals;
        const prevMidterm =
          previousGrades?.firstSem?.midterm || firstSem?.midterm;

        await update(ref(db, "grades/" + studentRow[0]), {
          firstSem: {
            midterm: {
              ...prevMidterm,
            },
            finals: {
              ...prevFinals,
              [subjectSelect.value.toUpperCase()]:
                firstSem?.finals[subjectSelect.value.toUpperCase()],
            },
          },
        });
      }
    }

    if (secondSem && semesterSelect.value === "2") {
      if (secondSem?.midterm && quarterSelect.value === "MIDTERM") {
        const prevMidterm =
          previousGrades?.secondSem?.midterm || secondSem?.midterm;
        const prevFinals =
          previousGrades?.secondSem?.finals || secondSem?.finals;

        await update(ref(db, "grades/" + studentRow[0]), {
          secondSem: {
            midterm: {
              ...prevMidterm,
              [subjectSelect.value.toUpperCase()]:
                secondSem?.midterm[subjectSelect.value.toUpperCase()],
            },
            finals: {
              ...prevFinals,
            },
          },
        });
      }

      if (secondSem?.finals && quarterSelect.value === "FINALS") {
        const prevFinals =
          previousGrades?.secondSem?.finals || secondSem?.finals;
        const prevMidterm =
          previousGrades?.secondSem?.midterm || secondSem?.midterm;

        await update(ref(db, "grades/" + studentRow[0]), {
          secondSem: {
            midterm: {
              ...prevMidterm,
            },
            finals: {
              ...prevFinals,
              [subjectSelect.value.toUpperCase()]:
                secondSem?.finals[subjectSelect.value.toUpperCase()],
            },
          },
        });
      }
    }

    console.log("Grades updated successfully.");
  } catch (error) {
    alert("Something went wrong!");
    console.log("Error updating grades: " + error);
  }
}

function getSubjectsPerSem() {
  let firstSem = null;
  let secondSem = null;

  // FIRST SEM
  if (semesterSelect.value === "1") {
    if (gradeLevelSelect.value === "11") {
      switch (strandSelect.value) {
        case "ICT":
          firstSem = {
            midterm: ICT_SUBJECTS.grade11.firstSem,
            finals: ICT_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: ICT_SUBJECTS.grade11.secondSem,
            finals: ICT_SUBJECTS.grade11.secondSem,
          };
          break;
        case "ABM":
          firstSem = {
            midterm: ABM_SUBJECTS.grade11.firstSem,
            finals: ABM_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: ABM_SUBJECTS.grade11.secondSem,
            finals: ABM_SUBJECTS.grade11.secondSem,
          };
          break;
        case "STEM":
          firstSem = {
            midterm: STEM_SUBJECTS.grade11.firstSem,
            finals: STEM_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: STEM_SUBJECTS.grade11.secondSem,
            finals: STEM_SUBJECTS.grade11.secondSem,
          };
          break;
        case "HUMMS":
          firstSem = {
            midterm: HUMSS_SUBJECTS.grade11.firstSem,
            finals: HUMSS_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: HUMSS_SUBJECTS.grade11.secondSem,
            finals: HUMSS_SUBJECTS.grade11.secondSem,
          };
          break;
        default:
          firstSem = "";
          break;
      }
    } else {
      switch (strandSelect.value) {
        case "ICT":
          firstSem = {
            midterm: ICT_SUBJECTS.grade12.firstSem,
            finals: ICT_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: ICT_SUBJECTS.grade12.secondSem,
            finals: ICT_SUBJECTS.grade12.secondSem,
          };
          break;
        case "ABM":
          firstSem = {
            midterm: ABM_SUBJECTS.grade12.firstSem,
            finals: ABM_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: ABM_SUBJECTS.grade12.secondSem,
            finals: ABM_SUBJECTS.grade12.secondSem,
          };
          break;
        case "STEM":
          firstSem = {
            midterm: STEM_SUBJECTS.grade12.firstSem,
            finals: STEM_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: STEM_SUBJECTS.grade12.secondSem,
            finals: STEM_SUBJECTS.grade12.secondSem,
          };
          break;
        case "HUMMS":
          firstSem = {
            midterm: HUMSS_SUBJECTS.grade12.firstSem,
            finals: HUMSS_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: HUMSS_SUBJECTS.grade12.secondSem,
            finals: HUMSS_SUBJECTS.grade12.secondSem,
          };
          break;
        default:
          break;
      }
    }
  }

  // SECOND SEM
  // FIRST SEM
  if (semesterSelect.value === "2") {
    if (gradeLevelSelect.value === "11") {
      switch (strandSelect.value) {
        case "ICT":
          firstSem = {
            midterm: ICT_SUBJECTS.grade11.firstSem,
            finals: ICT_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: ICT_SUBJECTS.grade11.secondSem,
            finals: ICT_SUBJECTS.grade11.secondSem,
          };
          break;
        case "ABM":
          firstSem = {
            midterm: ABM_SUBJECTS.grade11.firstSem,
            finals: ABM_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: ABM_SUBJECTS.grade11.secondSem,
            finals: ABM_SUBJECTS.grade11.secondSem,
          };
          break;
        case "STEM":
          firstSem = {
            midterm: STEM_SUBJECTS.grade11.firstSem,
            finals: STEM_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: STEM_SUBJECTS.grade11.secondSem,
            finals: STEM_SUBJECTS.grade11.secondSem,
          };
          break;
        case "HUMMS":
          firstSem = {
            midterm: HUMSS_SUBJECTS.grade11.firstSem,
            finals: HUMSS_SUBJECTS.grade11.firstSem,
          };
          secondSem = {
            midterm: HUMSS_SUBJECTS.grade11.secondSem,
            finals: HUMSS_SUBJECTS.grade11.secondSem,
          };
          break;
        default:
          secondSem = "";
          break;
      }
    } else {
      switch (strandSelect.value) {
        case "ICT":
          firstSem = {
            midterm: ICT_SUBJECTS.grade12.firstSem,
            finals: ICT_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: ICT_SUBJECTS.grade12.secondSem,
            finals: ICT_SUBJECTS.grade12.secondSem,
          };
          break;
        case "ABM":
          firstSem = {
            midterm: ABM_SUBJECTS.grade12.firstSem,
            finals: ABM_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: ABM_SUBJECTS.grade12.secondSem,
            finals: ABM_SUBJECTS.grade12.secondSem,
          };
          break;
        case "STEM":
          firstSem = {
            midterm: STEM_SUBJECTS.grade12.firstSem,
            finals: STEM_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: STEM_SUBJECTS.grade12.secondSem,
            finals: STEM_SUBJECTS.grade12.secondSem,
          };
          break;
        case "HUMMS":
          firstSem = {
            midterm: HUMSS_SUBJECTS.grade12.firstSem,
            finals: HUMSS_SUBJECTS.grade12.firstSem,
          };
          secondSem = {
            midterm: HUMSS_SUBJECTS.grade12.secondSem,
            finals: HUMSS_SUBJECTS.grade12.secondSem,
          };
          break;
        default:
          break;
      }
    }
  }

  return { firstSem, secondSem };
}

function changeSubjectValue(grade, semester, subject, newValue) {
  let subjects = [];

  switch (strandSelect.value) {
    case "ICT":
      subjects = ICT_SUBJECTS;
      break;
    case "ABM":
      subjects = ABM_SUBJECTS;
      break;
    case "HUMSS":
      subjects = HUMSS_SUBJECTS;
      break;
    case "STEM":
      subjects = STEM_SUBJECTS;
      break;
    default:
      break;
  }

  if (
    subjects.hasOwnProperty(grade) &&
    subjects[grade].hasOwnProperty(semester) &&
    subjects[grade][semester].hasOwnProperty(subject)
  ) {
    subjects[grade][semester][subject] = newValue;

    console.log(
      `Value of ${subject} in ${grade} ${semester} changed to ${newValue}`
    );

    return subjects;
  } else {
    console.error(`Invalid grade, semester, or subject`);
  }
}
// Example usage:
// changeSubjectValue("grade11", "firstSem", "GEN_MATH", "A");

// CHecking lang ng laman nung mga grades
get(gradesRef).then((snapshot) => {
  if (snapshot.exists()) {
    // Itong remove, i clear niya yung mga data sa 'grades"
    // remove(gradesRef, "grades");
    console.log(snapshot.val());
  } else {
    console.log("NO data found");
  }
});

// GET UNIQUE SUBJECTS PER STRAND
function extractUniqueSubjects(subjectsObject) {
  const uniqueSubjects = new Set();

  // Iterate over each grade level
  Object.values(subjectsObject).forEach((grade) => {
    // Iterate over each semester
    Object.values(grade).forEach((semester) => {
      // Iterate over each subject
      Object.keys(semester).forEach((subject) => {
        // Add subject to the set
        uniqueSubjects.add(subject);
      });
    });
  });

  // Convert set to array and return
  return Array.from(uniqueSubjects);
}

// Render all unique subjects in the subject dropdown
function populateSubjectSelect() {
  let subjects = [];
  // Clear existing options
  subjectSelect.innerHTML = "<option selected disabled hidden>SUBJECT</option>";

  switch (strandSelect.value) {
    case "ICT":
      subjects = ICT_SUBJECTS;
      break;
    case "ABM":
      subjects = ABM_SUBJECTS;
      break;
    case "HUMSS":
      subjects = HUMSS_SUBJECTS;
      break;
    case "STEM":
      subjects = STEM_SUBJECTS;
      break;

    default:
      break;
  }

  const uniqueSubjectsArray = extractUniqueSubjects(subjects);

  uniqueSubjectsArray.forEach((subject, index) => {
    const option = document.createElement("option");
    option.value = subject;
    option.textContent = subject;
    subjectSelect.appendChild(option);
  });

  console.log(subjects);
}

function populateSectionSelect() {
  let sections = ["St Dominic", "St John", "St Peter"];
  // Clear existing options
  sectionSelect.innerHTML = "<option selected disabled hidden>SUBJECT</option>";

  sections.forEach((section, index) => {
    const option = document.createElement("option");
    option.value = section;
    option.textContent = section;
    sectionSelect.appendChild(option);
  });
}

populateSectionSelect();
