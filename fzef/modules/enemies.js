var Enemy = function(game, x , y){
  Phaser.Sprite.call(this, game, x, y, 'zombie');
  game.add.existing(this);
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.init = function(){
  this.anchor.setTo(.5,.5);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.body.bounce.y = settings.enemy.bounce;
  this.body.gravity.y = settings.mechanic.gravity;
  this.body.drag.setTo(settings.enemy.drag, 0);
  this.body.maxVelocity.setTo(settings.enemy.max_speed, settings.enemy.max_speed * 10);


  this.animations.add('idle', Phaser.Animation.generateFrameNames('Occurrence Idle ', 0, 24, '', 5), 24, false);
  this.animations.add('run', Phaser.Animation.generateFrameNames('Occurrence Personnage ', 0, 36, '', 5), 24, true);
};
Enemy.prototype.controls = function(player){
  var dist = this.x - player.x;

  var direction = dist && dist / Math.abs(dist);
  if ((Math.abs(dist) < player.lantern.radius && settings.isLight)
    /* && (Math.floor(dist) < -9 || Math.floor(dist) > 6)*/) {
    this.game.cri.play('',0,settings.sounds.cri,false,false);
  this.body.velocity.x = -direction * settings.enemy.acceleration;
  if (direction > 0){
    this.scale.set(1,1);
    this.body.setSize(24, 105, 15, 0);
    this.animations.play('run');
  }else{
    this.scale.set(-1,1);
    this.body.setSize(24, 105, -15, 0);
    this.animations.play('run');
  }
}else {
 this.body.velocity.x = 0;
 this.animations.play('idle');
}
};

var Bat = function(game, x , y){
  Phaser.Sprite.call(this, game, x, y, 'bat');
  game.add.existing(this);
};
Bat.prototype = Object.create(Phaser.Sprite.prototype);
Bat.prototype.constructor = Bat;

Bat.prototype.init = function(){
  this.anchor.setTo(.5,.5);
  this.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;
  this.body.bounce.y = settings.enemy.bounce;
  this.body.gravity.y = settings.mechanic.gravity;
  this.body.drag.setTo(settings.enemy.drag, 0);
  this.body.maxVelocity.setTo(settings.enemy.max_speed, settings.enemy.max_speed * 10);
  this.animations.add('run', Phaser.Animation.generateFrameNames('bat_mouvement_last', 0, 24, '', 4), 24, true);
  this.animations.play('run');
};
Bat.prototype.controls = function(player){
  var dist = this.x - player.x;
  var distY = this.y - player.y;
  var direction = dist && dist / Math.abs(dist);
  var directionY = distY && distY / Math.abs(distY);
  if (Math.abs(dist) < player.lantern.radius && settings.isLight) {
    this.game.csourie.play('',0,settings.sounds.csourie,false,false);
    this.game.aile.play('',0,settings.sounds.aile,true,false);
    this.body.velocity.x = -direction * 400;
    if (direction > 0){
      this.scale.set(1,1);
    }
    else{
      this.scale.set(-1,1);
    }
  }else{
    this.game.aile.stop();
    this.body.velocity.x = 0;
    if (Math.abs(distY) < player.lantern.radius && settings.isLight){
      this.body.velocity.y = -directionY * 250;
    }else{
      this.body.velocity.y = 0;
    }
  }
};
