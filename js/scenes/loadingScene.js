// create a new scene
let loadingScene = new Phaser.Scene('Loading');

// load asset files for our game
loadingScene.preload = function() {
    
    // show logo
    let logo = this.add.sprite(this.sys.game.config.width / 2, 250, 'pet', 0).setScale(0.6)

    // progress bar background
    const bgBar = this.add.graphics();
    const barW = 200;
    const barH = 30;

    bgBar.setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2)
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0, 0, barW, barH);

    // progress bar
    const progressBar = this.add.graphics();
    progressBar.setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2)

    // listen to progress event
    this.load.on('progress', function(value) {
        // clear progress bar and draw rectangle
        progressBar.clear();
        progressBar.fillStyle(0x9AD98D, 1);
        progressBar.fillRect(0, 0, barW * value, barH)

        if (value > 0.75) {
            logo.destroy();
            logo = this.add.sprite(this.sys.game.config.width / 2, 250, 'pet', 3).setScale(0.6);
        } else if (value > 0.5) {
            logo.destroy();
            logo = this.add.sprite(this.sys.game.config.width / 2, 250, 'pet', 2).setScale(0.6);
        } else if (value > 0.25) {
            logo.destroy();
            logo = this.add.sprite(this.sys.game.config.width / 2, 250, 'pet', 1).setScale(0.6);
        }
    }, this);

    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');
    this.load.image('potion', 'assets/images/potion.png');
  
    // load spritesheet
    this.load.spritesheet('pet', 'assets/images/pet.png', {
      frameWidth: 97,
      frameHeight: 83,
      margin: 1,
      spacing: 1
    });

    // PROGRESS BAR TESTING ONLY
    for (let i = 0; i < 312; i++) {
        this.load.image(`test${i}`, 'assets/images/pet.png')
    }
};


loadingScene.create = function() {
    // pet animation
    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0 // to repeat infinitly: -1
    });

    this.scene.start('Home');
}