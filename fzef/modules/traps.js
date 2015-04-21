var Trap = function(game, x , y){
    Phaser.Sprite.call(this, game, x, y, 'trap');
    game.add.existing(this);
};
Trap.prototype = Object.create(Phaser.Sprite.prototype);
Trap.prototype.constructor = Trap;

Trap.prototype.init = function(){
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.immovable = true;
};