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

const platforms = [];

let platformPositionX = 600;
let platformPositionY = 350;

function preload() {
  this.load.image('background', 'img/background.png');
  this.load.spritesheet('platform', 'img/platform.png', { frameWidth: 180, frameHeight: 33 });
  this.load.spritesheet('hero', 'img/hero.png', { frameWidth: 78, frameHeight: 87 });
}

function create() {
  this.bg = this.add.tileSprite(0, 0, 800, 450, 'background').setOrigin(0, 0);

  player = this.physics.add.sprite(400, 100, 'hero');

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

  this.anims.create({
    key: 'move',
    frames: this.anims.generateFrameNumbers('platform', { start: 0, end: 3 }),
    frameRate: 16,
    repeat: -1
  });

  player.play('walk');

  this.physics.add.collider(player, platforms);
}

function update() {
  if (player.y > 500) {
    platforms.length = 0;
  }

  if (jump && (player.body.blocked.down || player.body.touching.down)) {
    player.setVelocityY(-360);

    player.anims.play('up', true);
  } else if (player.body.blocked.down || player.body.touching.down) {
    player.anims.play('walk', true);
  }

  this.bg.tilePositionX += 1;

  if (platforms.length < 3) {
    // if (Math.random() < 0.3) {
    //   platforms.push(this.physics.add.sprite(platformPositionX, platformPositionY, 'platform').setScale(1.3));
    // } else {
    //   platforms.push(this.physics.add.sprite(platformPositionX, platformPositionY, 'platform'));
    // }
    platforms.push(this.physics.add.sprite(platformPositionX, platformPositionY, 'platform'));
  }

  platforms.forEach(item => {
    if (item.x < 250) {
      platforms.shift();
      score++;
    }
    item.setVelocityY(-5);
    item.setVelocityX(-250);
    item.anims.play('move', true);
    platformPositionX = item.x + 500 - Math.floor(Math.random() * 100);
    platformPositionY = 350 - Math.floor(Math.random() * 100);
  });
}

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
