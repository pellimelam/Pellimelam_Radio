const BASE =
"https://cdn.jsdelivr.net/gh/pellimelam/pellimelam-music-infrastructure/radios/generated/"

const audio=document.getElementById("audio")

let playlist=[]
let queue=[]
let index=0

let category=""
let page=1
let hasMore=true

let shuffle=false
let repeat=false

let nextAudio=new Audio()


/* LOAD CATEGORIES */

async function loadCategories(){

const res=await fetch(BASE+"categories.json")
const data=await res.json()

const select=document.getElementById("categorySelect")

for(const cat of data.categories){

const option=document.createElement("option")
option.value=cat.id
option.textContent=cat.name
select.appendChild(option)

}

loadCategory()

}


/* LOAD CATEGORY */

async function loadCategory(){

const select=document.getElementById("categorySelect")

category=select.value

document.getElementById("title").innerText=
select.options[select.selectedIndex].text

playlist=[]
queue=[]

page=1
hasMore=true

await loadMore()

createQueue()

index=0

prepareTrack()

}


/* LOAD MORE TRACKS */

async function loadMore(){

if(!hasMore) return

const res=await fetch(BASE+category+"/"+page+".json")

if(res.status!=200){

hasMore=false
return

}

const data=await res.json()

playlist.push(...data)

page++

}


/* CREATE QUEUE */

function createQueue(){

queue=[...playlist]

if(shuffle){

shuffleArray(queue)

}

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

document.getElementById("play").innerText="▶"

preloadNext()

}


/* PRELOAD NEXT */

function preloadNext(){

if(index+1<queue.length){

nextAudio.src=queue[index+1].url
nextAudio.preload="auto"

}

}


/* PLAY */

function playTrack(){

if(!queue.length) return

audio.src=queue[index].url

document.getElementById("trackTitle").innerText=
queue[index].title || ""

audio.play()

document.getElementById("play").innerText="⏸"

preloadNext()

}


/* PLAY / PAUSE */

function togglePlay(){

const btn=document.getElementById("play")

if(audio.paused){

audio.play()
btn.innerText="⏸"

}else{

audio.pause()
btn.innerText="▶"

}

}


/* NEXT */

async function next(){

index++

if(index>playlist.length-10){

await loadMore()
createQueue()

}

if(index>=queue.length){

if(repeat){

index=0

}else{

index=queue.length-1
return

}

}

playTrack()

}


/* PREVIOUS */

function prev(){

if(audio.currentTime>3){

audio.currentTime=0
return

}

index--

if(index<0) index=0

playTrack()

}


/* SONG ENDED */

audio.addEventListener("ended",next)


/* BUTTONS */

document.getElementById("play").onclick=togglePlay
document.getElementById("next").onclick=next
document.getElementById("prev").onclick=prev


/* SHUFFLE */

document.getElementById("shuffle").onclick=()=>{

shuffle=!shuffle

document.getElementById("shuffle").classList.toggle("active")

createQueue()

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

playlist=[]
queue=[]

loadCategory()

}


/* INIT */

loadCategories()