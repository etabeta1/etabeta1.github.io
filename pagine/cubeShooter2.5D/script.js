class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Cube {
  constructor(x, y, z, h, w, d, color, ctx) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.h = h;
    this.w = w;
    this.d = d;
    this.color = color;
    this.ctx = ctx;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.zSpeed = 0;
    this.lastTimeStamp = 0;
  }

  setSpeed(xSpeed, ySpeed, zSpeed) {
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.zSpeed = zSpeed;
  }

  update(ts) {
    if(this.lastTimeStamp == 0) {  //se non ha un timestamp aspetta prossimo frame
      this.lastTimeStamp = ts;
      return;
    }
    let delta = (ts - this.lastTimeStamp);

    this.lastTimeStamp = ts;

    this.x += (this.xSpeed * delta);
    this.y += (this.ySpeed * delta);
    this.z += (this.zSpeed * delta);
  }

  render() {
    let pnt1 = new Point(Math.round((this.x - camera.x) * D / (this.z - camera.z) + WINDOW_WIDTH / 2),                    Math.round((this.y - camera.y) * D / (this.z - camera.z) + WINDOW_HEIGHT / 2));
    let pnt2 = new Point(Math.round((this.x + this.w - camera.x) * D / (this.z - camera.z) + WINDOW_WIDTH / 2),           Math.round((this.y - camera.y) * D / (this.z - camera.z) + WINDOW_HEIGHT / 2));
    let pnt3 = new Point(Math.round((this.x + this.w - camera.x) * D / (this.z - camera.z) + WINDOW_WIDTH / 2),           Math.round((this.y + this.h - camera.y) * D / (this.z - camera.z) + WINDOW_HEIGHT / 2));
    let pnt4 = new Point(Math.round((this.x - camera.x) * D / (this.z - camera.z) + WINDOW_WIDTH / 2),                    Math.round((this.y + this.h - camera.y) * D / (this.z - camera.z) + WINDOW_HEIGHT / 2));
    let pnt5 = new Point(Math.round((this.x - camera.x) * D / (this.z + this.d - camera.z) + WINDOW_WIDTH / 2),           Math.round((this.y - camera.y) * D / (this.z + this.d - camera.z) + WINDOW_HEIGHT / 2));
    let pnt6 = new Point(Math.round((this.x + this.w- camera.x) * D / (this.z + this.d - camera.z) + WINDOW_WIDTH / 2),   Math.round((this.y - camera.y) * D / (this.z + this.d - camera.z) + WINDOW_HEIGHT / 2));
    let pnt7 = new Point(Math.round((this.x + this.w- camera.x) * D / (this.z + this.d - camera.z) + WINDOW_WIDTH / 2),   Math.round((this.y + this.h - camera.y) * D / (this.z + this.d - camera.z) + WINDOW_HEIGHT / 2));
    let pnt8 = new Point(Math.round((this.x - camera.x) * D / (this.z + this.d - camera.z) + WINDOW_WIDTH / 2),           Math.round((this.y + this.h - camera.y) * D / (this.z + this.d - camera.z) + WINDOW_HEIGHT / 2));

    drawPolygon(ctx, this.color, [pnt1, pnt2, pnt3, pnt4]);
    drawPolygon(ctx, this.color, [pnt1, pnt5, pnt8, pnt4]);
    drawPolygon(ctx, this.color, [pnt3, pnt7, pnt6, pnt2]);
    drawPolygon(ctx, this.color, [pnt4, pnt8, pnt7, pnt3]);
    drawPolygon(ctx, this.color, [pnt1, pnt5, pnt6, pnt2]);
    drawPolygon(ctx, this.color, [pnt5, pnt8, pnt7, pnt6]);

    drawLine(ctx, "#000000", pnt1, pnt2);
    drawLine(ctx, "#000000", pnt2, pnt3);
    drawLine(ctx, "#000000", pnt3, pnt4);
    drawLine(ctx, "#000000", pnt4, pnt1);
    drawLine(ctx, "#000000", pnt1, pnt5);
    drawLine(ctx, "#000000", pnt2, pnt6);
    drawLine(ctx, "#000000", pnt4, pnt8);
    drawLine(ctx, "#000000", pnt3, pnt7);
    drawLine(ctx, "#000000", pnt8, pnt5);
    drawLine(ctx, "#000000", pnt5, pnt6);
    drawLine(ctx, "#000000", pnt6, pnt7);
    drawLine(ctx, "#000000", pnt7, pnt8);

  }

  collidesWith(other) {
    let xcol = this.x <= other.x + other.w && this.x + this.w >= other.x;
    let ycol = this.y <= other.y + other.h && this.y + this.h >= other.y;
    let zcol = this.z <= other.z + other.d && this.z + this.d >= other.z;
    return xcol && ycol && zcol;
  }
}

class Enemy extends Cube {
  constructor(x, y, z, h, w, d, color, ctx) {
    super(x, y, z, h, w, d, color, ctx);
  }

