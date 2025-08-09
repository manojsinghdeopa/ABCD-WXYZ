const myCanvas = document.getElementById('myCanvas');
const ctx = myCanvas.getContext('2d');
const FPS = 40;
const jumpAmount = -4;
const maxFallSpeed = +2;
const acceleration = 0.5;
const pipeSpeed = -2;
let gameMode = 'prestart';
let timeGameLastRunning;
let bottomBarOffset = 0;
const pipes = [];
let isJumping = false;

function MySprite(imgUrl) {
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.velocityX = 0;
    this.velocityY = 0;
    this.MyImg = new Image();
    this.MyImg.src = imgUrl || '';
    this.angle = 0;
    this.flipV = false;
    this.flipH = false;
}

MySprite.prototype.DoFrameThings = function () {
    ctx.save();
    ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
    ctx.rotate((this.angle * Math.PI) / 180);
    if (this.flipV) ctx.scale(1, -1);
    if (this.flipH) ctx.scale(-1, 1);
    if (this.visible)
        ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
    this.x += this.velocityX;
    this.y += this.velocityY;
    ctx.restore();
};

function ImagesTouching(thing1, thing2) {
    if (!thing1.visible || !thing2.visible) return false;
    return (
        thing1.x < thing2.x + thing2.MyImg.width &&
        thing1.x + thing1.MyImg.width > thing2.x &&
        thing1.y < thing2.y + thing2.MyImg.height &&
        thing1.y + thing1.MyImg.height > thing2.y
    );
}

function GotPlayerInput(event) {
    switch (gameMode) {
        case 'prestart':
            gameMode = 'running';
            break;
        case 'running':
            if (!isJumping) {
                isJumping = true;
                jump();
            }
            break;
        case 'over':
            if (new Date() - timeGameLastRunning > 1000) {
                resetGame();
                gameMode = 'running';
            }
            break;
    }
    event.preventDefault(); // Prevent default behavior for touch events
}

addEventListener('touchstart', GotPlayerInput);
addEventListener('mousedown', GotPlayerInput);
addEventListener('keydown', GotPlayerInput);

function jump() {
    let jumpVelocity = jumpAmount;
    let jumpInterval = setInterval(() => {
        bird.velocityY = jumpVelocity;
        jumpVelocity += acceleration;
        if (jumpVelocity >= 0) {
            clearInterval(jumpInterval);
            isJumping = false;
        }
    }, 1000 / FPS);
}

function makeBirdSlowAndFall() {

    if (bird.velocityY < maxFallSpeed) {
        bird.velocityY += acceleration;
    }
    if (bird.y > myCanvas.height - bird.MyImg.height || bird.y < 0 - bird.MyImg.height) {
        bird.velocityY = 0;
        gameMode = 'over';
    }
}

function addPipe(xPos, topOfGap, gapWidth) {
    const topPipe = new MySprite();
    topPipe.MyImg = pipePiece;
    topPipe.x = xPos;
    topPipe.y = topOfGap - pipePiece.height;
    topPipe.velocityX = pipeSpeed;
    pipes.push(topPipe);
    const bottomPipe = new MySprite();
    bottomPipe.MyImg = pipePiece;
    bottomPipe.flipV = true;
    bottomPipe.x = xPos;
    bottomPipe.y = topOfGap + gapWidth;
    bottomPipe.velocityX = pipeSpeed;
    pipes.push(bottomPipe);
}

function makeBirdTiltAppropriately() {
    if (bird.velocityY < 0 && bird.angle > -15) {
        bird.angle = Math.min(bird.angle - 4, -15);
    } else if (bird.angle < 70) {
        bird.angle = Math.min(bird.angle + 4, 70);
    }
}

function showThePipes() {
    pipes.forEach(pipe => pipe.DoFrameThings());
}

function checkForEndGame() {
    pipes.forEach(pipe => {
        if (ImagesTouching(bird, pipe)) gameMode = 'over';
    });
}

function displayIntroInstructions() {
    ctx.textAlign = 'center';
    ctx.fillText('press to play', myCanvas.width / 2, myCanvas.height / 4);
}

function displayGameOver() {
    let score = 0;
    pipes.forEach(pipe => {
        if (pipe.x < bird.x) score += 0.5;
    });
 
    ctx.textAlign = 'center';
    ctx.fillText('game over', myCanvas.width / 2, 100);
    ctx.fillText('score: ' + score, myCanvas.width / 2, 150);
   
    ctx.fillText('press to play', myCanvas.width / 2, 300);
}

function displayBarRunningAlongBottom() {
    bottomBarOffset = bottomBarOffset < -23 ? 0 : bottomBarOffset + pipeSpeed;
    ctx.drawImage(bottomBar, bottomBarOffset, myCanvas.height - bottomBar.height);
}

function resetGame() {
    bird.y = myCanvas.height / 2;
    bird.angle = 0;
    pipes.length = 0; // Clear the pipes array
    addAllPipes(); // and load them back in their starting positions
}

function addAllPipes() {  
    addPipe(500, 200, 200);
    addPipe(800, 150, 180);
    addPipe(1100, 250, 160);
    addPipe(1400, 200, 140);
    addPipe(1700, 150, 120);
    addPipe(2000, 250, 100);
    addPipe(2300, 200, 90);
    addPipe(2600, 150, 100);
    addPipe(2900, 250, 80);
    addPipe(3200, 200, 70);
    addPipe(3500, 150, 100);
    
    const finishLine = new MySprite('assets/flappyend.png');
    finishLine.x = 3900;
    finishLine.velocityX = pipeSpeed;
    pipes.push(finishLine);
}

const pipePiece = new Image();
pipePiece.onload = addAllPipes;
pipePiece.src = 'assets/flappypipe.png';

function DoAFrame() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    bird.DoFrameThings();
    // displayBarRunningAlongBottom();
    switch (gameMode) {
        case 'prestart':
            displayIntroInstructions();
            break;
        case 'running':
            timeGameLastRunning = new Date();
            showThePipes();
            makeBirdTiltAppropriately();
            makeBirdSlowAndFall();
            checkForEndGame();
            break;
        case 'over':
            makeBirdSlowAndFall();
            displayGameOver();
            break;
    }
    requestAnimationFrame(DoAFrame);
}

const bottomBar = new Image();
bottomBar.src = 'assets/flappybottom.png';

const bird = new MySprite('assets/flappybird.png');
bird.x = myCanvas.width / 3;
bird.y = myCanvas.height / 2;

requestAnimationFrame(DoAFrame);
