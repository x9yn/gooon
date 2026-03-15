function startGame(){
let name=document.getElementById("username").value;

localStorage.setItem("playerName",name);

window.location="game.html";
}

// page 2 logic
if(window.location.pathname.includes("game.html")){

let name=localStorage.getItem("playerName");

document.getElementById("playerName").innerText=name;

let count=0;

let button=document.getElementById("clickButton");

button.onclick=function(){

count++;

let time=new Date().toLocaleTimeString();

let log=document.getElementById("log");

let entry=document.createElement("div");

entry.innerText="Clicked at "+time;

log.prepend(entry);

updateScore(name,count);

};

}

// i think i like maia
// but this is in code so no one will know
let upload=document.getElementById("bgUpload");

if(upload){

upload.addEventListener("change",function(){

let file=this.files[0];

let reader=new FileReader();

reader.onload=function(){
document.body.style.backgroundImage="url("+reader.result+")";
}

reader.readAsDataURL(file);

});
