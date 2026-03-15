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



/* =====================
LEADERBOARD LISTENER
===================== */

function listenLeaderboard(){

const list=document.getElementById("leaderboardList");
if(!list) return;

onSnapshot(collection(db,"leaderboard"),(snapshot)=>{

let players=[];

snapshot.forEach(d=>{
players.push(d.data());
});

players.sort((a,b)=>b.score-a.score);

list.innerHTML="";

players.forEach(p=>{

const li=document.createElement("li");

li.innerText=`${p.name} : ${p.score} total nuts (Last: ${p.lastClick})`;

list.appendChild(li);

});

});

}



/* =====================
GAME LOGIC
===================== */

if(window.location.pathname.includes("game.html")){

const name=localStorage.getItem("playerName");

if(!name){
window.location="index.html";
}

document.getElementById("playerName").innerText=name;

listenLeaderboard();

let count=0;

let lastClick=0;

let fastClicks=[];
let clickTimes=[];



async function kickPlayer(reason){

alert(reason);

try{
await deleteDoc(doc(db,"leaderboard",name));
}catch(e){}

localStorage.removeItem("playerName");

window.location="index.html";

}



/* PLAYER LIMIT */

async function checkLimit(){

const snap=await getDocs(collection(db,"leaderboard"));

let players=[];

snap.forEach(p=>players.push(p.data()));

if(players.length>=15){

const exists=players.some(p=>p.name===name);

if(!exists){
kickPlayer("Server full (15 players max)");
}

}

}

checkLimit();



/* CLICK BUTTON */

const btn=document.getElementById("clickButton");

btn.onclick=async()=>{

const now=Date.now();

/* min delay */

if(now-lastClick<120){
kickPlayer("spam spam spam");
return;
}

lastClick=now;


/* 3 clicks/sec */

fastClicks.push(now);

fastClicks=fastClicks.filter(t=>now-t<1000);

if(fastClicks.length>3){
kickPlayer("spam spam spam");
return;
}


/* 10 cps */

clickTimes.push(now);

clickTimes=clickTimes.filter(t=>now-t<1000);

if(clickTimes.length>10){
kickPlayer("Autoclick detected");
return;
}


/* valid click */

count++;

const timestamp=new Date();

const timeString=timestamp.toLocaleTimeString();

const log=document.getElementById("log");

const entry=document.createElement("div");

entry.innerText=`Nutted at ${timeString}`;

log.prepend(entry);



/* leaderboard update */

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

};

}

/* UPDATE LEADERBOARD */




/* =====================
BACKGROUND CHANGER
===================== */

const upload=document.getElementById("bgUpload");

if(upload){

upload.addEventListener("change",function(){

const file=this.files[0];
if(!file) return;

const reader=new FileReader();

reader.onload=function(){

document.body.style.backgroundImage=`url(${reader.result})`;

localStorage.setItem("backgroundImage",reader.result);

};

reader.readAsDataURL(file);

});

}

const savedBg=localStorage.getItem("backgroundImage");

if(savedBg){
document.body.style.backgroundImage=`url(${savedBg})`;
}



/* =====================
LIGHT/DARK MODE
===================== */

const light=document.getElementById("lightModeBtn");
const dark=document.getElementById("darkModeBtn");

function lightMode(){

document.body.classList.remove("darkMode");
document.body.classList.add("lightMode");

localStorage.setItem("theme","light");

}

function darkMode(){

document.body.classList.remove("lightMode");
document.body.classList.add("darkMode");

localStorage.setItem("theme","dark");

}

if(light) light.onclick=lightMode;
if(dark) dark.onclick=darkMode;

const theme=localStorage.getItem("theme");

if(theme==="dark"){
darkMode();
}else{
lightMode();
}
