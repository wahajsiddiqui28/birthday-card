// helper functions
const PI2 = Math.PI * 2
const random = (min, max) => Math.random() * (max - min + 1) + min | 0
const timestamp = _ => new Date().getTime()
// container
class Birthday {
  constructor() {
    this.resize()
    // create a lovely place to store the firework
    this.fireworks = []
    this.counter = 0
  }
  resize() {
    this.width = canvas.width = window.innerWidth
    let center = this.width / 2 | 0
    this.spawnA = center - center / 4 | 0
    this.spawnB = center + center / 4 | 0
    this.height = canvas.height = window.innerHeight
    this.spawnC = this.height * .1
    this.spawnD = this.height * .5
  }
  onClick(evt) {
    let x = evt.clientX || evt.touches && evt.touches[0].pageX
    let y = evt.clientY || evt.touches && evt.touches[0].pageY
    let count = random(3, 5)
    for (let i = 0; i < count; i++) this.fireworks.push(new Firework(
      random(this.spawnA, this.spawnB),
      this.height,
      x,
      y,
      random(0, 260),
      random(30, 110)))
    this.counter = -1
  }
  update(delta) {
    ctx.globalCompositeOperation = 'hard-light'
    ctx.fillStyle = `rgba(20,20,20,${7 * delta})`
    ctx.fillRect(0, 0, this.width, this.height)
    ctx.globalCompositeOperation = 'lighter'
    for (let firework of this.fireworks) firework.update(delta)
    // if enough time passed... create new new firework
    this.counter += delta * 3 // each second
    if (this.counter >= 1) {
      this.fireworks.push(new Firework(
        random(this.spawnA, this.spawnB),
        this.height,
        random(0, this.width),
        random(this.spawnC, this.spawnD),
        random(0, 360),
        random(30, 110)))
      this.counter = 0
    }
    // remove the dead fireworks
    if (this.fireworks.length > 1000) this.fireworks = this.fireworks.filter(firework => !firework.dead)
  }
}
class Firework {
  constructor(x, y, targetX, targetY, shade, offsprings) {
    this.dead = false
    this.offsprings = offsprings
    this.x = x
    this.y = y
    this.targetX = targetX
    this.targetY = targetY
    this.shade = shade
    this.history = []
  }
  update(delta) {
    if (this.dead) return
    let xDiff = this.targetX - this.x
    let yDiff = this.targetY - this.y
    if (Math.abs(xDiff) > 3 || Math.abs(yDiff) > 3) { // is still moving
      this.x += xDiff * 2 * delta
      this.y += yDiff * 2 * delta
      this.history.push({
        x: this.x,
        y: this.y
      })
      if (this.history.length > 20) this.history.shift()
    } else {
      if (this.offsprings && !this.madeChilds) {
        let babies = this.offsprings / 2
        for (let i = 0; i < babies; i++) {
          let targetX = this.x + this.offsprings * Math.cos(PI2 * i / babies) | 0
          let targetY = this.y + this.offsprings * Math.sin(PI2 * i / babies) | 0
          birthday.fireworks.push(new Firework(this.x, this.y, targetX, targetY, this.shade, 0))
        }
      }
      this.madeChilds = true
      this.history.shift()
    }
    if (this.history.length === 0) this.dead = true
    else if (this.offsprings) {
      for (let i = 0; this.history.length > i; i++) {
        let point = this.history[i]
        ctx.beginPath()
        ctx.fillStyle = 'hsl(' + this.shade + ',100%,' + i + '%)'
        ctx.arc(point.x, point.y, 1, 0, PI2, false)
        ctx.fill()
      }
    } else {
      ctx.beginPath()
      ctx.fillStyle = 'hsl(' + this.shade + ',100%,50%)'
      ctx.arc(this.x, this.y, 1, 0, PI2, false)
      ctx.fill()
    }
  }
}
let canvas = document.getElementById('birthday')
let ctx = canvas.getContext('2d')
let then = timestamp()
let birthday = new Birthday
window.onresize = () => birthday.resize()
document.onclick = evt => birthday.onClick(evt)
document.ontouchstart = evt => birthday.onClick(evt);
(function loop() {
  requestAnimationFrame(loop)
  let now = timestamp()
  let delta = now - then
  then = now
  birthday.update(delta / 1000)
})()
// ==================Ballon===========
var c = document.getElementById("c");
var ctx2 = c.getContext("2d");
var bc = document.createElement("canvas");
var bCtx = bc.getContext("2d");
var cw = c.width = bc.width = window.innerWidth,
  cx = cw / 2;
