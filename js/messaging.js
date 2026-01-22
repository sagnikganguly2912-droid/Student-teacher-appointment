import { auth, db } from "./firebase.js";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const messageList = document.getElementById("messageList");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendMessage");

let currentAppointmentId = null;
let currentRole = null;

/* ================= INIT CHAT ================= */

export function initChat(appointmentId, role) {
  currentAppointmentId = appointmentId;
  currentRole = role;

  loadMessages();
}

/* ================= LOAD MESSAGES ================= */

function loadMessages() {
  messageList.innerHTML = "";

  const q = query(
    collection(db, "messages"),
    where("appointmentId", "==", currentAppointmentId),
    orderBy("createdAt")
  );

  onSnapshot(q, (snapshot) => {
    messageList.innerHTML = "";
    snapshot.forEach(docSnap => {
      const msg = docSnap.data();
      const li = document.createElement("li");
      li.textContent = `${msg.senderRole}: ${msg.message}`;
      messageList.appendChild(li);
    });
  });
}

/* ================= SEND MESSAGE ================= */

sendBtn.addEventListener("click", async () => {
  const text = messageInput.value.trim();
  if (!text || !currentAppointmentId) return;

  await addDoc(collection(db, "messages"), {
    appointmentId: currentAppointmentId,
    senderId: auth.currentUser.uid,
    senderRole: currentRole,
    message: text,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
});
