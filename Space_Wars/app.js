//Create a class for ships
class Ship {
  constructor(name, hull, firepower, accuracy) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
  }
}
//Random stat generator for alien ships
function randomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomHull(min = 3, max = 6) {
  return randomNum(min, max);
}

function getRandomFirepower(min = 2, max = 4) {
  return randomNum(min, max);
}

function getRandomAccuracy(min = 6, max = 8) {
  return randomNum(min, max) / 10;
}

//Character creation
let playerShip = new Ship("Player", 20, 5, 0.7);
let alienSquad = [];
for (let i = 6; i >= 1; i--) {
  alienSquad.push(
    new Ship(
      `Alien Ship ${i}`,
      getRandomHull(),
      getRandomFirepower(),
      getRandomAccuracy()
    )
  );
}

let totalDestroyedNum = 0;
let scrapsNum = 0;
let roundNum = 1;
let realBattle = false;
let playerHull = document.querySelector(".playerHull");
let playerAccuracy = document.querySelector(".playerAccuracy");
let playerFirepower = document.querySelector(".playerFirepower");
let alienHull = document.querySelector(".alienHull");
let gameLog = document.querySelector(".gameflow");
let roundStatus = document.querySelector(".shipsRemaining");
let round = document.querySelector(".round");
let scraps = document.querySelector(".scraps");
let totalDestroyed = document.querySelector(".totaldestroyed");

//Create attacks
function playerAttacks(targetShip) {
  if (Math.random() < playerShip["accuracy"]) {
    targetShip["hull"] -= 5;
    let p = document.createElement("p");
    p.textContent = "You have damaged the enemy ship by 5 hull.";
    gameLog.append(p);
  } else {
    let p = document.createElement("p");
    p.textContent = "You missed!";
    gameLog.append(p);
  }
}

function enemyAttacks(targetShip) {
  if (Math.random() < targetShip["accuracy"]) {
    playerShip["hull"] -= targetShip["firepower"];
    if (playerShip["hull"] < 0) {
      playerShip["hull"] = 0;
    } else {
      let p = document.createElement("p");
      p.textContent = `You have been damaged by the enemy ship by ${targetShip["firepower"]} hull.`;
      gameLog.append(p);
    }
  } else {
    let p = document.createElement("p");
    p.textContent = "The enemy missed!";
    gameLog.append(p);
  }
}

//Core flow of game
function nextRound() {
  let retreat = document.querySelector(".retreat");
  retreat.style.display = "flex";
  let targetShip = alienSquad[alienSquad.length - 1];
  if (roundNum === 2) {
    console.log("it works");
    let endGame = document.querySelector(".endGame");
    endGame.style.display = "flex";
    let battle = document.querySelector(".battle");
    battle.style.display = "none";
    let retreat = document.querySelector(".retreat");
    return (retreat.style.display = "none");
  }

  if (playerShip["hull"] > 0 && alienSquad.length !== 0) {
    let alienShip = document.querySelector(".alienShip");
    alienShip.textContent = `${targetShip["name"]}`;
    let alienHull = document.querySelector(".alienHull");
    alienHull.textContent = `Hull: ${targetShip["hull"]}`;
    let alienFirepower = document.querySelector(".alienFirepower");
    alienFirepower.textContent = `Firepower: ${targetShip["firepower"]}`;
    let alienAccuracy = document.querySelector(".alienAccuracy");
    alienAccuracy.textContent = `Accuracy: ${targetShip["accuracy"]}`;
    roundStatus.textContent = `Ships Remaining: ${alienSquad.length}`;

    while (targetShip["hull"] > 0 && playerShip["hull"] > 0) {
      playerAttacks(targetShip);
      alienHull.textContent = `Hull: ${targetShip["hull"]}`;
      if (targetShip["hull"] <= 0) {
        scrapsNum++;
        totalDestroyedNum++;
        scraps.textContent = `Scraps: ${scrapsNum}`;
        totalDestroyed.textContent = `Total Ships Destroyed: ${totalDestroyedNum}`;
        alienSquad.pop();
        if (alienSquad.length === 0) {
          let p = document.createElement("p");
          p.textContent = `You have defeated the last ship of this fleet!`;
          gameLog.append(p);
          if (roundNum === 2) {
            //Double check, may not need this code
            console.log("it works");
            let endGame = document.querySelector(".endGame");
            endGame.style.display = "flex";
            let battle = document.querySelector(".battle");
            battle.style.display = "none";
            let retreat = document.querySelector(".retreat");
            return (retreat.style.display = "none");
          } else if (realBattle === true) {
            //Can be moved
            roundNum++;
            round.textContent = `Round: ${roundNum}`;
            let shop = document.querySelector(".shop");
            shop.style.display = "flex";
            let battle = document.querySelector(".battle");
            battle.style.display = "none";
            let retreat = document.querySelector(".retreat");
            return (retreat.style.display = "none");
          } else {
            let playAgain = document.querySelector(".playagain");
            playAgain.style.display = "flex";
            let battle = document.querySelector(".battle");
            battle.style.display = "none";
            let retreat = document.querySelector(".retreat");
            return (retreat.style.display = "none");
          }
        } else {
          let p = document.createElement("p");
          p.textContent = `You have defeated ${targetShip["name"]}, would you like to continue or retreat?`;
          return gameLog.append(p);
        }
      } else {
        enemyAttacks(targetShip);
        playerHull.textContent = `Hull: ${playerShip["hull"]}`;
      }
    }
  } else {
    if (playerShip["hull"] === 0) {
      let p = document.createElement("p");
      p.textContent = "You have been defeated...";
      gameLog.append(p);
      let retreat = document.querySelector(".retreat");
      retreat.style.display = "none";
      let battle = document.querySelector(".battle");
      battle.style.display = "none";
    }
  }
}
//On Retreat
function endGame() {
  let p = document.createElement("p");
  p.textContent = "You have abandoned mankind...there is no place to run";
  gameLog.append(p);
  let retreat = document.querySelector(".retreat");
  retreat.style.display = "none";
  let battle = document.querySelector(".battle");
  battle.style.display = "none";
}

