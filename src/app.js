"use strict";

/* Classes */
const Game = require('./game');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var image = new Image();
image.src = 'assets/pool_balls.png';

var stick = {x: 0, y: 0}
var balls = []
for(var i = 0; i < 18; i++){
  balls.push({
    position: {x: 0, y: 0},
    angle: 0,
    velocity: {x:0, y:0},
    color: 'gray'
  });
}
rack();

/**
 * Helper function to rack the balls
 */
function rack() {
  balls[15].position.x = 732;
  balls[15].position.y = 266;

  balls[0].position.x = 266;
  balls[0].position.y = 266;

  balls[1].position.x = 240;
  balls[1].position.y = 250;
  balls[8].position.x = 240;
  balls[8].position.y = 281;

  balls[9].position.x = 212;
  balls[9].position.y = 236;
  balls[7].position.x = 212;
  balls[7].position.y = 266;
  balls[2].position.x = 212;
  balls[2].position.y = 298;

  balls[3].position.x = 185;
  balls[3].position.y = 218;
  balls[10].position.x = 185;
  balls[10].position.y = 250;
  balls[4].position.x = 185;
  balls[4].position.y = 282;
  balls[11].position.x = 185;
  balls[11].position.y = 314;

  balls[12].position.x = 158;
  balls[12].position.y = 206;
  balls[5].position.x = 158;
  balls[5].position.y = 236;
  balls[13].position.x = 158;
  balls[13].position.y = 266;
  balls[6].position.x = 158;
  balls[6].position.y = 297;
  balls[14].position.x = 158;
  balls[14].position.y = 327;
}

/**
 * Track the changing stick position relative
 * to the cue ball.
 */
canvas.onmousemove = function(event) {
  event.preventDefault();
  stick.x = event.offsetX;
  stick.y = event.offsetY;
}

/**
 * Strike the cue ball with the stick
 */
canvas.onmousedown = function(event) {
  event.preventDefault();

  // TODO: strike the cue ball with cue stick
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // move balls
  balls.forEach(function(ball) {
    ball.position.x += elapsedTime * ball.velocity.x;
    ball.position.y += elapsedTime * ball.velocity.y;
  });

  // process collisions
  /*KE = .5mv^2
  Ka + Kb = E = Ka1 + Kb1 + C  
  Unknowns: Va1, Vb1*/
  /*Momentum
   p = mv
   p0 = p1
   pa0 + pb0 = pa1 + pb1
  */
  /* a.futureVelocity = a.velocity + b.velocity - b.futureVelocity
    
  */
  var i, j, collisionPairs = [];
  for(i = 0; i < 15; i++) {
    for(j = i; j < 15; j++){
      if(i != j &&
        850 > Math.pow(balls[i].position.x - balls[j].position.x, 2) + Math.pow(balls[i].position.y - balls[j].position.y, 2)
      ){
        balls[i].color = 'red';
        balls[j].color = 'green';
        collisionPairs.push({a: balls[i], b: balls[j]});
      }
    }
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "#3F6922";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render the balls
  balls.forEach(function(ball, index) {
    var sourceX = index % 4;
    var sourceY = Math.floor(index / 4);
    ctx.save();
    ctx.translate(-15, -15);
    ctx.rotate(ball.angle);
    ctx.translate(ball.position.x, ball.position.y);
    ctx.drawImage(image,
      // Source Image
      sourceX * 160, sourceY * 160, 160, 160,
      // Destination Image
      0, 0, 30, 30
    );
    ctx.beginPath();
    ctx.strokeStyle = ball.color;
    ctx.arc(15,15,15,0,2*Math.PI);
    ctx.stroke();
    ctx.restore();
  });

  // Render the stick
  ctx.beginPath();
  ctx.moveTo(balls[15].position.x, balls[15].position.y);
  ctx.lineTo(stick.x, stick.y);
  ctx.strokeStyle = "darkgrey";
  ctx.stroke();
  ctx.beginPath();
}
