import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

/* ================= DOM ELEMENTS ================= */

const addSlotButton = document.getElementById("addSlot");
const slotList = document.getElementById("slotList");
const appointmentList = document.getElementById("appointmentList");

/* ================= AUTH STATE ================= */

let teacherId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    alert("Login required");
    window.location.href = "index.html";
    return;
  }

  teacherId = user.uid;
  loadSlots();
  loadAppointments();
});

/* ================= ADD SLOT ================= */

addSlotButton.addEventListener("click", async () => {
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  if (!date || !time) {
    alert("Select date and time");
    return;
  }

  await addDoc(collection(db, "slots"), {
    teacherId,
    date,
    time,
    isBooked: false
  });

  console.log(`[TEACHER] Slot added: ${date} ${time}`);
  loadSlots();
});

/* ================= LOAD SLOTS ================= */

async function loadSlots() {
  slotList.innerHTML = "";

  const q = query(
    collection(db, "slots"),
    where("teacherId", "==", teacherId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    slotList.innerHTML = "<li>No slots created</li>";
    return;
  }

  snapshot.forEach(docSnap => {
    const slot = docSnap.data();
    const li = document.createElement("li");
    li.textContent = `${slot.date} @ ${slot.time} (${slot.isBooked ? "Booked" : "Available"})`;
    slotList.appendChild(li);
  });
}

/* ================= LOAD APPOINTMENTS ================= */

async function loadAppointments() {
  appointmentList.innerHTML = "";

  const q = query(
    collection(db, "appointments"),
    where("teacherId", "==", teacherId)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    appointmentList.innerHTML = "<li>No appointments yet</li>";
    return;
  }

  snapshot.forEach(docSnap => {
    const app = docSnap.data();
    const li = document.createElement("li");

    li.textContent = `Student: ${app.studentId} | Status: ${app.status}`;

    const approveBtn = document.createElement("button");
    approveBtn.textContent = "Approve";
    approveBtn.onclick = () => updateStatus(docSnap.id, "approved");

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.onclick = () => updateStatus(docSnap.id, "cancelled");

    li.appendChild(approveBtn);
    li.appendChild(cancelBtn);
    appointmentList.appendChild(li);
  });
}

/* ================= UPDATE STATUS ================= */

async function updateStatus(appointmentId, status) {
  await updateDoc(
    doc(db, "appointments", appointmentId),
    { status }
  );

  console.log(`[TEACHER] Appointment ${appointmentId} → ${status}`);
  loadAppointments();
}
