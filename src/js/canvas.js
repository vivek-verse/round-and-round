const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const arcMap = {
  "UR" : {
    direction : -1,
    start : 90,
    end : 0,
    operator : ">"
  },
  "UL" : {
    direction : 1,
    start : 90,
    end : 180,
    operator : "<"
  },
  "BL" : {
    direction : -1,
    start : 270,
    end : 180,
    operator : ">"
  },
  "LB" : {
    direction : 1,
    start : 0,
    end : 90,
    operator : "<"
    },
  "LU" : {
    direction : -1,
    start : 0,
    end : -90,
    operator : ">"
  },
  "RB" : {
    direction : -1,
    start : 180,
    end : 90,
    operator : ">"
  },
  "RU" : {
  direction : 1,
  start : 180,
  end : 270,
  operator : "<"
  },
  "BR" : {
  direction : 1,
  start : 270,
  end : 360,
  operator : "<"
  },
}

const flow = [
    "LB",
    "LU",
    "BL",
    "RB",
    "RU",
    "UL",
    "RB",
    "RU",
    "BR",
    "LB",
    "BR",
    "LB"
  ];

const randomNumber = () => {
  return Math.floor(Math.random() * flow.length);
}


let state = flow.shift();
// let state = flow[randomNumber()];

class Ball {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius;
    this.radians = Ball.D2R(arcMap[state].start);
    this.velocity = 0.08;
    this.color = color;
  }

  static D2R(degrees){
    let pi = Math.PI;
    return degrees * (pi/180);
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle =  this.color;
    c.fill()
    c.closePath()
  }

  update() {

    if(!state) return;

    const {direction, end, operator} = arcMap[state];

    this.radians = this.radians + direction * this.velocity;

    if(operator === ">"){
      if(this.radians >= Ball.D2R(end)){
        this.draw();
      }else{
        this.draw();
        state = flow.shift();
        // state = flow[randomNumber()];
        if(state){
          const { start } = arcMap[state];
          this.radians = Ball.D2R(start);
        }
      }
    }else{
      if(this.radians <= Ball.D2R(end)){
        this.draw();
      }else{
        this.draw();
        state = flow.shift();
        // state = flow[randomNumber()];
        if(state){
          const { start } = arcMap[state];
          this.radians = Ball.D2R(start);
        }
      }
    }


    this.x = this.x + Math.cos(this.radians) * 10;
    this.y = this.y + Math.sin(this.radians) * 10;

  }
}

let ball;
function init() {
  ball = new Ball(canvas.width / 2,  canvas.height / 2, 5, 'blue');
}

function animate() {
  requestAnimationFrame(animate)
  // c.clearRect(0, 0, canvas.width, canvas.height)
  ball.update()
}

init()
animate()
