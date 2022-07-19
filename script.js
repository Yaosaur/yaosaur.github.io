let startTime = undefined;

let canvas = document.querySelector("canvas");
canvas.width = innerWidth - 200;
canvas.height = innerHeight - 300;
let context = canvas.getContext("2d");
let body = document.querySelector("body");
let shrinkIcon = document.querySelector(".shrinkIcon img");
let title = document.querySelector(".title");
let startBtn = document.querySelector(".startBtn");
let happy = document.querySelector(".happy");
let instructBtn = document.querySelector(".instructBtn");
let instruct = document.querySelector(".instruct");
let time = document.documentElement.querySelector(".time");
let gameOver = document.querySelector(".gameOver");
let restartBtn = document.querySelector(".restart");
let winGame = document.querySelector(".winGame");
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
    this.shrinkPow = 0;
  }

  draw() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = "yellow";
    context.stroke();
    context.fillStyle = "yellow";
    context.fill();
  }

  shrink(shrinkRadius) {
    this.radius = shrinkRadius;
    this.shrinkPow--;
    shrinkIcon.style.opacity = "0.5";
    setTimeout(() => {
      this.radius = canvas.width * 0.02;
    }, 1000);
  }
}

let player = new Circle(
  canvas.width / 2,
  canvas.height / 2,
  canvas.width * 0.02
);
let iceSources = [
  "images/icecave/icicles/icy1.png",
  "images/icecave/icicles/icy2.png",
  "images/icecave/icicles/icy3.png",
  "images/icecave/icicles/icy4.png",
  "images/icecave/icicles/icy5.png",
  "images/icecave/icicles/icy6.png",
];
let forestSourcesSwarm = ["images/forest/butterflyswarm.png"];
let forestSourcesSqur = [
  "images/forest/sq1.png",
  "images/forest/sq2.png",
  "images/forest/sq3.png",
];
let citySourcesCars = [
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
  array,
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
  while (array.length < desiredParticles) {
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
      array.push(image);
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
    if (
      image.yCord + canvas.height * 0.25 >
      randomNum(canvas.height * 1.1, canvas.height * 1.3)
    ) {
      image.xCord = randomNum(0, canvas.width * 0.95);
      image.yCord = randomNum(-canvas.height * 0.2, 0);
      image.dy = randomNum(canvas.height * 0.005, canvas.height * 0.015);
    }
    context.drawImage(
      image,
      image.xCord,
      image.yCord,
      canvas.width * 0.05,
      canvas.height * 0.25
    );
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + canvas.width * 0.05 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + canvas.height * 0.25
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
      image.xCord + canvas.width * 0.08 > canvas.width * 1.1 ||
      image.xCord < -canvas.width * 0.1
    ) {
      image.dx = -image.dx;
    }

    if (
      image.yCord < -canvas.height * 0.2 ||
      image.yCord + canvas.height * 0.24 > canvas.height * 0.75
    ) {
      image.dy = -image.dy;
    }

    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + canvas.width * 0.08 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + canvas.height * 0.24
    ) {
      endGame();
    }
    context.drawImage(
      image,
      image.xCord,
      image.yCord,
      canvas.width * 0.08,
      canvas.height * 0.24
    );
  }
}

let xCordS = 0;
let yCordS = canvas.height * 0.82;
let dy = randomNum(-canvas.height * 0.001, -canvas.height * 0.003);
let lastTimeS = 0;
let framesStopped = 0;
function moveSqur() {
  let image = undefined;
  if (yCordS < canvas.height * 0.7) {
    dy = -dy;
  }
  if (dy > 0) {
    image = imagesAni[1];
  } else {
    image = imagesAni[0];
  }
  if (yCordS > canvas.height * 0.82) {
    if (framesStopped < 60) {
      image = imagesAni[2];
      yCordS = yCordS;
      xCordS = xCordS;
      framesStopped++;
    } else {
      framesStopped = 0;
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
    xCordS = randomNum(-canvas.width * 0.2, -canvas.width * 0.1);
  }
  if (image === imagesAni[2]) {
    context.drawImage(
      image,
      xCordS + canvas.width * 0.01,
      yCordS,
      canvas.width * 0.06,
      canvas.height * 0.18
    );
  } else {
    context.drawImage(
      image,
      xCordS,
      yCordS,
      canvas.width * 0.12,
      canvas.height * 0.15
    );
  }
  if (image === imagesAni[0] || image === imagesAni[1]) {
    if (
      player.x + player.radius > xCordS &&
      player.x - player.radius < xCordS + canvas.width * 0.12 &&
      player.y + player.radius > yCordS &&
      player.y - player.radius < yCordS + canvas.height * 0.15
    ) {
      endGame();
    }
  } else if (image === imagesAni[2]) {
    if (
      player.x + player.radius > xCordS &&
      player.x - player.radius < xCordS + 20 + canvas.width * 0.06 &&
      player.y + player.radius > yCordS &&
      player.y - player.radius < yCordS + canvas.height * 0.18
    ) {
      endGame();
    }
  }
}

function moveCars() {
  for (image of images) {
    image.xCord -= image.dx;
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + canvas.width * 0.1 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + canvas.height * 0.1
    ) {
      endGame();
    }
    if (image.xCord < 0) {
      image.dx = randomNum(canvas.width * 0.005, canvas.width * 0.007);
      image.xCord = randomNum(canvas.width * 1.1, canvas.width * 1.2);
      let ranArrayIndex = randomNum(0, citySourcesCars.length - 1);
      image.src = citySourcesCars[ranArrayIndex];
    } else {
      context.drawImage(
        image,
        image.xCord,
        image.yCord,
        canvas.width * 0.1,
        canvas.height * 0.1
      );
    }
  }
}

