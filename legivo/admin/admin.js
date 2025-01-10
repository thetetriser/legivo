// Import Firebase app and Firestore functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, doc, setDoc, updateDoc, arrayUnion, FieldValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxWpU8TWBDdiDP7zZxKW2ovS1OBYddixA",
  authDomain: "legivo-1.firebaseapp.com",
  projectId: "legivo-1",
  storageBucket: "legivo-1.appspot.com",
  messagingSenderId: "733952528595",
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426",
  measurementId: "G-X5NH69G6DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Text Function
const textForm = document.getElementById("text-form");
textForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const textId = document.getElementById("text-id").value.trim();
  const textContent = document.getElementById("text-content").value.trim();
  const textNo = document.getElementById("text-no").value.trim();
  

  if (textId === "") {
    alert("Please enter a text ID.");
    return;
  }

  if (textContent === "") {
    alert("Please enter text content.");
    return;
  }

  if (textNo === "") {
    alert("Please enter a text number.");
    return;
  }

  try {
    await setDoc(doc(db, "texts", textId), {
      no: parseInt(textNo), // Convert textNo to a number using parseInt() function.textNo,
      title: textId,
      content: textContent,
      questions: []

    });
    alert("Text added successfully!");
    textForm.reset();
  } catch (error) {
    console.error("Error adding text:", error);
    alert("Failed to add the text. Please try again later.");
  }
});

// Add Question Function
const questionForm = document.getElementById("question-form");
questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const textId = document.getElementById("text-id-question").value.trim();
  const questionText = document.getElementById("question-text").value.trim();

  if (textId === "") {
    alert("Please select a text.");
    return;
  }

  if (questionText === "") {
    alert("Please enter a question.");
    return;
  }

  const options = Array.from(document.querySelectorAll(".option")).map((input) => ({
    value: input.value.trim(),
    answer: false,
  }));

  if (options.length === 0) {
    alert("Please add at least one option.");
    return;
  }

  const correctOption = parseInt(document.getElementById("correct-option").value);

  if (correctOption < 0 || correctOption >= options.length) {
    alert("Please select a valid correct option.");
    return;
  }

  options[correctOption].answer = true;

  try {
    await updateDoc(doc(db, "texts", textId), {
      questions: arrayUnion({
        question: questionText,
        options: options,
      }),
    });
    alert("Question added successfully!");
    questionForm.reset();
  } catch (error) {
    console.error("Error adding question:", error);
    alert("Failed to add the question. Please try again later.");
  }
});
