//variabili
var canvas, ctx;
var player1, player2;
var asteroids = [];
var running = false;
var remaining_time;

//costanti
var STARTING_ASTEROIDS = 20;
var DELAY_ADD_ASTEROIDS = 2500;

var CANVAS_DIMENSION = 640;
var PLAYER_DIMENSION = 30;
var ASTEROID_DIMENSION = 10;

var PLAYTIME = 90000;

var PLAYER_IMAGE = "img/astronave.png"
var ASTEROID_IMAGE = "img/asteroid.jpg";

var PLAYER1_START_X = CANVAS_DIMENSION / 4 - PLAYER_DIMENSION / 2;
var PLAYER2_START_X = 3 * CANVAS_DIMENSION / 4 - PLAYER_DIMENSION / 2;
var PLAYER_START_Y = CANVAS_DIMENSION * 9 / 10;

var PLAYER_VEL = 64;
var MAX_SPEED_MULTIPLIER = 10;
var SPEED_INCREMENT = 3;
var SPEED_DECREMENT = 2;

//classi
class Player {
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = img;
    this.moving = false;
    this.increment = 0;
    this.points = 0;
    this.currVel = 0;
  }

  update(delta) {
    if(this.moving){
      if(this.currVel < PLAYER_VEL){
        this.currVel = PLAYER_VEL;
      }
      if(this.currVel > 0){
        this.currVel += SPEED_INCREMENT;
      }
    }else{
      if(this.currVel > 0){
        this.currVel -= SPEED_DECREMENT;
      }
      if(this.currVel < 0){
        this.currVel = 0;
      }
    }
    if(this.currVel > MAX_SPEED_MULTIPLIER * PLAYER_VEL){
      this.currVel = MAX_SPEED_MULTIPLIER * PLAYER_VEL;
    }

    this.y -= this.currVel * delta / 1000;

    if(this.y < -PLAYER_DIMENSION) {
      this.y = CANVAS_DIMENSION;
      this.points++;
    }
  }

  render() {
    ctx.drawImage(this.image, this.x, this.y, PLAYER_DIMENSION, PLAYER_DIMENSION);
  }

  collidesWith(other) {
  /*
    if (this.x < other.x + ASTEROID_DIMENSION &&
    this.x + PLAYER_DIMENSION > other.x &&
    this.y < other.y + ASTEROID_DIMENSION &&
    this.y + PLAYER_DIMENSION > other.y) {
      return true;
    }
  */
    //preso liberamente da http://www.phatcode.net/articles.php?id=459
    var radius = ASTEROID_DIMENSION / 2;
    var centre = {x: other.x + radius, y: other.y + radius};
    var v1 = {x: this.x + PLAYER_DIMENSION / 2, y: this.y};
    var v3 = {x: this.x, y: this.y + PLAYER_DIMENSION};
    var v2 = {x: this.x + PLAYER_DIMENSION, y: this.y + PLAYER_DIMENSION};	//servono ordinati clockwise altrimenti il terzo caso non funziona

    var c1 = {x: v1.x - centre.x, y: v1.y - centre.y};
    var c2 = {x: v2.x - centre.x, y: v2.y - centre.y};
    var c3 = {x: v3.x - centre.x, y: v3.y - centre.y};

    var e1 = {x: 0, y: 0};
    var e2 = {x: 0, y: 0};
    var e3 = {x: 0, y: 0};
    //controlla se un vertice del triangolo è dentro il cerchio
    if(Math.sqrt(c1.x * c1.x + c1.y * c1.y) <= radius || Math.sqrt(c2.x * c2.x + c2.y * c2.y) <= radius || Math.sqrt(c3.x * c3.x + c3.y * c3.y) <= radius){
      return true;
    }

    //cerchio dentro al triangolo?
    if (((v2.y - v1.y)*(centre.x - v1.x) - (v2.x - v1.x)*(centre.y - v1.y)) >= 0 && ((v3.y - v2.y)*(centre.x - v2.x) - (v3.x - v2.x)*(centre.y - v2.y)) >= 0 && ((v1.y - v3.y)*(centre.x - v3.x) - (v1.x - v3.x)*(centre.x - v3.x)) >= 0){
      return true
    }

    //boh, però funziona quindi va benissimo
    c1.x = centre.x - v1.x;
    c1.y = centre.y - v1.y;
    e1.x = v2.x - v1.x;
    e1.y = v2.y - v1.y;

    var k = c1.x * e1.x + c1.y * e1.y;
    var len;

    if (k > 0) {
      len = Math.sqrt(e1.x * e1.x + e1.y * e1.y);
      k = k / len;

      if (k < len) {
        if (Math.sqrt(c1.x * c1.x + c1.y * c1.y - k * k) <= radius)
          return true;
      }
    }

    //Second edge
    c2.x = centre.x - v2.x;
    c2.y = centre.y - v2.y;
    e2.x = v3.x - v2.x;
    e2.y = v3.y - v2.y;

    k = c2.x * e2.x + c2.y * e2.y;

    if (k > 0) {
      len = Math.sqrt(e2.x * e2.x + e2.y * e2.y);
      k = k / len;

      if (k < len) {
        if (Math.sqrt(c2.x * c2.x + c2.y * c2.y - k * k) <= radius)
          return true;
      }
    }

    //Third edge
    c3.x = centre.x - v3.x;
    c3.y = centre.y - v3.y;
    e3.x = v1.x - v3.x;
    e3.y = v1.y - v3.y;

    k = c3.x * e3.x + c3.y * e3.y;

    if (k > 0) {
      len = Math.sqrt(e3.x * e3.x + e3.y * e3.y);
      k = k / len;

      if (k < len) {
        if (Math.sqrt(c3.x * c3.x + c3.y * c3.y - k * k) <= radius)
          return true;
      }
    }
    return false;
  }
}

