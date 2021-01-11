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
      gravity: { y: 300 }
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
let platforms;
let platforms1;
let platforms2;

function preload() {
  this.load.image('background', 'img/background.png');
  this.load.image('meteorite', 'img/meteorite.png');
  this.load.spritesheet('hero', 'img/hero.png', { frameWidth: 104, frameHeight: 116 });
}

function create() {
  // this.add.image(400, 225, 'background');

  this.bg = this.add.tileSprite(0, 0, 800, 450, 'background').setOrigin(0, 0);

  player = this.physics.add.sprite(400, 100, 'hero');

  // player.setCollideWorldBounds(true);

  platforms = this.physics.add.sprite(600, 350, 'meteorite');
  platforms1 = this.physics.add.sprite(1000, 350, 'meteorite');
  platforms2 = this.physics.add.sprite(1400, 350, 'meteorite');

  // platforms.setCollideWorldBounds(true);

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

  player.play('walk');

  this.physics.add.collider(player, platforms);
  this.physics.add.collider(player, platforms1);
  this.physics.add.collider(player, platforms2);
}

function update() {
  if (jump && (player.body.blocked.down || player.body.touching.down)) {
    player.setVelocityY(-300);

    player.anims.play('up', true);
  } else if (player.body.blocked.down || player.body.touching.down) {
    player.anims.play('walk', true);
  }

  this.bg.tilePositionX += 1;
  platforms.setVelocityX(-180);
  platforms.setVelocityY(0);
  platforms1.setVelocityX(-180);
  platforms1.setVelocityY(0);
  platforms2.setVelocityX(-180);
  platforms2.setVelocityY(0);
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
