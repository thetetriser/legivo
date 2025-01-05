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


// Function to fetch and display data from Firestore
async function fetchData() {
  const collectionRef = collection(db, "texts");
  const querySnapshot = await getDocs(collectionRef);

  const container = document.getElementById("documentsContainer");
  container.innerHTML = ''; // Clear the container

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const docDiv = document.createElement("div");
    docDiv.classList.add("document");

    docDiv.innerHTML = `
      <h3>${data.title}</h3>
      <p>${data.content}</p>
      <button class="read-button" id="${data.no}">Read text</button>
    `;

    // Add event listener to "Read Text" button
    const readButton = docDiv.querySelector(".read-button");
    readButton.addEventListener("click", () => {
      // Redirect to reading.html with query parameters, including questions
      window.location.href = `../reading/reading.html?no=${data.no}`;
    });

    container.appendChild(docDiv);
  });
}

// Call fetchData when the page loads
window.onload = fetchData;
