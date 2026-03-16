import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
deleteDoc,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


/* FIREBASE CONFIG */

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

document.querySelector(".centerBox").style.display = "none";
document.getElementById("adminPanel").style.display = "block";

loadAdminPanel();

}else{

alert("Wrong password");

}

};



function loadAdminPanel(){

const container = document.getElementById("adminLeaderboard");

let players = [];
let clickHistory = [];


/* LOAD CLICK HISTORY */

onSnapshot(collection(db,"clickHistory"), (snapshot)=>{

clickHistory = [];

snapshot.forEach(doc=>{
clickHistory.push(doc.data());
});

render();

});


/* LOAD PLAYERS */

onSnapshot(collection(db,"leaderboard"), (snapshot)=>{

players = [];

snapshot.forEach(doc=>{
players.push(doc.data());
});

render();

});


/* RENDER FUNCTION */

function render(){

container.innerHTML = "";

/* GROUP CLICKS BY PLAYER */

let clicksByPlayer = {};

clickHistory.forEach(click=>{

if(!clicksByPlayer[click.player]){
clicksByPlayer[click.player] = [];
}

clicksByPlayer[click.player].push(click.timestamp);

});


players.forEach(player=>{

const card = document.createElement("div");
card.className = "adminPlayerCard";


/* PLAYER NAME */

const title = document.createElement("h3");
title.innerText = `${player.name} (${player.score} clicks)`;

card.appendChild(title);


/* DELETE BUTTON */

const deleteBtn = document.createElement("button");
deleteBtn.className = "adminDelete";
deleteBtn.innerText = "Remove Player";

deleteBtn.onclick = async ()=>{

await deleteDoc(doc(db,"leaderboard",player.name));

};

card.appendChild(deleteBtn);


/* HISTORY TITLE */

const historyTitle = document.createElement("p");
historyTitle.className = "adminHistory";
historyTitle.innerText = "Click History:";

card.appendChild(historyTitle);


/* HISTORY LIST */

const list = document.createElement("ul");

const playerClicks = clicksByPlayer[player.name] || [];

/* SORT NEWEST FIRST */

playerClicks.sort((a,b)=>new Date(b)-new Date(a));


playerClicks.forEach(time=>{

const li = document.createElement("li");

const date = new Date(time);

li.innerText = date.toLocaleString();

list.appendChild(li);

});

card.appendChild(list);

container.appendChild(card);

});

}

}
