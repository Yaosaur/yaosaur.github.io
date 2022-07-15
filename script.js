let startTime = undefined;

let canvas = document.querySelector("canvas");
canvas.width = innerWidth - 200;
canvas.height = innerHeight - 300;
let context = canvas.getContext("2d");
let body = document.querySelector("body");
let startBtn = document.querySelector(".startBtn");
let happy = document.querySelector(".happy");
let instructBtn = document.querySelector(".instructBtn");
let instruct = document.querySelector(".instruct");
let time = document.documentElement.querySelector(".time");
let gameOver = document.querySelector(".gameOver");
let restartBtn = document.querySelector(".restart");
let display = document.querySelector(".display");
let audio = document.querySelector("audio");

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
  "images/icecave/icicles/icy1.png",
  "images/icecave/icicles/icy2.png",
  "images/icecave/icicles/icy3.png",
  "images/icecave/icicles/icy4.png",
  "images/icecave/icicles/icy5.png",
  "images/icecave/icicles/icy6.png",
];
let forestSources = ["images/forest/butterflyswarm.png"];
let forestSourcesSqur = [
  "images/forest/sq1.png",
  "images/forest/sq2.png",
  "images/forest/sq3.png",
];
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
let imagesAni = [];
let timeoutIDs = [];

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
    imagesAni.push(image);
  }
}

function clearImages() {
  images = [];
  imagesSub = [];
  imagesAni = [];
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
    if (image.xCord + 100 > canvas.width || image.xCord < 0) {
      image.dx = -image.dx;
    } else if (image.yCord < 0 || image.yCord + 100 > canvas.height * 0.6) {
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
    context.drawImage(image, image.xCord, image.yCord, 125, 125);
  }
}

let xCordS = 0;
let yCordS = canvas.height - 100;
let dy = randomNum(-1, -2);
let lastTimeS = 0;
let framesStopped = 0;
function moveSqur() {
  let image = undefined;
  if (yCordS < canvas.height - 150) {
    dy = -dy;
  }
  if (dy > 0) {
    image = imagesAni[1];
  } else {
    image = imagesAni[0];
  }
  if (yCordS > canvas.height - 100) {
    if (framesStopped < 60) {
      image = imagesAni[2];
      yCordS = yCordS;
      xCordS = xCordS;
      framesStopped++;
    } else {
      image = imagesAni[1];
      dy = -dy;
      yCordS += dy;
      xCordS += image.dx;
    }
  } else {
    yCordS += dy;
    xCordS += image.dx;
  }
  if (xCordS > canvas.width) {
    xCordS = randomNum(-200, -100);
  }
  if (image === imagesAni[2]) {
    context.drawImage(image, xCordS + 20, yCordS, 75, 100);
  } else {
    context.drawImage(image, xCordS, yCordS, 150, 100);
  }

  if (
    player.x + player.radius > xCordS &&
    player.x - player.radius < xCordS + 100 &&
    player.y + player.radius > yCordS &&
    player.y - player.radius < yCordS + 100
  ) {
    endGame();
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

let aniFrameP = 0;
let xCordP = canvas.width - 150;
let yCordP = canvas.height * 0.7;
let lastTimeP = 0;
function movePeople() {
  let timeDif = new Date() - startTime;
  let image = imagesAni[aniFrameP];
  if (
    player.x + player.radius > xCordP &&
    player.x - player.radius < xCordP + 100 &&
    player.y + player.radius > yCordP &&
    player.y - player.radius < yCordP + 100
  ) {
    endGame();
  }
  if (yCordP < canvas.height * 0.65 || yCordP > canvas.height - 125) {
    image.dy = -image.dy;
  }
  if (xCordP < randomNum(-500, -1500)) {
    xCordP = canvas.width - 150;
  }
  if (timeDif - lastTimeP > 700) {
    aniFrameP++;
    lastTimeP = timeDif;
  }

  if (aniFrameP < imagesAni.length) {
    yCordP += image.dy;
    xCordP += image.dx;
    context.drawImage(image, xCordP, yCordP, 60, 100);
  } else if (aniFrameP >= imagesAni.length) {
    aniFrameP = 0;
    image = imagesAni[aniFrameP];
    yCordP += image.dy;
    xCordP += image.dx;
    context.drawImage(image, xCordP, yCordP, 60, 100);
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
  moveSqur();
}

function animateCity() {
  animationID = requestAnimationFrame(animateCity);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveCars();
  moveBirds();
  movePeople();
}

let round2 = function () {
  return setTimeout(function () {
    cancelAnimationFrame(animationID);
    context.clearRect(0, 0, canvas.width, canvas.height);
    body.style.backgroundImage = "url('images/forest/forest.jpg')";
    clearImages();
    if (imagesAni)
      init(
        forestSources,
        10,
        0,
        canvas.width - 100,
        canvas.height * 0.15,
        canvas.height * 0.3,
        3,
        5,
        3,
        5
      );
    initAnimate(forestSourcesSqur, 25, canvas.height - 100, 2, 4, 0, 0);
    animateForest();
  }, randomNum(5000, 10000));
};

let round3 = function () {
  return setTimeout(function () {
    cancelAnimationFrame(animationID);
    context.clearRect(0, 0, canvas.width, canvas.height);
    body.style.backgroundImage = "url('images/city/streets.jpg')";
    clearImages();
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
};

addEventListener("keydown", (e) => {
  if (e.key === "z") {
    if (audio.paused) {
      audio.play();
    } else if (!audio.paused) {
      audio.pause();
    }
  }
});

instructBtn.addEventListener("click", () => {
  instructBtn.style.transform = "scale(0)";
  startBtn.style.transform = "scale(0)";
  instruct.style.transform = "translate(-50%, -40%) scale(1)";
});

startBtn.addEventListener("click", () => {
  instructBtn.style.transform = "scale(0)";
  startBtn.style.transform = "scale(0)";
  startGame();
});

happy.addEventListener("click", () => {
  instruct.style.transform = "translate(-50%, -40%) scale(0)";
  startGame();
});

function startGame() {
  body.style.backgroundImage = "url('images/icecave/icecave.jpg')";
  canvas.classList.remove("inactive");
  display.classList.add("active");
  startTime = new Date();
  init(iceSources, 12, 0, canvas.width - 100, 0, 200, 0, 0, 3, 5);
  animateIce();
}

restartBtn.addEventListener("click", () => {
  restart();
});

function endGame() {
  cancelAnimationFrame(animationID);
  for (ID of timeoutIDs) {
    clearTimeout(ID);
  }
  timeoutIDs = [];
  gameOver.classList.add("active");
  canvas.classList.add("inactive");
  time.textContent = `Time: ${(new Date() - startTime) / 1000} seconds`;
}

function restart() {
  images = [];
  imagesSub = [];
  imagesAni = [];
  gameOver.classList.remove("active");
  canvas.classList.remove("inactive");
  time.textContent = `Time:`;
  startGame();
  timeoutIDs.push(round2());
  timeoutIDs.push(round3());
}

// startGame();
// timeoutIDs.push(round2());
// timeoutIDs.push(round3());
//Notes for self

// context.beginPath();
// context.moveTo(0, 0);
// context.lineTo(canvas.width - 150, canvas.height * 0.68);
// context.stroke();

//Modularize image generation
//Universalize code for popups
