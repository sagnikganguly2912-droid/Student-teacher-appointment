import { auth, db, getUserRole } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { initChat } from "./messaging.js";

const myAppointments = document.getElementById("myAppointments");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Please login first");
    window.location.href = "index.html";
    return;
  }

  const role = await getUserRole(user.uid);
  if (role !== "student") {
    alert("Unauthorized access");
    window.location.href = "index.html";
    return;
  }

  loadMyAppointments(user.uid);
});

async function loadMyAppointments(studentId) {
  myAppointments.innerHTML = "";

  const q = query(
    collection(db, "appointments"),
    where("studentId", "==", studentId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    myAppointments.innerHTML = "<li>No appointments found</li>";
    return;
  }

  snapshot.forEach(docSnap => {
    const app = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `Status: ${app.status} | Purpose: ${app.purpose}`;
    li.onclick = () => {
  initChat(docSnap.id, "student");
};
    myAppointments.appendChild(li);
  });
}
