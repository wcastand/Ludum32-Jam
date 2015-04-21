Blblbl.ScoreMenu = function (game) {};
Blblbl.ScoreMenu.prototype = {
  init: function(score, victimes){
    this.score = score;
    this.highScore = localStorage.getItem('highScore') | 0;
    if(this.score > this.highScore)
      localStorage.setItem("highScore", this.score);
    this.victimes = victimes | 0;
  },
  create: function () {
    var theTime = moment().startOf('day').seconds(this.score).format('mm:ss');
    var highTime = moment().startOf('day').seconds(this.highScore).format('mm:ss');
    this.add.sprite(0, 0, 'ecranScore');

    this.scoreText = this.add.text(450, 200, 'You lasted : ' + theTime);
    this.scoreText.anchor.setTo(.5,.5);
    this.scoreText.fill = '#FFF';
    this.scoreText.font = 'Chewy';
    this.scoreText.fontSize = 60;

    this.highScoreText = this.add.text(450, 300, 'High score : ' + highTime);
    this.highScoreText.anchor.setTo(.5,.5);
    this.highScoreText.fill = '#FFF';
    this.highScoreText.font = 'Chewy';
    this.highScoreText.fontSize = 30;

    this.victimText = this.add.text(450, 380, 'Your victims : '+this.victimes);
    this.victimText.anchor.setTo(.5,.5);
    this.victimText.fill = '#FFF';
    this.victimText.font = 'Chewy';
    this.victimText.fontSize = 30;

    this.replayButton = this.add.button(750, 550, 'replayButton', this.restartGame, this);
    this.replayButton.inputEnabled = true;
    this.replayButton.input.useHandCursor = true;
    this.replayButton.anchor.setTo(.5,.5);
  },
  update: function () {},
  restartGame: function (pointer) {
    this.state.start('Game');
  }
};
