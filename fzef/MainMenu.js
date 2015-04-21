Lightmare.MainMenu = function (game) {
  this.music = null;
  this.playButton = null;
};
Lightmare.MainMenu.prototype = {
  create: function () {
    this.music = this.add.audio('bgmusic');
    this.music.play();
    this.add.sprite(0, 0, 'acceuil');
    this.playButton = this.add.button(275, 250, 'playbutton', this.startGame, this);
  },
  update: function () {},
  startGame: function (pointer) {
    this.music.stop();
    this.state.start('Game');
  }
};
