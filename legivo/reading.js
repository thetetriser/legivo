<<<<<<< HEAD
=======
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

let highlightedWords = new Set(); // Track highlighted words

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
    // Query Firestore for the document with the matching "no" value in texts collection
    const collectionRef = collection(db, "texts");
    const q = query(collectionRef, where("no", "==", parseInt(no)));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const textDoc = querySnapshot.docs[0].data();

      // Now, check for words in the content
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
        } else {
          console.log("Invalid word data:", wordDoc.data());
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

      const wordButtons = document.querySelectorAll('.clickable-word');
      wordButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const word = button.getAttribute('data-word');
          const wordData = wordDataMap.get(word);
          const list = document.getElementById('words-in-text');
          let wordExists = Array.from(list.querySelectorAll('li')).some(
            (item) => item.textContent.includes(word)
          );

          if (!wordExists) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `${list.children.length + 1}. <strong>${word}</strong>: ${wordData.definition}`;
            list.appendChild(listItem);
            button.classList.remove('highlighted'); // Remove highlight only from the clicked word
            highlightedWords.delete(word); // Remove word from the highlighted set
          } else {
            alert(`Item "${word}" already exists in the list.`);
          }
        });
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

document.getElementById('text-content').addEventListener('mouseenter', () => {
  // Add highlight class to all clickable words when the mouse enters the div
  const words = document.querySelectorAll('.clickable-word');
  const list = document.getElementById('words-in-text');
  
  // Use safe checking to ensure match is not null
  const listWords = Array.from(list.querySelectorAll('li')).map(item => {
    const match = item.textContent.match(/<strong>(.*?)<\/strong>/);
    return match ? match[1] : null; // Only include valid matches
  }).filter(Boolean); // Filter out null values
  
  words.forEach(word => {
    const wordText = word.getAttribute('data-word');
    if (!listWords.includes(wordText) && !highlightedWords.has(wordText)) {
      word.classList.add('highlighted');
      highlightedWords.add(wordText); // Add word to the highlighted set
    }
  });
});


document.getElementById('text-content').addEventListener('mouseleave', () => {
  // Remove highlight class when the mouse leaves the div
  const words = document.querySelectorAll('.clickable-word');
  words.forEach(word => {
    word.classList.remove('highlighted');
    highlightedWords.delete(word.getAttribute('data-word')); // Remove from highlighted set
  });
});

// Call loadText when the page loads
window.onload = loadText;
>>>>>>> 9d8e519 (Fix bug in word highlighting logic and improve UI responsiveness)
