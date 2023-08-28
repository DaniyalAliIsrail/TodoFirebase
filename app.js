import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  
} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyDJigyso8ZbLRduG88rRbxoe-tNO14mjR4",
  authDomain: "todo-ab3b5.firebaseapp.com",
  projectId: "todo-ab3b5",
  storageBucket: "todo-ab3b5.appspot.com",
  messagingSenderId: "186501367378",
  appId: "1:186501367378:web:bb6f0357c93d5bee9e818b",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const ids = [];
var list = document.getElementById("list");

//Get data
const getTodos = () => {
  onSnapshot(collection(db, "todos"), (data) => {
    data.docChanges().forEach((tododata) => {
      // console.log(tododata);
      // console.log(tododata.doc.data().value);
      ids.push(tododata.doc.id);

      if (tododata.type == "removed") {
        var dtodo = document.getElementById(tododata.doc.id);
        dtodo.remove();
      } else if (tododata.type == "added") {
        var todo = ` <li class="dynamiclist" id='${tododata.doc.id}'>
        <div>
        ${tododata.doc.data().value}
        </div>
        <div class="btnlist"> 
        <button   onclick="deleteItems(this,'${tododata.doc.id}')">DEL</button>
        <button onclick="editItems(this , '${tododata.doc.id}')">Edit</button>
       </div>
      </li>`;
        list.innerHTML = todo + list.innerHTML;
      }
    });
  });
};
getTodos();

const addList = async () => {
  try {
    var todoItems = document.getElementById("todo-items");
    if (todoItems.value === "") {
      return Swal.fire({
        icon: "error",
        title: "Fill up Input filled",
        text: "Add todo",
        footer: '<a href="">Why do I have this issue?</a>',
      });
    }
    const docRef = await addDoc(collection(db, "todos"), {
      value: todoItems.value,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.log("error", err);
  }
  todoItems.value = "";
};
const btn = document.getElementById("addList1");
btn.addEventListener("click", addList);

async function deleteItems(e, id) {
  await deleteDoc(doc(db, "todos", id));
  e.remove()
  
}

async function editItems(e, id) {
  let getValue = e.parentNode.parentNode.firstElementChild.textContent;
  console.log(getValue);
  var newValue = prompt("update value", getValue);
  if(newValue == ""){
    alert("fill up the input filled")
    return
  }
  e.parentNode.parentNode.firstElementChild.textContent = newValue;
  try {
    await updateDoc(doc(db, "todos", id), { value: newValue });
    console.log("Todo Updated");
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

const btn1 = document.getElementById("deleteAll1");
btn1.addEventListener("click", deleteAll);
async function deleteAll() {
  try {
    var list = document.getElementById("list");
    list.innerHTML = "";
   
    ids.forEach( async (id) => {
      await deleteDoc(doc(db, "todos", id));
    });

    // for (let i = 0; i < id.length; i++) {
    //   await deleteDoc(doc(db, "todos", id[i]));
    // }
  } catch (e) {
    console.log(e);
  }
}
window.deleteItems = deleteItems;
window.editItems = editItems;
