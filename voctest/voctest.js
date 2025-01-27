import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxWpU8TWBDdiDP7zZxKW2ovS1OBYddixA",
  authDomain: "legivo-1.firebaseapp.com",
  projectId: "legivo-1",
  storageBucket: "legivo-1.appspot.com",
  messagingSenderId: "733952528595",
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch word data from Firestore (including synonyms)
async function fetchWordData(words) {
  const wordDataMap = new Map();

  for (const word of words) {
    const wordQuery = query(collection(db, "words"), where("name", "==", word));
    const querySnapshot = await getDocs(wordQuery);

    if (!querySnapshot.empty) {
      const wordData = querySnapshot.docs[0].data();
      wordDataMap.set(word, wordData);
    }
  }
  
  return wordDataMap;
}

// Function to handle page load and display words
window.onload = async () => {
  const selectedWords = JSON.parse(localStorage.getItem("selectedWords"));

  if (!selectedWords || selectedWords.length === 0) {
    alert("No words selected for the test.");
    return;
  }

  const wordDataMap = await fetchWordData(selectedWords);

  // Display words and definitions
  const wordListContainer = document.getElementById("word-list");
  selectedWords.forEach(word => {
    const wordData = wordDataMap.get(word);
    if (wordData) {
      const listItem = document.createElement("li");
      listItem.innerHTML = `<strong>${word}</strong>: ${wordData.definition}`;
      wordListContainer.appendChild(listItem);
    }
  });

  // You can now proceed to generate the test based on word data
};
