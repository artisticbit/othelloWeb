
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "main",
    physics: {
        default: 'matter',
        matter: {
            gravity: { y: 0 },
            debug : true
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
    /*
    this.load.setBaseURL('http://labs.phaser.io');

    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
    this.load.image('red', 'assets/particles/red.png');
    */
    this.load.setBaseURL();
    this.load.image('ball','image/ball.png');
    this.load.image('ball2','image/ball2.png');
}

var ball;
var ball2;
function create ()
{
    /*
    this.add.image(400, 300, 'sky');

    var particles = this.add.particles('red');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });
    var logo = this.physics.add.image(400, 100, 'logo');
    logo.setVelocity(100, 200);
    logo.setBounce(1, 1);
    logo.setCollideWorldBounds(true);

    emitter.startFollow(logo);
    */
    this.matter.world.setBounds(0,0,800,600);

    ball = this.matter.add.sprite(25,0,'ball');
    ball.setPolygon(25, 25, 10, 25, { restitution: 0.9 });
    //ball.body.setCircle(25);
    //ball.body.gravity.y =100;
    ball.setVelocity(0, 10);
    ball.setBounce(1, 1);
    //ball.setCollideWorldBounds(true);

    ball2 = this.matter.add.sprite(50,300,'ball');
    ball2.setPolygon(25, 25, 10, 25, { restitution: 0.9, friction: 0.25 });
    //ball2.body.gravity.y =300;
    ball2.setVelocity(0, -10);
    ball2.setBounce(1, 1);
    //ball2.setCollideWorldBounds(true);
    this.matter.add.mouseSpring();

}

function update(){
    //this.physics.collide(ball,ball2);
}