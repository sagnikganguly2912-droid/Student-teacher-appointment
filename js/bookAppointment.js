import { auth, db, getUserRole } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const slotList = document.getElementById("slotList");
const purposeInput = document.getElementById("purpose");

let studentId = null;

/* ================= AUTH & ROLE CHECK ================= */

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

  studentId = user.uid;
  loadAvailableSlots();
});

/* ================= LOAD AVAILABLE SLOTS ================= */

async function loadAvailableSlots() {
  slotList.innerHTML = "";

  const q = query(
    collection(db, "slots"),
    where("isBooked", "==", false)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    slotList.innerHTML = "<li>No slots available</li>";
    return;
  }

  snapshot.forEach(docSnap => {
    const slot = docSnap.data();
    const li = document.createElement("li");

    li.textContent = `${slot.date} @ ${slot.time}`;

    const bookBtn = document.createElement("button");
    bookBtn.textContent = "Book";
    bookBtn.onclick = () => bookSlot(docSnap.id, slot.teacherId);

    li.appendChild(bookBtn);
    slotList.appendChild(li);
  });
}

/* ================= BOOK SLOT ================= */

async function bookSlot(slotId, teacherId) {
  const purpose = purposeInput.value.trim();

  if (!purpose) {
    alert("Enter purpose of appointment");
    return;
  }

  // Create appointment
  await addDoc(collection(db, "appointments"), {
    studentId,
    teacherId,
    slotId,
    purpose,
    status: "pending",
    createdAt: serverTimestamp()
  });

  // Mark slot as booked
  await updateDoc(doc(db, "slots", slotId), {
    isBooked: true
  });

  alert("Appointment requested successfully");
  purposeInput.value = "";
  loadAvailableSlots();
}
