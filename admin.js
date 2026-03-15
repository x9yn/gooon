// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
deleteDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";



// Firebase config
const firebaseConfig = {

apiKey: "YOUR_API_KEY",

authDomain: "goon1-bae62.firebaseapp.com",

projectId: "goon1-bae62",

storageBucket: "goon1-bae62.firebasestorage.app",

messagingSenderId: "146545482847",

appId: "1:146545482847:web:46c8eecafac1a41aa7cfea"

};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




const ADMIN_PASSWORD = "stanford";



const loginBtn = document.getElementById("loginBtn");

loginBtn.onclick = () => {

const pass = document.getElementById("adminPassword").value;

if(pass === ADMIN_PASSWORD){

document.querySelector(".centerBox").style.display = "none";

document.getElementById("adminPanel").style.display = "block";

loadLeaderboard();

}
else{

alert("Wrong password");

}

};



/* LOAD LEADERBOARD */

function loadLeaderboard(){

const list = document.getElementById("adminLeaderboard");

onSnapshot(collection(db,"leaderboard"), (snapshot)=>{

list.innerHTML="";

snapshot.forEach(player=>{

const data = player.data();

const li = document.createElement("li");

const btn = document.createElement("button");

btn.innerText = "Delete";

btn.onclick = async () => {

await deleteDoc(doc(db,"leaderboard",data.name));

};

li.innerText = data.name + " : " + data.score + " ";

li.appendChild(btn);

list.appendChild(li);

});

});

}
