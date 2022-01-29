const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
let blockSize = 150;
canvas.width = innerWidth
canvas.height = innerHeight

const arcMap = {
    "C_UR": {
        direction: -1,
        start: 90,
        end: 0,
        operator: ">"
    },
    "C_UL": {
        direction: 1,
        start: 90,
        end: 180,
        operator: "<"
    },
    "C_BL": {
        direction: -1,
        start: 270,
        end: 180,
        operator: ">"
    },
    "C_LB": {
        direction: 1,
        start: 0,
        end: 90,
        operator: "<"
    },
    "C_LU": {
        direction: -1,
        start: 0,
        end: -90,
        operator: ">"
    },
    "C_RB": {
        direction: -1,
        start: 180,
        end: 90,
        operator: ">"
    },
    "C_RU": {
        direction: 1,
        start: 180,
        end: 270,
        operator: "<"
    },
    "C_BR": {
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

const flow = [
    "C_LB",
    "C_LU",
    "C_BL",
    "C_RB",
    "C_RU",
    "C_UL",
    "C_RB",
    "C_RU",
    "C_BR",
    "C_LB",
    "C_BR",
    "C_LB",
    "L_LR",
    "L_UD",
    "L_RL",
    "L_DU"
];

// const randomNumber = () => {
//   return Math.floor(Math.random() * flow.length);
// }


let state = flow.shift();
// let state = flow[randomNumber()];

class Ball {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius;
        this.radians = Ball.D2R(arcMap[state].start);
        this.velocity = 0.07;
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
        // state = flow[randomNumber()];
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

      this[axis] = this[axis] + currentState.direction * this.velocity * 40;
      
      if (currentState["operator"] === ">") {
          if (this[axis] < currentState["end"]) {
              state = flow.shift();
          }
      } else {
          if (this[axis] > currentState["end"]) {
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
            this.radians = this.radians + direction * this.velocity;
            if (operator === ">") {
                if (this.radians < Ball.D2R(end)) {
                    this.updateStateAndRadians();
                }
            } else {
                if (this.radians > Ball.D2R(end)) {
                    this.updateStateAndRadians();
                }
            }
            this.x = this.x + Math.cos(this.radians) * 8;
            this.y = this.y + Math.sin(this.radians) * 8;
        } else if (montionType === "L") {
          this.updateLinearState(arcMap[state]);
        }

    }
}

let ball;

function init() {
    ball = new Ball(canvas.width / 2, canvas.height / 2, 5, 'blue');
}

function animate() {
    requestAnimationFrame(animate)
    // c.clearRect(0, 0, canvas.width, canvas.height)
    ball.update()
}

init()
animate()