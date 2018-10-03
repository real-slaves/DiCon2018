// variables
let foodChain = [];
let enemiesData = [];
let roomid = -1;
let status = 0;
let player = {};

let screenHeight = innerHeight;
let screenWidth = innerWidth;

// Scene
let main = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background.jpg');
        game.load.image('logo', 'src/assets/sprites/logo.png');
    },

    create : function()
    {
        game.add.tileSprite(0, 0, 2000, 2000, 'background');
        game.add.sprite(screenWidth/2, screenHeight/2, 'logo').anchor.setTo(0.5, 0.5);
    },

    update : function()
    {
        if (game.input.activePointer.leftButton.isDown)
            game.state.start('waiting');
    },

    render : function()
    {
    }
}

let waiting = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background.jpg');
    },

    create : function()
    {
        game.add.tileSprite(0, 0, 2000, 2000, 'background');
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
        game.add.tileSprite(0, 0, 2000, 2000, 'background'); 
        game.world.setBounds(0, 0, 1000, 1000);
    
        player = new Player();
        player.body.tint = 0x2EFE2E;
        for (let i = 0; i < 4; i++)
            player.addTail();
    },

    update : function()
    {
        player.update();

        this.backWaiting();
    },

    render : function()
    {
        game.debug.text(1 / game.time.physicsElapsed, 32, 32);
    },

    backWaiting : function()
    {
        if (game.input.activePointer.leftButton.isDown && roomid === -2)
        {
            roomid = -1;
            game.state.start('waiting');
        }
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
        this.bounce = {x:0, y:0};

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
        newTail.tint = 0x2EFE2E;
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
        if (status === 0 || foodChain.findIndex(chain => (chain.hunter === socket.id)) !== -1 )
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
            this.body.body.velocity.x = speed * Math.cos(this.lastAngle) + this.bounce.x;
            this.body.body.velocity.y = speed * Math.sin(this.lastAngle) + this.bounce.y;
            this.body.rotation = this.lastAngle;
        }
        else
        {
            if (Math.abs(this.lastAngle - angle) > Math.PI * game.time.physicsElapsed)
            {
                let angle2 = (angle - this.lastAngle);

                if (angle2 < -Math.PI) angle2 += 2 * Math.PI;
                else if (angle2 > Math.PI) angle2 -= 2 * Math.PI;

                if (angle2 < 0) angle = this.lastAngle - Math.PI * game.time.physicsElapsed;
                else angle = this.lastAngle + Math.PI * game.time.physicsElapsed;
            }
            this.lastAngle = angle;

            this.body.body.velocity.x = speed * Math.cos(angle) + this.bounce.x;
            this.body.body.velocity.y = speed * Math.sin(angle) + this.bounce.y;
            this.body.rotation = angle;
        }

        this.bounce.x -= game.time.physicsElapsed * 1000;
        this.bounce.y -= game.time.physicsElapsed * 1000;
        if (this.bounce.x < 0) this.bounce.x = 0;
        if (this.bounce.y < 0) this.bounce.y = 0;
    
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
        if (status == 1)
        {
            enemiesData.forEach(enemy => {
                let tailIndex = enemy.tail.findIndex(tail => isCollide(tail.position, this.body.position, this.body.width));

                if (tailIndex != -1)
                {
                    enemy.tail[tailIndex].tint = 0xff0000;
                    collision(enemy, enemy.tail[tailIndex]);
                }
            })
    
            function isCollide(tail, head, width)
            {
                return Util.doubleDistance(tail, head) <= Math.pow(width / 1.5, 2);
            }
    
            function collision(enemy, collideTail)
            {
                if (foodChain.find(chain => (chain.hunter === socket.id && chain.target === enemy.id)))
                {
                    socket.emit('died', {hunter:socket.id, target:enemy.id});
                }
                else if (foodChain.find(chain => (chain.target === socket.id && chain.hunter === enemy.id)))
                {
                }
                else if (foodChain.findIndex(chain => chain.hunter === socket.id) !== -1)
                {
                    player.bounce.x = 1000 * Math.cos(game.physics.arcade.angleBetween(collideTail.position, player.body.position));
                    player.bounce.y = 1000 * Math.sin(game.physics.arcade.angleBetween(collideTail.position, player.body.position));
                }
            }
        }
    }

    gameEnd(value)
    {
        let style = { font: "bold 50px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        if (value.winner.id === socket.id)
        {
            this.waitingText = game.add.text(game.camera.position.x + screenWidth/2, game.camera.position.y + screenHeight/2, "You Win!", style)
            this.waitingText.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
        }
        else
        {
            this.waitingText = game.add.text(game.camera.position.x + screenWidth/2, game.camera.position.y + screenHeight/2, "You Lose!", style)
            this.waitingText.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
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

        if (roomid !== -2)
        {
            //Destroy object that's oneself
            enemies.splice(enemies.findIndex(enemy => enemy.id == socket.id), 1);
            
            // Add object on enemies array
            enemies.forEach((enemy) => {
                if (!enemy.isDead)
                {
                    enemiesData[enemiesData.push(new Enemy()) - 1].getDataEach(enemy);
                }
            });
        }   
    }

    getDataEach(data)
    {
        // Create body
        this.body = game.add.sprite(data.x, data.y, 'body');
        this.body.rotation = data.rotation;
        this.body.anchor.setTo(0.5, 0.5);
        this.id = data.id;
        if (foodChain.find(chain => (chain.hunter == socket.id)) != undefined && foodChain.find(chain => (chain.hunter == socket.id)).target == data.id)
            this.body.tint = 0x00ffff;

        data.tail.forEach((tail, index) => {
            this.tail.push(game.add.sprite(tail.x, tail.y, 'tail'));
            this.tail[index].anchor.setTo(0.5, 0.5);
            this.tail[index].scale.setTo(tail.scale.x, tail.scale.y);
            this.tail[index].rotation = game.physics.arcade.angleBetween(this.tail[index].position, (index == 0) ? this.body.position : this.tail[index - 1].position);
            if (foodChain.find(chain => (chain.hunter == socket.id)) != undefined && foodChain.find(chain => (chain.hunter == socket.id)).target == data.id)
                this.tail[index].tint = 0x00ffff;
        });
    }
}

// Socket IO
let socket = io('http://tail-server-qhjjb.run.goorm.io');
socket.on("update", function(data)
{
    if (game.state.current == 'waiting')
        waiting.getDataFromServer();
    if (game.state.current == 'inGame')
    {
        foodChain = data.room.foodchain;
        status = data.room.status;
    }
    Enemy.getDataFromServer(data.users);
});
socket.on("died", () => {
    player.body.alpha = 0.5;
    player.body.tint = 0x999999;
    player.tail.forEach(tail => {
        tail.alpha = 0.5;
        tail.tint = 0x999999;
    })
});
socket.on("gameEnd", (value) => {
    roomid = -2;
    player.gameEnd(value);
})

// Game
let game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS);

game.state.add('inGame', inGame);
game.state.add('waiting', waiting);
game.state.add('main', main);

game.state.start('main');