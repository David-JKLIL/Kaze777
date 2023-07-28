const config = {
    title: "",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        type: Phaser.AUTO,
        parent: "contenedor",
        width: 800,
        height: 600,
    },
    scene: {
        preload,
        create,
        update,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 700 },
            debug: true
        }
    },
    type: Phaser.AUTO,
    parent: "contenedor",
    width: 800,
    height: 600,
    scene: {
        preload,
        create,
        update,
    },


}

var game = new Phaser.Game(config);
var jumps = 0;
var maxJumps = 2;
function esconder(Kaze, Coin) {
    Coin.disableBody(true, true);
}

function preload() {
    this.load.setPath('./Assets/');
    this.load.image([
        'Coin',
        'Esfera',
        'Fondo',
        'Plataforma',
    ])
    //Sprites Kaze
    this.load.spritesheet('Kaze', 'Warrior_3/Walk.png', { frameWidth: 96, frameHeight: 68 });
    this.load.spritesheet('KazeIdle', 'Warrior_3/Idle.png', { frameWidth: 96, frameHeight: 68 });
    this.load.spritesheet('KazeJumpUP', 'Warrior_3/JumpUP.png', { frameWidth: 96, frameHeight: 68 });
    this.load.spritesheet('KazeAttack1', 'Warrior_3/Attack_1.png', { frameWidth: 110, frameHeight: 46 });

    //Sprites ghost
    this.load.spritesheet('ghost', 'Ghost/ghostIdle.png', { frameWidth: 32, frameHeight: 32 });
};
function create() {

    //Fondo de pantalla
    this.add.image(400, 300, 'Fondo').setScale(1, 1.15);

    //Plataformas en la pantalla
    plataforma = this.physics.add.staticGroup();
    plataforma.create(400, 590, 'Plataforma').setScale(2.1, 1).refreshBody();
    plataforma.create(400, 0, 'Plataforma').setScale(2.1, 1).refreshBody();
    plataforma.create(700, 410, 'Plataforma').setScale(0.3, 1).refreshBody();
    plataforma.create(400, 300, 'Plataforma').setScale(0.2, 1).refreshBody();
    plataforma.create(800, 150, 'Plataforma');
    plataforma.create(-50, 300, 'Plataforma');
    plataforma.create(0, 450, 'Plataforma');

    for (var i = 0; i < plataforma.getChildren().length; i++) {
        plataforma.getChildren()[i].setOffset(0, 3);
    }

    ghost = this.physics.add.sprite(400, 100, 'ghost');
    ghost.setCollideWorldBounds(true);
    ghost.setSize(40, 40);

    Kaze = this.physics.add.sprite(100, 217, 'Kaze');
    Kaze.setCollideWorldBounds(true);
    Kaze.setSize(50, 68);

    coins = this.physics.add.group({
        key: 'Coin',
        repeat: 11,
        setXY: { x: 12, y: 50, stepX: 140 }
    });
    coins.children.iterate(function (child) {
        child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    //Colicion con algo
    this.physics.add.collider(plataforma, coins);
    this.physics.add.collider(Kaze, plataforma);
    this.physics.add.overlap(Kaze, coins, esconder, null, this);
    this.physics.add.collider(ghost, plataforma);


    this.anims.create({
        key: 'Izquierda',
        frames: this.anims.generateFrameNumbers('Kaze', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: 'Derecha',
        frames: this.anims.generateFrameNumbers('Kaze', { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'Quieto',
        frames: this.anims.generateFrameNumbers('KazeIdle', { start: 0, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: this.anims.generateFrameNumbers('KazeJumpUP', { start: 0, end: 2 }),
        frameRate: 10,
    });

    this.anims.create({
        key: 'attack1',
        frames: this.anims.generateFrameNumbers('KazeAttack1', { start: 0, end: 3 }),
        frameRate: 10,
    });

    this.anims.create({
        key: 'ghostQuieto',
        frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1
    });
    this.allkeys = [];

    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.allkeys.push(this.keyA);
    this.allkeys.push(this.keyD);
    this.allkeys.push(this.keyJ);
    this.allkeys.push(this.keySPACE);


    jumps = 0;

    ghost.anims.play('ghostQuieto');


    this.input.keyboard.on('keydown', procesarTeclaPresionada, this);
    //this.input.keyboard.on('keyup', procesarTeclaLiberada, this);
    //console.log(this.allkeys);

};
function update(time, delta) {

    //Validar que no se precione ningun boton
    var allKeysDown = true;
    for (var i = 0; i < this.allkeys.length; i++) {
        if (this.allkeys[i].isDown) {
            allKeysDown = false;
        }
    }

    if (this.keyA.isDown) {
        Kaze.setVelocityX(-200);
        Kaze.setFlipX(true);
        if (Kaze.body.touching.down) {
            Kaze.anims.play('Izquierda', true);
            Kaze.setSize(50, 68);
        }
    }
    else if (this.keyD.isDown) {
        Kaze.setVelocityX(200);
        Kaze.setFlipX(false);
        if (Kaze.body.touching.down) {
            Kaze.anims.play('Derecha', true);
            Kaze.setSize(50, 68);
        }
    } else {
        if (allKeysDown && Kaze.body.touching.down && this.anims.get('attack1').isPlaying) {
            Kaze.anims.play('Quieto', true);
            Kaze.setSize(50, 68);
            Kaze.setVelocityX(0);
        }
    }
};

function jump() {
    if (Kaze.body.touching.down) {
        jumps = 0;
    }
    if (Kaze.body.touching.down || jumps < maxJumps) {
        Kaze.anims.play('jump', true);
        Kaze.setVelocityY(-350);
        jumps++;
    }
}

function procesarTeclaPresionada(event) {
    if (event.keyCode == 32) {
        jump();
    }
    else if (event.keyCode == 74) {
        Kaze.anims.play('attack1', true);
        Kaze.setSize(96, 68);
    }
}

function procesarTeclaLiberada(event) {
    //console.log('Se ha liberado la tecla con código: ' + event.keyCode);
}