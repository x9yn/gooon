// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc, onSnapshot } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "goon1-bae62.firebaseapp.com",
  projectId: "goon1-bae62",
  storageBucket: "goon1-bae62.firebasestorage.app",
  messagingSenderId: "146545482847",
  appId: "1:146545482847:web:46c8eecafac1a41aa7cfea"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



/* =========================
   REALTIME LEADERBOARD
========================= */

function listenLeaderboard(){

const list = document.getElementById("leaderboardList");

if(!list) return;

const leaderboardRef = collection(db,"leaderboard");

onSnapshot(leaderboardRef,(snapshot)=>{

let players=[];

snapshot.forEach((doc)=>{
players.push(doc.data());
});

players.sort((a,b)=>b.score-a.score);

list.innerHTML="";

players.forEach(p=>{

let li=document.createElement("li");

let last = p.lastClick ? p.lastClick : "Never";

li.innerText = p.name + " : " + p.score + " nuts. Last Nut was (at: " + last + ")";

list.appendChild(li);

});

});

}



/* =========================
   GAME PAGE LOGIC
========================= */

if(window.location.pathname.includes("game.html")){

const name = localStorage.getItem("playerName");

if(!name){
window.location="index.html";
}

document.getElementById("playerName").innerText=name;

let count=0;

listenLeaderboard();

const button=document.getElementById("clickButton");

button.onclick=async()=>{

count++;

let time=new Date().toLocaleTimeString();

let log=document.getElementById("log");

let entry=document.createElement("div");

entry.innerText="nutted at "+time;

log.prepend(entry);

await setDoc(doc(db,"leaderboard",name),{

name:name,
score:count,
lastClick:time

});

};

}



/* =========================
   BACKGROUND CHANGER
========================= */

const upload=document.getElementById("bgUpload");

if(upload){

upload.addEventListener("change",function(){

const file=this.files[0];

if(!file) return;

const reader=new FileReader();

reader.onload=function(){

document.body.style.backgroundImage="url("+reader.result+")";

localStorage.setItem("backgroundImage",reader.result);

};

reader.readAsDataURL(file);

});

}

/* load saved background */

const savedBg=localStorage.getItem("backgroundImage");

if(savedBg){
document.body.style.backgroundImage="url("+savedBg+")";
}



/* =========================
   LIGHT / DARK MODE
========================= */

const lightBtn=document.getElementById("lightModeBtn");
const darkBtn=document.getElementById("darkModeBtn");

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

if(lightBtn) lightBtn.onclick=setLightMode;
if(darkBtn) darkBtn.onclick=setDarkMode;


const savedTheme=localStorage.getItem("theme");

if(savedTheme==="dark"){
setDarkMode();
}else{
setLightMode();
}
