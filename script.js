// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
setDoc,
addDoc,
getDocs,
onSnapshot,
deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


/* FIREBASE */

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



/* USERNAME */

let name = localStorage.getItem("playerName");



/* INDEX PAGE */

const startBtn = document.getElementById("startBtn");

if(startBtn){

startBtn.onclick = async () => {

const username = document.getElementById("username").value.trim();

if(!username){
alert("Enter a username");
return;
}

const snapshot = await getDocs(collection(db,"leaderboard"));

if(snapshot.size >= 15){
alert("Game full (15 players)");
return;
}

localStorage.setItem("playerName",username);

window.location.href = "game.html";

};

}



/* GAME PAGE */

const clickBtn = document.getElementById("clickBtn");
const leaderboard = document.getElementById("leaderboard");

if(clickBtn){

let count = 0;
let clickTimes = [];

document.getElementById("playerNameDisplay").innerText = name;


/* CLICK BUTTON */

clickBtn.onclick = async () => {

const now = Date.now();

clickTimes.push(now);

clickTimes = clickTimes.filter(t => now - t < 1000);


/* 3 CLICKS PER SECOND LIMIT */

if(clickTimes.length > 3){

alert("Too many clicks. You were removed.");

await deleteDoc(doc(db,"leaderboard",name));

localStorage.removeItem("playerName");

window.location.href="index.html";

return;

}


/* AUTOCLICK DETECTION */

if(clickTimes.length >= 2){

let interval = clickTimes[clickTimes.length-1] - clickTimes[clickTimes.length-2];

if(interval < 50){

alert("Autoclick detected.");

await deleteDoc(doc(db,"leaderboard",name));

localStorage.removeItem("playerName");

window.location.href="index.html";

return;

}

}


count++;

const timestamp = new Date();
const timeString = timestamp.toLocaleTimeString();


/* UPDATE LEADERBOARD */

await setDoc(doc(db,"leaderboard",name),{

name:name,
score:count,
lastClick:timeString

});


/* SAVE CLICK HISTORY */

await addDoc(collection(db,"clickHistory"),{

player:name,
timestamp:timestamp.toISOString()

});


/* UPDATE CLICK LOG */

const log = document.getElementById("clickLog");

if(log){

const li = document.createElement("li");

li.innerText = timeString;

log.prepend(li);

}

};

}



/* LIVE LEADERBOARD */

if(leaderboard){

onSnapshot(collection(db,"leaderboard"),(snapshot)=>{

let players = [];

snapshot.forEach(doc=>{
players.push(doc.data());
});

players.sort((a,b)=>b.score-a.score);

leaderboard.innerHTML="";

players.forEach(p=>{

const li = document.createElement("li");

li.innerText = `${p.name} — ${p.score} clicks (Last: ${p.lastClick || "N/A"})`;

leaderboard.appendChild(li);

});

});

}



/* BACKGROUND IMAGE */

const bgInput = document.getElementById("bgInput");

if(bgInput){

bgInput.onchange = (e)=>{

const file = e.target.files[0];

const reader = new FileReader();

reader.onload = function(event){

document.body.style.backgroundImage = `url(${event.target.result})`;

localStorage.setItem("backgroundImage",event.target.result);

};

reader.readAsDataURL(file);

};

}


const savedBg = localStorage.getItem("backgroundImage");

if(savedBg){

document.body.style.backgroundImage = `url(${savedBg})`;

}



/* DARK MODE */

const darkBtn = document.getElementById("darkMode");

if(darkBtn){

darkBtn.onclick = ()=>{

document.body.classList.add("dark");

};

}



/* LIGHT MODE */

const lightBtn = document.getElementById("lightMode");

if(lightBtn){

lightBtn.onclick = ()=>{

document.body.classList.remove("dark");

};

}
