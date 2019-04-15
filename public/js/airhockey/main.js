
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');

    this.load.setBaseURL();
    this.load.image('ball','image/ball.png');
    this.load.image('ball2','image/ball2.png');
}

function create ()
{
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });
    /*
    var logo = this.physics.add.image(400, 100, 'logo');
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    */
    var ball = this.physics.add.sprite(25,0,'ball');
    ball.body.setCircle(25);
    ball.body.gravity.y =0;
    ball.setVelocity(0, 0);
    ball.setBounce(1, 1);
    ball.setCollideWorldBounds(true);

    var ball2 = this.physics.add.sprite(50,100,'ball');
    ball2.body.setCircle(25);
    ball2.body.gravity.y =0;
    ball2.setVelocity(0, 0);
    ball2.setBounce(1, 1);
    ball2.setCollideWorldBounds(true);

    
   
}

function update(){
    
}