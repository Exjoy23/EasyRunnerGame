'use strict';

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 450
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let jump;
let jumpSound;
let score = 0;
let platformPositionX = 700;
let platformPositionY = 300;
let platformMoveX = -250;
let platformMoveY = 0;
let platformSound;
let platformTouch = true;
let endGameSound;

const platforms = [];

const scoreText = document.querySelector('.page__score');
const play = document.querySelector('.page__play');

function preload() {
  this.load.image('background', 'img/background.png');
  this.load.spritesheet('platform', 'img/platform.png', { frameWidth: 180, frameHeight: 33 });
  this.load.spritesheet('hero', 'img/hero.png', { frameWidth: 78, frameHeight: 87 });
  this.load.audio('jump', 'audio/jump.wav');
  this.load.audio('platform', 'audio/platform.wav');
  this.load.audio('endgame', 'audio/endgame.wav');
}

function create() {
  play.addEventListener('click', () => {
    player.destroy(true);
    player = this.physics.add.sprite(400, 100, 'hero');
    platforms.pop();
    platforms.pop();
    platforms.pop();
    this.physics.add.collider(player, platforms);
    score = 0;
    platforms.push(this.physics.add.sprite(700, 300, 'platform'));
    platforms.push(this.physics.add.sprite(1100, 300, 'platform'));
    platforms.push(this.physics.add.sprite(1400, 300, 'platform'));
    platformMoveX = -250;
    platformMoveY = 0;
    play.classList.add('page__play--hide');
  });

  // pause.addEventListener('click', () => {
  //   this.scene.pause();
  // });

  jumpSound = this.sound.add('jump');
  platformSound = this.sound.add('platform');
  endGameSound = this.sound.add('endgame');

  this.background = this.add.tileSprite(0, 0, 800, 450, 'background').setOrigin(0, 0);

  player = this.physics.add.sprite(400, 100, 'hero');

  // Player animation
  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 3 }),
    frameRate: 8,
    repeat: -1
  });

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('hero', { start: 4, end: 5 }),
    frameRate: 8,
    repeat: -1
  });

  // Platform animation
  this.anims.create({
    key: 'move',
    frames: this.anims.generateFrameNumbers('platform', { start: 0, end: 3 }),
    frameRate: 16,
    repeat: -1
  });

  this.physics.add.collider(player, platforms);
}

function update() {

  // Score
  scoreText.textContent = `SCORE: ${score}`;

  // End game
  if (player.y >= 500) {
    platformMoveY = 500;
    platformMoveX = 0;
    play.classList.remove('page__play--hide');

    if (player.y >= 500 && player.y <= 510) {
      endGameSound.play();
    }
  }

  // Player jump & walk
  if (jump && player.body.touching.down) {
    player.setVelocityY(-360);
    player.anims.play('up', true);
    jumpSound.play();
    platformTouch = true;
  } else if (player.body.touching.down) {
    player.anims.play('walk', true);
    if (platformTouch) {
      platformSound.play();
      platformTouch = false;
    }
  } else {
    player.anims.play('up', true);
  }

  // Background move
  this.background.tilePositionX += 1;

  // Platforms generator
  if (platforms.length < 3) {
    platforms.push(this.physics.add.sprite(platformPositionX, platformPositionY, 'platform'));
  }
  platforms.forEach(item => {
    if (item.x < 300 && !player.body.touching.down) {
      platforms.shift();
      score++;
    }
    item.setVelocityY(platformMoveY);
    item.setVelocityX(platformMoveX);
    item.anims.play('move', true);

    platformPositionX = item.x + 470 - Math.floor(Math.random() * 100);

    if (Math.random() < 0.5 && item.y <= 310) {
      platformPositionY = item.y + Math.floor(Math.random() * 90);
    } else if (item.y >= 310) {
      platformPositionY = item.y - Math.floor(Math.random() * 90);
    }
  });
}

// Control
document.addEventListener('touchstart', () => {
  jump = true;
});

document.addEventListener('touchend', () => {
  jump = false;
});

document.addEventListener('keydown', () => {
  jump = true;
});

document.addEventListener('keyup', () => {
  jump = false;
});

document.addEventListener('mousedown', () => {
  jump = true;
});

document.addEventListener('mouseup', () => {
  jump = false;
});
