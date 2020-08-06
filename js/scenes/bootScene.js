// create a new scene
let bootScene = new Phaser.Scene('Boot');

bootScene.preload = function() {
    // load spritesheet
    this.load.spritesheet('pet', 'assets/images/pet.png', {
        frameWidth: 97,
        frameHeight: 83,
        margin: 1,
        spacing: 1
    });
};


bootScene.create = function() {
    this.scene.start('Loading');
};