var Person = function(game){
  Phaser.Sprite.call(this, game, 0, 0, 'people'+randomRange(1,4));
  this.game.physics.p2.enableBody(this, false);
  this.body.clearShapes();
  this.body.fixedRotation = true;
  this.body.setRectangle(50, 82, -70, 0);
  this.body.collideWorldBounds = false;

  this.name        = 'person';
  this.first       = chance.first().toUpperCase();
  this.speed       = randomRange(30, 60);
  this.is_stun     = false;
  this.is_dying    = false;
  this.exists      = false;
  this.minRange    = game.width - randomRange(50, 150);
  this.anchor.set(0.5);

  this.runAnim     = this.animations.add('runPeople',    [0,1,2,3,4,5]);
  this.gunAnim     = this.animations.add('getGunPeople', [7,8,9,10,11,12]);
  this.gunRun      = this.animations.add('gunRunPeople', [14,15,16,17,18,19]);
  this.shoot       = this.animations.add('shootPeople',  [21,22,23,24,25,26,27]);
  this.stun        = this.animations.add('stunPeople',   [28,29,30]);
  this.die         = this.animations.add('diePeople',    [31,32,33,34]);

  this.text = new Phaser.Text(game, 0, 0, this.first, {'fill': "#fff"});

  this.gunAnim.onComplete.add(function() {
    this.animations.play('gunRunPeople', 8, true);
  }, this);
  this.stun.onComplete.add(function() {
    this.is_stun = true;
    this.body.setRectangle(60, 20, 0, 30);
    this.body.setCollisionGroup(this.group);
  }, this);
};
Person.prototype = Object.create(Phaser.Sprite.prototype);
Person.prototype.constructor = Person;
Person.prototype.update = function(){
  if(!this.is_stun){
    if(this.position.x < this.minRange){
      this.body.moveRight(randomRange(110, 200));
    }
    else if(this.position.x >= this.game.width - 20){
      this.body.moveLeft(randomRange(110, 200));
    }
  }
  else
    this.body.moveLeft(500);
  this.text.position.x = this.position.x - 80;
}

Person.prototype.addOne = function(x, y, first, index){
  this.reset(x, y);
  this.first    = first;
  this.index    = index;
  this.is_stun  = false;
  this.is_dying = false;
  this.loadTexture('people'+randomRange(1,4));

  this.body.clearShapes();
  this.body.fixedRotation = true;
  this.body.setRectangle(50, 70, -70, 5);

  this.text = this.game.add.text(this.text);
  this.text.reset(x -16, y + 80 + ((index%2?1:-1)*10));
  this.text.setText(this.first);
  this.text.cssFont = 'normal 20px Chewy';
  this.text.fill = "#fff";
  this.animations.play('runPeople', 8, true);
  return this;
}
