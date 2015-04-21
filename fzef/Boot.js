var Lightmare = {};
Lightmare.Boot = function (game) {};
Lightmare.Boot.prototype = {
    init: function () {
        this.input.maxPointers = 1;
        if (this.game.device.desktop)
            this.scale.pageAlignHorizontally = true;
        else{
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
            this.scale.setScreenSize(true);
            this.scale.refresh();
        }
    },
    preload: function () {
        this.load.image('preloader_bg', './assets/img/preload_bg.jpg');
        this.load.image('preload_bar', './assets/img/preload_bar.jpg');
    },
    create: function () {
        this.state.start('Preloader');
    }
};
