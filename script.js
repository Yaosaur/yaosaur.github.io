let startTime = undefined;
document.addEventListener("DOMContentLoaded", function () {
  startTime = new Date();
});

let canvas = document.querySelector("canvas");
canvas.width = innerWidth - 200;
canvas.height = innerHeight - 300;
let context = canvas.getContext("2d");
let body = document.querySelector("body");
let time = document.documentElement.querySelector(".time");
let gameOver = document.querySelector(".gameOver");

function randomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Circle {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = "yellow";
    context.stroke();
    context.fillStyle = "yellow";
    context.fill();
  }
}

let player = new Circle(canvas.width / 2, canvas.height / 2, 25);
let iceSources = [
  "images/icecave/icicles/icy1.jpg",
  "images/icecave/icicles/icy2.jpg",
  "images/icecave/icicles/icy3.jpg",
  "images/icecave/icicles/icy4.jpg",
  "images/icecave/icicles/icy5.jpg",
  "images/icecave/icicles/icy6.jpg",
];
let forestSources = ["images/forest/butterflyswarm.png"];
let citySources = [
  "images/city/car1.png",
  "images/city/car2.png",
  "images/city/car3.png",
  "images/city/car3.png",
];
let citySourcesBirds = ["images/city/pigeon1.png"];
let citySourcesGirl = ["images/city/girl1.png", "images/city/girl2.png"];
let images = [];
let imagesSub = [];
let imagesSub2 = [];

canvas.addEventListener("mousemove", (event) => {
  player.x = event.offsetX;
  player.y = event.offsetY;
});

function init(
  sources,
  desiredParticles,
  spawnWidthMin,
  spawnWidthMax,
  spawnHeightMin,
  spawnHeightMax,
  dxMin,
  dxMax,
  dyMin,
  dyMax
) {
  while (images.length < desiredParticles) {
    for (let i = 0; i < desiredParticles; i++) {
      let ranArrayIndex = randomNum(0, sources.length - 1);
      let image = new Image();
      image.xCord = randomNum(spawnWidthMin, spawnWidthMax);
      image.yCord = randomNum(spawnHeightMin, spawnHeightMax);
      image.dx = randomNum(dxMin, dxMax);
      image.dy = randomNum(dyMin, dyMax);
      image.src = sources[ranArrayIndex];
      image.onload = () => {
        context.drawImage(image, image.xCord, image.yCord);
      };
      images.push(image);
    }
  }
}

function init2(
  sources,
  desiredParticles,
  spawnWidthMin,
  spawnWidthMax,
  spawnHeightMin,
  spawnHeightMax,
  dxMin,
  dxMax,
  dyMin,
  dyMax,
  imageWidth,
  imageHeight
) {
  while (imagesSub.length < desiredParticles) {
    for (let i = 0; i < desiredParticles; i++) {
      let ranArrayIndex = randomNum(0, sources.length - 1);
      let image = new Image();
      image.xCord = randomNum(spawnWidthMin, spawnWidthMax);
      image.yCord = randomNum(spawnHeightMin, spawnHeightMax);
      image.dx = randomNum(dxMin, dxMax);
      image.dy = randomNum(dyMin, dyMax);
      image.src = sources[ranArrayIndex];
      image.onload = () => {
        context.drawImage(
          image,
          image.xCord,
          image.yCord,
          imageWidth,
          imageHeight
        );
      };
      imagesSub.push(image);
    }
  }
}

function initAnimate(sources, xCord, yCord, dxMin, dxMax, dyMin, dyMax) {
  for (let i = 0; i < sources.length; i++) {
    let image = new Image();
    image.xCord = xCord;
    image.yCord = yCord;
    image.dx = randomNum(dxMin, dxMax);
    image.dy = randomNum(dyMin, dyMax);
    image.src = sources[i];
    image.onload = () => {
      context.drawImage(image, image.xCord, image.yCord);
    };
    imagesSub2.push(image);
  }
}

function endGame() {
  cancelAnimationFrame(animationID);
  gameOver.style.display = "flex";
  time.textContent = `Time: ${(new Date() - startTime) / 1000} seconds`;
}

function moveIcicles() {
  for (image of images) {
    image.xCord += image.dx;
    image.yCord += image.dy;
    if (image.yCord + 100 > canvas.height + randomNum(200, 500)) {
      image.xCord = randomNum(0, canvas.width - 100);
      image.yCord = randomNum(-100, 0);
    }
    context.drawImage(image, image.xCord, image.yCord, 50, 125);
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + 100 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + 100
    ) {
      endGame();
    }
  }
}

