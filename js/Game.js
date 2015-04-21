Blblbl.Game = function(game) {};
Blblbl.Game.prototype = {
  preload : function() {
    this.game.time.advancedTiming = true;
  },
  create : function() {
    this.ready = false;
    this.end   = false;
    this.game.stage.backgroundColor = 0x4488cc;

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.gravity.y = 400;
    this.game.physics.p2.restitution = .2;
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.updateBoundsCollisionGroup();

    this.playerG = this.game.physics.p2.createCollisionGroup();
    this.stoneG  = this.game.physics.p2.createCollisionGroup();
    this.ballG   = this.game.physics.p2.createCollisionGroup();
    this.personG = this.game.physics.p2.createCollisionGroup();
    this.groundG = this.game.physics.p2.createCollisionGroup();

    this.moutain = this.game.add.tileSprite(0, 0, 1800, this.game.cache.getImage('moutain').height, 'moutain');
    this.moutain.autoScroll(-50,0);
    this.the_ground = this.game.add.tileSprite(0, 0, 3600, this.game.cache.getImage('mur').height, 'mur');
    this.the_ground.autoScroll(-90,0);

    //GROUND
    var bmd = this.game.add.bitmapData(32,32);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0,0,32,32);
    bmd.ctx.fillStyle = 'rgba(0,0,0,0)';
    bmd.ctx.fill();
    this.ground = this.game.add.tileSprite(0, this.game.height - 130, 1900, 32, bmd);
    this.ground.name = 'ground';
    this.game.physics.p2.enableBody(this.ground, false);
    this.ground.body.setCollisionGroup(this.groundG);
    this.ground.body.collides([this.ballG, this.playerG, this.stoneG, this.personG]);
    this.ground.body.static = true;

    //BALL
    this.ball = new Ball(this.game, 0, this.game.height - 350);
    this.ball.visible = false;
    this.ball.body.setCollisionGroup(this.ballG);
    this.ball.body.collides([this.groundG, this.stoneG]);
    this.ball.body.createGroupCallback(this.stoneG, this.destroyCailloux, this);
    this.ballTimer = this.game.time.create(false);
    this.ballTimer.start();

    //PLAYER
    this.player = new Player(this.game);
    this.player.body.setCollisionGroup(this.playerG);
    this.player.body.collides([this.groundG]);
    this.player.stun.onComplete.add(function() {
      this.splashSound.play();
      this.player.animations.play('die', 8, false);
    }, this);
    this.player.shoot.onComplete.add(function(){
      var temp;
      temp = this.bullets.getFirstExists(false);
      if(!temp)
        temp = this.createBullet();
      temp.fire(this.player.position.x, this.player.position.y, this.player.target);
      this.player.target = null;
      this.player.animations.play('run', 8, true);
    }, this);
    this.player.die.onComplete.add(function(){
      this.end = true;
      this.resetOnDeath();
    }, this);

    //TOP
    this.the_top = this.game.add.tileSprite(0, 0, 3600, this.game.cache.getImage('top').height, 'top');
    this.the_top.autoScroll(-100,0);
    //BOT
    this.the_bot = this.game.add.tileSprite(0, 0, 3600, this.game.cache.getImage('bot').height, 'bot');
    this.the_bot.autoScroll(-100,0);

    //CAILLOUX
    this.caillouxx = this.game.add.group();
    this.createCailloux();

    this.caillouxTimer = this.game.time.create(false);
    this.caillouxTimer.start();
    this.caillouxTimer.add(this.game.rnd.realInRange(1000, 3500), this.createCailloux, this);
    this.revealCailloux();

    //PERSONS
    this.persons = this.game.add.group();
    this.createPerson();
    this.createPerson();
    this.revealPerson(0);
    this.revealPerson(1);
    //BULLET
    this.bullets = this.game.add.group();
    this.createBullet();
    //EXPLOSION
    this.explosions = this.game.add.group();
    //SCORING
    this.scorings = this.game.add.group();

    this.game.physics.p2.setPostBroadphaseCallback(this.checkOverlap, this);
    this.gameTimer = this.game.time.create(false);
    this.gameTimer.start();
    this.showTimer();

    this.tuto = this.game.add.sprite(0, 0, 'tuto');
    this.gameTimer.add(5000, function(){ this.tuto.destroy();this.ball.body.x = 0; this.ball.visible = true; }, this);


    this.bubble1 = this.game.add.sprite(330, 240, 'bubble1');
    this.bubble1.visible = false;
    this.gameTimer.add(randomRange(30000), this.randomCatch, this);

    this.noammo = this.game.add.sprite(365, 265, 'noammo');
    this.noammo.visible = false;

    this.title = this.game.add.sprite(450, 540, 'title');
    //BUTTON
    this.muteButton = this.game.add.button(250, 565, 'muteButton', this.muteSound, this);
    this.muteButton.anchor.setTo(.5,.5);
    this.muteButton.inputEnabled = true;
    this.muteButton.input.useHandCursor = true;

    this.initSound();

    this.game.input.keyboard.addCallbacks(this, null, function(e){
      e.preventDefault();
      if(e.keyCode >= 65 && e.keyCode <= 90 && this.player.nb_cailloux > 0){
        if(!this.player.is_typing && !this.player.target){
          this.persons.forEachExists(function(person){
            if(person.first.charAt(0) == String.fromCharCode(e.keyCode)){
              this.player.is_typing = true;
              this.player.animations.play('getGun', 8, false);
              this.player.target = this.persons.getChildIndex(person);
              this.attackPerson(person);
            }
          }, this);
        }
        else{
          var person = this.persons.getChildAt(this.player.target);
          if(person.first.charAt(0) == String.fromCharCode(e.keyCode))
            this.attackPerson(person);
        };
        return false;
      }
    }, null);
  },
  update : function() {
    var theTime = moment().startOf('day').seconds(this.gameTimer.seconds).format('mm:ss');
    this.gameTimerText.setText( theTime );
    this.caillouxText.setText("STONES : " + this.player.nb_cailloux);
    this.victimText.setText("VICTIMS : " + this.player.nb_victimes);
  },
  render : function (){
    //this.game.debug.text(this.game.time.fps || '--', 2, 14, "#fff");
  },
  initSound : function(){
    this.shootSound = this.game.add.audio('shootSound');
    this.mainSound = this.game.add.audio('mainSound');
    this.loopSound = this.game.add.audio('loopSound');
    this.toucheySound = this.game.add.audio('toucheySound');
    this.splashSound = this.game.add.audio('splashSound');
    this.gameOverSound = this.game.add.audio('gameOverSound');
    this.game.sound.setDecodedCallback([ this.shootSound, this.mainSound, this.loopSound, this.toucheySound, this.splashSound, this.gameOverSound ], function(){
      this.ready = true;
      this.mainSound.play('', 0, .2, false);
      this.mainSound.onStop.add(function(){
        if(!this.end)
          this.loopSound.play('', 0, .2, true);
      }, this);
    }, this);
  },
  muteSound : function(){
    this.game.sound.mute = !this.game.sound.mute;
  },
  randomCatch : function(){
    this.bubble1.visible = true;
    this.gameTimer.add(1000, function(){ this.bubble1.frame = randomRange(0,2);this.bubble1.visible = false; }, this);
    this.gameTimer.add(randomRange(15000,30000), this.randomCatch, this);
  },
  stunPerson : function(bullet, person){
    bullet.kill();
    person.animations.play('stunPeople', 6, false);
    this.toucheySound.play();
    person.die.onComplete.add(function(person) {
      var index = person.index;
      person.text.destroy();
      person.kill();
      this.revealPerson(index);
    }, this);
  },
  attackPerson : function (person) {
    person.first = person.first.slice(1);
    if(person.first.length == 0){
      this.player.nb_cailloux--;
      if(!this.player.nb_cailloux)
        this.noammo.visible = true;
      this.player.target = this.persons.getChildIndex(person);
      this.player.animations.play('shoot', 8, false);
      if(this.ready)
        this.shootSound.play();
    }
    person.text.fill = "red";
    person.text.setText(person.first);
  },
  revealPerson : function(index){
    var first = chance.first().toUpperCase();
    this.persons.forEachExists(function(person){
      while(person.first.charAt(0) == first.charAt(0) && person != temp){
        first = chance.first().toUpperCase();
      }
    });
    this.caillouxx.forEach(function(cailloux){
      while(String.fromCharCode(cailloux.letter) == first.charAt(0)){
        first = chance.first().toUpperCase();
      }
    });
    var temp;
    temp = this.persons.getFirstExists(false);
    if(!temp)
      temp = this.createPerson();
    temp.addOne( this.game.width + 100, this.game.height - 195, first, index);

    temp.body.setCollisionGroup(this.personG);
    temp.body.collides([this.groundG]);
    temp.group = this.personG;
  },
  revealCailloux : function () {
    var letter = randomRange(65,90);
    if(this.persons){
      this.persons.forEachExists(function(person){
        while(person.first.charAt(0) == String.fromCharCode(letter)){
          letter = randomRange(65,90);
        }
      });
    }
    var temp;
    temp = this.caillouxx.getFirstExists(false);
    if(!temp)
      temp = this.createCailloux();
    temp.addOne(letter);

    temp.body.setCollisionGroup(this.stoneG);
    temp.body.collides([this.groundG, this.ballG]);

    this.caillouxTimer.add( this.game.rnd.realInRange(2000, 5000), this.revealCailloux, this);
  },
  createBullet : function(){
    var temp = new Projectile(this.game);
    this.bullets.add(temp);
    return temp;
  },
  createCailloux : function(){
    var temp = new Cailloux(this.game);
    this.caillouxx.add(temp);
    return temp;
  },
  createPerson : function () {
    var temp = new Person(this.game);
    this.persons.add(temp);
    return temp;
  },
  destroyCailloux : function(source, target, shape_source, shape_target){
    target.sprite.kill();
    target.sprite.text.destroy();
  },
  checkOverlap : function(body1, body2){
    if(body1.sprite && body2.sprite){
      if((body1.sprite.name === 'ball' && body2.sprite.name === 'player') || (body1.sprite.name === 'player' && body2.sprite.name === 'ball')){
        var player = (body1.sprite.name === 'player') ? body1.sprite : body2.sprite;
        if(!player.is_stun){
          player.is_stun = true;
          player.animations.play('stun', 8, false);
        }
        return false;
      }
      if((body1.sprite.name === 'stone' && body2.sprite.name === 'player') || (body1.sprite.name === 'player' && body2.sprite.name === 'name')){
        var stone = (body1.sprite.name === 'stone') ? body1.sprite : body2.sprite;
        if(this.game.input.keyboard.isDown(stone.letter) && stone.no_pick){
          this.player.nb_cailloux++;
          this.noammo.visible = false;
          stone.no_pick = false;
          this.getScoring(stone.body.x, stone.body.y - 90);
          stone.animations.play('goAway', 8, false);
          return false;
        }
      }
      if((body1.sprite.name === 'ball' && body2.sprite.name === 'person') || (body1.sprite.name === 'person' && body2.sprite.name === 'ball')){
        var person = (body1.sprite.name === 'person') ? body1.sprite : body2.sprite;
        if(!person.is_dying){
          person.is_dying = true;
          person.animations.play('diePeople', 8, false);
          this.splashSound.play();
          this.player.nb_victimes++;
          this.ball.rolling = false;
          this.ballTimer.add(700, function(){ this.ball.rolling = true; }, this);
        }
        return false;
      }
      if((body1.sprite.name === 'bullet' && body2.sprite.name === 'person') || (body1.sprite.name === 'person' && body2.sprite.name === 'bullet')){
        var bullet = (body1.sprite.name === 'bullet') ? body1.sprite : body2.sprite;
        var person = (body1.sprite.name === 'person') ? body1.sprite : body2.sprite;
        if(bullet.target == this.persons.getChildIndex(person)){
          this.getExplosion(bullet.body.x + 66, bullet.body.y);
          bullet.kill();
          this.player.is_typing = false;
          this.stunPerson(bullet, person);
        }
        return false;
      }
    }
    return true;
  },
  getExplosion : function(x, y) {
    var explosion = this.explosions.getFirstDead();
    if (explosion === null) {
      explosion = this.game.add.sprite(0, 0, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
      var animation = explosion.animations.add('boom', null, 4, false);
      animation.killOnComplete = true;
      this.explosions.add(explosion);
    }
    explosion.revive();
    explosion.x = x;
    explosion.y = y;
    explosion.animations.play('boom');
    return explosion;
  },
  getScoring : function(x, y) {
    var scoring = this.scorings.getFirstDead();
    if (scoring === null) {
      scoring = this.game.add.sprite(0, 0, 'scoring');
      scoring.anchor.setTo(0.5, 0.5);
      var animation = scoring.animations.add('pop', null, 12, false);
      animation.killOnComplete = true;
      this.explosions.add(scoring);
    }
    scoring.revive();
    scoring.x = x;
    scoring.y = y;
    scoring.animations.play('pop');
    return scoring;
  },
  showTimer: function(){
    var theTime = moment().startOf('day').seconds(this.gameTimer.seconds).format('mm:ss');
    this.gameTimerText = this.game.add.text(20, this.game.height - 50, theTime);
    this.gameTimerText.fill = '#eca700';
    this.gameTimerText.font = 'Chewy';
    this.gameTimerText.fontSize = 25;

    this.caillouxText = this.game.add.text(this.game.width - 20, this.game.height - 35, "STONES : " + this.player.nb_cailloux);
    this.caillouxText.fill = '#eca700';
    this.caillouxText.anchor.setTo(1,0);
    this.caillouxText.cssFont = 'normal 25px Chewy';

    this.victimText = this.game.add.text(this.game.width - 20, this.game.height - 70, "VICTIMS : " + this.player.nb_victimes);
    this.victimText.fill = '#eca700';
    this.victimText.anchor.setTo(1,0);
    this.victimText.cssFont = 'normal 25px Chewy';
  },
  resetOnDeath : function(){
    var score = this.gameTimer.seconds;
    this.mainSound.stop();
    this.loopSound.stop();
    this.gameOverSound.play();
    this.state.start('ScoreMenu', true, false, score, this.player.nb_victimes);
  }
};
