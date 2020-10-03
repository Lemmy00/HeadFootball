"use strict"

const music=new Audio();
music.src="Music.mp3";
music.loop=true;

const button=document.querySelector(".music");
button.addEventListener("click", playMusic);

function playMusic(event){
    if(button.textContent==="Play Music"){
        music.play();
        button.textContent="Stop Music";
    }
    else{
        music.pause();
        button.textContent="Play Music";
    }
}



