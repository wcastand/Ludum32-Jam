Blblbl.Preloader = function (game) {};
Blblbl.Preloader.prototype = {
  preload: function () {
    var loadingBar = this.add.sprite(450,300,"loading");
    loadingBar.anchor.setTo(0.5,0.5);
    this.load.setPreloadSprite(loadingBar);

    this.load.script(     'webfont',      '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    this.load.image(      'scoreBoard',   './assets/scoreBoard.png');
    this.load.image(      'tuto',         './assets/tuto.png');
    this.load.image(      'replayButton', './assets/replaybutton.png');
    this.load.image(      'muteButton',   './assets/mutebutton.png');
    this.load.image(      'title',        './assets/title.png');
    this.load.image(      'ecranScore',   './assets/EcranScore.jpg');

    this.load.image(      'moutain',    '/assets/moutain.jpg');
    this.load.image(      'top',        '/assets/top.png');
    this.load.image(      'mur',        '/assets/mur.png');
    this.load.image(      'bot',        '/assets/bot.png');

    this.load.spritesheet('bubble1',     '/assets/bubble1.png',  160, 105, 3);

    this.load.image(      'ball',       '/assets/boule.png');
    this.load.image(      'noammo',     '/assets/noammo.png');
    this.load.spritesheet('explosion',  '/assets/shot.png',     80, 80, 2);
    this.load.spritesheet('scoring',    '/assets/scoring.png',  80, 80, 5);
    this.load.spritesheet('cailloux',   '/assets/cailloux.png', 36, 66, 8);
    this.load.spritesheet('bullet',     '/assets/balle.png',    160, 20, 5);
    this.load.spritesheet('player',     '/assets/player.png',   196, 82, 35);
    this.load.spritesheet('people1',    '/assets/people1.png',  196, 82, 35);
    this.load.spritesheet('people2',    '/assets/people2.png',  196, 82, 35);
    this.load.spritesheet('people3',    '/assets/people3.png',  196, 82, 35);
    this.load.spritesheet('people4',    '/assets/people4.png',  196, 82, 35);

    this.load.audio('shootSound',       'sound/shoot.mp3');
    this.load.audio('mainSound',        'sound/Main.mp3');
    this.load.audio('toucheySound',     'sound/touchey.mp3');
    this.load.audio('loopSound',        'sound/Mainboucle.mp3');
    this.load.audio('splashSound',      'sound/splash.mp3');
    this.load.audio('gameOverSound',    'sound/gameover.mp3');
  },
  create: function () {
    this.state.start('Game');
  },
  update: function () {}
};
