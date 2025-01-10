import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// Handle form submission
document.getElementById("add-word-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const wordsInput = document.getElementById("words-input").value;
    const wordsArray = wordsInput
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
  
    const wordsData = wordsArray.map((line) => {
      const [name, definition, tos, questionsRaw] = line.split(" | ").map((part) => part.trim());
  
      if (!name || !definition || !tos || !questionsRaw) {
        throw new Error(`Invalid input format in: ${line}`);
      }
  
      // Process the questions
      const questions = [];
      const questionPairs = questionsRaw.replace(">", "").split("&");
      
      questionPairs.forEach((pair) => {
        const parts = pair.split(":").map((part) => part.trim());
        
        // Validate if both question and answer are present
        if (parts.length === 2) {
          const [question, answer] = parts;
          if (question && answer) {
            questions.push({ question, answer });
          } else {
            throw new Error(`Invalid question/answer pair in: ${pair}`);
          }
        } else {
          // If the pair is not in the correct format, handle it as invalid
          console.warn(`Skipping invalid question/answer pair: ${pair}`);
        }
      });
  
      return { name, definition, tos, questions };
    });
  
    try {
      const wordsCollection = collection(db, "words");
      for (const wordData of wordsData) {
        await addDoc(wordsCollection, wordData);
      }
      alert("Words added successfully!");
    } catch (error) {
      console.error("Error adding words:", error);
      alert("Failed to add words. Check console for details.");
    }
  });
  