var c, ctx;
var tileSize = 16;
var direction = "nothing";
var points = 0;

var snake = [{x: 15, y: 15}, {x: 15, y: 16}, {x: 15, y: 17}, {x: 15, y: 18}, {x: 15, y: 19}, {x: 15, y: 20}];
var fruit = {x: -1, y: -1};

var lastCalledTime;
var fps;

function requestFPS() {
  if(!lastCalledTime) {
    lastCalledTime = Date.now();
    fps = 0;
    return;
  }
    delta = (Date.now() - lastCalledTime)/1000;
    lastCalledTime = Date.now();
    fps = 1/delta;
}

function drawGrid(){
  ctx.lineWidth = .1;
  for (var x = 0; x <= c.width; x += tileSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, c.height);
  }
  for (var x = 0; x <= c.height; x += tileSize) {
    ctx.moveTo(0, x);
    ctx.lineTo(c.width, x);
  }
  ctx.strokeStyle = "white";
  ctx.stroke();
}

function tick(){
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 640, 480);
  //drawGrid();
  drawSnake();
  drawFruit();
  requestFPS();
  ctx.font = "24px Arial bold";
  ctx.fillStyle = "#ffaa19";
  ctx.fillText("FPS: " + Math.round(fps), 10, 20);
  ctx.fillText("points: " + points, 400, 20);
  requestAnimationFrame(tick);
}

function moveSnake(){
  switch(direction){
    case "left":
      snake.unshift({x: snake[0].x-1, y: snake[0].y});
      break;
    case "up":
      snake.unshift({x: snake[0].x, y: snake[0].y-1});
      break;
    case "right":
      snake.unshift({x: snake[0].x+1, y: snake[0].y});
      break;
    case "down":
      snake.unshift({x: snake[0].x, y: snake[0].y+1});
      break;
  }
  if(snake[0].x < 0){snake[0].x = 39;}
  if(snake[0].x > 39){snake[0].x = 0;}
  if(snake[0].y < 0){snake[0].y = 29;}
  if(snake[0].y > 29){snake[0].y = 0;}
  if(direction != "nothing"){
    snake.pop();
  }

  for(var s_cnt = 2; s_cnt < snake.length; s_cnt++){
    if(snake[0].x == snake[s_cnt].x && snake[0].y == snake[s_cnt].y){
      snake.length = s_cnt;
      break;
    }
  }

  checkFruit();


}

function drawSnake(){
  for(let s of snake){
    if(s.x == snake[0].x && s.y == snake[0].y){
      ctx.fillStyle = "#177245";
    }else{
      ctx.fillStyle = "#00ff00";
    }
    ctx.fillRect(s.x * tileSize, s.y * tileSize, tileSize, tileSize);
  }
}

function drawFruit(){
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(fruit.x * tileSize, fruit.y * tileSize, tileSize, tileSize);
}

function checkFruit(){
  if(fruit.x == -1 && fruit.y == -1){
    do{
      fruit.x = getRandomInt(0, 39);
      fruit.y = getRandomInt(0, 29);
      //alert("fruit");
    }while(testCoord(fruit));
  }else{
    if(snake[0].x == fruit.x && snake[0].y == fruit.y){
      fruit = {x: -1, y: -1};
      points++;
      snake.push({x: -2, y: -2});
    }
  }
}

function testCoord(item){
  for(let s of snake){
    if(item.x == s.x && item.y == s.y){
      return true;
    }
  }
  return false;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.onload = function(){
  c = document.getElementById("GameCanvas");
  ctx = c.getContext("2d");
  c.height = 480;
  c.width = 640;
  setInterval(moveSnake, 400);
  document.addEventListener("keydown", function(e){
    switch(e.keyCode){
      case 37:
        direction = "left";
        break;
      case 38:
        direction = "up";
        break;
      case 39:
        direction = "right";
        break;
      case 40:
        direction = "down";
        break;
    }
  });
  requestAnimationFrame(tick);
}
