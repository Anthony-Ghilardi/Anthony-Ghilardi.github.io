/********** This creates the play area and appends it to the main element on HTML **********/

function startGame() {
    myGameArea.start();
}

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
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = myGameArea.keys || {};
            myGameArea.keys[e.key] = true;
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.key] = false;
        });
    },
    clear: function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

/********** This creates the playable character and lays the foundation for movement **********/
let myCharacter;
function startGame() {
    myGameArea.start();
    myCharacter = new component (30, 30, "red", 470, 225);
}

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
}

/********** This function adds and updates frames for the game **********/
/********** This function also controls the keyboard inputs for charactermovement **********/
function updateGameArea(){
    myGameArea.clear();
    myCharacter.speedX = 0;
    myCharacter.speedY = 0;
    if (myGameArea.keys && myGameArea.keys["a"] || myGameArea.keys["A"]) {myCharacter.speedX -= 3;}
    if (myGameArea.keys && myGameArea.keys["d"] || myGameArea.keys["D"]) {myCharacter.speedX += 3;}
    if (myGameArea.keys && myGameArea.keys["w"] || myGameArea.keys["W"]) {myCharacter.speedY -= 3;}
    if (myGameArea.keys && myGameArea.keys["s"] || myGameArea.keys["S"]) {myCharacter.speedY += 3;}

    myCharacter.newPos();
    myCharacter.update();
}

/********** This function add character movement**********/
function moveUp() {
    myCharacter.speedY -= 1;
}

function moveDown() {
    myCharacter.speedY += 1;
}

function moveLeft() {
    myCharacter.speedX -= 1;
}

function moveRight() {
    myCharacter.speedX += 1;
}

function stopMove() {
    myCharacter.speedX = 0;
    myCharacter.speedY = 0;
}
/********** This calls the startGame function and begins the game **********/
startGame();