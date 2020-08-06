// create a new scene
let homeScene = new Phaser.Scene('Home');

homeScene.create = function() {
    // game background, with active input
    let bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();
    
    const gameW = this.sys.game.config.width;
    const gameH = this.sys.game.config.height;

    // welcome text
    const text = this.add.text(gameW / 2 + 24, gameH / 2 + 48, "VIRTUAL PET", {
        font: '42px Quicksand',
        fill: '#ffffff',
        strokeThickness: 3,
    });
    text.setOrigin(0.5);
    text.depth = 1;

    // text background
    const textBG = this.add.graphics();
    textBG.fillStyle(0x000000, 0.3);
    textBG.fillRect((gameW / 2 - text.width / 2) - 4, (gameH / 2 - text.height / 2) + 48, text.width + 48, text.height - 10)

    bg.on('pointerdown', function() {
        this.scene.start('Game');
    }, this);
};