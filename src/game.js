// variables
let foodChain = [];
let enemiesData = [];
let roomid = -1;

// Scene
let waiting = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background.jpg');
    },

    create : function()
    {
        game.add.tileSprite(0, 0, 5000, 5000, 'background'); 
        game.world.setBounds(0, 0, 5000, 5000);
        var style = { font: "bold 50px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.waitingText = game.add.text(100, 100, "3 / 4", style)
        this.waitingText.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
    },

    update : function()
    {
    },

    render : function()
    {
    },

    getDataFromServer : function(data)
    {
        if (roomid != -1)
            game.state.start('inGame');
    }
}

let inGame = 
{
    preload : function()
    {
        game.load.image('body', 'src/assets/sprites/body.png');
        game.load.image('tail', 'src/assets/sprites/tail.png');
        game.load.image('background', 'src/assets/sprites/background.jpg');
    },

    create : function()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#99ffcc';
    
        game.add.tileSprite(0, 0, 5000, 5000, 'background'); 
        game.world.setBounds(0, 0, 5000, 5000);
    
        this.player = new Player();
        this.player.body.tint = 0x2EFE2E;
        for (let i = 0; i < 4; i++)
            this.player.addTail();
    },

    update : function()
    {
        this.player.update();
        if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).justDown)
            this.player.addTail();
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
            this.tail.push(game.add.sprite(this.body.position.x + this.body.width * 2, this.body.position.y, 'tail'));
        else
            this.tail.push(game.add.sprite(this.tail[this.tail.length - 1].body.position.x, this.tail[this.tail.length - 1].body.position.y, 'tail'));
    
        let newTail = this.tail[this.tail.length - 1];

        newTail.anchor.setTo(0.5, 0.5);
        game.physics.arcade.enable(newTail);
    
        // Set Tails's Scale
        this.tail.forEach((tail, index) => {
            tail.scale.setTo(0.2 + (this.tail.length - index - 1) * 0.8 / (this.tail.length));
        })
    }
    
    update()
    {
        this.move();
        this.tailCollision();
        this.emitDataToServer();
    }
    
    move()
    {
        let defaultSpeed = 300;
        let speed = defaultSpeed;
        if (game.input.activePointer.leftButton.isDown)
            speed = 600;
    
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
        this.tail.forEach(tail => {
            tail.tint = 0x2EFE2E;

            if (enemiesData.find(enemyData => isCollide(tail.position, enemyData.body.position, this.body.width) == true)) 
            {
                tail.tint = 0xff0000;
                collision();
            }
        });

        function isCollide(tail, head, width)
        {
            return Util.doubleDistance(tail, head) <= Math.pow(width / 2, 2);
        }

        function collision()
        {

        }
    }

    emitDataToServer()
    {
        let data = {
            x:this.body.position.x,
            y:this.body.position.y,
            rotation:this.body.rotation,
            tail:[],
            roomid: roomid
        };
        this.tail.forEach(tail => {
            data.tail.push({
                x:tail.position.x,
                y:tail.position.y,
                scale:{
                    x:tail.scale.x,
                    y:tail.scale.y
                }
            })
        });

        socket.emit("update", data);
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
        // Destroy last data
        enemiesData.forEach(enemy => {
            enemy.body.destroy();
            enemy.tail.forEach(tail => {
                tail.destroy();
            });
        });
        enemiesData = [];

        // Save User's roomid
        roomid = enemies.find(enemy => enemy.id == socket.id).roomid;

        //Destroy object that's oneself
        enemies.splice(enemies.findIndex(enemy => enemy.id == socket.id), 1);
        
        // Add object on enemies array
        enemies.forEach((enemy, index) => {
            enemiesData.push(new Enemy());
            enemiesData[index].getDataEach(enemy);
        });
    }

    getDataEach(data)
    {
        // Create body
        this.body = game.add.sprite(data.x, data.y, 'body');
        this.body.rotation = data.rotation;
        this.body.anchor.setTo(0.5, 0.5);
        this.body.tint = 0xF7FE2E;

        data.tail.forEach((tail, index) => {
            this.tail.push(game.add.sprite(tail.x, tail.y, 'tail'));
            this.tail[index].anchor.setTo(0.5, 0.5);
            this.tail[index].scale.setTo(tail.scale.x, tail.scale.y);
            this.tail[index].tint = 0xF7FE2E;
            this.tail[index].rotation = game.physics.arcade.angleBetween(this.tail[index].position, (index == 0) ? this.body.position : this.tail[index - 1].position);
        });
    }
}

// Socket IO
let socket = io('http://jinhyeokfang.iptime.org');
socket.on("update", function(data)
{
    Enemy.getDataFromServer(data.users);
    if (game.state.current == 'waiting')
        waiting.getDataFromServer();
});

// Game
let game = new Phaser.Game(innerWidth, innerHeight, Phaser.CANVAS);

game.state.add('inGame', inGame);
game.state.add('waiting', waiting);

game.state.start('waiting');