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


/* PASSWORD */

const ADMIN_PASSWORD = "s";


/* LOGIN */

document.getElementById("loginBtn").onclick = () => {

const pass = document.getElementById("adminPassword").value;

if(pass === ADMIN_PASSWORD){

document.querySelector(".centerBox").style.display = "none";
document.getElementById("adminPanel").style.display = "block";

loadAdmin();

}else{

alert("Wrong password");

}

};



function loadAdmin(){

const container = document.getElementById("adminLeaderboard");

let players = [];
let clickHistory = [];


/* LOAD CLICK HISTORY */

onSnapshot(collection(db,"clickHistory"), (snapshot)=>{

clickHistory = [];

snapshot.forEach(docSnap=>{

clickHistory.push({
id: docSnap.id,
...docSnap.data()
});

});

render();

});


/* LOAD LEADERBOARD */

onSnapshot(collection(db,"leaderboard"), (snapshot)=>{

players = [];

snapshot.forEach(docSnap=>{
players.push(docSnap.data());
});

render();

});


/* RENDER */

function render(){

container.innerHTML = "";


/* GROUP CLICKS BY PLAYER */

let grouped = {};

clickHistory.forEach(click=>{

if(!grouped[click.player]){
grouped[click.player] = [];
}

grouped[click.player].push(click);

});


players.forEach(player=>{

const card = document.createElement("div");
card.className = "adminPlayerCard";


/* PLAYER TITLE */

const title = document.createElement("h3");
title.innerText = `${player.name} (${player.score} nuts)`;
card.appendChild(title);


/* DELETE PLAYER BUTTON */

const deleteBtn = document.createElement("button");
deleteBtn.className = "adminDelete";
deleteBtn.innerText = "Remove Player";

deleteBtn.onclick = async () => {

await deleteDoc(doc(db,"leaderboard",player.name));

};

card.appendChild(deleteBtn);


/* HISTORY TITLE */

const historyTitle = document.createElement("p");
historyTitle.innerText = "Nut History:";
card.appendChild(historyTitle);


/* HISTORY LIST */

const list = document.createElement("ul");

let playerClicks = grouped[player.name] || [];


/* SORT NEWEST FIRST */

playerClicks.sort((a,b)=>{

let ta = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
let tb = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);

return tb - ta;

});


playerClicks.forEach(click=>{

const li = document.createElement("li");


/* FIX DATE */

let date;

if(click.timestamp && click.timestamp.toDate){
date = click.timestamp.toDate();
}else{
date = new Date(click.timestamp);
}

li.innerText = date.toLocaleString();


/* DELETE TIME BUTTON */

const delBtn = document.createElement("button");

delBtn.innerText = "Delete";
delBtn.style.marginLeft = "10px";

delBtn.onclick = async () => {

await deleteDoc(doc(db,"clickHistory",click.id));

};

li.appendChild(delBtn);

list.appendChild(li);

});


card.appendChild(list);

container.appendChild(card);

});

}

}