var ch = c.height = bc.height = window.innerHeight + 100,
  cy = ch;
var frames = 0;
var requestId = null;
var rad = (Math.PI / 180);
var kappa = 0.5522847498;
var x, y;
bCtx.strokeStyle = "#abcdef";
bCtx.lineWidth = 1;
var balloons = [];
function Balloon() {
  this.r = randomIntFromInterval(20, 70);
  this.R = 1.4 * this.r;
  this.x = randomIntFromInterval(this.r, cw - this.r);
  this.y = ch + 2 * this.r;
  this.a = this.r * 4.5;
  this.pm = Math.random() < 0.5 ? -1 : 1;
  this.speed = randomIntFromInterval(1.5, 4);
  this.k = this.speed / 5;
  this.hue = this.pm > 0 ? "210" : "10";
}
function Draw() {
  updateBallons(bCtx);
  ctx.clearRect(0, 0, cw, ch);
  var img = bc;
  ctx.drawImage(img, 0, 0);
  requestId = window.requestAnimationFrame(Draw);
}
//requestId = window.requestAnimationFrame(Draw);
function Init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }
  cw = c.width = bc.width = window.innerWidth, cx = cw / 2;
  ch = c.height = bc.height = window.innerHeight + 100, cy = ch;
  bCtx.strokeStyle = "#abcdef";
  bCtx.lineWidth = 1;
  Draw();
}
setTimeout(function () {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);
function updateBallons(ctx) {
  frames += 1;
  if (frames % 37 == 0 && balloons.length < 37) {
    var balloon = new Balloon();
    balloons.push(balloon);
  }
  ctx.clearRect(0, 0, cw, ch);
  for (var i = 0; i < balloons.length; i++) {
    var b = balloons[i];
    if (b.y > -b.a) {
      b.y -= b.speed
    } else {
      b.y = parseInt(ch + b.r + b.R);
    }
    var p = thread(b, ctx);
    b.cx = p.x;
    b.cy = p.y - b.R;
    ctx.fillStyle = Grd(p.x, p.y, b.r, b.hue)
    drawBalloon(b, ctx);
  }
}
function drawBalloon(b, ctx) {
  var or = b.r * kappa; // offset
  var p1 = {
    x: b.cx - b.r,
    y: b.cy
  }
  var pc11 = {
    x: p1.x,
    y: p1.y + or
  }
  var pc12 = {
    x: p1.x,
    y: p1.y - or
  }
  var p2 = {
    x: b.cx,
    y: b.cy - b.r
  }
  var pc21 = {
    x: b.cx - or,
    y: p2.y
  }
  var pc22 = {
    x: b.cx + or,
    y: p2.y
  }
  var p3 = {
    x: b.cx + b.r,
    y: b.cy
  }
  var pc31 = {
    x: p3.x,
    y: p3.y - or
  }
  var pc32 = {
    x: p3.x,
    y: p3.y + or
  }
  var p4 = {
    x: b.cx,
    y: b.cy + b.R
  };
  var pc41 = {
    x: p4.x + or,
    y: p4.y
  }
  var pc42 = {
    x: p4.x - or,
    y: p4.y
  }
  var t1 = {
    x: p4.x + .2 * b.r * Math.cos(70 * rad),
    y: p4.y + .2 * b.r * Math.sin(70 * rad)
  }
  var t2 = {
    x: p4.x + .2 * b.r * Math.cos(110 * rad),
    y: p4.y + .2 * b.r * Math.sin(110 * rad)
  }
  //balloon
  ctx.beginPath();
  ctx.moveTo(p4.x, p4.y);
  ctx.bezierCurveTo(pc42.x, pc42.y, pc11.x, pc11.y, p1.x, p1.y);
  ctx.bezierCurveTo(pc12.x, pc12.y, pc21.x, pc21.y, p2.x, p2.y);
  ctx.bezierCurveTo(pc22.x, pc22.y, pc31.x, pc31.y, p3.x, p3.y);
  ctx.bezierCurveTo(pc32.x, pc32.y, pc41.x, pc41.y, p4.x, p4.y);
  //knot
  ctx.lineTo(t1.x, t1.y);
  ctx.lineTo(t2.x, t2.y);
  ctx.closePath();
  ctx.fill();
}
function thread(b, ctx) {
  ctx.beginPath();
  for (var i = b.a; i > 0; i -= 1) {
    var t = i * rad;
    x = b.x + b.pm * 50 * Math.cos(b.k * t - frames * rad)
    y = b.y + b.pm * 25 * Math.sin(b.k * t - frames * rad) + 50 * t
    ctx.lineTo(x, y)
  }
  ctx.stroke();
  return p = {
    x: x,
    y: y
  }
}
function Grd(x, y, r, hue) {
  grd = ctx.createRadialGradient(x - .5 * r, y - 1.7 * r, 0, x - .5 * r, y - 1.7 * r, r);
  grd.addColorStop(0, 'hsla(' + hue + ',100%,65%,.95)');
  grd.addColorStop(0.4, 'hsla(' + hue + ',100%,45%,.85)');
  grd.addColorStop(1, 'hsla(' + hue + ',100%,25%,.80)');
  return grd;
}
function randomIntFromInterval(mn, mx) {
  return ~~(Math.random() * (mx - mn + 1) + mn);
}
// Define the custom element "top-canvas" as a "canvas" element
class TopCanvas extends HTMLElement {
  constructor() {
    super();
    const canvasElement = document.createElement("canvas");
    this.appendChild(canvasElement);
    canvasElement.setAttribute("id", this.id); // Copy the ID to the actual canvas element
    canvasElement.classList.add(...this.classList); // Copy classes to the canvas element
  }
}
// Register the custom element
customElements.define("top-canvas", TopCanvas);
//-----------Var Inits--------------
const customElement = document.getElementById("topcanvasmme");
const confettiCanvas = customElement.querySelector("canvas"); // Use confettiCanvas instead of canvas
const confettiCtx = confettiCanvas.getContext("2d"); // Use confettiCtx instead of ctx
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
let canvasCenterX = confettiCanvas.width / 2;
let canvasCentery = confettiCanvas.height / 2;
let confetti = [];
const confettiCount = 200;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
  { front: 'red', back: 'darkred' },
  { front: 'green', back: 'darkgreen' },
  { front: 'blue', back: 'darkblue' },
  { front: 'yellow', back: 'darkyellow' },
  { front: 'orange', back: 'darkorange' },
  { front: 'pink', back: 'darkpink' },
  { front: 'purple', back: 'darkpurple' },
  { front: 'turquoise', back: 'darkturquoise' },
];
//-----------Functions--------------
const resizeCanvas = () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  canvasCenterX = confettiCanvas.width / 2;
  canvasCentery = confettiCanvas.height / 2;
};
const randomRange = (min, max) => Math.random() * (max - min) + min;
const initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30),
      },
      position: {
        x: randomRange(0, confettiCanvas.width),
        y: confettiCanvas.height - 1,
      },
      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },
      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50),
      },
    });
  }
};
//---------Render-----------
const render = () => {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;
    // Move canvas to position and rotate
    confettiCtx.translate(confetto.position.x, confetto.position.y);
    confettiCtx.rotate(confetto.rotation);
    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(confetto.velocity.y + gravity, terminalVelocity);
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;
    // Delete confetti when out of frame
    if (confetto.position.y >= confettiCanvas.height) confetti.splice(index, 1);
    // Loop confetto x position
    if (confetto.position.x > confettiCanvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = confettiCanvas.width;
    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    confettiCtx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
    // Draw confetti
    confettiCtx.fillRect(-width / 2, -height / 2, width, height);
    // Reset transform matrix
    confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
  });
  // Fire off another round of confetti
  if (confetti.length <= 10) initConfetti();
  window.requestAnimationFrame(render);
};
//---------Execution--------
initConfetti();
render();
//----------Resize----------
window.addEventListener('resize', resizeCanvas);
//------------Click------------
window.addEventListener('click', initConfetti);
// modal js start 
function openModal() {
  var modal = document.getElementById("birthdayModal");
  modal.classList.add("show"); // Add class for animation
  var audio = document.getElementById("birthdaySound");
  audio.play(); // Play the sound
}
function closeModal() {
  var modal = document.getElementById("birthdayModal");
  modal.classList.remove("show"); // Remove class for animation
}
// modal js end
