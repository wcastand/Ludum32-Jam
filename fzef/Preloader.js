Lightmare.Preloader = function (game) {
  this.background = null;
  this.preloadBar = null;
  this.ready = false;
};
Lightmare.Preloader.prototype = {
  preload: function () {
    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar
    this.background = this.add.sprite(0, 0, 'preloader_bg');
    this.preloadBar = this.add.sprite(300, 215, 'preload_bar');
    this.load.setPreloadSprite(this.preloadBar);

    this.load.image('acceuil', './assets/img/acceuil.jpg');
    this.load.image('playbutton', './assets/img/playbutton.jpg');

    this.load.image('fearback', './assets/img/fearback.png');
    this.load.image('fearfront', './assets/img/fearfront.png');
    this.load.image('habillage', './assets/img/habillage.png');

    this.load.atlas('player', 'assets/img/Fille/fille.png', 'assets/img/Fille/fille.json');
    this.load.atlas('zombie', 'assets/img/Zombie/Zombie.png', 'assets/img/Zombie/Zombie.json');
    this.load.atlas('bat', 'assets/img/Bat/Bat.png', 'assets/img/Bat/Bat.json');
    this.load.image('trap', './assets/img/pics.png');

    //music
    this.load.audio('bgmusic', 'assets/audio/BGzik.mp3');
    this.load.audio('footstep', 'assets/audio/pas.mp3');
    this.load.audio('fear', 'assets/audio/peur.mp3');
    this.load.audio('onde', 'assets/audio/onde.mp3');
    this.load.audio('crepitement', 'assets/audio/crepitement.mp3');
    this.load.audio('lanterne', 'assets/audio/lanterne.mp3');
    this.load.audio('saut', 'assets/audio/saut.mp3');
    this.load.audio('reachground', 'assets/audio/atterrissage.mp3');
    this.load.audio('grognement', 'assets/audio/grognement.mp3');
    this.load.audio('csourie', 'assets/audio/csourie.mp3');
    this.load.audio('aile', 'assets/audio/aile.mp3');
    this.load.audio('cri', 'assets/audio/cri.mp3');
    this.load.audio('batlow', 'assets/audio/batlow.mp3');
    this.load.audio('bathigh', 'assets/audio/bathigh.mp3');

    //Touch Controls
    this.load.image('compass', 'assets/img/touch/compass_rose.png');
    this.load.image('touch_segment', 'assets/img/touch/touch_segment.png');
    this.load.image('touch', 'assets/img/touch/touch.png');
  },
  create: function () {
    this.preloadBar.cropEnabled = false;
  },
  update: function () {
    if (this.cache.isSoundDecoded('bgmusic') && this.ready == false){
      this.ready = true;
      this.state.start('MainMenu');
    }
  }
};
