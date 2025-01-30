// Import Firebase app and Firestore functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxWpU8TWBDdiDP7zZxKW2ovS1OBYddixA",
  authDomain: "legivo-1.firebaseapp.com",
  projectId: "legivo-1",
  storageBucket: "legivo-1.firebasestorage.app",
  messagingSenderId: "733952528595",
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426",
  measurementId: "G-X5NH69G6DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch word data from Firestore
async function fetchWords() {
  const wordCollection = collection(db, "words");
  const wordSnapshot = await getDocs(wordCollection);
  const words = wordSnapshot.docs.map(doc => doc.data().name);
  return words;
}

async function fetchTexts() {
  const textCollection = collection(db, "texts");
  const textSnapshot = await getDocs(textCollection);
  const texts = textSnapshot.docs.map(doc => doc.data());
  return texts;
}

window.onload = async () => {
  try {
    const words = await fetchWords();
    const texts = await fetchTexts();

    const statTextNumber = document.querySelector(".stat-text-number");
    const statWordNumber = document.querySelector(".stat-word-number");

    if (statTextNumber) {
      statTextNumber.textContent = texts.length; // Use actual data
    }

    if (statWordNumber) {
      statWordNumber.textContent = words.length; // Use actual data
    }

    const selectedTextContainer = document.querySelector(".selected-texts-container"); // Parent div for cards

    texts.forEach(text => {
      const card = document.createElement("div");
      card.classList.add("selected-text"); // Add your CSS class for styling

      card.innerHTML = `
        <h5 class="card-title">${text.title}</h5>
        <p class="text-level">Level: ${text.level}</p>
        <img src="default.jpg" alt="Text Image" class="selected-text-image"> <!-- Change as needed -->
      `;
      
      if (selectedTextContainer.children.length < 6) {
        selectedTextContainer.appendChild(card);
      }
      
    })

  } catch (error) {
    console.error("Error fetching Firestore data:", error);
  }
};


