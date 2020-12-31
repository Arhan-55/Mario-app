var groundImg, smallmario_running, mario_jumping, mario_collided;
var goombaImg, obstacleImg_1, obstacleImg_2, obstacleImg_3;
var goombaGroup1, goombaGroup2, goombaGroup3, invisibleblocksGroup1, invisibleblocksGroup2, invisibleblocksGroup3, obstaclesGroup, CloudsGroup, mountainsGroup;
var cloudImg, SunImg, mountainImg;
var jumpSound, gameoverSound, kickSound, resetSound;
var checkpointSound;


var END = 0;
var PLAY = 1;
var gameState = PLAY;
var gameOverImg, RestartImg;
var score;

function preload() {

  groundImg = loadImage("ground.png");

  smallmario_running = loadAnimation("small mario(1).png", "small mario(2).png", "small mario(3).png", "small mario(4).png");
  mario_collided = loadAnimation("mario_collided.png");
  mario_jumping = loadAnimation("mario_jumping.png");

  goombaImg = loadAnimation("goomba(1).png", "goomba(2).png");

  obstacleImg_1 = loadAnimation("pirana(1).png", "pirana(2).png", "pirana(3).png", "pirana(4).png", "pirana(5).png");
  obstacleImg_2 = loadImage("rock.png");
  obstacleImg_3 = loadImage("spikes.png");

  cloudImg = loadImage("cloud.png");
  SunImg = loadAnimation("sun(1).png", "sun(2).png");
  mountainImg = loadImage("mountain.png");

  gameOverImg = loadImage("GAME_OVER.png");
  RestartImg = loadImage("RESTART.png");

  jumpsound = loadSound("jump.wav");
  gameoverSound = loadSound("game over.wav");
  kickSound = loadSound("kick.wav");
  resetSound = loadSound("reset.wav");
  checkpointSound = loadSound("checkpoint.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  sun = createSprite(width-50, 70, 10, 10);
  sun.addAnimation("Sun", SunImg);

  ground = createSprite(width/2,height-25 ,width,2);
  ground.addImage(groundImg);
  ground.scale = 0.4;

  mario = createSprite(50, height-70);
  mario.addAnimation("running", smallmario_running);
  mario.addAnimation("jumping", mario_jumping);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.5;

  gameOver = createSprite(width/2,height/2- 70);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 1.5;

  restart = createSprite(width/2,height/2);
  restart.addImage(RestartImg);
  restart.scale = 0.9;

  goombaGroup1 = createGroup();
  goombaGroup2 = createGroup();
  goombaGroup3 = createGroup();
  invisibleblocksGroup1 = createGroup();
  invisibleblocksGroup2 = createGroup();
  invisibleblocksGroup3 = createGroup();
  obstaclesGroup = createGroup();
  CloudsGroup = createGroup();
  mountainsGroup = createGroup();

  score = 0;
}

function draw() {
  background("skyblue");

  if (gameState === PLAY) {

    ground.velocityX = -(5 + 3*score/100);

    if (ground.x < 80) {
      ground.x = 300;
      ground.y = height-25;
    }

    if (score > 0 && score % 200 === 0) {
      checkpointSound.play()
    }

    if (keyWentDown("space") && mario.y >= 275) {
      jumpsound.play();
    }
    
    if (touches.length > 0 || keyDown("space") && mario.y >= height- 140) {
      mario.velocityY = -10;
      touches = [];
      mario.changeAnimation("jumping", mario_jumping);
    } else if (mario.isTouching(ground)) {
      mario.changeAnimation("running", smallmario_running);
    }
    mario.velocityY = mario.velocityY + 0.8;

    if (invisibleblocksGroup1.isTouching(mario)) {
      goombaGroup1.setVelocityYEach(4);
      kickSound.play();
      mario.velocityY = -5;
    } else if (invisibleblocksGroup2.isTouching(mario)) {
      goombaGroup2.setVelocityYEach(4);
      kickSound.play();
      mario.velocityY = -5;
    } else if (invisibleblocksGroup3.isTouching(mario)) {
      goombaGroup3.setVelocityYEach(4);
      kickSound.play();  
      mario.velocityY = -5;
    }

    score = score + Math.round(getFrameRate() / 60);

    gameOver.visible = false;
    restart.visible = false;

    mario.collide(ground);

    spawnclouds();
    spawnmountains();
    enemy();
    spawnobstacles();

    if (obstaclesGroup.isTouching(mario) || goombaGroup1.isTouching(mario) || goombaGroup2.isTouching(mario) || goombaGroup3.isTouching(mario)) {
      gameState = END;
      gameoverSound.play();
      goombaGroup1.setVelocityYEach(0);
      goombaGroup2.setVelocityYEach(0);
      goombaGroup3.setVelocityYEach(0);
      mario.velocityY = -10;
    }
  }

  if (gameState === END) {
    ground.velocityX = 0;

    CloudsGroup.setVelocityXEach(0);
    mountainsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    goombaGroup1.setVelocityXEach(0);
    goombaGroup2.setVelocityXEach(0);
    goombaGroup3.setVelocityXEach(0);
    invisibleblocksGroup1.setVelocityXEach(0);
    invisibleblocksGroup2.setVelocityXEach(0);
    invisibleblocksGroup3.setVelocityXEach(0);

    CloudsGroup.setLifetimeEach(-1);
    mountainsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    goombaGroup1.setLifetimeEach(-1);
    goombaGroup2.setLifetimeEach(-1);
    goombaGroup3.setLifetimeEach(-1);
    invisibleblocksGroup1.setLifetimeEach(-1);
    invisibleblocksGroup2.setLifetimeEach(-1);
    invisibleblocksGroup3.setLifetimeEach(-1);

    mario.velocityY = mario.velocityY + 0.8;
    mario.changeAnimation("collided", mario_collided);

    gameOver.visible = true;
    restart.visible = true;

    if (touches.restart || mousePressedOver(restart)) {
      reset();
      resetSound.play();
      touches = []
    }
  }



  drawSprites();

  strokeWeight(0.1);
  stroke("white");
  fill("white");
  textFont("Cooper Black");
  textSize(20);
  text("Mario : " + score, 50, 50);

}

function reset() {
  mario.y = height-70;
  mario.collide(ground);
  gameState = PLAY;

  mario.changeAnimation("running", smallmario_running);

  CloudsGroup.destroyEach();
  mountainsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  goombaGroup1.destroyEach();
  goombaGroup2.destroyEach();
  goombaGroup3.destroyEach();
  invisibleblocksGroup1.destroyEach();
  invisibleblocksGroup2.destroyEach();
  invisibleblocksGroup3.destroyEach();

  frameCount = 0;
  score = 0;
}

function spawnclouds() {
  if (frameCount % 60 === 0) {
    Cloud = createSprite(width + 20,height - 300,40,10);
    Cloud.addImage(cloudImg);
    Cloud.scale = 0.5;
    Cloud.velocityX = -5;
    Cloud.lifetime = 175;
    CloudsGroup.add(Cloud);
    Cloud.depth = mario.depth;
    mario.depth = mario.depth + 1;
  }
}

function spawnmountains() {
  if (frameCount % 250 === 0) {
    mountain = createSprite(700, height-95);
    mountain.addImage(mountainImg);
    mountain.scale = 2.9;
    mountain.velocityX = -5;
    mountain.lifetime = 175;
    mountain.depth = ground.depth;
    ground.depth = ground.depth + 1;
    mountainsGroup.add(mountain);
  }
}

function enemy() {
  if (frameCount % 230 === 0) {
    goomba1 = createSprite(700, height-85);
    goomba1.addAnimation("moving", goombaImg);
    goomba1.scale = 0.4;
    goomba1.velocityX = -(6 + 3*score/100);
    goomba1.lifetime = 175;
    goomba1.setCollider("rectangle", 0, 0, 100, 40);
    //goomba1.debug = true;
    goombaGroup1.add(goomba1);

    goomba2 = createSprite(goomba1.x + 40, height-85);
    goomba2.addAnimation("moving", goombaImg);
    goomba2.scale = 0.4;
    goomba2.velocityX = -(6 + 3*score/100);
    goomba2.lifetime = 185;
    goomba2.setCollider("rectangle", 0, 0, 100, 40);
    //goomba2.debug = true;
    goombaGroup2.add(goomba2);

    goomba3 = createSprite(goomba1.x + 80, height-85);
    goomba3.addAnimation("moving", goombaImg);
    goomba3.scale = 0.4;
    goomba3.velocityX = -(6 + 3*score/100);
    goomba3.lifetime = 195;
    goomba3.setCollider("rectangle", 0, 0, 100, 40);
    //goomba3.debug = true;
    goombaGroup3.add(goomba3);

    invisibleblock1 = createSprite(700, goomba1.y-20, 20, 20);
    invisibleblock1.velocityX = -(6 + 3*score/100);
    invisibleblock1.lifetime = 175;
    invisibleblock1.visible = false;
    invisibleblocksGroup1.add(invisibleblock1);

    invisibleblock2 = createSprite(740, goomba2.y-20, 20, 20);
    invisibleblock2.velocityX = -(6 + 3*score/100);
    invisibleblock2.lifetime = 185;
    invisibleblock2.visible = false;
    invisibleblocksGroup2.add(invisibleblock2);

    invisibleblock3 = createSprite(780, goomba3.y-20, 20, 20);
    invisibleblock3.velocityX = -(6 + 3*score/100);
    invisibleblock3.lifetime = 195;
    invisibleblock3.visible = false;
    invisibleblocksGroup3.add(invisibleblock3);
  }
}

function spawnobstacles() {
  if (frameCount % 100 === 0) {
    obstacle = createSprite(700, height-95);
    obstacle.velocityX = -(6 + 3*score/100);

    r = Math.round(random(1, 3));
    switch (r) {
      case 1:
        obstacle.addAnimation("obstacle", obstacleImg_1);
        obstacle.scale = 0.8;
        obstacle.y = height-90;
        break;
      case 2:
        obstacle.addImage(obstacleImg_2);
        obstacle.scale = 0.7;
        break;
      case 3:
        obstacle.addImage(obstacleImg_3);
        obstacle.scale = 0.7;
        break;
      default:
        break;
    }
    obstacle.lifetime = 175;
    obstaclesGroup.add(obstacle);
  }


}