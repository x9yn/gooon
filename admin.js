// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
deleteDoc,
onSnapshot,
query,
where
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


/* ADMIN PASSWORD */

const ADMIN_PASSWORD = "s";



/* LOGIN */

document.getElementById("loginBtn").onclick = () => {

const pass = document.getElementById("adminPassword").value;

if(pass === ADMIN_PASSWORD){

document.querySelector(".centerBox").style.display="none";
document.getElementById("adminPanel").style.display="block";

loadLeaderboard();

}
else{

alert("Wrong password");

}

};



/* LOAD PLAYERS */

function loadLeaderboard(){

const list=document.getElementById("adminLeaderboard");

onSnapshot(collection(db,"leaderboard"),(snapshot)=>{

list.innerHTML="";

snapshot.forEach(player=>{

const data=player.data();

const container=document.createElement("div");

container.style.border="1px solid gray";
container.style.margin="10px";
container.style.padding="10px";
container.style.borderRadius="10px";


/* PLAYER TITLE */

const title=document.createElement("h3");

title.innerText=data.name+" ("+data.score+" clicks)";

container.appendChild(title);


/* DELETE BUTTON */

const deleteBtn=document.createElement("button");

deleteBtn.innerText="Delete Player";

deleteBtn.onclick=async()=>{

await deleteDoc(doc(db,"leaderboard",data.name));

};

container.appendChild(deleteBtn);


/* CLICK HISTORY */

const historyTitle=document.createElement("p");

historyTitle.innerText="Click History:";

container.appendChild(historyTitle);

const historyList=document.createElement("ul");

container.appendChild(historyList);


/* LOAD HISTORY */

const q=query(collection(db,"clickHistory"),where("player","==",data.name));

onSnapshot(q,(historySnap)=>{

historyList.innerHTML="";

historySnap.forEach(click=>{

const li=document.createElement("li");

li.innerText=click.data().time;

historyList.appendChild(li);

});

});


list.appendChild(container);

});

});

}
