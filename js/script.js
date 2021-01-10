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
      gravity: { y: 200 }
    }
  },
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);
let text;
let sky;

function preload() {
  this.load.setBaseURL('http://labs.phaser.io');

  this.load.image('sky', 'assets/skies/space3.png');
  this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  this.load.image('red', 'assets/particles/red.png');
}

function create() {
  sky = this.add.image(400, 300, 'sky');

  text = this.add.text(config.scale.width / 2, config.scale.height / 2, 'Please set your\nphone to landscape', { font: '48px sans-serif', fill: '#ffffff', align: 'center' }).setOrigin(0.5);

  checkOriention(this.scale.orientation);

  this.scale.on('orientationchange', checkOriention, this);

  const particles = this.add.particles('red');

  const emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: 'ADD'
  });

  const logo = this.physics.add.image(400, 100, 'logo');

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}

function checkOriention(orientation) {
  if (orientation === Phaser.Scale.PORTRAIT) {
    sky.alpha = 0.2;
    text.setVisible(true);
  }
  else if (orientation === Phaser.Scale.LANDSCAPE) {
    sky.alpha = 1;
    text.setVisible(false);
  }
}
