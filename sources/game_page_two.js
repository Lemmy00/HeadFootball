"use strict"

const ball=document.querySelector(".ball");
const canvasElement=document.querySelector("canvas");
const ctx=canvasElement.getContext("2d");
const player1=document.querySelector(".player1");
const player2=document.querySelector(".player2");
const goal1=document.querySelector(".team1");
const goal2=document.querySelector(".team2");
const foot1=document.querySelector(".p1");
const foot2=document.querySelector(".p2");
const barL=document.querySelector(".L");
const barR=document.querySelector(".R");
const frontBarL=document.querySelector(".frontBarL");
const frontBarR=document.querySelector(".frontBarR");
const postL=document.querySelector(".postL");
const postR=document.querySelector(".postR");
const sound=document.querySelector("#sound");
const play=document.querySelector("#play");


let team1Goals=0;
let team2Goals=0;
let Goal=false;


const rBall=ball.offsetWidth/2;
const rPlayer=player1.offsetWidth/2;


let yBall=ball.offsetTop;
let yBallVel=0;
let yAcc=0.2;

let xBall=ball.offsetLeft;
let xBallVel=0;
let xBallAcc=0;

let xPlayer1=player1.offsetLeft;
let xPlayer1Vel=0;

let yPlayer1=player1.offsetTop;
let yPlayer1Vel=0;
let player1Up=true;

let xPlayer2=player2.offsetLeft;
let xPlayer2Vel=0;

let yPlayer2=player2.offsetTop;
let yPlayer2Vel=0;
let player2Up=true;


const Shoot1=[];
let nextShoot1=0;
let shooting1=0;

const Shoot2=[];
let nextShoot2=0;
let shooting2=0;

const shootPower=[];

let bouncy=0.8;

let gameStarted=false;

const img_ball=new Image();
let img_ball_idx=0;
const img_ball_w=267;
const img_ball_h=267;

const whistle=new Audio();
const crowd= new Audio();
const goal_cel= new Audio();

main();

function main(){
    ctx.canvas.width=1200;
    ctx.canvas.height=800;
    img_ball.src="../data/ball.png";
    img_ball.onload=displayBall;

    whistle.src="../data/whistlee.mp3";
    
    crowd.src="../data/crowd_sound.mp3";
    crowd.loop=true;

    goal_cel.src="../data/Goal.mp3";

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup",stopPlayer);
    play.addEventListener("click", playGame);
    sound.addEventListener("click", voulume);

    for(let k=35,ang=25;k<=60;k+=3,ang-=7){
        Shoot1.push([k, 60-30+Math.sqrt(900-Math.pow((k-30),2)), ang]);
    }

    for(let k=0;k<Shoot1.length;k++){
        Shoot2.push([Shoot1[k][0], Shoot1[k][1], -Shoot1[k][2]]);
    }

    for(let k=0;k<4;k++){
        shootPower.push([3*k,2*k]);
    }
    for(let k=4;k<9;k++){
        shootPower.push([2.5*(8-k),3*(8-k)]);
    }
    xBallVel=getRndWind();
    
    window.requestAnimationFrame(frame);

}

function getRndWind(){
    return Math.floor(Math.random()*(5))-2;
}

function playGame(event){
    if(document.querySelector(".panel").style.opacity!="0"){
        return;
    }
    if(gameStarted){
        play.src="../data/pause.png";
    }
    else{
        play.src="../data/play.png";
    }
    gameStarted=!gameStarted;
}

function voulume(event){
    if(whistle.volume===0){
        whistle.volume=1;
        crowd.volume=1;
        goal_cel.volume=1;
        sound.src="../data/sound.png";
    }
    else{
        whistle.volume=0;
        crowd.volume=0;
        goal_cel.volume=0;
        sound.src="../data/sound_off.png";
    }
}

function movePlayer(event){
    if(!gameStarted){
        if(event.key===" "){
            gameStarted=true;
            document.querySelector(".panel").style.opacity ="0.0";
            whistle.play();
            crowd.play();
            play.src="../data/play.png";
        }
        return;
    }

    if(event.key==="d" || event.key==="D"){
        xPlayer1Vel=4;
    }
    else if(event.key==="a" || event.key==="A"){
        xPlayer1Vel=-4;
    }
    else if((event.key==="w" || event.key==="W") && player1Up){
        yPlayer1Vel=-6;
        player1Up=false;
    }
    else if(event.key===" "){
        shooting1=1;
    }
    else if(event.key==="ArrowRight"){
        xPlayer2Vel=4;
    }
    else if(event.key==="ArrowLeft"){
        xPlayer2Vel=-4;
    }
    else if(event.key==="ArrowUp" && player2Up){
        yPlayer2Vel=-6;
        player2Up=false;
    }
    else if(event.key==="p" || event.key==="P"){
        shooting2=1;
    }
}

