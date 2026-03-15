// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
getFirestore,
collection,
doc,
setDoc,
deleteDoc,
addDoc,
onSnapshot,
getDocs
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

let playersCache = [];


/* =========================
   LEADERBOARD LISTENER
========================= */

function listenLeaderboard(){

const list = document.getElementById("leaderboardList");

if(!list) return;

const leaderboardRef = collection(db,"leaderboard");

onSnapshot(leaderboardRef,(snapshot)=>{

playersCache = [];

snapshot.forEach((doc)=>{
playersCache.push(doc.data());
});

playersCache.sort((a,b)=>b.score-a.score);

list.innerHTML="";

playersCache.forEach(p=>{

let li = document.createElement("li");

let last = p.lastClick || "Never";

li.innerText = p.name + " : " + p.score + " total goons. (Last: " + last + ")";

list.appendChild(li);

});

});

}



/* =========================
   GAME LOGIC
========================= */

if(window.location.pathname.includes("game.html")){

const name = localStorage.getItem("playerName");

if(!name){
window.location="index.html";
}

document.getElementById("playerName").innerText = name;

listenLeaderboard();

let count = 0;

let lastClickTime = 0;

let clickTimes = [];
let fastClicks = [];


/* =========================
   KICK PLAYER FUNCTION
========================= */

async function kickPlayer(reason){

alert(reason);

try{
await deleteDoc(doc(db,"leaderboard",name));
}catch(e){}

localStorage.removeItem("playerName");

window.location="index.html";

}



/* =========================
   PLAYER LIMIT CHECK
========================= */

async function checkPlayerLimit(){

const snap = await getDocs(collection(db,"leaderboard"));

let players=[];

snap.forEach(d=>{
players.push(d.data());
});

if(players.length >= 15){

const exists = players.some(p => p.name === name);

if(!exists){
kickPlayer("server full.");
}

}

}

checkPlayerLimit();



/* =========================
   CLICK BUTTON
========================= */

const button = document.getElementById("clickButton");

button.onclick = async()=>{

const now = Date.now();

/* MINIMUM DELAY CHECK */

if(now - lastClickTime < 120){
kickPlayer("bumass spammer");
return;
}

lastClickTime = now;


/* 3 CLICKS PER SECOND CHECK */

fastClicks.push(now);

fastClicks = fastClicks.filter(t => now - t < 1000);

if(fastClicks.length > 3){
kickPlayer("autoclicker bruh");
return;
}


/* 10 CPS AUTCLICK DETECTION */

clickTimes.push(now);

clickTimes = clickTimes.filter(t => now - t < 1000);

if(clickTimes.length > 10){
kickPlayer("Autoclicking detected");
return;
}


/* VALID CLICK */

count++;

let time = new Date().toLocaleTimeString();

let log = document.getElementById("log");

let entry = document.createElement("div");

entry.innerText = "Clicked at " + time;

log.prepend(entry);


/* UPDATE LEADERBOARD */

await setDoc(doc(db,"leaderboard",name),{

name:name,
score:count,
lastClick:time

});


/* SAVE CLICK HISTORY */

await addDoc(collection(db,"clickHistory"),{

player:name,
time:time

});

};

}



/* =========================
   BACKGROUND CHANGER
========================= */

const upload = document.getElementById("bgUpload");

if(upload){

upload.addEventListener("change",function(){

const file = this.files[0];

if(!file) return;

const reader = new FileReader();

reader.onload = function(){

document.body.style.backgroundImage = "url("+reader.result+")";

localStorage.setItem("backgroundImage",reader.result);

};

reader.readAsDataURL(file);

});

}

const savedBg = localStorage.getItem("backgroundImage");

if(savedBg){
document.body.style.backgroundImage = "url("+savedBg+")";
}



/* =========================
   LIGHT / DARK MODE
========================= */

const lightBtn = document.getElementById("lightModeBtn");
const darkBtn = document.getElementById("darkModeBtn");

function setLightMode(){

document.body.classList.remove("darkMode");
document.body.classList.add("lightMode");

localStorage.setItem("theme","light");

}

function setDarkMode(){

document.body.classList.remove("lightMode");
document.body.classList.add("darkMode");

localStorage.setItem("theme","dark");

}

if(lightBtn) lightBtn.onclick = setLightMode;
if(darkBtn) darkBtn.onclick = setDarkMode;

const savedTheme = localStorage.getItem("theme");

if(savedTheme === "dark"){
setDarkMode();
}else{
setLightMode();
}