function moveBirds() {
  for (image of imagesSub) {
    let ranTop = randomNum(canvas.height * 0.02, canvas.height * 0.07);
    let ranBottom = randomNum(canvas.height * 0.4, canvas.height * 0.45);
    image.xCord += image.dx;
    image.yCord += image.dy;
    if (image.yCord < ranTop || image.yCord > ranBottom) {
      image.dy = -image.dy;
    }
    if (image.xCord < 0) {
      image.dx = randomNum(-canvas.width * 0.004, -canvas.width * 0.008);
      image.xCord = randomNum(canvas.width * 1.1, canvas.width * 1.2);
      image.yCord = randomNum(canvas.height * 0.02, canvas.height * 0.45);
    }
    if (
      player.x + player.radius > image.xCord &&
      player.x - player.radius < image.xCord + canvas.width * 0.03 &&
      player.y + player.radius > image.yCord &&
      player.y - player.radius < image.yCord + canvas.height * 0.07
    ) {
      endGame();
    }
    context.drawImage(
      image,
      image.xCord,
      image.yCord,
      canvas.width * 0.03,
      canvas.height * 0.07
    );
  }
}

let aniFrameP = 0;
let xCordP = canvas.width * 0.9;
let yCordP = canvas.height * 0.7;
let lastTimeP = 0;
function movePeople() {
  let timeDif = new Date() - startTime;
  let image = imagesAni[aniFrameP];
  if (
    player.x + player.radius > xCordP &&
    player.x - player.radius < xCordP + canvas.width * 0.05 &&
    player.y + player.radius > yCordP &&
    player.y - player.radius < yCordP + canvas.height * 0.2
  ) {
    endGame();
  }
  if (yCordP < canvas.height * 0.65 || yCordP > canvas.height * 0.8) {
    image.dy = -image.dy;
  }
  if (xCordP < randomNum(-canvas.width * 0.5, -canvas.width * 1)) {
    xCordP = canvas.width * 0.9;
  }
  if (timeDif - lastTimeP > 700) {
    aniFrameP++;
    lastTimeP = timeDif;
  }

  if (aniFrameP < imagesAni.length) {
    yCordP += image.dy;
    xCordP += image.dx;
    context.drawImage(
      image,
      xCordP,
      yCordP,
      canvas.width * 0.05,
      canvas.height * 0.2
    );
  } else if (aniFrameP >= imagesAni.length) {
    aniFrameP = 0;
    image = imagesAni[aniFrameP];
    yCordP += image.dy;
    xCordP += image.dx;
    context.drawImage(
      image,
      xCordP,
      yCordP,
      canvas.width * 0.05,
      canvas.height * 0.2
    );
  }
}

let animationID = undefined;
function animateIce() {
  animationID = requestAnimationFrame(animateIce);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveIcicles();
}

