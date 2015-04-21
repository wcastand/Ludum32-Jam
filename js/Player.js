var Player = function(game){
  Phaser.Sprite.call(this, game, game.width / 2 - 32, game.height - 195, 'player');
  this.game.physics.p2.enableBody(this, false);
  this.body.clearShapes();
  this.body.fixedRotation = true;
  this.body.setRectangle(50, 70, -70, 5);

  this.name = 'player';
  this.nb_cailloux = 5;
  this.nb_victimes = 0;
  this.is_typing   = false;
  this.speed       = 0;
  this.is_stun     = false;
  this.runAnim     = this.animations.add('run',    [0,1,2,3,4,5]);
  this.gunAnim     = this.animations.add('getGun', [7,8,9,10,11,12]);
  this.gunRun      = this.animations.add('gunRun', [14,15,16,17,18,19]);
  this.shoot       = this.animations.add('shoot',  [21,22,23,24,25,26,27]);
  this.stun        = this.animations.add('stun',   [28,29,30]);
  this.die         = this.animations.add('die',    [31,32,33,34]);

  this.gunAnim.onComplete.add(function() {
    this.animations.play('gunRun', 8, true);
  }, this);
  this.animations.play('run', 8, true);

  game.add.existing(this);
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(){
  if(this.is_stun)
    this.body.moveLeft(300);
}
