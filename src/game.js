// variables
var foodChain = [];
var enemiesData = [];

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
    
        for (let i = 0; i < 4; i++)
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
        game.debug.text(1 / game.time.physicsElapsed, 32, 32);
    }
}

// Classes
class Player
{
    constructor()
    {
        this.lastAngle = 0;
        this.tail = [];
        this.body = game.add.sprite(game.world.centerX, game.world.centerY, 'body');
        this.body.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(this.body);
        game.camera.follow(this.body);
    }

    addTail()
    {
        // Create Tail
        if (this.tail.length == 0)
        {
            this.tail.push(game.add.sprite(this.body.position.x + this.body.width * 2, this.body.position.y, 'tail'));
        }
        else
        {
            this.tail.push(game.add.sprite(this.tail[this.tail.length - 1].body.position.x, this.tail[this.tail.length - 1].body.position.y, 'tail'));
        }
    
        let newTail = this.tail[this.tail.length - 1];

        newTail.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(newTail);
    
        // Set Tails's Scale
        this.tail.forEach((element, index) => {
            element.scale.setTo(0.2 + (this.tail.length - index - 1) * 0.8 / (this.tail.length));
        })
    }
    
    update()
    {
        this.move();
        this.tailCollision();

        let enemyData = [];
        enemyData[0] = {
            body:{
                x:this.body.position.x,
                y:(this.body.position.y + 150),
                rot:this.body.rotation
            },
            tail:[]
        };
        for (let i = 0; i < this.tail.length; i++)
        {
            enemyData[0].tail[i] = {
                x:this.tail[i].position.x,
                y:(this.tail[i].position.y + 150),
                rot:this.tail[i].rotation,
                scale:{
                    x:this.tail[i].scale.x,
                    y:this.tail[i].scale.y
                }
            }
        }
        Enemy.getDataFromServer(enemyData);
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
        
        if (Util.distance(x1, y1, x2, y2) <= this.body.width)
        {
            this.body.body.velocity.x = speed * Math.cos(this.lastAngle);
            this.body.body.velocity.y = speed * Math.sin(this.lastAngle);
            this.body.rotation = this.lastAngle;
        }
        else
        {
            if (Math.abs(this.lastAngle - angle) > Math.PI * game.time.physicsElapsed)
            {
                let angle2 = (angle - this.lastAngle);

                if (angle2 < -Math.PI)
                {
                    angle2 += 2 * Math.PI;
                }
                else if (angle2 > Math.PI)
                {
                    angle2 -= 2 * Math.PI;
                }

                if (angle2 < 0)
                {
                    angle = this.lastAngle - Math.PI * game.time.physicsElapsed;
                }
                else
                {
                    angle = this.lastAngle + Math.PI * game.time.physicsElapsed;
                }
            }
            this.lastAngle = angle;

            this.body.body.velocity.x = speed * Math.cos(angle);
            this.body.body.velocity.y = speed * Math.sin(angle);
            this.body.rotation = angle;
        }
    
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

    tailCollision()
    {
        for (let i = 0; i < this.tail.length; i++)
        {
            this.tail[i].tint = 0xffffff;

            if (isCollide(this.tail[i].position, this.body.position, this.body.width))
            {
                this.tail[i].tint = 0xff0000;
                collision();
                break;
            }
            for (let j = 0; j < enemiesData.length; j++)
            {
                if (isCollide(this.tail[i].position, enemiesData[j].body.position, this.body.width))
                {
                    this.tail[i].tint = 0xff0000;
                    collision();
                }
            }
        }
    
        function isCollide(tail, head, width)
        {
            return Util.doubleDistance(tail, head) <= Math.pow(width / 2, 2);
        }

        function collision()
        {

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

    static getDataFromServer(enemies)
    {
        enemiesData.forEach(element1 => {
            element1.body.destroy();
            element1.tail.forEach(element2 => {
                element2.destroy();
            });
        });
        enemiesData = [];

        enemies.forEach((element, index) => {
            enemiesData.push(new Enemy());
            enemiesData[index].getDataEach(element);
        });
    }

    getDataEach(data)
    {
        // Create body
        this.body = game.add.sprite(data.body.x, data.body.y, 'body');
        this.body.rotation = data.body.rot;
        this.body.anchor.setTo(0.5, 0.5);

        data.tail.forEach((element, index) => {
            this.tail.push(game.add.sprite(element.x, element.y, 'tail'));
            this.tail[index].rotation = element.rot;
            this.tail[index].anchor.setTo(0.5, 0.5);
            this.tail[index].scale.setTo(element.scale.x, element.scale.y);
        });
    }
}
// 적 배열
    // 머리
        // x
        // y
        // rot
    // 꼬리 배열
        // 꼬리
            // x
            // y
            // rot

// Game
var game = new Phaser.Game(innerWidth, innerHeight, Phaser.CANVAS);

game.state.add('inGame', inGame);

game.state.start('inGame');