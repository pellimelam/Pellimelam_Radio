const BASE =
"https://cdn.jsdelivr.net/gh/pellimelam/Pellimelam_Radio/radios/generated/"

const audio=document.getElementById("audio")

let playlist=[]
let queue=[]
let index=0

let category=""
let module=1
let totalModules=1

let shuffle=false
let repeat=false
let moduleLoop=false

let nextAudio=new Audio()

let categoriesData=[]


/* LOAD CATEGORIES */

async function loadCategories(){

const res=await fetch(BASE+"categories.json")
const data=await res.json()

categoriesData=data.categories

const select=document.getElementById("categorySelect")

for(const cat of data.categories){

const option=document.createElement("option")
option.value=cat.id
option.textContent=cat.name
select.appendChild(option)

}

select.value=data.categories[0].id

loadCategory()

}


/* LOAD CATEGORY */

async function loadCategory(){

category=document.getElementById("categorySelect").value

document.getElementById("title").innerText=
document.getElementById("categorySelect").selectedOptions[0].text

module=1

loadModule()

}


/* LOAD MODULE */

async function loadModule(){

document.getElementById("moduleLabel").innerText="Module "+module

const res=await fetch(BASE+category+"/"+module+".json")

if(res.status!=200){

if(moduleLoop){
module=1
return loadModule()
}

return
}

playlist=await res.json()

queue=[...playlist]

if(shuffle) shuffleArray(queue)

index=Math.floor(Math.random()*queue.length)

prepareTrack()

}


/* SHUFFLE */

function shuffleArray(arr){

for(let i=arr.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1))
[arr[i],arr[j]]=[arr[j],arr[i]]

}

}


/* PREPARE TRACK */

function prepareTrack(){

if(!queue.length) return

audio.src=queue[index].url

document.getElementById("trackTitle").innerText=
queue[index].title || ""

document.getElementById("trackMeta").innerText=
"Module "+module+" • Track "+(index+1)

document.getElementById("play").innerText="▶"

}


/* PLAY */

function playTrack(){

audio.src=queue[index].url

document.getElementById("trackTitle").innerText=
queue[index].title || ""

document.getElementById("trackMeta").innerText=
"Module "+module+" • Track "+(index+1)

audio.play()

document.getElementById("play").innerText="⏸"

}


/* PLAY / PAUSE */

function togglePlay(){

if(audio.paused){
playTrack()
}else{
audio.pause()
document.getElementById("play").innerText="▶"
}

}


/* NEXT TRACK */

function next(){

index++

if(index>=queue.length){

index=0

if(moduleLoop){

module++

loadModule()
return

}

}

playTrack()

}


/* PREVIOUS TRACK */

function prev(){

index--

if(index<0) index=queue.length-1

playTrack()

}


/* MODULE CONTROLS */

document.getElementById("moduleNext").onclick=()=>{

module++

loadModule()

}

document.getElementById("modulePrev").onclick=()=>{

module--
if(module<1) module=1

loadModule()

}

document.getElementById("moduleShuffle").onclick=()=>{

module=Math.floor(Math.random()*5)+1

loadModule()

}

document.getElementById("moduleLoop").onclick=()=>{

moduleLoop=!moduleLoop

document.getElementById("moduleLoop").classList.toggle("active")

}


/* TRACK BUTTONS */

document.getElementById("play").onclick=togglePlay
document.getElementById("next").onclick=next
document.getElementById("prev").onclick=prev


/* SHUFFLE TRACKS */

document.getElementById("shuffle").onclick=()=>{

shuffle=!shuffle

document.getElementById("shuffle").classList.toggle("active")

queue=[...playlist]

if(shuffle) shuffleArray(queue)

index=0

prepareTrack()

}


/* LOOP TRACK */

document.getElementById("loop").onclick=()=>{

repeat=!repeat

audio.loop=repeat

document.getElementById("loop").classList.toggle("active")

}


/* CATEGORY CHANGE */

document.getElementById("categorySelect").onchange=()=>{

audio.pause()

loadCategory()

}


/* SONG END */

audio.addEventListener("ended",next)


/* INIT */

loadCategories()