class Asteroid {
  constructor(img) {
    this.setup();
    this.image = new Image();
    this.image.src = img;
  }

  setup() {
    var x, y;
    var vel;

    vel = random(32) + 32;
    y = random(550);
    if (random(2) == 0){
      x = -ASTEROID_DIMENSION;
    } else {
      x = CANVAS_DIMENSION;
      vel *= -1;
    }

    this.x = x;
    this.y = y;
    this.vel = vel;
  }

  update(delta) {
    this.x += this.vel * delta / 1000;
    if(this.vel < 0 && this.x < -ASTEROID_DIMENSION || this.vel > 0 && this.x > CANVAS_DIMENSION) {
      this.setup();
    }
  }

  render() {
    /*
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(this.x, this.y, ASTEROID_DIMENSION, ASTEROID_DIMENSION)
    */
    ctx.drawImage(this.image, this.x, this.y, ASTEROID_DIMENSION, ASTEROID_DIMENSION);
  }

}

//funzioni
function update(delta) {
  player1.update(delta);
  player2.update(delta);
  for(let i of asteroids) {
    i.update(delta);
    if(player1.collidesWith(i)){
      player1.y = CANVAS_DIMENSION;
      player2.points++;
    }
    if(player2.collidesWith(i)){
      player2.y = CANVAS_DIMENSION;
      player1.points++;
    }
  }
  if(remaining_time > 0){
    remaining_time -= delta;
  }
}

var start = null;
function render(tstamp) {
  if(running){
    if(!start)
      start = tstamp;
    let delta = tstamp - start;
    start = tstamp;

    update(delta);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, CANVAS_DIMENSION, CANVAS_DIMENSION);

    player1.render();
    player2.render();
    for(let i of asteroids) {
      i.render();
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(CANVAS_DIMENSION / 2 - 1, (PLAYTIME - remaining_time)/PLAYTIME * CANVAS_DIMENSION, 2, CANVAS_DIMENSION - (PLAYTIME - remaining_time)/PLAYTIME * CANVAS_DIMENSION)
    ctx.font = "64px Arial";
    ctx.fillText(player1.points, 50, 600);
    ctx.fillText(player2.points, CANVAS_DIMENSION / 2 + 50, 600);

    requestAnimationFrame(render);
  }
  if(remaining_time < 0){
    running = false;
    ctx.font = "64px Arial";
    ctx.fillStyle = "#ffffff";
    if(player1.points > player2.points)
      ctx.fillText("player 1 ha vinto", 75, 300);
    else if(player1.points < player2.points){
      ctx.fillText("player 2 ha vinto", 75, 300);
    }else{
      ctx.fillText("pareggio", 200, 300);
    }
  }
}

function random(x) {
  return Math.floor(Math.random() *  x);
}

function addAsteroid() {

  asteroids.push(new Asteroid(ASTEROID_IMAGE));
}

function startGame() {
  requestAnimationFrame(render);
  remaining_time = PLAYTIME;
  running = true;
}

function initGame() {
  canvas.height = CANVAS_DIMENSION;
  canvas.width = CANVAS_DIMENSION;

  player1 = new Player(PLAYER1_START_X, PLAYER_START_Y, PLAYER_IMAGE);
  player2 = new Player(PLAYER2_START_X, PLAYER_START_Y, PLAYER_IMAGE);
}

window.onload = () => {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  addEventListener("keydown", (e) => {
    if(running){
      if(e.keyCode == 81){	//q
        player1.moving = true;
      }
      if(e.keyCode == 80){	//p
        player2.moving = true;
      }
    }
  })
  addEventListener("keyup", (e) => {
    if(running){
      if(e.keyCode == 81){	//q
        player1.moving = false;
      }
      if(e.keyCode == 80){	//p
        player2.moving = false;
      }
    }
  })

  setInterval(addAsteroid, 1500); //2500
  initGame();
  startGame();
}
