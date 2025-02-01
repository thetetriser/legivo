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
  appId: "1:733952528595:web:99bd0efdd4874d3ea50426",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to fetch word data from Firestore
async function fetchWordData(words) {
  const wordDataMap = new Map();

  for (const word of words) {
    const wordQuery = query(collection(db, "words"), where("name", "==", word));
    const querySnapshot = await getDocs(wordQuery);

    if (!querySnapshot.empty) {
      const wordData = querySnapshot.docs[0].data();
      wordDataMap.set(word, {
        name: wordData.name || "",
        synonyms: wordData.synonyms || "",
        questions: wordData.questions || [],
      });
    } else {
      console.error(`No data found for the word: ${word}`);
    }
  }
  
  
  return wordDataMap;
}

// Shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Handle page load and initialize components
window.onload = async () => {
  const selectedWords = JSON.parse(localStorage.getItem("selectedWords"));

  if (!selectedWords || selectedWords.length === 0) {
    alert("No words selected for the test.");
    return;
  }

  const wordDataMap = await fetchWordData(selectedWords);

 // Get the partA-words div
const partAWordsDiv = document.getElementById("partA-words");
const partBWordsDiv = document.getElementById("partB-words");

// Populate partA-words div with the selected words
selectedWords.forEach((word) => {
  const wordElement = document.createElement("p"); // Create a <p> element
  wordElement.textContent = word; // Set the text content to the word
  partAWordsDiv.appendChild(wordElement); // Append the <p> to the div
  
});

selectedWords.forEach((word) => {
  const wordElement = document.createElement("p"); // Create a <p> element
  wordElement.textContent = word; // Set the text content to the word
  partBWordsDiv.appendChild(wordElement); // Append the <p> to the div
  
});


  // Populate Part A and Part B
  selectedWords.forEach((word) => {
    const wordData = wordDataMap.get(word);
    if (wordData && wordData.questions.length >= 2) {
      const partAContainer = document.getElementById("partA");
      const partBContainer = document.getElementById("partB");
      

      
      

      partAContainer.innerHTML += `<ol><li><p>${wordData.questions[0].replace(
        word,
        `<input type="text" class="answer-box" data-word="${word}">`
      )}</p></li></ol>`;
      partBContainer.innerHTML += `<ol><li><p>${wordData.questions[1].replace(
        word,
        `<input type="text" class="answer-box" data-word="${word}">`
      )}</p></li></ol>`;
    }
  });

  // Populate synonym matching
  const synonymListContainer = document.getElementById("synonym-list");
  const wordListContainer = document.getElementById("word-list");

  selectedWords.forEach((word) => {
    const wordData = wordDataMap.get(word);
    if (wordData) {
      // Word blank
      const wordItem = document.createElement("li");
      wordItem.innerHTML = `<span>${word}</span> <span class="blank" data-word="${word}"></span>`;
      wordListContainer.appendChild(wordItem);

      // Synonym draggable
      const synonymItem = document.createElement("li");
      synonymItem.textContent = wordData.synonyms;
      synonymItem.classList.add("draggable");
      synonymItem.setAttribute("draggable", "true");
      synonymItem.addEventListener("dragstart", dragStart);
      synonymItem.addEventListener("dragend", dragEnd);
      synonymListContainer.appendChild(synonymItem);
    }
  });

  // Shuffle synonyms
  const shuffledSynonyms = shuffle(
    Array.from(synonymListContainer.querySelectorAll(".draggable"))
  );
  shuffledSynonyms.forEach((synonym) =>
    synonymListContainer.appendChild(synonym)
  );

  
// Function to handle dropping a synonym into a blank
function drop(e) {
  e.preventDefault();

  // Get the text of the dragged synonym
  const droppedSynonym = e.dataTransfer.getData("text").trim();

  // Get the word associated with the blank being dropped into
  const word = e.target.getAttribute("data-word");

  // Temporarily set the synonym in the blank
  e.target.textContent = droppedSynonym;
  e.target.classList.remove("drag-over");

  // Hide the dragged synonym from the original list
  const synonymBox = Array.from(synonymListContainer.querySelectorAll(".draggable"))
    .find(item => item.textContent.trim() === droppedSynonym);
  if (synonymBox) {
    synonymBox.style.display = "none";
  }
}

// Drag-and-drop events
function dragStart(e) {
  e.dataTransfer.setData("text", e.target.textContent.trim());
  e.target.style.opacity = "0.5";
}

function dragEnd(e) {
  e.target.style.opacity = "1";
  e.target.classList.remove("drag-over");
}

// Initialize drop targets (word blanks)
wordListContainer.querySelectorAll(".blank").forEach((blank) => {
  blank.addEventListener("dragover", (e) => e.preventDefault());
  blank.addEventListener("drop", drop);
});

// Check answers for synonyms
document.getElementById("check-synonym-answers").addEventListener("click", () => {
  let correct = 0, incorrect = 0;

  wordListContainer.querySelectorAll(".blank").forEach((blank) => {
    const word = blank.dataset.word;
    const synonym = blank.textContent.trim();
    const correctSynonym = wordDataMap.get(word).synonyms;

    if (synonym === correctSynonym) {
      blank.style.backgroundColor = "#d3ffd3"; // Green for correct
      correct++;
    } else {
      blank.style.backgroundColor = "#ffdddd"; // Red for incorrect
      incorrect++;

      // Return the incorrect synonym to the synonym list
      const synonymBox = Array.from(synonymListContainer.querySelectorAll(".draggable"))
        .find(item => item.textContent.trim() === synonym);
      if (synonymBox) {
        synonymBox.style.display = "inline-block";
      }

      // Clear the incorrect synonym from the blank
      blank.textContent = "";
    }
  });

  //alert(`Correct: ${correct}, Incorrect: ${incorrect}`);

  // Remove correct synonyms permanently from the list
  synonymListContainer.querySelectorAll(".draggable").forEach((synonym) => {
    if (Array.from(wordListContainer.querySelectorAll(".blank"))
      .some(blank => blank.textContent.trim() === synonym.textContent.trim())) {
      synonym.remove(); // Permanently remove correct synonyms
    }
  });
});

  // Check answers for Part A and Part B
  ["partA", "partB"].forEach((part) => {
    document.getElementById(`check-${part}-answers`).addEventListener("click", () => {
      document.querySelectorAll(`#${part} .answer-box`).forEach((input) => {
        const word = input.dataset.word;
        const correctAnswer = wordDataMap.get(word).name;
        if (input.value.trim() === correctAnswer) {
          input.style.backgroundColor = "#d3ffd3";
          
        } else {
          input.style.backgroundColor = "#ffdddd";
        }
      });
    });
  });
};
