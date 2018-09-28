// variables
var foodChain = [];
var enemies = [];

// Scene
var inGame = 
{
    preload : function()
    {
        game.load.image('body', 'assets/sprites/body.png');
        game.load.image('tail', 'assets/sprites/tail.png');
        game.load.image('background', 'assets/sprites/background.jpg');
    },
    create : function()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#99ffcc';
    
        game.add.tileSprite(0, 0, 5000, 5000, 'background'); 
        game.world.setBounds(0, 0, 5000, 5000);
    
        this.player = new Player();
    
        for (let i = 0; i < 10; i++)
        {
            this.player.addTail();
        }
    },
    update : function()
    {
        this.player.update();
        if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).justDown)
        {
            this.player.addTail();
        }
    },
    render : function()
    {
        game.debug.cameraInfo(game.camera, 32, 32);
    }
}

// Classes
class Player
{
    constructor()
    {
        this.tail = [];
        this.body = game.add.sprite(game.world.centerX, game.world.centerY, 'body');
        this.body.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.body);
        game.camera.follow(this.body);
        this.body.tint = game.rnd.integerInRange(0, Math.pow(16, 6) - 1);
    }

    addTail()
    {
        // Create Tail
        if (this.tail.length == 0)
        {
            this.tail.push(game.add.sprite(this.body.position.x, this.body.position.y, 'tail'));
        }
        else
        {
            this.tail.push(game.add.sprite(this.tail[this.tail.length - 1].body.position.x, this.tail[this.tail.length - 1].body.position.y, 'tail'));
        }
    
        let newTail = this.tail[this.tail.length - 1];

        newTail.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(newTail);
        newTail.tint = game.rnd.integerInRange(0, Math.pow(16, 6) - 1);
    
        // Set Tails's Scale and Layer
        for (let i = this.tail.length - 1; i >= 0; i--)
        {
            game.world.bringToTop(this.tail[i]);
            this.tail[i].scale.setTo(0.2 + (this.tail.length - i - 1) * 0.8 / (this.tail.length), 0.2 + (this.tail.length - i - 1) * 0.8 / (this.tail.length));
        }
        game.world.bringToTop(this.body);
    }
    
    update()
    {
        this.move();
    }
    
    move()
    {
        let defaultSpeed = 300;
        let speed = defaultSpeed;
        if (game.input.activePointer.leftButton.isDown)
        {
            speed = 600;
        }
    
        // Body Move
        let x1 = this.body.position.x + this.body.width / 2;
        let y1 = this.body.position.y + this.body.height / 2;
        let x2 = game.input.activePointer.x + game.camera.position.x;
        let y2 = game.input.activePointer.y + game.camera.position.y;
        let angle = game.physics.arcade.angleBetween(this.body, {x:game.input.activePointer.position.x + game.camera.position.x, y:game.input.activePointer.position.y + game.camera.position.y});
        
        if (Util.distance(x1, y1, x2, y2) <= this.body.width / 2)
        {
            this.body.body.velocity.setTo(0, 0);
        }
        else
        {
            
            this.body.body.velocity.x = speed * Math.cos(angle);
            this.body.body.velocity.y = speed * Math.sin(angle);
        }
        this.body.rotation = angle;
    
        // Tail Move
        for (let i = 0; i < this.tail.length; i++)
        {
            if (i == 0)
            {
                let distance = Util.distance(this.tail[i].position.x - this.tail[i].width/2, this.tail[i].position.y - this.tail[i].height/2, this.body.position.x - this.body.width/2, this.body.position.y - this.body.height/2);
                if (distance <= (this.tail[i].height + this.tail[i].height) / 4)
                {
                    this.tail[i].body.velocity.setTo(0, 0);
                }
                else
                {
                    let angle = game.physics.arcade.angleBetween({x:(this.tail[i].position.x - this.tail[i].width/2), y:(this.tail[i].position.y - this.tail[i].height/2)}, {x:(this.body.position.x - this.body.width/2), y:(this.body.position.y - this.body.height/2)});
                    
                    this.tail[i].body.velocity.x = distance / this.tail[i].width * defaultSpeed * Math.cos(angle);
                    this.tail[i].body.velocity.y = distance / this.tail[i].width * defaultSpeed * Math.sin(angle);
                }
                this.tail[i].rotation = game.physics.arcade.angleBetween(this.tail[i], this.body);
            }
            else
            {
                let distance = Util.distance(this.tail[i].position.x, this.tail[i].position.y, this.tail[i - 1].position.x, this.tail[i - 1].position.y);
                if (distance <= (this.tail[i].height + this.tail[i - 1].height) / 4)
                {
                    this.tail[i].body.velocity.setTo(0, 0);
                }
                else
                {
                    let angle = game.physics.arcade.angleBetween(this.tail[i], this.tail[i-1]);
                    this.tail[i].body.velocity.x = distance / this.tail[i].width * defaultSpeed * Math.cos(angle);
                    this.tail[i].body.velocity.y = distance / this.tail[i].width * defaultSpeed * Math.sin(angle);
                }
                this.tail[i].rotation = game.physics.arcade.angleBetween(this.tail[i], this.tail[i-1]);
            }
        }
    }
}

class Enemy
{
    constructor()
    {
        this.body = undefined;
        this.tail = [];
    }

    static getDataFromServer()
    {

    }

    getDataEach()
    {

    }
}

// Game
var game = new Phaser.Game(innerWidth, innerHeight, Phaser.CANVAS);

game.state.add('inGame', inGame);

game.state.start('inGame');