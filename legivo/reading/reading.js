import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDxWpU8TWBDdiDP7zZxKW2ovS1OBYddixA",
  authDomain: "legivo-1.firebaseapp.com",
  projectId: "legivo-1",
  storageBucket: "legivo-1.appspot.com",
  messagingSenderId: "733952528595",
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let highlightedWords = new Set(); // Track highlighted words
let listedWords = new Set(); // Track words added to the list

async function loadText() {
  const urlParams = new URLSearchParams(window.location.search);
  const no = urlParams.get('no');

  if (!no) {
    console.error("No text ID provided in the URL.");
    document.getElementById('text-content').innerText = "No text ID provided.";
    return;
  }

  try {
    const collectionRef = collection(db, "texts");
    const q = query(collectionRef, where("no", "==", parseInt(no)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const textDoc = querySnapshot.docs[0].data();

      const wordsCollectionRef = collection(db, "words");
      const wordsSnapshot = await getDocs(wordsCollectionRef);

      const wordsSet = new Set();
      const wordDataMap = new Map();

      wordsSnapshot.forEach((wordDoc) => {
        const wordData = wordDoc.data();
        if (wordData && wordData.name) {
          const word = wordData.name.toLowerCase().replace(/[^\w\s]|_/g, "");
          wordsSet.add(word);
          wordDataMap.set(word, wordData);
        }
      });

      const originalContent = textDoc.content;
      const wordsRegex = new RegExp(`\\b(${Array.from(wordsSet).join('|')})\\b`, 'gi');

      const modifiedContent = originalContent.replace(wordsRegex, (match) => {
        return `<button class="clickable-word" data-word="${match.toLowerCase()}">${match}</button>`;
      });

      document.title = textDoc.title;
      document.getElementById('text-title').innerText = textDoc.title;
      document.getElementById('text-content').innerHTML = modifiedContent;

      setupWordInteractions(wordDataMap);
    } else {
      console.error("No document found with the specified ID.");
      document.getElementById('text-content').innerText = "Text not found.";
    }
  } catch (error) {
    console.error("Error fetching text:", error);
    document.getElementById('text-content').innerText = "An error occurred while loading the text.";
  }
}

function setupWordInteractions(wordDataMap) {
  const textContent = document.getElementById('text-content');
  const wordList = document.getElementById('words-in-text');

  textContent.addEventListener('mouseenter', () => {
    const words = document.querySelectorAll('.clickable-word');
    words.forEach((word) => {
      const wordText = word.getAttribute('data-word');
      if (!listedWords.has(wordText)) {
        word.classList.add('highlighted');
        highlightedWords.add(wordText);
      }
    });
  });

  textContent.addEventListener('mouseleave', () => {
    const words = document.querySelectorAll('.clickable-word');
    words.forEach((word) => {
      word.classList.remove('highlighted');
    });
    highlightedWords.clear();
  });

  textContent.addEventListener('click', (event) => {
    if (event.target.matches('.clickable-word')) {
      const wordButton = event.target;
      const word = wordButton.getAttribute('data-word');

      if (listedWords.has(word)) {
        alert(`The word "${word}" is already in the list.`);
        return;
      }

      // Add word to the list
      const wordData = wordDataMap.get(word);
      const listItem = document.createElement('li');
      listItem.innerHTML = `<strong>${word}</strong>: ${wordData ? wordData.definition : 'No definition available'}`;
      listItem.addEventListener('click', () => {
        // Remove word from the list
        listItem.remove();
        listedWords.delete(word);
        wordButton.classList.add('highlighted');
        highlightedWords.add(word);
      });
      wordList.appendChild(listItem);
      listedWords.add(word);

      // Remove highlight for the clicked word
      wordButton.classList.remove('highlighted');
      highlightedWords.delete(word);
    }
  });
}

window.onload = loadText;
