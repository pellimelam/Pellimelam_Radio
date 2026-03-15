const BASE =
"https://cdn.jsdelivr.net/gh/pellimelam/Pellimelam_Radio/radios/generated/"

const audio=document.getElementById("audio")

let playlist=[]
let queue=[]
let index=0

let category=""
let page=1
let totalPages=1

let shuffle=false
let repeat=false

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

const catInfo=categoriesData.find(c=>c.id===category)

totalPages=catInfo.pages || 1

document.getElementById("title").innerText=
document.getElementById("categorySelect").selectedOptions[0].text

/* RANDOM MODULE */

page=Math.floor(Math.random()*totalPages)+1

await loadModule()

}


/* LOAD MODULE */

async function loadModule(){

const res=await fetch(BASE+category+"/"+page+".json")

playlist=await res.json()

queue=[...playlist]

/* RANDOM START TRACK */

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

audio.src=queue[index].url

document.getElementById("trackTitle").innerText=
queue[index].title || ""

document.getElementById("trackMeta").innerText=
"Module "+page+" • Track "+(index+1)

document.getElementById("play").innerText="▶"

}


/* PLAY */

function playTrack(){

audio.src=queue[index].url

document.getElementById("trackTitle").innerText=
queue[index].title || ""

document.getElementById("trackMeta").innerText=
"Module "+page+" • Track "+(index+1)

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

if(!repeat){

/* RANDOM NEW MODULE */

page=Math.floor(Math.random()*totalPages)+1
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


/* BUTTONS */

document.getElementById("play").onclick=togglePlay
document.getElementById("next").onclick=next
document.getElementById("prev").onclick=prev


/* SHUFFLE */

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


/* SEEK */

const seek=document.getElementById("seek")

audio.addEventListener("timeupdate",()=>{

seek.value=(audio.currentTime/audio.duration)*100||0

document.getElementById("currentTime").innerText=format(audio.currentTime)
document.getElementById("duration").innerText=format(audio.duration)

})

seek.oninput=()=>{

audio.currentTime=(seek.value/100)*audio.duration

}


/* VOLUME */

const volume=document.getElementById("volume")

volume.value=0.8
audio.volume=0.8

volume.oninput=()=>{

audio.volume=volume.value

}


/* FORMAT TIME */

function format(t){

if(!t) return "0:00"

const m=Math.floor(t/60)
const s=Math.floor(t%60)

return m+":"+(s<10?"0":"")+s

}


/* CATEGORY CHANGE */

document.getElementById("categorySelect").onchange=()=>{

audio.pause()

loadCategory()

}


/* SONG ENDED */

audio.addEventListener("ended",next)


/* INIT */

loadCategories()
