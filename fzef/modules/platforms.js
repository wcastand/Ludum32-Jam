var Platform = function(game, x, y){
    Phaser.Sprite.call(this, game, x, y);
    game.add.existing(this);
    this.visual;
};
Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

Platform.prototype.init = function(){
    this.visual = this.game.add.sprite(this.x, this.y - 25, 'plateforme_type_1');
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.checkCollision.down = false;
    this.body.checkCollision.left = false;
	this.body.checkCollision.right = false;
    this.body.immovable = true;
    this.width = this.visual.width;
    this.height = 15;
};
