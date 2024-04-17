/********** This creates the play area and appends it to the main element on HTML This function
 also calls all other necessary functions to begin the game**********/
function startGame() {
    let button = document.getElementById("start-button");
    button.addEventListener("click", function(){
            console.log("You started the game!");
            
            if(!window.gameStarted) {
                window.gameStarted = true;
                myGameArea.start();
                myCharacter = new component (30, 30, "red", 470, 225);
                gameTimer();
                createCoins();
                renderScore();
                hideInfo();
                loadBackground();
                
                button.style.display = "none";
        }
    });
}

window.gameStarted = false;

let myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.id = "arena";
        this.canvas.width = 1000;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        let mainElement = document.getElementById("arena-container");
        mainElement.insertBefore(this.canvas, mainElement.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        // Load and store the background image
        this.background = new Image();
        this.background.src = "/assets/Game Background Image.png";
        this.background.onload = () => {
            this.context.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
        };

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = myGameArea.keys || {};
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};


/********** This creates the playable character and lays the foundation for movement **********/
let myCharacter;

function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function(){
        this.x += this.speedX;
        this.y += this.speedY;
    }
};

/********** This creates the coins which the player will collect **********/
function Coin(x, y, radius, imgSrc) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.img = new Image();
    this.img.src = imgSrc;
}

Coin.prototype.draw = function(ctx) {
    ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
};

/********** This creates random coords for coins **********/
let coins = [];
let numberOfCoinsToGenerate = 20;

function generateRandomPosition() {
    const maxX = myGameArea.canvas.width - 20;
    const maxY = myGameArea.canvas.height - 20;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    return { x: randomX, y: randomY };
};

function createCoins() {
    const canvas = document.getElementById("arena");
    const ctx = canvas.getContext("2d");
    const imgSources =["/assets/meats/meat1.png", "/assets/meats/meat2.png", "/assets/meats/meat3.png", "/assets/meats/meat4.png"]

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numberOfCoinsToGenerate; i++) {
        const randomPosition = generateRandomPosition(); 
        const imgSrc = imgSources[Math.floor(Math.random()* imgSources.length)];
        let coin = new Coin(randomPosition.x, randomPosition.y, 10, imgSrc);
        coins.push(coin);
    }
    
    coins.forEach(function(coin){
        coin.draw(ctx);
    });
};

/********** This function generates new waves of coins once all previous coins are collected **********/
function coinWave(){
    if(coins.length === 0){
        createCoins();
    }
};


/********** This controls coin collision and collection **********/
Coin.prototype.updatePosition = function(){
    for (let i = 0; i < coins.length;) {
        let thisCoin = coins[i];
        if (
            thisCoin.x < myCharacter.x + myCharacter.width &&
            thisCoin.x + thisCoin.radius > myCharacter.x &&
            thisCoin.y < myCharacter.y + myCharacter.height &&
            thisCoin.y + thisCoin.radius > myCharacter.y
        ) {
            coins.splice(i, 1);
            console.log('Coin collected!');
        } else {
            i++;
        }
    }
    console.log('Collision detection loop finished!');
};


/********** This series of functions controls the coin counter **********/
let initialScore = 0;
let scoreSpan;

function updateScore(){
    initialScore++;
    scoreSpan.textContent = `Coins Collected: ${initialScore}`;
};

function renderScore() {
    scoreSpan = document.createElement("span");
    scoreSpan.textContent = `Coins Collected: ${initialScore}`;

    let scoreContainer = document.getElementById("score-counter");
    scoreContainer.appendChild(scoreSpan);
};

function coinScore() {
    for (let i = 0; i < coins.length; i++) {
        let thisCoin = coins[i];
        if (
            thisCoin.x < myCharacter.x + myCharacter.width &&
            thisCoin.x + thisCoin.radius > myCharacter.x &&
            thisCoin.y < myCharacter.y + myCharacter.height &&
            thisCoin.y + thisCoin.radius > myCharacter.y
        ) {
            coins.splice(i, 1);
            updateScore();
            console.log('Coin collected!');
        }
    }
};


console.log('Collision detection loop finished!');

/********** This function adds and updates frames for the game **********/
/********** This function also controls the keyboard inputs for charactermovement **********/
function updateGameArea(){
    myGameArea.clear();
    myGameArea.context.drawImage(myGameArea.background, 0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
    
    myCharacter.speedX = 0;
    myCharacter.speedY = 0;
    if (myGameArea.keys && (myGameArea.keys["a"] || myGameArea.keys["A"])) {myCharacter.speedX -= 3;}
    if (myGameArea.keys && (myGameArea.keys["d"] || myGameArea.keys["D"])) {myCharacter.speedX += 3;}
    if (myGameArea.keys && (myGameArea.keys["w"] || myGameArea.keys["W"])) {myCharacter.speedY -= 3;}
    if (myGameArea.keys && (myGameArea.keys["s"] || myGameArea.keys["S"])) {myCharacter.speedY += 3;}

    let newX = myCharacter.x + myCharacter.speedX;
    let newY = myCharacter.y + myCharacter.speedY;

    if (newX >= 0 && newX <= myGameArea.canvas.width - myCharacter.width) {
        myCharacter.x = Math.round(newX); // Round the position coordinates
    }
    if (newY >= 0 && newY <= myGameArea.canvas.height - myCharacter.height) {
        myCharacter.y = Math.round(newY); // Round the position coordinates
    }

    coinScore();
    coinWave();

    coins.forEach(function(coin){
        coin.updatePosition();
        coin.draw(myGameArea.context);
    });

    myCharacter.update();
};

/********** This function appends a timer to the HTML page **********/
function gameTimer() {
    let seconds = 61;
    function tick() {
        let counter = document.getElementById("timer");
        seconds--;
        counter.innerHTML = "Time Remaining: 0:" + (seconds < 10 ? "0" : "") + String(seconds);
        if (seconds > 0) {
            setTimeout(tick, 1000);
        } else {
            clearInterval(myGameArea.interval);

            document.getElementById("final-score").textContent = "Coins Collected: " + initialScore;
            document.getElementById("end-game-popup").style.display = "block";
        }
    }
    tick();
};


/********** This function add character movement**********/
function moveUp() {
    myCharacter.speedY -= 1;
};

function moveDown() {
    myCharacter.speedY += 1;
};

function moveLeft() {
    myCharacter.speedX -= 1;
};

function moveRight() {
    myCharacter.speedX += 1;
};

function stopMove() {
    myCharacter.speedX = 0;
    myCharacter.speedY = 0;
};

/********** This function hides the score and timer until the start button is clicked **********/
function hideInfo(){
    let hideTimer = document.getElementById("timer")
        hideTimer.style.display = "initial";

    let hideScore = document.getElementById("score-counter")
        hideScore.style.display = "initial";
};


/********** This function loads the background image **********/
function loadBackground() {
    const canvas = document.getElementById("arena");
    const ctx = canvas.getContext("2d");
    canvas.width = 1000;
    canvas.height = 500;

    let background = new Image();
    background.src ="/assets/Game Background Image.png"

    background.onload = function(){
        ctx.drawImage(background,0,0);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    startGame();
});