var Cailloux = function(game, x, y){
  Phaser.Sprite.call(this, game, x, y, 'cailloux');
  this.game.physics.p2.enableBody(this, false);
  this.body.setRectangle(36,20,0,22);
  this.body.fixedRotation = true;
  this.body.collideWorldBounds = false;

  this.name    = 'stone';
  this.speed   = 100;
  this.exists  = false;
  this.letter  = "";
  this.no_pick = true;

  this.text = new Phaser.Text(game, 0, 0, "z", {'fill': "#fff"});
  this.play = this.animations.add('play', [0,1,2,3], 6, true);
  this.goAway = this.animations.add('goAway', [4,5,6,7], 6, true);
  this.goAway.onComplete.add(function(){
    this.text.destroy();
    this.kill();
  }, this);
};
Cailloux.prototype = Object.create(Phaser.Sprite.prototype);
Cailloux.prototype.constructor = Cailloux;

Cailloux.prototype.update = function(){
  this.body.moveLeft(this.speed);
  this.text.position.x = this.position.x - 6;
}
Cailloux.prototype.addOne = function(letter){
  this.reset(this.game.width + 25, this.game.height - 180);

  this.body.setRectangle(36,20,0,22);
  this.body.fixedRotation = true;

  this.text = this.game.add.text(this.text);
  this.text.reset(this.position.x - 6, this.position.y + 35);
  this.text.setText(String.fromCharCode(letter));
  this.text.cssFont = 'normal 25px Chewy';
  this.text.fill = "#fff";

  this.letter  = letter;
  this.no_pick = true;

  this.animations.play('play', 6, true);
  return this;
}
