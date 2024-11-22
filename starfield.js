const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const stars = [];
const numStars = 200;
let excited = false;

function Star() {
  this.x = Math.random() * width;
  this.y = Math.random() * height;
  this.size = Math.random() * 2;
  this.baseSpeedX = Math.random() * 0.5 - 0.25;
  this.baseSpeedY = Math.random() * 0.5 - 0.25;
  this.speedX = this.baseSpeedX;
  this.speedY = this.baseSpeedY;
}

Star.prototype.update = function () {
  if (excited) {
    this.speedX = this.baseSpeedX * 3;
    this.speedY = this.baseSpeedY * 3;
  } else {
    this.speedX = this.baseSpeedX;
    this.speedY = this.baseSpeedY;
  }

  this.x += this.speedX;
  this.y += this.speedY;

  if (this.x < 0) this.x = width;
  if (this.x > width) this.x = 0;
  if (this.y < 0) this.y = height;
  if (this.y > height) this.y = 0;
};

Star.prototype.draw = function () {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
};

function createStars() {
  stars.length = 0;
  for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
  }
}

createStars();

function animate() {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  stars.forEach((star) => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  createStars();
});

function setStarExcitement(isExcited) {
  excited = isExcited;
}

animate();

export { setStarExcitement };
