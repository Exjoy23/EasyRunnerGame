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
let cursors;
let touch;

function preload() {
  this.load.image('background', 'img/background.jpg');
  this.load.spritesheet('hero', 'img/hero.png', { frameWidth: 81, frameHeight: 87 });
}

function create() {
  this.add.image(400, 225, 'background');

  player = this.physics.add.sprite(400, 500, 'hero');

  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'walk',
    frames: this.anims.generateFrameNumbers('hero', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'up',
    frames: this.anims.generateFrameNumbers('hero', { start: 2, end: 2 }),
    frameRate: 10,
  });

  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.up.isDown || touch && player.body.blocked.down) {
    player.setVelocityY(-300);

    player.anims.play('up', true);
  } else if (player.body.blocked.down) {
    player.anims.play('walk', true);
  }
}

document.addEventListener('touchstart', () => {
  touch = true;
});

document.addEventListener('touchend', () => {
  touch = false;
});
