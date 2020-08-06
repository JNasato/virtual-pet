// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {
    // game stats
    this.stats = {
        health: 100,
        fun: 100
    }

    // decay parameters
    this.decayRates = {
        health: -5,
        fun: -2
    }
};


// executed once, after assets were loaded
gameScene.create = function () {
    // game background
    this.bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    // event listener for the background
    this.bg.on('pointerdown', this.placeItem, this);

    this.pet = this.add.sprite(240, 200, 'pet', 0).setInteractive();

    // make pet draggable and follow pointer
    this.input.setDraggable(this.pet);
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    // create user interface
    this.createUI();

    // show stats to user
    this.createHUD();
    this.refreshHUD();

    // decay of health and fun over time
    this.timeEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callbackScope: this,
        callback: function () {
            // update stats
            this.updateStats(this.decayRates);
        }
    });
};


// create UI
gameScene.createUI = function () {
    // buttons
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.customStats = { health: 20, fun: -5 }
    this.appleBtn.on('pointerdown', this.pickItem);

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.customStats = { health: -10, fun: 10 }
    this.candyBtn.on('pointerdown', this.pickItem);

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.customStats = { health: 0, fun: 15 }
    this.toyBtn.on('pointerdown', this.pickItem);

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    this.rotateBtn.customStats = { health: 0, fun: 20 }
    this.rotateBtn.on('pointerdown', this.rotatePet);
    
    this.potionBtn = this.add.sprite(this.sys.game.config.width / 2, 480, 'potion').setInteractive();
    this.potionBtn.alpha = 0;
    this.potionBtn.customStats = { health: 100, fun: -100 }
    this.potionBtn.on('pointerdown', this.pickItem);

    // array with all buttons
    this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];
    // UI starts unblocked
    this.uiBlocked = false;

    // refresh UI
    this.uiReady();
};


// rotate pet
gameScene.rotatePet = function () {
    // UI can't be blocked to rotate the pet
    if (this.scene.uiBlocked) return;
    this.scene.uiReady();

    // block the UI
    this.scene.uiBlocked = true;
    this.alpha = 0.5;

    // rotation tween
    let rotateTween = this.scene.tweens.add({
        targets: this.scene.pet,
        duration: 720,
        angle: 720,
        pause: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            // update stats
            this.scene.updateStats(this.customStats);

            // clear UI 
            this.scene.uiReady();
        }
    })
};


// pick an item
gameScene.pickItem = function () {
    // UI can't be blocked to select an item
    if (this.scene.uiBlocked) return;
    this.scene.uiReady();

    // select item
    this.scene.selectedItem = this;

    // change transparency
    this.alpha = 0.5;

    console.log(`picked the ${this.texture.key}`)
};


// set UI to "ready"
gameScene.uiReady = function () {
    // nothing is being selected
    this.selectedItem = null;

    // set all buttons to alpha: 1
    for (let button of this.buttons) {
        button.alpha = 1;
    }

    this.potionBtn.alpha = 0;

    this.uiBlocked = false;
};


// place new item on game
gameScene.placeItem = function (pointer, localX, localY) {
    // check that item was selected and UI unblocked
    if (!this.selectedItem || this.uiBlocked) return;

    // create new item in the position
    const newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

    // block UI
    this.uiBlocked = true;

    // pet movement (tween)
    let petTween = this.tweens.add({
        targets: this.pet,
        duration: 540,
        x: newItem.x,
        y: newItem.y,
        pause: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            // destroy item
            newItem.destroy();

            // event listener for animation end
            this.pet.on('animationcomplete', function () {
                // set pet back to neutral frame
                this.pet.setFrame(0);

                // clear UI 
                this.uiReady();
            }, this);

            // play spritesheet animation
            this.pet.play('funnyfaces');

            // update stats
            this.updateStats(this.selectedItem.customStats);
        }
    });
};


// create the text elements to show the stats
gameScene.createHUD = function () {
    // health stat
    this.healthText = this.add.text(20, 20, `Health: `, {
        font: '24px Quicksand',
        fill: '#ffffff',
        strokeThickness: 1.5
    });
    // health stat
    this.funText = this.add.text(20, 60, `Fun: `, {
        font: '24px Quicksand',
        fill: '#ffffff',
        strokeThickness: 1.5
    });
};


// show the current value of the stats
gameScene.refreshHUD = function () {
    this.healthText.setText(`Health: ${this.stats.health}`);
    this.funText.setText(`Fun: ${this.stats.fun}`);
}


// stat updater
gameScene.updateStats = function (statDiff) {
    // flag for game over state
    let isGameOver = false;

    if (this.stats.health <= 20 || this.stats.fun > 300) {
        this.potionBtn.alpha = 1;
    }

    // change pet stats
    for (stat in statDiff) {
        if (statDiff.hasOwnProperty(stat)) {
            this.stats[stat] += statDiff[stat];

            // stats can't go below zero
            if (this.stats[stat] < 0) {
                isGameOver = true;
                this.stats[stat] = 0;
            }
        }
    }
    // refresh HUD
    this.refreshHUD();

    // check for game over flag
    if (isGameOver) this.gameOver();
}


gameScene.gameOver = function () {
    // block UI
    this.uiBlocked = true;

    // change pet frame
    this.pet.setFrame(4);

    // darken bg 
    const rect = this.add.graphics().fillStyle(0x000000, 1).fillRect(0, 0, this.sys.game.config.width, this.sys.game.config.height)
    rect.depth = -1;
    this.bg.alpha = 0.4;

    let deathText = this.add.text(40, this.sys.game.config.height - 40, '', {
        font: '18px Quicksand',
        fill: '#ffffff'
    });

    if (this.stats.health === 0) {
        deathText.setText('Your pet starved to death.');
    } else if (this.stats.fun === 0) {
        deathText.setText('Your pet died from a lack of fun.');
    }  

    this.time.addEvent({
        delay: 3000,
        repeat: 0,
        callbackScope: this,
        callback: function () {
            this.scene.start('Home');
        }   
    });
};