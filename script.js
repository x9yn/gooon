// fuckass imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js";
import { getFirestore, collection, doc, setDoc, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";


// firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqedG7hv5AF0CVf2OgH5FhAvMq_X4wzao",
  authDomain: "goon1-bae62.firebaseapp.com",
  projectId: "goon1-bae62",
  storageBucket: "goon1-bae62.firebasestorage.app",
  messagingSenderId: "146545482847",
  appId: "1:146545482847:web:46c8eecafac1a41aa7cfea",
  measurementId: "G-GXV8X8L07V"
};


// i want a girl
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


// oh yeah start me upppp yo
window.startGame = function(){

let name = document.getElementById("username").value;

if(name.trim() === ""){
alert("Enter a name first");
return;
}

localStorage.setItem("playerName", name);

window.location = "game.html";

};



if(window.location.pathname.includes("game.html")){

let name = localStorage.getItem("playerName");

document.getElementById("playerName").innerText = name;

let count = 0;

loadLeaderboard();

let button = document.getElementById("clickButton");

button.onclick = async function(){

count++;

let time = new Date().toLocaleTimeString();

let log = document.getElementById("log");

let entry = document.createElement("div");

entry.innerText = "Clicked at " + time;

log.prepend(entry);

await updateScore(name,count);

};

}




async function updateScore(name,score){

await setDoc(doc(db,"leaderboard",name),{
name:name,
score:score
});

loadLeaderboard();

}



async function loadLeaderboard(){

let list = document.getElementById("leaderboardList");

if(!list) return;

list.innerHTML = "";

let snapshot = await getDocs(collection(db,"leaderboard"));

let players = [];

snapshot.forEach(d=>{
players.push(d.data());
});

players.sort((a,b)=>b.score-a.score);

players.forEach(p=>{

let li = document.createElement("li");

li.innerText = p.name + " : " + p.score;

list.appendChild(li);

});

}



let upload = document.getElementById("bgUpload");

if(upload){

upload.addEventListener("change",function(){

let file = this.files[0];

if(!file) return;

let reader = new FileReader();

reader.onload = function(){

document.body.style.backgroundImage = "url("+reader.result+")";

};

reader.readAsDataURL(file);

});

}