function moveButterflies() {
  for (image of images) {
    image.xCord += image.dx;
    image.yCord += image.dy;
    if (
      image.xCord + 100 > canvas.width ||
      image.yCord + 100 > canvas.height ||
      image.xCord < 0 ||
      image.yCord < 0
    ) {
      image.dx = -image.dx;
      image.dy = -image.dy;
    }
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + 100 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + 100
    ) {
      endGame();
    }
    context.drawImage(image, image.xCord, image.yCord, 100, 100);
  }
}

function moveCars() {
  for (image of images) {
    image.xCord -= image.dx;
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + 100 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + 100
    ) {
      endGame();
    }
    if (image.xCord < 0) {
      image.dx = randomNum(3, 7);
      image.xCord = randomNum(canvas.width - 150, canvas.width - 200);
      let ranArrayIndex = randomNum(0, citySources.length - 1);
      image.src = citySources[ranArrayIndex];
    } else {
      context.drawImage(image, image.xCord, image.yCord, 125, 70);
    }
  }
}

function moveBirds() {
  for (image of imagesSub) {
    let ranTop = randomNum(10, 30);
    let ranBottom = randomNum(175, 200);
    image.xCord += image.dx;
    image.yCord += image.dy;
    if (image.yCord < ranTop || image.yCord > ranBottom) {
      image.dy = -image.dy;
    }
    if (image.xCord < 0) {
      image.dx = randomNum(-3, -10);
      image.xCord = randomNum(canvas.width - 150, canvas.width - 200);
      image.yCord = randomNum(50, 150);
    }
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + 100 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + 100
    ) {
      endGame();
    }
    context.drawImage(image, image.xCord, image.yCord, 50, 50);
  }
}

let aniFrame = 0;
let xCord = canvas.width - 150;
let yCord = canvas.height * 0.7;
let lastTime = 0;
function movePeople() {
  let timeDif = new Date() - startTime;
  let image = imagesSub2[aniFrame];
  if (
    player.x + player.radius > xCord &&
    player.x - player.radius < xCord + 100 &&
    player.y + player.radius > yCord &&
    player.y - player.radius < yCord + 100
  ) {
    endGame();
  }
  if (yCord < canvas.height * 0.65 || yCord > canvas.height - 125) {
    image.dy = -image.dy;
  }
  console.log(xCord);
  if (xCord < randomNum(-500, -1500)) {
    xCord = canvas.width - 150;
  }
  if (timeDif - lastTime > 700) {
    aniFrame++;
    lastTime = timeDif;
  }

  if (aniFrame < imagesSub2.length) {
    yCord += image.dy;
    xCord += image.dx;
    context.drawImage(image, xCord, yCord, 60, 100);
  } else if (aniFrame >= imagesSub2.length) {
    aniFrame = 0;
    image = imagesSub2[aniFrame];
    yCord += image.dy;
    xCord += image.dx;
    context.drawImage(image, xCord, yCord, 60, 100);
  }
}

let animationID = undefined;
function animateIce() {
  animationID = requestAnimationFrame(animateIce);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveIcicles();
}

function animateForest() {
  animationID = requestAnimationFrame(animateForest);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveButterflies();
}

function animateCity() {
  animationID = requestAnimationFrame(animateCity);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveCars();
  moveBirds();
  movePeople();
}

init(iceSources, 12, 0, canvas.width - 100, 0, 200, 0, 0, 3, 5);
animateIce();

setTimeout(function () {
  cancelAnimationFrame(animationID);
  context.clearRect(0, 0, canvas.width, canvas.height);
  body.style.backgroundImage = "url('images/forest/forest.jpg')";
  if (images.length !== 0) {
    images = [];
  }
  init(forestSources, 10, 0, canvas.width - 100, 0, 200, 3, 5, 3, 5);
  animateForest();
}, randomNum(5000, 10000));

setTimeout(function () {
  cancelAnimationFrame(animationID);
  context.clearRect(0, 0, canvas.width, canvas.height);
  body.style.backgroundImage = "url('images/city/streets.jpg')";
  if (images.length !== 0) {
    images = [];
  }
  init(
    citySources,
    3,
    canvas.width - 150,
    canvas.width - 200,
    canvas.height * 0.6,
    canvas.height * 0.65,
    3,
    7,
    0,
    0
  );
  init2(citySourcesBirds, 4, 0, canvas.width - 100, 50, 150, -3, -10, 1, 1);
  initAnimate(
    citySourcesGirl,
    canvas.width - 150,
    canvas.height * 0.7,
    -2,
    -4,
    0.5,
    0.5
  );
  animateCity();
}, randomNum(15000, 20000));

//Notes for self

// context.beginPath();
// context.moveTo(0, 0);
// context.lineTo(canvas.width - 150, canvas.height * 0.68);
// context.stroke();

//Modularize image generation