function animateForest(speed) {
  animationID = requestAnimationFrame(animateForest);
  context.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  moveButterflies(speed);
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

function startGame() {
  body.style.backgroundImage = "url('images/forest/forest.jpg')";
  canvas.style.transform = "scale(1)";
  time.style.transform = "scale(1)";
  shrinkIcon.style.transform = "scale(1)";
  title.style.animation = "none";
  startTime = new Date();
  player.shrinkPow = 1;
  shrinkIcon.style.opacity = "1";
  init(
    images,
    forestSourcesSwarm,
    10,
    0,
    canvas.width * 0.9,
    canvas.height * 0,
    canvas.height * 0.1,
    canvas.width * 0.003,
    canvas.width * 0.006,
    canvas.height * 0.005,
    canvas.height * 0.008
  );
  initAnimate(
    forestSourcesSqur,
    canvas.width * 0.05,
    canvas.height * 0.8,
    canvas.width * 0.003,
    canvas.width * 0.006,
    0,
    0
  );
  animateForest();
  timeoutIDs.push(round2());
  timeoutIDs.push(round3());
  timeoutIDs.push(winGameTimeOut());
}

let round2 = function () {
  return setTimeout(function () {
    player.shrinkPow = 1;
    shrinkIcon.style.opacity = "1";
    cancelAnimationFrame(animationID);
    context.clearRect(0, 0, canvas.width, canvas.height);
    body.style.backgroundImage = "url('images/city/streets.jpg')";
    clearImages();
    init(
      images,
      citySourcesCars,
      3,
      canvas.width * 0.9,
      canvas.width,
      canvas.height * 0.6,
      canvas.height * 0.65,
      canvas.width * 0.005,
      canvas.width * 0.007,
      0,
      0
    );
    init(
      imagesSub,
      citySourcesBirds,
      4,
      canvas.width * 0.9,
      canvas.width,
      canvas.height * 0.1,
      canvas.height * 0.5,
      -canvas.width * 0.006,
      -canvas.width * 0.01,
      canvas.height * 0.001,
      canvas.height * 0.003
    );
    initAnimate(
      citySourcesGirl,
      canvas.width * 0.9,
      canvas.height * 0.7,
      -canvas.width * 0.002,
      -canvas.width * 0.004,
      canvas.height * 0.0005,
      canvas.height * 0.001
    );
    animateCity();
  }, 20000);
};

let round3 = function () {
  return setTimeout(function () {
    player.shrinkPow = 1;
    shrinkIcon.style.opacity = "1";
    cancelAnimationFrame(animationID);
    context.clearRect(0, 0, canvas.width, canvas.height);
    body.style.backgroundImage = "url('images/icecave/icecave.jpg')";
    clearImages();
    init(
      images,
      iceSources,
      10,
      0,
      canvas.width * 0.9,
      -canvas.height * 0.1,
      canvas.height * 0.1,
      0,
      0,
      canvas.height * 0.005,
      canvas.height * 0.015
    );
    animateIce();
  }, 40000);
};

let winGameTimeOut = function () {
  return setTimeout(function () {
    cancelAnimationFrame(animationID);
    body.style.backgroundImage = "url('images/stars-train.gif')";
    canvas.style.transform = "scale(0)";
    winGame.style.transform = "translate(-50%, -40%) scale(1)";
    title.style.animation = "wiggle 2s infinite linear alternate";
    time.textContent = `Time: ${(new Date() - startTime) / 1000} seconds`;
    shrinkIcon.style.transform = "scale(0)";
  }, 60000);
};

addEventListener("resize", () => {
  canvas.width = innerWidth - 200;
  canvas.height = innerHeight - 300;
  player.radius = canvas.width * 0.02;
  //reset moveSqur assets
  yCordS = canvas.height * 0.82;
  dy = randomNum(-canvas.height * 0.001, -canvas.height * 0.003);
  //reset movePeople assets
  xCordP = canvas.width * 0.9;
  yCordP = canvas.height * 0.7;
});

addEventListener("keydown", (e) => {
  if (e.key === "z") {
    if (audio.paused) {
      audio.play();
    } else if (!audio.paused) {
      audio.pause();
    }
  }
  if (e.key === "s" && player.shrinkPow > 0) {
    player.shrink(canvas.width * 0.005);
  }
});

instructBtn.addEventListener("click", () => {
  title.style.top = "5%";
  title.style.animation = "none";
  instructBtn.style.transform = "scale(0)";
  startBtn.style.transform = "scale(0)";
  instruct.style.transform = "translate(-50%, -40%) scale(1)";
});

startBtn.addEventListener("click", () => {
  title.style.top = "5%";
  instructBtn.style.transform = "scale(0)";
  startBtn.style.transform = "scale(0)";
  startGame();
});

happy.addEventListener("click", () => {
  instruct.style.transform = "translate(-50%, -40%) scale(0)";
  startGame();
});

restartBtn.addEventListener("click", () => {
  restart();
});

function endGame() {
  cancelAnimationFrame(animationID);
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (ID of timeoutIDs) {
    clearTimeout(ID);
  }
  timeoutIDs = [];
  gameOver.style.transform = "translate(-50%, -40%) scale(1)";
  canvas.style.transform = "scale(0)";
  time.textContent = `Time: ${(new Date() - startTime) / 1000} seconds`;
}

function restart() {
  images = [];
  imagesSub = [];
  imagesAni = [];
  gameOver.style.transform = "translate(-50%, -40%) scale(0)";
  canvas.style.transform = "scale(1)";
  player.x = canvas.width * 0.5;
  player.y = canvas.height * 0.65;
  time.textContent = `Time:`;
  //Have to reset location of animated items since their x and y are not auto reset with each restart
  xCordS = 0;
  yCordS = canvas.height * 0.82;
  xCordP = canvas.width * 0.9;
  yCordP = canvas.height * 0.7;
  startGame();
  timeoutIDs.push(round2());
  timeoutIDs.push(round3());
  timeoutIDs.push(winGameTimeOut());
}
