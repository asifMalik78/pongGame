// getting the caption element 
const canvas=document.getElementById("canvas");

// getting the context without context we can't draw on the canvas and it contains varout methods and properties to which helps to draw on the canvas
const ctx=canvas.getContext("2d");

canvas.height=745;
canvas.width=1000;
const canvasHeight=canvas.height;
const canvasWidth=canvas.width;

const paddleHeight=10;
const paddleWidth=180;

const netHeight=2;
const netWidth=6;

let leftArrowKeyPressed=false;
let rightArrowKeyPressed=false;

// sounds
let hitSound=new Audio("../sounds/sounds_hitSound.wav");
let scoreSound=new Audio("../sounds/sounds_scoreSound.wav");
let wallHitSound=new Audio("../sounds/sounds_wallHitSound.wav");



// objects

// user
const user={
  x:(canvasWidth/2)-(paddleWidth/2),
  y:10,
  height:paddleHeight,
  width:paddleWidth,
  color:"blue",
  score:0
}

// computer
const computer={
  x:(canvasWidth/2)-(paddleWidth/2),
  y:canvasHeight-(paddleHeight + 10),
  height:paddleHeight,
  width:paddleWidth,
  color:"purple",
  score:0
}

//net
const net={
  x:0,
  y:(canvasHeight/2)-(netHeight/2),
  height:netHeight,
  width:netWidth,
  color:"white"
}

//ball
const ball={
  x:canvasWidth/2,
  y:canvasHeight/2,
  radius:10,
  speed:5,
  velocityX:5,
  velocityY:5,
  color:'red'
}

// functions

// draw board
function drawBoard(){
  ctx.fillStyle="black";
  ctx.fillRect(0 , 0 , canvasWidth , canvasHeight);
}

// draw net
function drawNet(){
  for(let i=0 ; i<canvasWidth ; i+=15){
    ctx.fillStyle=net.color;
    ctx.fillRect(net.x+i , net.y , net.width , net.height);
  }
}

// draw score
function drawScore(x , y , score){
  ctx.fillStyle="white";
  ctx.font="35px monospace";
  ctx.fillText(score , x , y);

}

// draw paddle
function drawPaddle(x , y , width , height , color){
  ctx.fillStyle=color;
  ctx.fillRect(x , y , width , height);
}

// draw ball
function drawBall(x , y , radius , color){
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(x , y , radius , 0 , Math.PI*2 ,false);
  ctx.closePath();
  ctx.fill();
}


// key movement handler
window.addEventListener("keydown" , keyDownHandler);
window.addEventListener("keyup" , keyUpHandler);

function keyDownHandler(event){
  switch(event.key){
    case 'a':
      leftArrowKeyPressed=true;
      break;
    
    case 'd':
      rightArrowKeyPressed=true;
      break;
  }
}


function keyUpHandler(event){
  switch(event.key){
    case 'a':
      leftArrowKeyPressed=false;
      break;
    
    case 'd':
      rightArrowKeyPressed=false;
      break;
  }
}

// reset function
function reset(){
 
  ball.x=(canvasWidth/2);
  ball.y=(canvasHeight/2);
  ball.speed=5;
  // changing the direction of the ball
  ball.velocityX=0;
  ball.velocityY=-ball.velocityY;

}

// collision function
function collision(ball , player){
  player.left=player.x;
  player.top=player.y;
  player.right=player.x + player.width;
  player.bottom=player.y + player.height;

  ball.left=ball.x-ball.radius;
  ball.top=ball.y-ball.radius;
  ball.right=ball.x + ball.radius;
  ball.bottom=ball.y + ball.radius;

  return (ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top);
}

// update function
function update(){
  // move the user paddle
  if(leftArrowKeyPressed && user.x > 0){
    user.x-=10;
    computer.x-=10;
  }
  else if(rightArrowKeyPressed && user.x < canvasWidth-user.width){
    user.x+=10;
    computer.x+=10;
  }

  // checking if balll hits the left and right ball
  if(ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width){
    wallHitSound.play();
    ball.velocityX=-ball.velocityX;
  }

  // if ball hit on the down wall
  if(ball.y + ball.radius >= canvas.height){
    scoreSound.play();
    user.score+=10;
    reset("user");
  }

  if(ball.y - ball.radius <= 0){
    scoreSound.play();
    computer.score+=10;
    reset("computer");
  }



  // move the ball
  ball.x+=ball.velocityX;
  ball.y+=ball.velocityY;

  // move computer paddle
  // computer.x += ((ball.x - (computer.x + computer.width/2))) * 0.9;

  // detecting ball hit to which paddle
  let player=(ball.y < (canvasHeight/2)) ? user : computer;


  if(collision(ball , player)){
    // sound plays
    hitSound.play();
    let angle=0;
    // if ball hit on the  upper half left side then it should deflect back at an angle of -45 deg
    if(ball.x < (player.x + player.width/2)){
      angle = -1 * Math.PI / 4;
    }

    // if ball hit on the lower half right side then it should deflect back at an angle of 45 deg
    else if(ball.x > (player.x + player.width/2)){
      angle = Math.PI/ 4;
    }
    // if ball hit at the center of the paddle than it should deflect back at an angle of 0 deg
    else{
      angle=0;
    }

     // change the velocity of the ball which paddle hit the ball
     let sign=(player===user) ? 1 : -1;

     ball.velocityX=ball.speed * Math.sin(angle);
     ball.velocityY=sign * ball.speed * Math.cos(angle);

    // increasing the ball speed
    ball.speed+=0.4;

  
  }
}


// render function draws everything on the function
function render(){
  //drawing the canvas
  drawBoard();

  // drewing the net on the canvas
  drawNet();

  // drawing the score on the canvas
  // user score
  drawScore(canvasWidth/15 , canvasHeight/4 , user.score);
  // computer score
  drawScore(canvasWidth/15 , (3*canvasHeight)/4 , computer.score);

  // player -1
  drawScore(canvasWidth/60 , (canvasHeight/2)-30 , "Player-1")
  drawScore(canvasWidth/60 , (canvasHeight/2)+45 , "Player-2")
  
  // draw paddle
  // user paddle
  drawPaddle(user.x , user.y , user.width , user.height , user.color);
  // computer paddle
  drawPaddle(computer.x , computer.y , computer.width , computer.height , computer.color);

  //drawing the ball
  drawBall(ball.x , ball.y , ball.radius , ball.color);
}


function gameLoop(){
  update();
  render();
}


function initalDisplay(){
  //drawing the canvas
  drawBoard();

  // user paddle
  drawPaddle(user.x , user.y , user.width , user.height , user.color);
  // computer paddle
  drawPaddle(computer.x , computer.y , computer.width , computer.height , computer.color);

}

initalDisplay();
window.addEventListener("keypress" , function(e){
  if(e.key=="Enter"){
    var interval=setInterval(function(){
      gameLoop();
    } , 1000/60);
    document.querySelector(".strip").style.display="none";
  }
})








