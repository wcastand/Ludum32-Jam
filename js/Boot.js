var Blblbl = {};
Blblbl.Boot = function (game) {};
Blblbl.Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        if (this.game.device.desktop)
            this.scale.pageAlignHorizontally = true;
        else{
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }
    },
    preload: function () {
        this.game.load.image("loading","assets/loading.png");
    },
    create: function () {
        this.state.start('Preloader');
    }
};
