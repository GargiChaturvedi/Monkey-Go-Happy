//global variables declared here
var monkey, monkey_running;
var banana, bananaImage, obstacle, obstacleImage, ground;
var bananaGroup, obstacleGroup;
var survivalTime;
var gameState = "play";
var replay, replayImage;
var jumpSound;
var checkpointSound;
var dieSound;
var lives = 3;
var life1, life2, life3, lifeImage;
var backdrop, backdropImage;
var music;

function preload() {

  //sounds, animations and images loaded here
  monkey_running = loadAnimation("sprite_0.png", "sprite_1.png", "sprite_2.png", "sprite_3.png", "sprite_4.png", "sprite_5.png", "sprite_6.png", "sprite_7.png", "sprite_8.png");
  monkey_stop = loadAnimation("sprite_6.png");

  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  backdropImage = loadImage("jungle.png");
  replayImage = loadImage("replay.png");
  lifeImage = loadImage("life.png");
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkpoint.mp3");
  dieSound = loadSound("die.mp3");
  music = loadSound("music.mp3");
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  
  music.play();
  
  //monkey, ground, replay sprites created here 
  backdrop = createSprite(width, height);
  backdrop.addImage("jungle", backdropImage);
  backdrop.scale = 2.5;
  
  ground = createSprite(width/2, height-50, width, 20);
  ground.shapeColor = "green";
  
  monkey = createSprite(50, height - 100);
  monkey.addAnimation("monkey_running", monkey_running);
  monkey.addAnimation("monkey_stop", monkey_stop);
  monkey.scale = 0.15;
  monkey.debug = false;
  monkey.setCollider("circle", 0, 0, 280);
  
  replay = createSprite(width/2, height/2 - 100);
  replay.addImage("replay", replayImage);
  replay.scale = 0.2;
  replay.visible = false;
  
  //groups created here
  obstacleGroup = new Group();
  bananaGroup = new Group();
  
  life1 = createSprite(80, 20);
  life1.addImage("life", lifeImage);
  
  life2 = createSprite(50, 20);
  life2.addImage("life", lifeImage);
  
  life3 = createSprite(20, 20);
  life3.addImage("life", lifeImage);
  
  //score
  survivalTime = 0;
}


function draw() {
  background("white");
  
  //play game state
  if(gameState === "play") {
    backdrop.velocityX = -5;
    spawnObstacles();
    spawnBanana();
    survivalTime = survivalTime + Math.round(getFrameRate()/30);
  }
  
  //jumping
  if((touches.length > 0 || keyDown("space")) && gameState === "play") {
    monkey.velocityY = -15;
    jumpSound.play();
    touches = [];
  }
  
  //checkpoint sound
  if(survivalTime > 0 && survivalTime % 200 === 0 && gameState === "play") {
    checkpointSound.play();
  }
  
  //gravity
  monkey.velocityY = monkey.velocityY + 0.8;
  //preventing sinking
  monkey.collide(ground);
  
  //scrolling effect
  if(backdrop.x < 0) {
    backdrop.x = width/2;
  }
  
  //extra points on eating banana
  if(monkey.isTouching(bananaGroup) && gameState === "play") {
    bananaGroup.destroyEach();
    survivalTime += 50;
  }
  
  //game state is end
  //if(monkey.isTouching(obstacleGroup) && gameState === "play") {
    //dieSound.play();
    //gameState = "end";
  //}
  
  if(monkey.isTouching(obstacleGroup)) {
      lives -= 1;
      dieSound.play();
      obstacleGroup.destroyEach();
      monkey.scale -= 0.01;
    }
        
    if(lives === 2) {
      life1.visible = false;
      life2.visible = true;
      life3.visible = true;
    }
    
    if(lives === 1) {
      life2.visible = false;
      life3.visible = true;
      life1.visible = false;
    }
    
    //console.log(lives);
    
    if(lives === 0) {
      life3.visible = false;
      life2.visible = false;
      life1.visible = false;
      gameState = "end";
    }
  
  if(gameState === "end") {
    backdrop.setVelocity(0, 0);
    //0 monkey velocity
    monkey.velocityX = 0;
    //animation changed
    monkey.changeAnimation("monkey_stop", monkey_stop);
    //negative lifetime
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    //replay button active here
    replay.visible = true;
  }
  
  //resetting the game
  if((mousePressedOver(replay) || touches.length > 0) && gameState === "end") {
    reset();
  }
  drawSprites();
  
  //console.log(windowWidth)
  //score printed here
  fill("black");
  textSize(20);
  text("Score: " + survivalTime, width - 150, 50);
}

//spawning obstacles
function spawnObstacles() {
  if(frameCount % 100 === 0) {
    //obstacle sprite details
    obstacle = createSprite(width - 50, height - 75);
    obstacle.velocityX = -5;
    obstacle.addImage("obstacle", obstacleImage);
    obstacle.scale = 0.2;
    if(obstacle.x > width) {
      obstacle.destroy();
    }
    //adding obstacle to the group
    obstacleGroup.add(obstacle);
  }
}

//spawning bananas
function spawnBanana() {
  if(frameCount % 50 === 0) {
    //random variable for random x position
    var rand = Math.round(random(width - 280, width/2));
    //banana sprite details
    banana = createSprite(width, 200);
    banana.y = rand;
    banana.velocityX = -5;
    banana.addImage("banana", bananaImage);
    banana.scale = 0.1;
    if(banana.x > width) {
      banana.destroy();
    }
    //banana sprite added to group
    bananaGroup.add(banana);
  }
}

//reset function(called on line no.113)
function reset() {
  monkey.scale = 0.15;
  monkey.changeAnimation("monkey_running", monkey_running);
  obstacleGroup.destroyEach();
  bananaGroup.destroyEach();
  replay.visible = false;
  gameState = "play";
  survivalTime = 0;
  lives = 3;
  life1.visible = true;
  life2.visible = true;
  life3.visible = true;
}