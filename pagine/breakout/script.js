var canvas, context;

var oldTime, deltaTime;

var HEIGHT = 480, WIDTH = 670;

var player, enemies = [], ball;
var PLAYER_Y = 400, PLAYER_H = 20, PLAYER_W = 100, PLAYER_COLOR = "#00ff00";
var ENEMY_COLOR = "#423189";
var BALL_COLOR = "#ffdf00";
var BALL_DIM = 20;

var ball_v = 0, ball_h = 0;

var mouse_x = WIDTH / 2;

var gameStatus = 0;

var BGCOLOR = "#6441a5";

var ball_speed = 0.075;
var vel_increase = 0.01;

var punti = 0;

class Block{
  static istanze = [];
  constructor(x, y, w, h, color){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;
    this.visible = true;
    Block.istanze.push(this);
  }

  collidesWith(other){
    let result = {
      esito: undefined,
      direzione: undefined
    };
    if(this.x < other.x + other.w && this.x + this.w > other.x && this.y < other.y + other.h && this.y + this.h > other.y && other.visible){
      result.esito = true;
    }else{
      result.esito = false;
    }

    if(result.esito){
      var this_bottom = this.y + this.h;
      var other_bottom = other.y + other.h;
      var this_right = this.x + this.w;
      var other_right = other.x + other.w;

      var b_collision = other_bottom - this.y;
      var t_collision = this_bottom - other.y;
      var l_collision = other_right - other.x;
      var r_collision = other_right - this.x;

      if (t_collision < b_collision && t_collision < l_collision && t_collision < r_collision){
      //sopra
      result.direzione = "sopra";
      }
      if(b_collision < t_collision && b_collision < l_collision && b_collision < r_collision){
      //sotto
      result.direzione = "sotto"
      }
      if (l_collision < r_collision && l_collision < t_collision && l_collision < b_collision ){
      //sinistra
      result.direzione = "sx";
      }
      if(r_collision < l_collision && r_collision < t_collision && r_collision < b_collision){
      //destra
      result.direzione = "dx";
      }
    }
    return result;
  }

  draw(){
    if(this.visible){
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.w, this.h);
    }
  }



}

function start(){
  //genera player e ball;
  player = new Block(0, PLAYER_Y, PLAYER_W, PLAYER_H, PLAYER_COLOR);
  ball = new Block(0, PLAYER_Y - BALL_DIM, BALL_DIM, BALL_DIM, BALL_COLOR);

  //genera nemici
  for(let i = 0; i < 6; i++){
    for(let j = 0; j < 8; j++){
      new Block(10 + i * 110, 20 + 40 * j, 100, 20, ENEMY_COLOR);
    }
  }

  //genera eventListener
  document.addEventListener("click", function(){
    if(gameStatus == 0){
      gameStatus = 1;
      ball_v = -1;
      ball_h = 1;
    }
  });

  document.addEventListener("mousemove", function(e){
    mouse_x = e.offsetX;
  });

  //ridimensiona il canvas
  canvas.height = HEIGHT;
  canvas.width = WIDTH;

  //comincia il ciclo di update
  update(0);
}

function update(time){
  //cancellazione cnavas
  context.fillStyle = BGCOLOR;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  //calcolo delta
  deltaTime = time - oldTime;

  //disegna blocchi e testo
  for(let i of Block.istanze){
    i.draw();
  }

  context.font = "30px Arial"
  context.fillStyle = "#000000";
  context.fillText("punti: " + punti, 30, 430);

  //gioco non iniziato, muove solo la palla e assieme il player
  if(gameStatus == 0){
    let temp = mouse_x - player.w / 2;
    if(temp < 0)
      temp = 0;
    if(temp + player.w > WIDTH)
      temp = WIDTH - player.w;
    player.x = temp;
    ball.x = temp + PLAYER_W / 2 - BALL_DIM / 2 - 1;

  }else if(gameStatus == 1){
    let temp = mouse_x - player.w / 2;
    if(temp < 0)
      temp = 0;
    if(temp + player.w > WIDTH)
      temp = WIDTH - player.w;
    player.x = temp;

    ball.y += ball_speed * ball_v * deltaTime;
    ball.x += ball_speed * ball_h * deltaTime;

    if(ball.y <= 0){
      ball.y = 0;
      ball_v = 1;
    }
    if(ball.x <= 0){
      ball.x = 0;
      ball_h = 1;
    }

    if(ball.x >= WIDTH - BALL_DIM){
      ball.x = WIDTH - BALL_DIM;
      ball_h = -1;
    }

    if(ball.y > HEIGHT){
      gameStatus = 2;
      youLose();
    }

    if(punti == 48) {
      alert("hai vinto");
      gameStatus = 2;
    }

    for(let i of Block.istanze){
      if(i != ball){
        let collisionResult = ball.collidesWith(i);
        if(collisionResult.esito){
          if(collisionResult.direzione == "sopra" || collisionResult.direzione == "sotto"){
            //collide da sotto o da sopra forse?
            if(ball_v == 1)
              ball_v = -1;
            else
              ball_v = 1;
          }else if(collisionResult.direzione == "sx" || collisionResult.direzione == "dx"){
            //collide dal fianco
            if(ball_h == 1)
              ball_h = -1;
            else
              ball_h = 1;
          }

          switch(collisionResult.direzione){
            case "sopra":
              ball.y = i.y - BALL_DIM - 1;
              break;
            case "sotto":
              ball.y = i.y + i.h + 1;
              break;
            case "sx":
              ball.x = i.x - BALL_DIM - 1;
              break;
            case "dx":
              ball.x = i.x + i.w + 1;
              break;
          }

          if(i != player){	//collisione con nemico
            i.visible = false;
            ball_speed += vel_increase;
            punti++;

          }
        }
      }
    }
  }

  oldTime = time;
  requestAnimationFrame(update);
}

 function youLose(){
  alert("hai perso");
}

window.onload = () => {
  canvas = document.querySelector("canvas");
  context = canvas.getContext("2d");
  start();
}
