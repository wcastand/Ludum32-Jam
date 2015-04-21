var Projectile = function(game){
  Phaser.Sprite.call(this, game, 0, 0, 'bullet');
  this.game.physics.p2.enableBody(this, false);
  this.body.allowGravity     = false;
  this.body.checkWorldBounds = true;
  this.body.outOfBoundsKill  = true;
  this.body.clearShapes();
  this.body.setRectangle(20, 20, 70, 0);
  this.body.collideWorldBounds = false;
  this.outOfBoundsKill = true;
  this.checkWorldBounds = true;

  this.name = 'bullet';
  this.speed = 700;
  this.anchor.set(0.5);
  this.exists = false;

  this.playAnim = this.animations.add('play', null, 8, false);
};
Projectile.prototype = Object.create(Phaser.Sprite.prototype);
Projectile.prototype.constructor = Projectile;

Projectile.prototype.update = function(){
  this.body.setZeroVelocity();
  this.body.moveRight(this.speed);
}
Projectile.prototype.fire = function(x, y, target){
  this.reset(x, y);
  this.target = target;
  this.animations.play('play', 8, false);
}
