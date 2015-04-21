var Player = function(game){
    Phaser.Sprite.call(this, game, 32, game.height - 150, 'player');
    game.add.existing(this);
    this.lantern;
    this.inAir = false;
    this.controlKey = {};
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.init = function(){
    this.anchor.setTo(0.5,0.5);
    this.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.body.maxVelocity.setTo(settings.player.max_speed, settings.player.max_speed * 10);
    this.body.drag.setTo(settings.player.drag, 0);
    this.body.gravity.y = settings.mechanic.gravity;
    this.body.bounce.y = settings.player.bounce;
    this.canVariableJump = true;
    this.justJumped = false;

    this.animations.add('fall', Phaser.Animation.generateFrameNames('Occurrence Fall ', 0, 6, '', 5), 24, false);
    this.animations.add('jump', Phaser.Animation.generateFrameNames('Occurrence Idle ', 0, 9, '', 5), 24, false);
    this.animations.add('idle', Phaser.Animation.generateFrameNames('Occurrence Jump ', 0, 59, '', 5), 24, true);
    this.animations.add('reception', Phaser.Animation.generateFrameNames('Occurrence Recept ', 0, 15, '', 5), 24, false);
    this.animations.add('run', Phaser.Animation.generateFrameNames('Occurrence Run ', 0, 19, '', 5), 24, true);
    this.animations.play('idle');

    this.createControls();
};
Player.prototype.createControls = function(){
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.Q, Phaser.Keyboard.D, Phaser.Keyboard.Z]);

    this.controlKey.q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
    this.controlKey.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.controlKey.z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.controlKey.right = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.controlKey.left = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.controlKey.up = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
};
Player.prototype.addLantern = function(lantern){
    this.lantern = lantern;
    this.lantern.graphics.x = this.x;
    this.lantern.graphics.y = this.y;
};
Player.prototype.controls = function(){
    var onTheGround = this.body.touching.down;
    if(this.leftInputIsActive()){
        this.body.acceleration.x = -settings.player.acceleration;
        this.body.setSize(24, 80, -15, 0);
        this.scale.set(-1, 1);
        if(onTheGround){
            this.animations.play('run');
            this.game.foot.play('',0,settings.sounds.foot,false,false);
        }
    }
    else if(this.rightInputIsActive()){
        this.body.acceleration.x = settings.player.acceleration;
        this.body.setSize(24, 80, 15, 0);
        this.scale.set(1, 1);
        if(onTheGround){
            this.animations.play('run');
            this.game.foot.play('',0,settings.sounds.foot,false,false);
        }
    }
    else{
        this.body.velocity.x = 0;
        this.body.acceleration.x = 0;
    }

    if(onTheGround && !this.body.velocity.x) this.animations.play('idle');

    //JUMP
    if(onTheGround) this.jumpAmount = 0;
    if(this.upInputIsActive() && this.jumpAmount < 10){
        this.jumpAmount++;
        this.body.velocity.y = settings.player.jump_speed;
        this.canVariableJump = true;
        this.animations.play('jump');
        this.game.saut.play('',0,settings.sounds.saut,false,false);
        this.justJumped = true;
    }
    if(this.body.velocity.y > 100)
        this.animations.play('reception');
    else if(this.justJumped && onTheGround){
        this.justJumped = false;
        this.game.reachground.play('',0,settings.sounds.reachground,false,false);
    }

    this.lantern.graphics.x = this.x;
    this.lantern.graphics.y = this.y;
};
Player.prototype.leftInputIsActive = function() {
    var isActive = false;
    isActive = (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.game.touchControl.cursors.left);
    // isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x < this.game.width/4);
    return isActive;
};
Player.prototype.rightInputIsActive = function() {
    var isActive = false;
    isActive = (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.game.input.keyboard.isDown(Phaser.Keyboard.D) || this.game.touchControl.cursors.right);
    // isActive |= (this.game.input.activePointer.isDown && this.game.input.activePointer.x > this.game.width/2 + this.game.width/4);
    return isActive;
};
Player.prototype.upInputIsActive = function() {
    var isActive = false;
    isActive = (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.game.input.keyboard.isDown(Phaser.Keyboard.Z) || this.game.touchControl.cursors.up);
    // isActive |= (this.game.input.activePointer.justPressed(duration + 1000/60) && this.game.input.activePointer.x > this.game.width/4 && this.game.input.activePointer.x < this.game.width/2 + this.game.width/4);
    return isActive;
};