  respawn() {
    this.x = Math.random() * (WINDOW_WIDTH - 200) + 100;
    this.y = Math.random() * (WINDOW_HEIGHT - 200) + 100;
    this.z = Math.random() * 25 + 50;
  }
}

var canvas, ctx;
var camera;

var enemies = [];
var player;
var points = 0;
var bullets = [];
var MAX_BULLETS = 10;
var CURR_MAX_BULLETS;
var WINDOW_WIDTH, WINDOW_HEIGHT;
var BULLET_WIDTH = 10, BULLET_HEIGHT = 10;

var FOV = 120;
var D = 1/Math.tan(FOV/2);

var gameStatus = 0;

var mouse_x = 0, mouse_y = 0;

function drawPolygon(ctx, fillColor, points) {
  let oldColor = ctx.fillStyle;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for(let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.closePath()
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.fillStyle = oldColor;
}

function drawLine(ctx, color, from, to) {
  let oldColor = ctx.fillStyle;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.stroke();
  ctx.fillStyle = oldColor;

}


function distance(a, b) {
  return Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2 + (a.z - b.z)**2);
}

function createNewEnemy() {
  let c = new Enemy(
    Math.random() * (WINDOW_WIDTH - 200) + 100,
    Math.random() * (WINDOW_HEIGHT - 200) + 100,
    Math.random() * 25 + 50,
    Math.random() * 20 + 30,
    Math.random() * 20 + 30,
    1,
    "#FF0000"
  );
  c.respawn();
  enemies.push(c);
  c.setSpeed(0, 0, -(Math.random() * 0.01 + 0.005));
}

function spawnBullet() {
  if(bullets.length < MAX_BULLETS) {
    let b = new Cube(
      player.x + (player.w - BULLET_WIDTH) / 2,
      player.y + (player.h - BULLET_HEIGHT) / 2,
      player.z + player.d,
      BULLET_WIDTH, BULLET_HEIGHT, 0.25, "#00FFFF"
    );
    b.setSpeed(0, 0, .02),
    bullets.push(b);
    setTimeout(() => {bullets.shift()}, 2500);    //elimina in proiettile dopo 2.5 secondi
  }
}

function update(ts) {
  //player.update(ts);
  player.x = mouse_x;
  player.y = mouse_y;

  for(let b of bullets) {
    b.update(ts);
  }

  for(let e of enemies) {
    e.update(ts);
    if (e.z < camera.z) {
      e.respawn();
    }

    for(let b of bullets) {
      if(e.collidesWith(b)) {
        e.respawn();
        points++;
        setTimeout(createNewEnemy, 250);
        if(Math.round(Math.random() * CURR_MAX_BULLETS) == 1) {
          CURR_MAX_BULLETS++;
          //piccola probabilità di vincere un proiettile bonus
          //diminuisce con l'aumentare dei proiettili vinti;
        }
      }
    }

    if(player.collidesWith(e)) {
      //console.log("you lose");
      gameStatus = 2;
    }
  }

  render();
  requestAnimationFrame(update);
}

function render() {
  if(gameStatus != 2) {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //let entitiesToRender = [...enemies, player, ...bullets].sort((a, b) => {distance(a, camera) > distance(b, camera)});
    let entitiesToRender = [...enemies, player, ...bullets].sort((a, b) => {return a.z < b.z});
    for(let e of entitiesToRender) {
      e.render();
    }

    ctx.fillStyle = "#000000";
    ctx.font = "18px Verdana";
    ctx.fillText("punti: " + points, 20, 20);

    for(let i = 0; i < CURR_MAX_BULLETS - bullets.length; i++) {
      ctx.fillStyle = "#00FFFF";
      ctx.strokeStyle = "#000000";
      ctx.beginPath()
      ctx.rect(20 + i * 20, 440, 10, 20);
      ctx.fill();
      ctx.stroke();
      ctx.closePath();
    }
  }else if(gameStatus == 2) {
    ctx.fillStyle = "#000000";

    ctx.font = "48px Verdana";
    ctx.fillText("Hai perso", 40, 200);
    ctx.fillText("Clicca per ricominciare", 40, 270);
  }
}

function reset() {
  gameStatus = 1;
  points = 0;
  enemies = [];
  CURR_MAX_BULLETS = MAX_BULLETS;
  for(let i = 0; i < 10; i++) {
    setTimeout(createNewEnemy, i * 100);
  }

  player = new Cube(100, 100, 3, 30, 30, 0.25, "#00FF00");
  update(0);
}

window.onload = () => {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");

  canvas.addEventListener("mousemove", (e) => {
    mouse_x = e.offsetX;
    mouse_y = e.offsetY;
  });

  document.addEventListener("click", () => {
    if(gameStatus != 1) {
      reset();
    } else {
      spawnBullet();
    }
  });

  WINDOW_WIDTH = canvas.width;
  WINDOW_HEIGHT = canvas.height;

  camera = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    z: 0
  }

  ctx.fillStyle = "#000000";
  ctx.font = "48px Verdana";
  ctx.fillText("Clicca per iniziare", 80, 200);
}
