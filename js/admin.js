import {db} from "./firebase.js";
import{
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const addButton = document.getElementById("addTeacher");
const teacherList = document.getElementById("teacherList"); 

addButton.addEventListener("click", async() => {
    const name = document.getElementById("name").value.trim();
    const dept = document.getElementById("department").value.trim();
    const subject = document.getElementById("subject").value.trim();

    if(!name || !dept || !subject){
        alert("All fields required");
        return;
    }
    
    await addDoc(collection(db, "teachers"),{
        name,
        dept,
        subject
    });

    console.log(`[ADMIN] Teacher added: ${name}`);
    loadTeachers();
});

async function loadTeachers() {
    teacherList.innerHTML = "";
    const snapshot = await getDocs(collection(db, "teachers"));

    snapshot.forEach(docSnap => {
        const li = document.createElement("li");
        li.textContent = `${docSnap.data().name} (${docSnap.data().subject})`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = async () => {
            await deleteDoc(doc(db, "teachers", docSnap.id));
            console.log(`[ADMIN] Teacher deleted: ${docSnap.id}`);
            loadTeachers();
        };

        li.appendChild(deleteButton);
        teacherList.appendChild(li);
    });
}

loadTeachers();