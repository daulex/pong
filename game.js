// settings definitions

var canvas;
var canvasContext;

var ballRadius = 10;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;
var showingStartScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 2;


function calculateMousePos(evt){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop - (PADDLE_HEIGHT/2);

  return {
    x: mouseX,
    y: mouseY
  }
}

function handleMouseClick(evt){
  if(showingStartScreen || showingWinScreen){
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
    showingStartScreen = false;
    console.log("yea");
  }
}

window.onload = function(){

  canvas = document.getElementById("gc");
  canvasContext = canvas.getContext("2d");

  var framesPerSecond = 30;

  setInterval(function(){

    moveEverything();
    drawEverything();

  }, 1000/framesPerSecond);

  canvas.addEventListener('mousedown', handleMouseClick);

  canvas.addEventListener('mousemove', function(evt){
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y;
  });

  showingStartScreen = true;
}

function ballReset(){

  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
    showingWinScreen = true;
  }
  ballX = canvas.width/2;
  ballY = canvas.height/2;

  ballSpeedX = -ballSpeedX;
  
}

function computerMovement(){
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if(paddle2YCenter < ballY - 35){
    paddle2Y += 6;
  }else if(paddle2YCenter > ballY+35){
    paddle2Y -= 6;
  }
}

function moveEverything(){
  if(showingStartScreen || showingWinScreen){
    return;
  }
  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;
  
  if(ballX+ballRadius >= canvas.width){
    if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;

    }else{
      player1Score++; // must be before ballReset()
      ballReset();
    }
  }else if(ballX-ballRadius <= 0){
    if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){

      ballSpeedX = -ballSpeedX;
      
      var deltaY = ballY - (paddle1Y+PADDLE_HEIGHT/2);
      ballSpeedY = deltaY * 0.35;
    }else{
      player2Score++; // must be before ballReset()
      ballReset();
    }
    
  }

  if(ballY+ballRadius >= canvas.height){
    ballSpeedY = -ballSpeedY;
  }else if(ballY-ballRadius <= 0){
    ballSpeedY = -ballSpeedY;
  }
}

function drawNet(){
  for(var i=0; i<canvas.height; i+=40){
    colorRect(canvas.width/2-1,i,2,20,'white');
  }
}

function drawEverything(){
  
  // black background
  colorRect(0,0,canvas.width,canvas.height,'black');

  if(showingWinScreen){
    canvasContext.fillStyle = "white";
    if(player1Score >= WINNING_SCORE){
      canvasContext.fillText("Left Player Won!", 350, 200);
    }else{
      canvasContext.fillText("Right Player Won!", 350, 200);
    }
    
  
    
    canvasContext.fillText("Click to play again", 345, 500);
    return;
  }

  if(showingStartScreen){
    canvasContext.fillStyle = "white";
    canvasContext.font = "20px sans-serif";
    canvasContext.fillText("Welcome to JavaScript Pong", 270, 300);
    
  
    canvasContext.font = "12px sans-serif";
    canvasContext.fillText("Click to start", 355, 400);
    return;
  }

  drawNet();

  // left paddle
  colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // right paddle
  colorRect(canvas.width-PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');

  // ball
  colorCircle(ballX,ballY, 10, 'white');

  // score
  canvasContext.fillText(player1Score, 100, 100);
  canvasContext.fillText(player2Score, canvas.width-100, 100);
}







// Helpers
function colorCircle(centerX, centerY, radius, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}
function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX,topY,width,height);
}
