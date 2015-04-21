Lightmare.Game = function (game) {
	this.player;
	this.layers;
	this.bg = new Array();
	this.enemies;
	this.traps;
	this.fx;
	this.platforms;
	this.music;
	this.levelData;
	this.light;
};
Lightmare.Game.prototype =  {
	preload: function() {
		this.game.load.pack('level', 'assets/levels/one/pack.json', null, this);
	},
	create: function() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.startSystem(Phaser.Physics.P2JS);

		this.levelData = this.game.cache.getJSON('levelData');
		this.layers = this.game.add.group();

		this.mapGenerator();
		this.initSound();

		this.game.touchControl = this.game.plugins.add(Phaser.Plugin.TouchControl);
		this.game.touchControl.inputEnable();

		this.player = new Player(this.game);
		this.player.init();
		this.layers.add(this.player);
		this.layers.add(this.ground);
		this.layers.add(this.enemies);
		this.layers.add(this.traps);
		this.layers.add(this.platforms);

		this.ground.z = 7;
		this.platforms.z = 8;
		this.enemies.z = 9;
		this.traps.z = 10;
		this.player.z = 11;

		this.layers.sort();
		this.game.physics.p2.enable(this.player);
		this.game.camera.follow(this.player);

		var lantern = new Light(this.game, this.shadowTexture, 50);
		lantern.init(this.player.x, this.player.y);
		this.player.addLantern(lantern);

		this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
		this.initHud();
		this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		//this.game.input.onDown.add(this.fullScreen, this);
	},
	mapGenerator: function(){
		this.game.world.setBounds(0, 0, this.levelData.scene.width, this.levelData.scene.height);
		this.shadowTexture = this.game.add.bitmapData( this.levelData.scene.width,  this.levelData.scene.height);

		var assets = this.levelData.scene.assets;
		var enemies = this.levelData.enemies;
		var platformes = this.levelData.platforms;
		var traps = this.levelData.traps;
		var that = this;

		this.enemies = this.game.add.group();
		this.platforms = this.game.add.group();
		this.traps = this.game.add.group();

		this.platforms.enableBody = true;

		assets.forEach(function(asset, index, array){
			var temp = that.game.add.tileSprite(0, 0, that.levelData.scene.width,  that.levelData.scene.height, asset.id);
			that.layers.add(temp);
			temp.z = asset.z;
			if(asset.type == 2)
				temp.autoScroll(asset.autoscroll,0);
			else if(asset.type == 1)
				that.bg.push(temp);
		});
		enemies.forEach(function(enemy, index, array){
			var temp;
			if(enemy.type == 1)
				temp = new Enemy(that.game, enemy.x, that.game.height - enemy.y);
			else
				temp = new Bat(that.game, enemy.x, that.game.height - enemy.y);
			temp.init();
			that.enemies.add(temp);
		});
		platformes.forEach(function(platform, index, array){
			var temp;
			if(platform.type == 1)
				temp = new Platform(that.game, platform.x, platform.y);
			temp.init();
			that.platforms.add(temp);
		});
		traps.forEach(function(trap, index, array){
			var temp;
			if(trap.type == 1)
				temp = new Trap(that.game, trap.x, that.game.height - trap.y);
			temp.init();
			that.traps.add(temp);
		});

		var bmd = this.game.add.bitmapData(20,20);
		bmd.ctx.beginPath();
		bmd.ctx.rect(0,0,20,20);
		bmd.ctx.fillStyle = '#000';
		bmd.ctx.fill();
		this.ground = this.game.add.tileSprite(0, that.levelData.scene.height - 20,
			that.levelData.scene.width,  that.levelData.scene.height, bmd);
		this.game.physics.arcade.enable(this.ground);
		this.ground.enableBody = true;
		this.ground.body.immovable = true;
	},
	initSound: function(){
		this.music = this.game.add.audio('bgmusic',1,true);
		this.music.play('',0,settings.sounds.bgmusic,true);
		this.game.foot = this.game.add.audio('footstep',1,false);
		this.game.fear = this.game.add.audio('fear',1,false);
		this.game.onde = this.game.add.audio('onde',1,false);
		this.game.crepitement = this.game.add.audio('crepitement',1,false);
		this.game.lantern = this.game.add.audio('lanterne',1,false);
		this.game.saut = this.game.add.audio('saut',1,false);
		this.game.reachground = this.game.add.audio('reachground',1,false);
		this.game.grognement = this.game.add.audio('grognement',1,false);
		this.game.cri = this.game.add.audio('cri',1,false);
		this.game.csourie = this.game.add.audio('csourie',1,false);
		this.game.aile = this.game.add.audio('aile',1,false);
		this.game.bathigh = this.game.add.audio('bathigh',1,false);
		this.game.batlow = this.game.add.audio('batlow',1,false);
	},
	initHud: function(){
		this.fear = 0;
		this.forcelight = false;
		this.sensshock = settings.hud.shock;

		this.habillage = this.game.add.sprite(settings.hud.posx, settings.hud.posy, 'habillage');
		this.habillage.fixedToCamera = true;

		this.fearback = this.game.add.sprite(settings.hud.posx, settings.hud.posy, 'fearback');
		this.fearback.fixedToCamera = true;

		this.fearfront = this.game.add.sprite(settings.hud.posx, settings.hud.posy+32, 'fearfront');
		this.fearfront.fixedToCamera = true;
	},
	collision: function() {
		this.game.physics.arcade.collide(this.player, this.ground);
		this.game.physics.arcade.collide(this.player, this.platforms);
		this.game.physics.arcade.collide(this.enemies, this.ground);
		this.game.physics.arcade.collide(this.enemies, this.platforms);
		this.game.physics.arcade.collide(this.enemies, this.player, this.quitGame, null, this.game);
		this.game.physics.arcade.collide(this.traps, this.player, this.quitGame, null, this.game);
	},
	update: function() {
		var that = this;
		var rand_sound = Math.floor(Math.random() * 1500);
		if(rand_sound == 100)
			this.game.onde.play('',0,settings.sounds.onde,false,false);
		if(rand_sound == 200)
			this.game.fear.play('',0,settings.sounds.fear,false,false);
		if(rand_sound == 300)
			this.game.grognement.play('',0,settings.sounds.grognement,false,false);

		this.collision();
		this.player.controls();
		this.parralax();
		this.enemies.forEach(function(enemy) { enemy.controls(that.player);	});
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
			if(!settings.isLight)
				this.game.lantern.play('',0,settings.sounds.light,false,false);
			settings.isLight = true;
			this.game.crepitement.play('',0,settings.sounds.crepitement,true,false);
		}else{
			if(this.forcelight == false){
				this.game.crepitement.stop();
				settings.isLight = false;
			}
		}
		if(settings.isLight)
			this.player.lantern.setRadius(settings.lantern.radius.on);
		else
			this.player.lantern.setRadius(settings.lantern.radius.off);
		this.updateShadowTexture();

	//hud
	if (settings.isLight == true){
		if(this.fear <= 0){
			this.fear = 0;
			if(this.forcelight){
				this.forcelight = false;
				settings.isLight = false;
			}
		}else{
			this.fear -= settings.fear.heal;
		}
	}else{
		if(this.fear < 200)
			this.fear += settings.fear.dot;
		else{
			this.fear = 200;
			this.forcelight = true;
		}
	}

	if(this.forcelight)
		settings.isLight = true;

	var cropRect = new Phaser.Rectangle(0, 0, this.fear, 10);
	this.fearfront.crop(cropRect);

	if(this.fear > settings.hud.shockval || this.forcelight == true){
		this.game.bathigh.play('',0,settings.sounds.bathigh,true,false);
		this.habillage.cameraOffset.y += this.sensshock;
		this.fearback.cameraOffset.y += this.sensshock;
		this.fearfront.cameraOffset.y += this.sensshock;
		this.player.y += this.sensshock+1;
		this.sensshock = -this.sensshock;
	}

	if(this.fear < settings.hud.shockval)
		this.game.bathigh.stop();
	this.layers.sort('z', Phaser.Group.SORT_ASCENDING);
},
updateShadowTexture: function() {
	this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
	this.shadowTexture.context.fillRect(0, 0, this.levelData.scene.width, this.levelData.scene.height);
	this.lights.forEach(function(light) {
		var radius = light.radius + this.game.rnd.integerInRange(1,settings.lantern.radius.random);

		var gradient =
		this.shadowTexture.context.createRadialGradient(
			light.graphics.x, light.graphics.y,light.radius * .1,
			light.graphics.x, light.graphics.y, radius);
		gradient.addColorStop(0, 'rgba(255,255,255,1)');
		gradient.addColorStop(.8, 'rgba(249,195,32,.2)');
		gradient.addColorStop(.95, 'rgba(249,195,32,.1)');
		gradient.addColorStop(1, 'rgba(249,195,32,.1)');

		this.shadowTexture.context.beginPath();
		this.shadowTexture.context.fillStyle = gradient;
		this.shadowTexture.context.arc(light.graphics.x, light.graphics.y, radius, 0, Math.PI*2);
		this.shadowTexture.context.fill();
	}, this);

	this.shadowTexture.dirty = true;
},
fullScreen: function(){
	if (this.game.scale.isFullScreen)
		this.game.scale.stopFullScreen();
	else
		this.game.scale.startFullScreen(false);
},
parralax: function() {
	if(this.player.leftInputIsActive()){
		this.bg.forEach(function(asset, index, array){
			asset.tilePosition.x += asset.z * 1.5;
		});
	}
	else if(this.player.rightInputIsActive()){
		this.bg.forEach(function(asset, index, array){
			asset.tilePosition.x -= asset.z * 1.5;
		});
	}
},
quitGame: function (pointer) {
		//  Here you should destroy anything you no longer need.
		//  Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//  Then let's go back to the main menu.
		this.state.start('MainMenu');
	}
}
