console.log("ready stedy go");
let currentSong = new Audio();
let songs;
function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
  
    
    minutes = minutes < 10 ? `0${minutes}` : minutes;
   
    remainingSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
  
   
    return `${minutes}:${remainingSeconds}`;
  }
  let tempFol;
async function getSongs(folder) {
  tempFol = folder;
   // let a = await fetch("http://127.0.0.1:3000/songs/");
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    // console.log(response);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    // console.log(as);
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
           // songs.push(element.href.split(`/${folder}/`)[1])
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUl.innerHTML = ""
    console.log(songUl);
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML+`<li> 
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20"," ")}</div>
            <div>Artist</div>
        </div>
        <div class="playNow">
            <span>প্লে</span>
        <img class = "invert" src="play1.svg" alt="">
    </div>  </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
             console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
         
        
       // console.log(e.querySelector(".info").firstElementChild.innerHTML)
       // console.log(e);
    })
   // return songs;
    // console.log(songs);
}

const playMusic = (track,pause = 0)=>{
    // let audio = new Audio("/songs/" + track);
    currentSong.src = `/${tempFol}/` + track;
   if(!pause){ currentSong.play();
    play.src = "pause.svg";
   }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00.00"

    

}
async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
            </div>

            <img src="/songs/${folder}/cover.webp" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}
async function main(){
   
     await getSongs("songs/ncs");
    playMusic(songs[0],1);
    await displayAlbums()
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src = "pause.svg";
        }
        else{
            currentSong.pause();
            play.src = "play.svg";
        }
    })

    currentSong.addEventListener("timeupdate",()=>{
        console.log(currentSong.currentTime,currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}:${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click",e=>{
       
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentSong.currentTime = currentSong.duration*(e.offsetX/e.target.getBoundingClientRect().width);
    })

    
     previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            
        })
    })

   
}
main();
