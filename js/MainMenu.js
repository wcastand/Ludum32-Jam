Blblbl.MainMenu = function (game) {
  this.playButton = null;
};
Blblbl.MainMenu.prototype = {
  create: function () {
    this.add.sprite(0, 0, 'acceuil');
    this.playButton = this.add.button(50, 280, 'playbutton', this.startGame, this);
  },
  update: function () {},
  startGame: function (pointer) {
  }
};
