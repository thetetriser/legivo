import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxWpU8TWBDdiDP7zZxKW2ovS1OBYddixA",
  authDomain: "legivo-1.firebaseapp.com",
  projectId: "legivo-1",
  storageBucket: "legivo-1.firebaseapp.com",
  messagingSenderId: "733952528595",
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function toggleAnswer(event) {
  const answerElement = event.target.previousElementSibling; // This assumes the button is directly after the answer
  answerElement.classList.toggle('hidden');
  
  // Optionally, change the button text too
  if (answerElement.classList.contains('hidden')) {
    event.target.innerText = 'Show Answer';
  } else {
    event.target.innerText = 'Hide Answer';
  }
}

async function loadText() {
  // Get the "no" parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const no = urlParams.get('no');

  if (!no) {
    console.error("No text ID provided in the URL.");
    document.getElementById('text-content').innerText = "No text ID provided.";
    return;
  }

  try {
    // Query Firestore for the document with the matching "no" value
    const collectionRef = collection(db, "texts");
    const q = query(collectionRef, where("no", "==", parseInt(no)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Assuming the "no" is unique, get the first document
      const doc = querySnapshot.docs[0].data();

      // Update the page content
      document.title = doc.title; // Update browser tab title
      document.getElementById('text-title').innerText = doc.title; // Update the page title
      document.getElementById('text-content').innerText = doc.content; // Update the text content

      // Display questions and answers
      const questionsContainer = document.getElementById('questions-container');
      doc.questions.forEach((qna, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question-answer'); // Optional for styling

        // Add question and answer to the HTML
        questionElement.innerHTML = `
          <p><strong>Question ${index + 1}:</strong> ${qna.question}</p>
          <p class="answer hidden"><strong>Answer:</strong> ${qna.answer}</p>
          <button class="show-answer-btn">Show Answer</button>
        `;
        questionsContainer.appendChild(questionElement);

        // Add event listener for the "Show Answer" button
        const showAnswerButton = questionElement.querySelector('.show-answer-btn');
        showAnswerButton.addEventListener('click', toggleAnswer);
      });
    } else {
      console.error("No document found with the specified ID.");
      document.getElementById('text-content').innerText = "Text not found.";
    }
  } catch (error) {
    console.error("Error fetching text:", error);
    document.getElementById('text-content').innerText = "An error occurred while loading the text.";
  }
}

// Call loadText when the page loads
window.onload = loadText;
