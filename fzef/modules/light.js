var Light = function(game){
    this.lights;
    Phaser.BitmapData.call(this, game, this.game.width, this.game.height);
    game.add.existing(this);
};

Light.prototype = Object.create(Phaser.BitmapData.prototype);
Light.prototype.constructor = Light;

Light.prototype.init = function(){
    this.lights = this.game.add.group();

    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.strokeStyle = 'rgb(255, 255, 255)';
};

Light.prototype.update = function(){
    // get cursor location
    this.cursor.x = this.game.input.activePointer.x;
    this.cursor.y = this.game.input.activePointer.y;

    this.context.fillStyle = 'rgb(100, 100, 100)';
    this.context.fillRect(0, 0, this.game.width, this.game.height);
}