let instructions = document.querySelector(".instructions");
instructions.addEventListener("mouseover", () => {
  let gameplay = document.querySelector(".gameplay");
  gameplay.style.display = "block";
});

instructions.addEventListener(
  "mouseout",
  () => {
    let gameplay = document.querySelector(".gameplay");
    gameplay.style.display = "none";
  },
  { capture: true }
);

let battle = document.querySelector(".battle");
battle.addEventListener("click", nextRound);

let retreat = document.querySelector(".retreat");
retreat.addEventListener("click", endGame);

let nextbattle = document.querySelector(".nextbattle");
nextbattle.addEventListener("mouseover", () => {
  let explanation = document.querySelector(".explanation");
  let p = document.createElement("p");
  p.textContent = "This will restart the game with additional features";
  explanation.append(p);
});

nextbattle.addEventListener("mouseout", () => {
  let explanation = document.querySelector(".explanation");
  explanation.removeChild(explanation.lastChild);
});

//Restarting game with features
nextbattle.addEventListener("click", () => {
  let playAgain = document.querySelector(".playagain");
  playAgain.style.display = "none";
  let newGamePlay = document.querySelector(".newgameplay");
  newGamePlay.style.display = "flex";
  let battle = document.querySelector(".battle");
  battle.style.display = "flex";
  round.textContent = `Round: ${roundNum}`;
  scraps.textContent = `Scraps: ${scrapsNum}`;
  totalDestroyed.textContent = `Total Ships Destroyed: ${totalDestroyedNum}`;
  round.style.display = "inline";
  scraps.style.display = "inline";
  totalDestroyed.style.display = "inline";
  let bomb = document.querySelector("#theBomb");
  bomb.style.display = "flex";

  realBattle = true;
  let addShips = randomNum(3, 5);
  for (let i = 6 + addShips; i >= 1; i--) {
    alienSquad.push(
      new Ship(
        `Alien Ship ${i}`,
        getRandomHull(5, 11),
        getRandomFirepower(),
        getRandomAccuracy()
      )
    );
  }

  playerShip["hull"] = 20 + randomNum(5, 10);
  playerHull.textContent = `Hull: ${playerShip["hull"]}`;
});

let simulator = document.querySelector(".simulator");
simulator.addEventListener("mouseover", () => {
  let explanation = document.querySelector(".explanation");
  let p = document.createElement("p");
  p.textContent = "This will restart the game";
  explanation.append(p);
});

simulator.addEventListener("mouseout", () => {
  let explanation = document.querySelector(".explanation");
  explanation.removeChild(explanation.lastChild);
});

//Restarts Game Completely
simulator.addEventListener("click", () => {
  let playAgain = document.querySelector(".playagain");
  playAgain.style.display = "none";
  let battle = document.querySelector(".battle");
  battle.style.display = "flex";
  let retreat = document.querySelector(".retreat");
  retreat.style.display = "flex";
  for (let i = 6; i >= 1; i--) {
    alienSquad.push(
      new Ship(
        `Alien Ship ${i}`,
        getRandomHull(),
        getRandomFirepower(),
        getRandomAccuracy()
      )
    );
  }
  playerShip["hull"] = 20;
  playerHull.textContent = `${playerShip["hull"]}`;
  let alienShip = document.querySelector(".alienShip");
  alienShip.textContent = `${alienSquad[5]["name"]}`;
  let alienHull = document.querySelector(".alienHull");
  alienHull.textContent = `Hull: ${alienSquad[5]["hull"]}`;
  let alienFirepower = document.querySelector(".alienFirepower");
  alienFirepower.textContent = `Firepower: ${alienSquad[5]["firepower"]}`;
  let alienAccuracy = document.querySelector(".alienAccuracy");
  alienAccuracy.textContent = `Accuracy: ${alienSquad[5]["accuracy"]}`;
});

