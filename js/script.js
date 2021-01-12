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
let score = 0;
let platformPositionX = 700;
let platformPositionY = 300;
let jumpSound;
let platformSound;
let platformTouch = true;
let endGameSound;

const platforms = [];

function preload() {
  this.load.image('background', 'img/background.png');
  this.load.spritesheet('platform', 'img/platform.png', { frameWidth: 180, frameHeight: 33 });
  this.load.spritesheet('hero', 'img/hero.png', { frameWidth: 78, frameHeight: 87 });
  this.load.audio('jump', 'audio/jump.wav');
  this.load.audio('platform', 'audio/platform.wav');
  this.load.audio('endgame', 'audio/endgame.wav');
}

function create() {
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

  // End game
  if (player.y >= 500) {
    platforms.length = 0;

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
    item.setVelocityY(0);
    item.setVelocityX(-250);
    item.anims.play('move', true);
    platformPositionX = item.x + 470 - Math.floor(Math.random() * 100);

    if (Math.random() < 0.5 && item.y <= 310) {
      platformPositionY = item.y + Math.floor(Math.random() * 90);
    } else if (item.y >= 310) {
      platformPositionY = item.y - Math.floor(Math.random() * 90);
    }

    // Test position platforms
    // platformPositionX = item.x + 470;
    // platformPositionY = item.y - 90;
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
