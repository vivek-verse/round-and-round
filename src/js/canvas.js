const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let blockSize = innerWidth * 0.90 / 5; // block size in grid
canvas.width = innerWidth
canvas.height = innerHeight
const linearVelocity = 60;
const arcMap = {
    "C_LU": {//
        direction: -1,
        start: 90,
        end: 0,
        operator: ">"
    },
    "C_RU": {//
        direction: 1,
        start: 90,
        end: 180,
        operator: "<"
    },
    "C_RB": {//
        direction: -1,
        start: 270,
        end: 180,
        operator: ">"
    },
    "C_UL": {//
        direction: 1,
        start: 0,
        end: 90,
        operator: "<"
    },
    "C_BL": {//
        direction: -1,
        start: 0,
        end: -90,
        operator: ">"
    },
    "C_UR": {//
        direction: -1,
        start: 180,
        end: 90,
        operator: ">"
    },
    "C_BR": {
        direction: 1,
        start: 180,
        end: 270,
        operator: "<"
    },
    "C_LB": {//
        direction: 1,
        start: 270,
        end: 360,
        operator: "<"
    },
    "L_LR": {
        direction: 1,
        type: "H",
        end: null,
        operator: "<"
    },
    "L_RL": {
        direction: -1,
        type: "H",
        end: null,
        operator: ">"
    },
    "L_UD": {
        direction: 1,
        type: "V",
        end: null,
        operator: "<"
    },
    "L_DU": {
        direction: -1,
        type: "V",
        end: null,
        operator: ">"
    },
}

const lastBlock = {};

const curveAdjustment = (arc, x, y) => {
    switch(arc) {
      case "C_UL":
        return { x : x - blockSize / 2, y};
      case "C_BL":
        return { x : x  - blockSize / 2, y};
      case "C_LB":
        return { x, y : y + blockSize / 2};
      case "C_LU":
        return { x, y : y - blockSize / 2};
      case "C_BR":
        return { x : x + blockSize / 2, y};
      case "C_UR":
        return { x : x + blockSize / 2, y};
      case "C_RU":
        return { x, y : y - blockSize / 2};
      case "C_RB":
        return {x, y : y + blockSize / 2}
      default:
        return {x, y}
    }
}

const flow = [
    "C_LB",
    "C_LU",
    "C_RU",
    "C_RB",
    "C_BL",
    "L_RL",
    "C_RB",
    "L_LR",
    "L_LR",
    "C_UL",
    "C_RU"
];

let state = flow.shift();

class Ball {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        lastBlock.x = x;
        lastBlock.y = y;
        this.radius = radius;
        this.radians = Ball.D2R(arcMap[state].start);
        this.velocity = 0.03;
        this.color = color;
    }

    static D2R(degrees) { // degree to radians
        let pi = Math.PI;
        return degrees * (pi / 180);
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color;
        c.fill()
        c.closePath()
    }

    updateStateAndRadians() {
        state = flow.shift();
        if (state) {
            const {
                start
            } = arcMap[state];
            if(start !== undefined){
              this.radians = Ball.D2R(start);
            }
        }
    }

    updateLinearState(currentState){
      let axis = "x";
      if (currentState["type"] === "V") {
          axis = "y";
      }

      if (!currentState["end"]) {
          currentState["end"] = this[axis] + currentState.direction * blockSize;
      }

      this[axis] = this[axis] + currentState.direction * this.velocity * linearVelocity;

      if (currentState["operator"] === ">") {
          if (this[axis] < currentState["end"]) {
              this.radians = null;
              currentState["end"] = null;
              lastBlock.x = this.x;
              lastBlock.y = this.y;
              state = flow.shift();
          }
      } else {
          if (this[axis] > currentState["end"]) {
              this.radians = null;
              currentState["end"] = null;
              lastBlock.x = this.x;
              lastBlock.y = this.y;
              state = flow.shift();
          }
      }
    }

    update() {

        if (!state) return;

        const {
            direction,
            end,
            operator
        } = arcMap[state];

        const [montionType] = state;

        this.draw();

        if (montionType === "C") {
            if(!this.radians){
                this.radians = Ball.D2R(arcMap[state].start);
            }

            this.radians = this.radians + direction * this.velocity;

            const {x, y} = curveAdjustment(state, lastBlock.x, lastBlock.y);

            this.x = x + Math.cos(this.radians) * blockSize / 2;
            this.y = y + Math.sin(this.radians) * blockSize / 2;

            if (operator === ">") {
                if (this.radians < Ball.D2R(end)) {
                    lastBlock.x = this.x;
                    lastBlock.y = this.y;
                    this.updateStateAndRadians();
                }
            } else {
                if (this.radians > Ball.D2R(end)) {
                    lastBlock.x = this.x;
                    lastBlock.y = this.y;
                    this.updateStateAndRadians();
                }
            }

        } else if (montionType === "L") {
          this.updateLinearState(arcMap[state]);
        }


    }
}

let ball;

function init() {
    ball = new Ball(canvas.width / 2, 200, 10, 'blue');
}

function animate() {
    requestAnimationFrame(animate)
    // c.clearRect(0, 0, canvas.width, canvas.height)
    ball.update()
}

init()
animate()