function stopPlayer(event){
    if(!gameStarted){
        return;
    }
    if(event.key==="d" || event.key==="a" || event.key==="D" || event.key==="A"){
        xPlayer1Vel=0;
    }
    else if(event.key===" "){
        shooting1=-1;
    }
    else if(event.key==="ArrowRight" || event.key==="ArrowLeft"){
        xPlayer2Vel=0;
    }
    else if(event.key==="p" || event.key==="P"){
        shooting2=-1;
    }
}


function frame(){
    if(!gameStarted){
        window.requestAnimationFrame(frame);
        return;
    }
    if(Goal){
        goal_cel.play();
        let yConf = document.querySelector(".confetti").offsetTop;
        yConf += 6;
        document.querySelector(".confetti").style.top=`${yConf}px`;
        let xText= document.querySelector("em").offsetLeft;
        xText+=10;
        document.querySelector("em").style.left=`${xText}px`;
        if(xText>=1200){
            document.querySelector(".confetti").style.top=`${-500}px`;
            whistle.play();
            Goal=false;
            xBall=485;
            yBall=110;
            document.querySelector("em").style.left=`${-880}px`;
            xPlayer1=150;
            xPlayer2=788;
            xBallVel=getRndWind();
            yBallVel=0;
            if(team1Goals==5){
                gameStarted=false;
                document.querySelector(".panel").textContent=`Player 1 Wins ${team1Goals}:${team2Goals}. Press "Space" to restart`;
                document.querySelector(".panel").style.opacity="1.0";
                team2Goals=0;
                team1Goals=0;
                goal2.textContent=`${team2Goals}`;
                goal1.textContent=`${team1Goals}`;
                play.src="pause.png";
            }
            else if(team2Goals==5){
                gameStarted=false;
                document.querySelector(".panel").textContent=`Player 2 Wins ${team1Goals}:${team2Goals}. Press "Space" to restart`;
                document.querySelector(".panel").style.opacity="1.0";
                team2Goals=0;
                team1Goals=0;
                goal2.textContent=`${team2Goals}`;
                goal1.textContent=`${team1Goals}`;
                play.src="pause.png";
            }
        }
    }

    nextShoot1+=shooting1;
    if(nextShoot1>=Shoot1.length){
        nextShoot1=Shoot1.length-1;
        shooting1=0;
    }
    else if(nextShoot1<0){
        nextShoot1=0;
        shooting1=0;
    }
    foot1.style.left=`${Shoot1[nextShoot1][0]}px`;
    foot1.style.top=`${Shoot1[nextShoot1][1]}px`;
    foot1.style.transform=`rotate(${Shoot1[nextShoot1][2]}deg)`;     
    yBallVel+=yAcc
    yBall+=yBallVel;
    ball.style.top=`${yBall}px`;
    xBallVel+=xBallAcc;
    xBall+=xBallVel;
    ball.style.left=`${xBall}px`;
    xPlayer1+=xPlayer1Vel;
    player1.style.left=`${xPlayer1}px`;

    if(!player1Up){
        yPlayer1Vel+=yAcc;
        yPlayer1+=yPlayer1Vel;
        player1.style.top=`${yPlayer1}px`;
    }

    nextShoot2+=shooting2;
    if(nextShoot2>=Shoot2.length){
        nextShoot2=Shoot2.length-1;
        shooting2=0;
    }
    else if(nextShoot2<0){
        nextShoot2=0;
        shooting2=0;
    }
    foot2.style.right=`${Shoot2[nextShoot2][0]}px`;
    foot2.style.top=`${Shoot2[nextShoot2][1]}px`;
    foot2.style.transform=`rotate(${Shoot2[nextShoot2][2]}deg)`; 
    xPlayer2+=xPlayer2Vel;
    player2.style.left=`${xPlayer2}px`;

    if(!player2Up){
        yPlayer2Vel+=yAcc;
        yPlayer2+=yPlayer2Vel;
        player2.style.top=`${yPlayer2}px`;       
    }
    checkGoal();
    MovingPlayer1();
    MovingPlayer2();
    shootFootPlayer1();
    const contact1=ShootBallPlayer1();
    const contact2=ShootBallPlayer2();

    shootFootPlayer2();
    MovingBall();
    checkBar();
    checkPost();
    calculateXAcc();
    collision();
    if(contact1 && contact2){
        yBall-=15;
    }
    window.requestAnimationFrame(frame);
}

