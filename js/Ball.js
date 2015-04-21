var Ball = function(game, x, y){
  Phaser.Sprite.call(this, game, x, y, 'ball');
  this.game.physics.p2.enableBody(this, false);

  this.name = 'ball';
  this.speed = 15;
  this.rolling = true;
  this.body.setCircle(130, 0, 0, 0);
  this.body.collideWorldBounds = false;

  game.add.existing(this);
};
Ball.prototype = Object.create(Phaser.Sprite.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.update = function(){
  if(this.rolling){
    this.body.moveRight(this.speed);
    this.body.fixedRotation = false;
    this.body.rotation += .008;
  }
  else if(!this.rolling && this.body.x > -300){
    this.body.setZeroVelocity();
    this.body.setZeroRotation();
    this.body.moveLeft(80);
    this.body.rotation += .002;
  }
  else
    this.body.moveRight(0);
}
