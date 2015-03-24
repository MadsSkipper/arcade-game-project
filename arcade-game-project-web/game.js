//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;
var is_firing = 0;
var the_shot = 0;
var shot = 0;
var evship = 0;
var evishipxI = 200;
var evishipyI = 40;
var evishipxII = 250;
var evishipyII = 30;
var evishipxIII = 150;
var evishipyIII = 10;
var evishipxIV = 100;
var evishipyIV = 20;
var evishipxV = 200;
var evishipyV = 0;
var fst = true;
var knatLI = false;
//---------------
//Preloading ...
//---------------
//Preload Art Assets
// - Sprite Sheet
var charImage = new Image();
charImage.ready = false;
charImage.onload = setAssetReady;
charImage.src = PATH_CHAR;

var ShotImage = new Image();
ShotImage.src = PATH_shot;



function setAssetReady() {
    this.ready = true;
}

//Display Preloading
ctx.fillRect(0, 0, stage.width, stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
var preloader = setInterval(preloading, TIME_PER_FRAME);

var gameloop, facing, currX, currY, charX, charY, isMoving;

function preloading() {
    if (charImage.ready) {
        clearInterval(preloader);

        //Initialise game
        facing = "E"; //N = North, E = East, S = South, W = West
        isMoving = false;
        IsShot = false;

        gameloop = setInterval(update, TIME_PER_FRAME);
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
    }
}

//------------
//Key Handlers
//------------
function keyDownHandler(event) {
    var keyPressed = String.fromCharCode(event.keyCode);

    if (keyPressed == "W") {
        facing = "N";
        isMoving = true;
    }
    else if (keyPressed == "D") {
        facing = "E";
        isMoving = true;
    }
    else if (keyPressed == "S") {
        facing = "S";
        isMoving = true;
    }
    else if (keyPressed == "A") {
        facing = "W";
        isMoving = true;
    }
    if (keyPressed == "F") {
        is_firing = 1;        

    }
}

function keyUpHandler(event) {
    var keyPressed = String.fromCharCode(event.keyCode);

    if ((keyPressed == "W") || (keyPressed == "A") ||
		(keyPressed == "S") || (keyPressed == "D")) {
        isMoving = false;
    }
    if (keyPressed == "F") {
        is_firing = 0;
        the_shot = 1;

    }

}

//------------
//Game Loop
//------------
charX = CHAR_START_X;
charY = CHAR_START_Y;

currX = IMAGE_START_X;
currY = IMAGE_START_EAST_Y;

ShotcharX = ShotCHAR_START_X;
ShotcharY = ShotCHAR_START_Y;

aiCharx = 200;
aiChary = 0;
function update() {
    //Clear Canvas
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, stage.width, stage.height);

    if (isMoving) {
        if (facing == "N") {
            charY -= CHAR_SPEED;
            currY = IMAGE_START_NORTH_Y;
        }
        else if (facing == "E") {
            charX += CHAR_SPEED;
            currY = IMAGE_START_EAST_Y;
        }
        else if (facing == "S") {
            charY += CHAR_SPEED;
            currY = IMAGE_START_NORTH_Y;
        }
        else if (facing == "W") {
            charX -= CHAR_SPEED;
            currY = IMAGE_START_WEST_Y;
        }

        currX += CHAR_WIDTH;

        if (currX >= SPRITE_WIDTH)
            currX = 0;
    }
    if (is_firing == 1 || the_shot == 1)
    {
        if (fst == true)
        {
            ShotcharX = charX;
            ShotcharY = charY;

        }        
        ShotcharY -= ShotCHAR_SPEED;
        ctx.drawImage(ShotImage, ShotcharX, ShotcharY);
        shot++;
        fst = false;
       
        

    }



    //Draw Image 


    ctx.drawImage(charImage, currX, currY, CHAR_WIDTH, CHAR_HEIGHT,
                    charX, charY, CHAR_WIDTH, CHAR_HEIGHT);    
    var evishipImageI = new Image();
    var evishipImageII = new Image();
    var evishipImageIII = new Image();
    var evishipImageIV = new Image();
    var evishipImageV = new Image();

    evishipImageI.src = "Images/ai.png";
    evishipImageII.src = "Images/ai.png";
    evishipImageIII.src = "Images/ai.png";
    evishipImageIV.src = "Images/ai.png";
    evishipImageV.src = "Images/ai.png";
              
            //evishipx = Math.floor((Math.random() * 400) + 0);
            //evishipy = Math.floor((Math.random() * 30) + 0);
        
    ctx.drawImage(evishipImageI, evishipxI, evishipyI);
    ctx.drawImage(evishipImageII, evishipxII, evishipyII);
    ctx.drawImage(evishipImageIII, evishipxIII, evishipyIII);
    ctx.drawImage(evishipImageIV, evishipxIV, evishipyIV);
    ctx.drawImage(evishipImageV, evishipxV, evishipyV);
    var test, testI, testII, testIII, testIV, testV;
         
         
    
        
   eviI = Math.floor((Math.random() * 4) + 1);
   evishipyI += eviI;
   testI = Math.floor((Math.random() * 2) + 1);
   testII = Math.floor((Math.random() * 2) + 1);
   testIII = Math.floor((Math.random() * 2) + 1);
   testIV = Math.floor((Math.random() * 2) + 1);
   testV = Math.floor((Math.random() * 2) + 1);

   if (testI == 1) {
       evishipxI += Math.floor((Math.random() * 2) + 0);
       if (knatLI == true)
       {
           testI = 1;

       }
       if (evishipxI > 100)
       {
           knatLI = false;
       }
        
    }
   if (testI == 2) {
        evishipxI -= Math.floor((Math.random() * 5) + 0);
    };
    eviII = Math.floor((Math.random() * 7) + 4);
    evishipyII += eviI;
    testII = Math.floor((Math.random() * 2) + 1);
    if (testII == 1) {
        evishipxII += Math.floor((Math.random() * 2) + 0);

    }
    if (testII == 2) {
        evishipxII -= Math.floor((Math.random() * 5) + 0);
    };

    eviIII = Math.floor((Math.random() * 7) + 4);
    evishipyIII += eviI;
    testIII = Math.floor((Math.random() * 2) + 1);
    if (testIII == 1) {
        evishipxII += Math.floor((Math.random() * 2) + 0);

    }
    if (testIII == 2) {
        evishipxIII -= Math.floor((Math.random() * 5) + 0);
    };


    eviIV = Math.floor((Math.random() * 7) + 4);
    evishipyIV += eviI;
    testIV = Math.floor((Math.random() * 2) + 1);
    if (testIV == 1) {
        evishipxIV += Math.floor((Math.random() * 2) + 0);

    }
    if (testIV == 2) {
        evishipxIV -= Math.floor((Math.random() * 5) + 0);
    };
       
    eviV = Math.floor((Math.random() * 7) + 4);
    evishipyV += eviI;
    testV = Math.floor((Math.random() * 2) + 1);
    if (testV == 1) {
        evishipxV += Math.floor((Math.random() * 2) + 0);

    }
    if (testV == 2) {
        evishipxV -= Math.floor((Math.random() * 5) + 0);
    };

    if (
		charX <= (evishipxI + 6)
		&& evishipxI <= (charX + 6)
		&& charY <= (evishipyI + 6)
		&& evishipyI <= (charY + 6)
	) {
        
    }
    if (
		(evishipxI + 6) <= 0
       
	) {
        evishipxI += 15;
        knatLI = true;
        
    }
    if (
		480 <= (evishipxI + 6)

	) {
        evishipxI -= 15;

    }

    //
    if (
       (evishipxII + 6) <= 0

   ) {
        evishipxII += 15;

    }
    if (
		480 <= (evishipxII + 6)

	) {
        evishipxII -= 15;

    }
    //
    if (
       (evishipxIII + 6) <= 0

   ) {
        evishipxIII += 15;

    }
    if (
		480 <= (evishipxIII + 6)

	) {
        evishipxIII -= 15;

    }
    //
    if (
       (evishipxIV + 6) <= 0

   ) {
        evishipxIV += 15;

    }
    if (
		480 <= (evishipxIV + 6)

	) {
        evishipxIV -= 15;

    }
    //
    if (
       (evishipxV + 6) <= 0

   ) {
        evishipxV += 15;

    }
    if (
		480 <= (evishipxV + 6)

	) {
        evishipxV -= 15;

    }
}






