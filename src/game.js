// variables
let foodChain = [];
let enemiesData = [];
let roomid = -3;
let status = 0;
let player = {};

let screenHeight = innerHeight;
let screenWidth = innerWidth;
let mapSize = {x:2400, y:2400};
let isFirst = true;

// Scene
let main = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background.jpg');
        game.load.image('logo', 'src/assets/sprites/main/logo.png');
        game.load.image('check', 'src/assets/sprites/main/check.png');
        game.load.image('text1', 'src/assets/sprites/main/text1.png');
        game.load.image('text2', 'src/assets/sprites/main/text2.png');
        game.load.image('text3', 'src/assets/sprites/main/text3.png');
        game.load.image('madeBy', 'src/assets/sprites/main/madeBy.png');
    },

    create : function()
    {
        game.add.tileSprite(0, 0, 2000, 2000, 'background');

        if (isFirst)
        {
            isFirst = false;
            this.time = 0;
        }
        else
        {
            this.time = 10;
        }
        this.button = [];
        this.goToWaiting = 0;

        this.madeBy = game.add.sprite(screenWidth - 220, screenHeight - 100, 'madeBy');

        this.logo = game.add.sprite(screenWidth/2, screenHeight/2, 'logo');
        this.logo.anchor.setTo(0.5);
        this.logo.alpha = 0;

        this.button[0] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2, 'check'),
            text:game.add.sprite(screenWidth/2 - 50, screenHeight/2, 'text1')
        }
        this.button[1] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2 + 80, 'check'),
            text:game.add.sprite(screenWidth/2 - 50, screenHeight/2 + 80, 'text2')
        }
        this.button[2] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2 + 160, 'check'),
            text:game.add.button(screenWidth/2 - 50, screenHeight/2 + 160, 'text3', () => {
                if (this.time >= 3.3 && this.goToWaiting === 0)
                {
                    this.goToWaiting = this.time;
                }
            }, this, 2, 1, 0)
        }

        this.button[0].check.anchor.setTo(0.5); this.button[0].text.anchor.setTo(0.5);
        this.button[1].check.anchor.setTo(0.5); this.button[1].text.anchor.setTo(0.5);
        this.button[2].check.anchor.setTo(0.5); this.button[2].text.anchor.setTo(0.5);
        this.button[0].check.alpha = 0; this.button[0].text.alpha = 0;
        this.button[1].check.alpha = 0; this.button[1].text.alpha = 0;
        this.button[2].check.alpha = 0; this.button[2].text.alpha = 0;
    },

    update : function()
    {
        this.time += game.time.physicsElapsed;
        this.animation();
    },

    render : function()
    {
    },

    animation : function()
    {
        if (this.goToWaiting !== 0)
        {
            let alpha = 1 - (((this.time - this.goToWaiting) * 3 > 1) ? 1 : (this.time - this.goToWaiting) * 3);
            this.logo.alpha = alpha;
            this.button[0].check.alpha = alpha; this.button[0].text.alpha = alpha;
            this.button[1].check.alpha = alpha; this.button[1].text.alpha = alpha;
            this.button[2].check.alpha = alpha; this.button[2].text.alpha = alpha;
            this.madeBy.alpha = alpha;
            if (this.time - this.goToWaiting > 0.5)
            {
                roomid = -1;
                game.state.start('waiting');
            }
        }
        else
        {
            this.logo.alpha = (0 > (this.time) - 0.5) ? 0 : this.time- 0.5;
            if (this.time > 1.5)
                this.logo.position.y = (screenHeight / 2 - 120 < screenHeight / 2 - (this.time - 1.5) * 240) ? (screenHeight / 2 - (this.time - 1.5) * 240) : (screenHeight / 2 - 120);
            if (this.time > 2)
                this.button[0].check.alpha = (this.time - 2) * 2;
            if (this.time > 2.2)
                this.button[1].check.alpha = (this.time - 2.2) * 2;
            if (this.time > 2.4)
                this.button[2].check.alpha = (this.time - 2.4) * 2;
            if (this.time > 2.6)
                this.button[0].text.alpha = (this.time - 2.6) * 2;
            if (this.time > 2.8)
                this.button[1].text.alpha = (this.time - 2.8) * 2;
            if (this.time > 3)
                this.button[2].text.alpha = (this.time - 3) * 2;
        }
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
        game.load.image('body', 'src/assets/sprites/inGame/body.png');
        game.load.image('tail', 'src/assets/sprites/inGame/tail.png');
        game.load.image('background', 'src/assets/sprites/background.jpg');
    },

    create : function()
    {
        game.physics.startSystem(Phaser.Physics.ARCADE);    
        game.add.tileSprite(0, 0, mapSize.x, mapSize.y, 'background'); 
        game.world.setBounds(0, 0, mapSize.x, mapSize.y);
    
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
        this.isDead = false;

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
        this.worldBound();
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
            this.body.body.velocity.x = speed * Math.cos(this.lastAngle);
            this.body.body.velocity.y = speed * Math.sin(this.lastAngle);
            this.body.rotation = this.lastAngle;
        }
        else
        {
            if (Math.abs(this.lastAngle - angle) > 1.5 * Math.PI * game.time.physicsElapsed)
            {
                let angle2 = (angle - this.lastAngle);

                if (angle2 < -Math.PI) angle2 += 2 * Math.PI;
                else if (angle2 > Math.PI) angle2 -= 2 * Math.PI;

                if (angle2 < 0) angle = this.lastAngle - (1.5 * Math.PI * game.time.physicsElapsed);
                else angle = this.lastAngle + (1.5 * Math.PI * game.time.physicsElapsed);
            }
            this.lastAngle = angle;

            this.body.body.velocity.x = speed * Math.cos(angle) + this.bounce.x;
            this.body.body.velocity.y = speed * Math.sin(angle) + this.bounce.y;
            this.body.rotation = angle;
        }

        this.body.body.velocity.x += this.bounce.x;
        this.body.body.velocity.y += this.bounce.y;

        if (this.bounce.x > 0)
        {
            this.bounce.x -= game.time.physicsElapsed * 1000;
            if (this.bounce.x < 0) this.bounce.x = 0;
        }
        else if (this.bounce.x < 0)
        {
            this.bounce.x += game.time.physicsElapsed * 1000;
            if (this.bounce.x > 0) this.bounce.x = 0;
        }
        
        if (this.bounce.y > 0)
        {
            this.bounce.y -= game.time.physicsElapsed * 1000;
            if (this.bounce.y < 0) this.bounce.y = 0;
        }
        else if (this.bounce.y < 0)
        {
            this.bounce.y += game.time.physicsElapsed * 1000;
            if (this.bounce.y > 0) this.bounce.y = 0;
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
                    player.bounce.x = 700 * Math.cos(game.physics.arcade.angleBetween(collideTail.position, player.body.position));
                    player.bounce.y = 700 * Math.sin(game.physics.arcade.angleBetween(collideTail.position, player.body.position));
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

    worldBound()
    {
        if (player.body.position.x < 0)
        {
            player.bounce.x = 800;
            player.body.position.x = 5;
        }
        else if (player.body.position.x > mapSize.x)
        {
            player.bounce.x = -800;
            player.body.position.x = mapSize.x - 5;
        }
        else if (player.body.position.y < 0)
        {
            player.bounce.y = 800;
            player.body.position.y = 5;
        }
        else if (player.body.position.y > mapSize.y)
        {
            player.bounce.y = -800;
            player.body.position.y = mapSize.y - 5;
        }
    }

    emitDataToServer()
    {
        let data = {
            x:this.body.position.x,
            y:this.body.position.y,
            rotation:this.body.rotation,
            tail:[],
            roomid: roomid,
            isDead: player.isDead
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
    if (game.state.current != 'main')
        Enemy.getDataFromServer(data.users);
});
socket.on("died", () => {
    player.isDead = true;
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