function MovingBall(){
    if(yBall+ball.offsetHeight+4>=document.querySelector(".stage").offsetHeight){
        yBall=document.querySelector(".stage").offsetHeight-ball.offsetHeight-4;
        ball.style.top=`${yBall}px`;
        yBallVel=-Math.abs(yBallVel*bouncy);
    }

    else if(yBall<=0){
        yBall=0;
        yBallVel=-yBallVel*bouncy;
        ball.style.top=`0px`;
    }

    if(xBall<=0){
        xBall=0;
        ball.style.left=`0px`;
        xBallVel=-xBallVel*bouncy;
    }

    else if(xBall>=document.querySelector(".stage").offsetWidth-ball.offsetWidth-4){
        xBall=document.querySelector(".stage").offsetWidth-ball.offsetWidth-4;
        ball.style.left=`${xBall}px`;
        xBallVel=-xBallVel*bouncy;
    }
}

function MovingPlayer1(){
    if(xPlayer1<=7){
        xPlayer1=7;
        player1.style.left=`7px`;
    }

    if(xPlayer1>=document.querySelector(".stage").offsetWidth-player1.offsetWidth-11){
        xPlayer1=document.querySelector(".stage").offsetWidth-player1.offsetWidth-11;
        player1.style.left=`${xPlayer1}px`;

    }

    if(!player1Up && yPlayer1+player1.offsetHeight+4>=document.querySelector(".stage").offsetHeight){
        yPlayer1=document.querySelector(".stage").offsetHeight-player1.offsetHeight- 4;
        player1.style.top=`${yPlayer1}px`;
        yPlayer1Vel=0;
        player1Up=true;
    }
}

function MovingPlayer2(){
    if(xPlayer2<=7){
        xPlayer2=7;
        player2.style.left=`7px`;
    }

    if(xPlayer2>=document.querySelector(".stage").offsetWidth-player2.offsetWidth-11){
        xPlayer2=document.querySelector(".stage").offsetWidth-player2.offsetWidth-11;
        player2.style.left=`${xPlayer2}px`;

    }

    if(!player2Up && yPlayer2+player2.offsetHeight+4>=document.querySelector(".stage").offsetHeight){
        yPlayer2=document.querySelector(".stage").offsetHeight-player2.offsetHeight- 4;
        player2.style.top=`${yPlayer2}px`;
        yPlayer2Vel=0;
        player2Up=true;
    }
}