let quit = document.querySelector(".abort");
quit.addEventListener("click", () => {
  let explanation = document.querySelector(".explanation");
  explanation.textContent = "Thank you for your service Captain!";
});

let exitScreen1 = document.querySelector(".close");
exitScreen1.addEventListener("click", () => {
  let newGamePlay = document.querySelector(".newgameplay");
  newGamePlay.style.display = "none";
  let shop = document.querySelector(".shop");
  shop.style.display = "flex";
  let battle = document.querySelector(".battle");
  battle.style.display = "none";
  let retreat = document.querySelector(".retreat");
  retreat.style.display = "none";
});

let bomb = document.querySelector("#theBomb");
let bombCounter = 0;
bomb.addEventListener("click", () => {
  if (bombCounter === 0) {
    bombCounter++;
    let targetShip = alienSquad[alienSquad.length - 1];
    targetShip["hull"] -= 10;
    alienHull.textContent = `Hull: ${targetShip["hull"]}`;
    let p = document.createElement("p");
    p.textContent = `You have damaged the alien ship by 10 hull`;
    gameLog.append(p);
    bomb.style.transitionDuration = "1s";
    bomb.style.backgroundColor = "gray";
    if (targetShip["hull"] <= 0) {
      let p = document.createElement("p");
      p.textContent = `You have defeated ${targetShip["name"]}, would you like to continue or retreat?`;
      gameLog.append(p);
      alienSquad.pop();
      roundStatus.textContent = `Ships Remaining: ${alienSquad.length}`;
    }
  } else {
    return;
  }
});

let repair = document.querySelector(".repair");
repair.addEventListener("mouseover", () => {
  let explanation = document.querySelector(".explanation2");
  let p = document.createElement("p");
  p.textContent = "Repairs your ship by 5 hull";
  explanation.append(p);
});

repair.addEventListener("mouseout", () => {
  let explanation = document.querySelector(".explanation2");
  explanation.removeChild(explanation.lastChild);
});

repair.addEventListener("click", () => {
  if (scrapsNum >= 3) {
    playerShip["hull"] += 5;
    scrapsNum -= 3;
    playerHull.textContent = `Hull: ${playerShip["hull"]}`;
    scraps.textContent = `Scraps: ${scrapsNum}`;
  } else {
    let p = document.createElement("p");
    p.textContent = "You don't have enough resources";
    gameLog.append(p);
  }
});

let tungMissles = document.querySelector(".tungstenMissles");
tungMissles.addEventListener("mouseover", () => {
  let explanation = document.querySelector(".explanation2");
  let p = document.createElement("p");
  p.textContent = "Increases your firepower by 2";
  explanation.append(p);
});

tungMissles.addEventListener("mouseout", () => {
  let explanation = document.querySelector(".explanation2");
  explanation.removeChild(explanation.lastChild);
});

tungMissles.addEventListener("click", () => {
  if (scrapsNum >= 10) {
    playerShip["firepower"] += 2;
    scrapsNum -= 10;
    playerFirepower.textContent = `Firepower: ${playerShip["firepower"]}`;
    scraps.textContent = `Scraps: ${scrapsNum}`;
    tungMissles.style.display = "none";
  } else {
    let p = document.createElement("p");
    p.textContent = "You don't have enough resources";
    gameLog.append(p);
  }
});

let sniperLens = document.querySelector(".sniperLens");
sniperLens.addEventListener("mouseover", () => {
  let explanation = document.querySelector(".explanation2");
  let p = document.createElement("p");
  p.textContent = "Increases your accuracy by 0.2";
  explanation.append(p);
});

sniperLens.addEventListener("mouseout", () => {
  let explanation = document.querySelector(".explanation2");
  explanation.removeChild(explanation.lastChild);
});

sniperLens.addEventListener("click", () => {
  if (scrapsNum >= 5) {
    playerShip["accuracy"] = (playerShip["accuracy"] * 10 + 2) / 10;
    scrapsNum -= 5;
    playerAccuracy.textContent = `Accuracy: ${playerShip["accuracy"]}`;
    scraps.textContent = `Scraps: ${scrapsNum}`;
    sniperLens.style.display = "none";
  } else {
    let p = document.createElement("p");
    p.textContent = "You don't have enough resources";
    gameLog.append(p);
  }
});

let exitScreen2 = document.querySelector(".close2");
exitScreen2.addEventListener("click", () => {
  let shop = document.querySelector(".shop");
  shop.style.display = "none";
  let battle = document.querySelector(".battle");
  battle.style.display = "flex";
  let retreat = document.querySelector(".retreat");
  retreat.style.display = "flex";
});
