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


const firebaseConfig={
apiKey:"YOUR_API_KEY",
authDomain:"goon1-bae62.firebaseapp.com",
projectId:"goon1-bae62",
storageBucket:"goon1-bae62.firebasestorage.app",
messagingSenderId:"146545482847",
appId:"1:146545482847:web:46c8eecafac1a41aa7cfea"
};

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);

const ADMIN_PASSWORD="s";


document.getElementById("loginBtn").onclick=()=>{

const pass=document.getElementById("adminPassword").value;

if(pass===ADMIN_PASSWORD){

document.querySelector(".centerBox").style.display="none";
document.getElementById("adminPanel").style.display="block";

loadPlayers();

}else{

alert("Wrong password");

}

};



function loadPlayers(){

const container=document.getElementById("adminLeaderboard");

onSnapshot(collection(db,"leaderboard"),(snapshot)=>{

container.innerHTML="";

snapshot.forEach(player=>{

const data=player.data();

const card=document.createElement("div");

card.className="adminPlayerCard";



/* title */

const title=document.createElement("h3");

title.innerText=`${data.name} (${data.score} clicks)`;

card.appendChild(title);



/* delete button */

const del=document.createElement("button");

del.innerText="Remove Player";

del.className="adminDelete";

del.onclick=async()=>{

await deleteDoc(doc(db,"leaderboard",data.name));

};

card.appendChild(del);



/* history */

const history=document.createElement("div");

history.className="adminHistory";

history.innerText="Click History:";

card.appendChild(history);



const list=document.createElement("ul");

card.appendChild(list);



const q=query(collection(db,"clickHistory"),where("player","==",data.name));

onSnapshot(q,(snap)=>{

list.innerHTML="";

let clicks=[];

snap.forEach(c=>clicks.push(c.data()));

clicks.sort((a,b)=>new Date(b.timestamp)-new Date(a.timestamp));

clicks.forEach(c=>{

const li=document.createElement("li");

const time=new Date(c.timestamp);

li.innerText=time.toLocaleString();

list.appendChild(li);

});

});

container.appendChild(card);

});

});

}
