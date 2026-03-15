const BASE =
"https://cdn.jsdelivr.net/gh/pellimelam/Pellimelam_Radio/radios/generated/"

const audio = document.getElementById("audio")

let playlist=[]
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

await loadCategory()

}


/* LOAD CATEGORY */

async function loadCategory(){

category=document.getElementById("categorySelect").value

const catInfo=categoriesData.find(c=>c.id===category)

totalPages=catInfo?.pages || 1

document.getElementById("title").innerText =
document.getElementById("categorySelect").selectedOptions[0].text

page=Math.floor(Math.random()*totalPages)+1

await loadModule()

}


/* LOAD MODULE */

async function loadModule(){

const res=await fetch(BASE+category+"/"+page+".json")

playlist=await res.json()

if(!playlist.length) return

index=Math.floor(Math.random()*playlist.length)

prepareTrack()

}


/* PREPARE TRACK */

function prepareTrack(){

const track = playlist[index]

if(!track) return

audio.src = track.url

const titleEl = document.getElementById("trackTitle")
const metaEl = document.getElementById("trackMeta")

if(titleEl) titleEl.innerText = track.title || ""
if(metaEl) metaEl.innerText = "Module "+page+" • Track "+(index+1)

document.getElementById("play").innerText="▶"

}


/* PLAY */

function playTrack(){

const track = playlist[index]

if(!track) return

audio.src = track.url
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


/* NEXT */

function next(){

index++

if(index>=playlist.length){

index=0

if(!repeat){

page=Math.floor(Math.random()*totalPages)+1
loadModule()
return

}

}

prepareTrack()
playTrack()

}


/* PREVIOUS */

function prev(){

index--

if(index<0) index=playlist.length-1

prepareTrack()
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

playlist.sort(()=>Math.random()-0.5)

index=0

prepareTrack()

}


/* LOOP */

document.getElementById("loop").onclick=()=>{

repeat=!repeat

audio.loop=repeat

document.getElementById("loop").classList.toggle("active")

}


/* SEEK */

const seek=document.getElementById("seek")

audio.addEventListener("timeupdate",()=>{

if(!audio.duration) return

seek.value=(audio.currentTime/audio.duration)*100

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