function ShootBallPlayer1(){
    let contact=false;
    const centerBallX=xBall+rBall;
    const centerBallY=yBall+rBall;

    const centerPlayer1X=xPlayer1+rPlayer;
    const centerPlayer1Y=yPlayer1+rPlayer;
    
    const dist=Math.sqrt(Math.pow(centerBallX-centerPlayer1X,2)+Math.pow(centerBallY-centerPlayer1Y,2));
    if(dist<=rBall+rPlayer){
        const xVec=(xBall-xPlayer1)/dist;
        const yVec=(yBall-yPlayer1)/dist;
        xBall+=xVec*(rBall+rPlayer-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rPlayer-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec*bouncy;
        if(xBallVel*xPlayer1Vel>=0){
            xBallVel+=xPlayer1Vel*bouncy*bouncy;
        }
        yBallVel=vBall*yVec;
        if(yBallVel*yPlayer1Vel>=0){
            yBallVel+=yPlayer1Vel*bouncy;
        } 
        contact=true;
    }
    return contact;
}

function shootFootPlayer1(){
    const rect1=foot1.getBoundingClientRect();
    const rect2=ball.getBoundingClientRect();

    const centerBallX=rect2.left+rBall;
    const centerBallY=rect2.top+rBall;

    const rFoot=foot1.offsetWidth/2+2
    const centerFootX=rect1.left+rFoot;
    const centerFootY=rect1.top+rFoot;

    const dist=Math.sqrt(Math.pow(centerBallX-centerFootX,2)+Math.pow(centerBallY-centerFootY,2));
    if(dist<=rBall+rFoot){
        const xVec=(rect2.left-rect1.left)/dist;
        const yVec=(rect2.top-rect1.top)/dist;

        xBall+=xVec*(rBall+rFoot-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rFoot-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec;
        if(xBallVel>=0){
            xBallVel+=shootPower[nextShoot1][0]
        }
        yBallVel=vBall*yVec;
        if(yBallVel<=0){
            yBallVel-=shootPower[nextShoot1][1];
        }
    }

}

function ShootBallPlayer2(){
    let contact=false;
    const centerBallX=xBall+rBall;
    const centerBallY=yBall+rBall;

    const centerPlayer2X=xPlayer2+rPlayer;
    const centerPlayer2Y=yPlayer2+rPlayer;
    
    const dist=Math.sqrt(Math.pow(centerBallX-centerPlayer2X,2)+Math.pow(centerBallY-centerPlayer2Y,2));
    if(dist<=rBall+rPlayer){
        const xVec=(xBall-xPlayer2)/dist;
        const yVec=(yBall-yPlayer2)/dist;
        xBall+=xVec*(rBall+rPlayer-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rPlayer-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec*bouncy;
        if(xBallVel*xPlayer2Vel>=0){
            xBallVel+=xPlayer2Vel*bouncy*bouncy;
        }
        yBallVel=vBall*yVec;
        if(yBallVel*yPlayer2Vel>=0){
            yBallVel+=yPlayer2Vel*bouncy;
        } 
        contact=true
    }
    return contact
}

function shootFootPlayer2(){
    const rect1=foot2.getBoundingClientRect();
    const rect2=ball.getBoundingClientRect();

    const centerBallX=rect2.left+rBall;
    const centerBallY=rect2.top+rBall;

    const rFoot=foot2.offsetWidth/2+2
    const centerFootX=rect1.left+rFoot;
    const centerFootY=rect1.top+rFoot;

    const dist=Math.sqrt(Math.pow(centerBallX-centerFootX,2)+Math.pow(centerBallY-centerFootY,2));
    if(dist<=rBall+rFoot){
        const xVec=(rect2.left-rect1.left)/dist;
        const yVec=(rect2.top-rect1.top)/dist;

        xBall+=xVec*(rBall+rFoot-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rFoot-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec;
        if(xBallVel<=0){
            xBallVel-=shootPower[nextShoot2][0]
        }
        yBallVel=vBall*yVec;
        if(yBallVel<=0){
            yBallVel-=shootPower[nextShoot2][1];
        }
    }
}


function calculateXAcc(){
    if(Math.abs(xBallVel)<0.6){
        xBallAcc=0;
        xBallVel=0;
    }
    else if(xBallVel>0){
        xBallAcc=-0.005;
    }
    else{
        xBallAcc=0.005;
    }
    if(yBall===document.querySelector(".stage").offsetHeight-ball.offsetHeight-4){
        xBallAcc*=30;
    }
}

function checkGoal(){
    if(Goal){
        return;
    }
    if(xBall<55 && yBall>385){
        team2Goals++;
        goal2.textContent=`${team2Goals}`;
        Goal=true;

    }
    else if(xBall>918 && yBall>385){
        team1Goals++;
        goal1.textContent=`${team1Goals}`;
        Goal=true;
    }
}

function checkBar(){
    const ballBound=ball.getBoundingClientRect();
    
    const frontBoundL=frontBarL.getBoundingClientRect();
    const frontBoundR=frontBarR.getBoundingClientRect();

    const rFront=frontBoundL.offsetWidth/2;
    const centerBallX=ballBound.left+rBall;
    const centerBallY=ballBound.top+rBall;

    const centerFrontLX=frontBoundL.left+rFront;
    const centerFrontLY=frontBoundL.top+rFront;

    let dist=Math.sqrt(Math.pow(centerBallX-centerFrontLX,2)+Math.pow(centerBallY-centerFrontLY,2));


    if(dist<=rBall+rFront){

        const xVec=(ballBound.left-frontBoundL.left)/dist;
        const yVec=(ballBound.top-frontBoundL.top)/dist;

        xBall+=xVec*(rBall+rFront-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rFront-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec;
        yBallVel=vBall*yVec;
        return;
    }


    const centerFrontRX=frontBoundR.left+rFront;
    const centerFrontRY=frontBoundR.top+rFront;

    dist=Math.sqrt(Math.pow(centerBallX-centerFrontRX,2)+Math.pow(centerBallY-centerFrontRY,2));

    if(dist<=rBall+rFront){

        const xVec=(ballBound.left-frontBoundR.left)/dist;
        const yVec=(ballBound.top-frontBoundR.top)/dist;

        xBall+=xVec*(rBall+rFront-dist);
        ball.style.left=`${xBall}px`;

        yBall+=yVec*(rBall+rFront-dist);
        ball.style.top=`${yBall}px`;

        const vBall=Math.sqrt(Math.pow(xBallVel,2)+Math.pow(yBallVel,2))*bouncy;
        xBallVel=vBall*xVec;
        yBallVel=vBall*yVec;
        return;
    }



    const barLbound=barL.getBoundingClientRect();
    const barRbound=barR.getBoundingClientRect();    

    var overlapL=!(barLbound.right< ballBound.left || 
        barLbound.left>ballBound. right ||
        barLbound.top > ballBound.bottom ||
        barLbound.bottom< ballBound.top
        );
    
    if(overlapL){
        if(ballBound.top<=barLbound.top){
            yBall+=barLbound.top-ballBound.bottom;
            xBallVel+=1;
        }
        else{
            yBall-=ballBound.top-barLbound.bottom;
        }
        ball.style.top=`${yBall}px`;
        yBallVel=-yBallVel*bouncy;
        xBallVel=xBallVel*bouncy;
        return;
    }

    var overlapR=!(barRbound.right< ballBound.left || 
        barRbound.left>ballBound. right ||
        barRbound.top > ballBound.bottom ||
        barRbound.bottom< ballBound.top
        );
    
    if(overlapR){
        if(ballBound.top<=barRbound.top){
            yBall+=barRbound.top-ballBound.bottom;
            xBallVel-=1;
        }
        else{
            yBall-=ballBound.top-barRbound.bottom;
        }

        ball.style.top=`${yBall}px`;
        yBallVel=-yBallVel*bouncy;
        xBallVel=xBallVel*bouncy;
        return;
    }
}

function checkPost(){
    const ballBound=ball.getBoundingClientRect();
    const postLBound=postL.getBoundingClientRect();
    const postRBound=postR.getBoundingClientRect();

    var overlapL=!(postLBound.right< ballBound.left || 
        postLBound.left>ballBound. right ||
        postLBound.top > ballBound.bottom ||
        postLBound.bottom< ballBound.top
        );
    if(overlapL){
        xBall=7;
        xBallVel=-xBallVel*bouncy;
        return;
    }

    var overlapR=!(postRBound.right< ballBound.left || 
        postRBound.left>ballBound. right ||
        postRBound.top > ballBound.bottom ||
        postRBound.bottom< ballBound.top
        );

    if(overlapR){
        xBall=document.querySelector(".stage").offsetWidth-ball.offsetWidth-11;
        xBallVel=-xBallVel*bouncy;
    }
}

function collision(){
    const rect1=player1.getBoundingClientRect();
    const rect2=player2.getBoundingClientRect();

    const center1X=rect1.left+rPlayer;
    const center1Y=rect1.top+rPlayer;

    const center2X=rect2.left+rPlayer;
    const center2Y=rect2.top+rPlayer;

    const dist=Math.sqrt(Math.pow(center1X-center2X,2)+Math.pow(center1Y-center2Y,2));
    if(dist<=2*rPlayer){
        const num=Math.floor(Math.random()*2)
        if(num==0){
            const xVec=(center2X-center1X)/dist;
            const yVec=(center2Y-center1Y)/dist;
            xPlayer2+=xVec*(2*rPlayer-dist);
            player2.style.left=`${xPlayer2}px`;
    
            yPlayer2+=yVec*(2*rPlayer-dist);
            player2.style.top=`${yPlayer2}px`; 
            if(yPlayer2+player2.offsetHeight+4>=document.querySelector(".stage").offsetHeight){
                yPlayer2=document.querySelector(".stage").offsetHeight-player2.offsetHeight- 4;
                player2.style.top=`${yPlayer2}px`;
                yPlayer2Vel=0;
            }
        }
        else{
            const xVec=(center1X-center2X)/dist;
            const yVec=(center1Y-center2Y)/dist;
            xPlayer1+=xVec*(2*rPlayer-dist);
            player1.style.left=`${xPlayer1}px`;
    
            yPlayer1+=yVec*(2*rPlayer-dist);
            player1.style.top=`${yPlayer1}px`;
            if(yPlayer1+player1.offsetHeight+4>=document.querySelector(".stage").offsetHeight){
                yPlayer1=document.querySelector(".stage").offsetHeight-player1.offsetHeight- 4;
                player1.style.top=`${yPlayer1}px`;
                yPlayer1Vel=0;
            }
        }
    }
}


let BallCnt=0;
function displayBall(){
    img_ball_idx=Math.abs(img_ball_idx%4);
    ctx.drawImage(img_ball,0,img_ball_h*img_ball_idx,img_ball_w,img_ball_h,
        -1,-1,32,32);
    BallCnt++;
    if(Math.abs(xBallVel)>0 && BallCnt>=Math.abs(10/xBallVel)){
        if(xBallVel>0){
            img_ball_idx++;
        }
        else{
            img_ball_idx--;
        }
        BallCnt=0;
    }
    window.requestAnimationFrame(displayBall);
}



