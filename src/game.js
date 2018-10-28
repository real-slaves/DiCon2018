// variables
let foodChain = [];
let enemiesData = [];
let roomid = -3;
let status = 0;

let blocks = [];
let player = {};
let leftEnemyText;

let screenHeight = innerHeight;
let screenWidth = innerWidth;
let mapSize = {x:2400, y:2400};
let isFirst = true;

var emitter;

// Scene
let main = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background/background.jpg');
        game.load.image('fade', 'src/assets/sprites/background/fade.jpg');

        game.load.image('logo', 'src/assets/sprites/UI/logo.png');
        game.load.image('check', 'src/assets/sprites/UI/check.png');
        game.load.image('text1', 'src/assets/sprites/UI/text1.png');
        game.load.image('text2', 'src/assets/sprites/UI/text2.png');
        game.load.image('text3', 'src/assets/sprites/UI/text3.png');
        game.load.image('madeBy', 'src/assets/sprites/UI/madeBy.png');

        game.load.image('body', 'src/assets/sprites/object/player/body.png');
        game.load.image('tail', 'src/assets/sprites/object/player/tail.png');

        game.load.image('particle', 'src/assets/sprites/particle/particle.png');
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
        game.add.tileSprite(0, 0, 2000, 2000, 'background');
        player = new Player();
        player.body.position.x = -10;
        player.body.position.y = -10;

        for (let i = 0; i < 10; i++) { player.addTail(); player.tail[i].tint = 0xffffff };

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

        this.fade = game.add.tileSprite(0, 0, 2000, 2000, 'fade');
        this.fade.alpha = 0;

        emitter = game.add.emitter(0, 0, 75);
        emitter.makeParticles('particle');
        emitter.setAlpha(1, 0, 1000);
        emitter.minParticleSpeed.setTo(-250, -250);
        emitter.maxParticleSpeed.setTo(250, 250);
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.2;

        emitter.x = player.body.position.x;
        emitter.y = player.body.position.y;
        emitter.start(true, 1500, null, 10);
    },

    update : function()
    {
        this.time += game.time.physicsElapsed;
        player.update();
        this.animation();
    },

    render : function()
    {
    },

    animation : function()
    {
        if (this.goToWaiting !== 0)
        {
            this.fade.alpha = (((this.time - this.goToWaiting) * 3 > 1) ? 1 : (this.time - this.goToWaiting) * 3);
            if (this.time - this.goToWaiting > 0.5)
            {
                roomid = -1;
                socket.emit('join', {access: 1});
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
        game.load.image('background', 'src/assets/sprites/background/fade.jpg');
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
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
        if (roomid != -1) {
            game.state.start('inGame');
            document.querySelector("#chat").setAttribute("class", "");
        }
    }
}

let inGame = 
{
    preload : function()
    {
        game.load.image('background', 'src/assets/sprites/background/background.jpg');
        game.load.image('fade', 'src/assets/sprites/background/fade.jpg');

        game.load.image('body', 'src/assets/sprites/object/player/body.png');
        game.load.image('tail', 'src/assets/sprites/object/player/tail.png');

        game.load.image('leftEnemy', 'src/assets/sprites/UI/leftEnemy.png');

        game.load.image('block', 'src/assets/sprites/object//blocks/block.png');
        game.load.image('breakableBlock', 'src/assets/sprites/object//blocks/breakableBlock.png');

        game.load.image('particle', 'src/assets/sprites/particle/particle.png');
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
        game.physics.startSystem(Phaser.Physics.ARCADE);    
        game.add.tileSprite(0, 0, mapSize.x, mapSize.y, 'background'); 
        game.world.setBounds(0, 0, mapSize.x, mapSize.y);

        leftEnemy = game.add.image(screenWidth - 150, 20, 'leftEnemy').fixedToCamera = true;
        let style = { font: "100px Arial", fill: "#ffffff", boundsAlignH: "center", boundsAlignV: "middle" };
        leftEnemyText = game.add.text(screenWidth - 112, 36, "0", style);
        leftEnemyText.fixedToCamera = true;

        player = new Player();
        player.body.tint = 0x2EFE2E;
        for (let i = 0; i < 4; i++)
            player.addTail();

        blocks.forEach(value => value.destroy());
        blocks = [];

        this.time = 0;
        this.breakCool = 0;
        this.fade = game.add.tileSprite(0, 0, mapSize.x, mapSize.y, 'fade');

        emitter = game.add.emitter(0, 0, 75);
        emitter.makeParticles('particle');
        emitter.setAlpha(1, 0, 1000);
        emitter.minParticleSpeed.setTo(-250, -250);
        emitter.maxParticleSpeed.setTo(250, 250);
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.2;

        emitter.x = player.body.position.x;
        emitter.y = player.body.position.y;
        emitter.start(true, 1500, null, 10);
    },

    update : function()
    {
        this.time += game.time.physicsElapsed;
        this.breakCool += game.time.physicsElapsed;

        player.update();

        this.backWaiting();
        this.animaiton();
        this.blockCollision();
    },

    render : function()
    {
    },

    backWaiting : function()
    {
        if (game.input.activePointer.leftButton.justPressed(100) && roomid === -2)
        {
            roomid = -1;
            game.state.start('waiting');
            document.querySelector("#chat").setAttribute("class", "hide");
            socket.emit('join', {access: 1});
        }
    },

    animaiton : function()
    {
        this.fade.alpha = 1 - ((this.time >= 0.5) ? 1 : (this.time / 0.5));
    },

    blockCollision : function()
    {
        blocks.forEach((element, index) => {
            if (element.type === 0 || element.type === 1)
            {
                if (Util.doubleDistance(player.body.position, element.position) <= Math.pow(element.width / 2 + player.body.width / 2, 2) + Math.pow(element.height / 2 + player.body.width / 2, 2))
                {
                    let isCollide = false;

                    let angle = Math.atan2(player.body.position.y - element.position.y, player.body.position.x - element.position.x) - element.rotation;
                    let playerX = element.position.x + Math.cos(angle) * Util.distance(player.body.position, element.position);
                    let playerY = element.position.y + Math.sin(angle) * Util.distance(player.body.position, element.position);
        
                    if (playerY >= element.position.y + element.height / 5) // bottom
                    {
                        if (playerX >= element.position.x + element.width / 5) // right
                        {
                            if (Util.doubleDistance(playerX, playerY, element.position.x + element.width / 2, element.position.y + element.height / 2) <= Math.pow(player.body.width, 2))
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI / 4);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI / 4);
                                isCollide = true;
                            }
                        }
                        else if (playerX <= element.position.x - element.width / 5) // left
                        {
                            if (Util.doubleDistance(playerX, playerY, element.position.x - element.width / 2, element.position.y + element.height / 2) <= Math.pow(player.body.width, 2))
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI * 3 / 4);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI * 3 / 4);
                                isCollide = true;
                            }
                        }
                        else // middle
                        {
                            if (playerY <= element.position.y + element.height / 2 + player.body.width / 2)
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI / 2);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI / 2);
                                isCollide = true;
                            }
                        }
                    }
                    else if (playerY <= element.position.y - element.height / 5) // top
                    {
                        if (playerX >= element.position.x + element.width / 5) // right
                        {
                            if (Util.doubleDistance(playerX, playerY, element.position.x + element.width / 2, element.position.y - element.height / 2) <= Math.pow(player.body.width, 2))
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI * 7 / 4);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI * 7 / 4);
                                isCollide = true;
                            }
                        }
                        else if (playerX <= element.position.x - element.width / 5) // left
                        {
                            if (Util.doubleDistance(playerX, playerY, element.position.x - element.width / 2, element.position.y - element.height / 2) <= Math.pow(player.body.width, 2))
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI * 5 / 4);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI * 5 / 4);
                                isCollide = true;
                            }
                        }
                        else // middle
                        {
                            if (playerY >= element.position.y - element.height / 2 - player.body.width / 2)
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI * 3 / 2);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI * 3 / 2);
                                isCollide = true;
                            }
                        }
                    }
                    else // middle
                    {
                        if (playerX >= element.position.x + element.width / 5) // right
                        {
                            if (playerX <= element.position.x + element.width / 2 + player.body.width / 2)
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation);
                                player.bounce.y = 1000 * Math.sin(element.rotation);
                                isCollide = true;
                            }
                        }
                        else if (playerX <= element.position.x - element.width / 5) // left
                        {
                            if (playerX >= element.position.x - element.width / 2 - player.body.width / 2)
                            {
                                player.bounce.x = 1000 * Math.cos(element.rotation + Math.PI);
                                player.bounce.y = 1000 * Math.sin(element.rotation + Math.PI);
                                isCollide = true;
                            }
                        }
                        else
                        {
                            isCollide = true;
                        }
                    }

                    if (isCollide)
                    {
                        if (element.type === 1 && this.breakCool >= 0.06)
                        {
                            this.breakCool = 0;
                            socket.emit('blockCollision', {roomid:roomid, index:index});
                        }
                    }
                }
            }
        });
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
        this.collisionCool = 0;

        game.physics.arcade.enable(this.body);
        game.camera.follow(this.body);
    }

    addTail()
    {
        if (this.tail.length < 12)
        {
            // Create Tail
            if (this.tail.length == 0)
                this.tail.push(game.add.sprite(this.body.position.x + this.body.width * 2, this.body.position.y, 'tail'));
            else
                this.tail.push(game.add.sprite(this.tail[this.tail.length - 1].body.position.x, this.tail[this.tail.length - 1].body.position.y, 'tail'));
        
            let newTail = this.tail[this.tail.length - 1];

            newTail.anchor.setTo(0.5, 0.5);
            if (this.isDead)
            {
                newTail.alpha = 0.5;
                newTail.tint = 0x999999;
            }
            else
                newTail.tint = 0x2EFE2E;
            game.physics.arcade.enable(newTail);
        
            // Set Tails's Scale
            this.tail.forEach((tail, index) => {
                tail.scale.setTo(0.2 + (this.tail.length - index - 1) * 0.8 / (this.tail.length));
            })
        }
    }
    
    update()
    {
        this.move();
        this.worldBound();

        this.collisionCool += game.time.physicsElapsed;
        if (this.collisionCool >= 0.04)
        {
            this.tailCollision();
            this.collisionCool -= 0.04;
        }
        if (status === 0 || foodChain.findIndex(chain => (chain.hunter === socket.id)) !== -1 )
            this.emitDataToServer();
    }
    
    move()
    {
        let defaultSpeed = 300;
        let speed = defaultSpeed;
        if (game.input.activePointer.leftButton.isDown)
        {
            if (player.isDead)
                speed = 800;
            else
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
            if (!player.isDead && Math.abs(this.lastAngle - angle) > 1.5 * Math.PI * game.time.physicsElapsed)
            {
                let angle2 = (angle - this.lastAngle);

                if (angle2 < -Math.PI) angle2 += 2 * Math.PI;
                else if (angle2 > Math.PI) angle2 -= 2 * Math.PI;

                if (angle2 < 0) angle = this.lastAngle - (1.5 * Math.PI * game.time.physicsElapsed);
                else angle = this.lastAngle + (1.5 * Math.PI * game.time.physicsElapsed);
            }
            this.lastAngle = angle;

            this.body.body.velocity.x = speed * Math.cos(angle);
            this.body.body.velocity.y = speed * Math.sin(angle);
            this.body.rotation = angle;
        }

        if (!this.isDead)
        {
            this.body.body.velocity.x += this.bounce.x;
            this.body.body.velocity.y += this.bounce.y;
        }

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
                    player.bounce.x = 1200 * Math.cos(game.physics.arcade.angleBetween(collideTail.position, player.body.position));
                    player.bounce.y = 1200 * Math.sin(game.physics.arcade.angleBetween(collideTail.position, player.body.position));

                    socket.emit('addTail', {target:enemy.id});
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
            player.bounce.x = 1200;
            player.body.position.x = 5;
        }
        else if (player.body.position.x > ((game.state.current == 'inGame') ? mapSize.x : screenWidth))
        {
            player.bounce.x = -1200;
            player.body.position.x = ((game.state.current == 'inGame') ? mapSize.x : screenWidth) - 5;
        }
        else if (player.body.position.y < 0)
        {
            player.bounce.y = 1200;
            player.body.position.y = 5;
        }
        else if (player.body.position.y > ((game.state.current == 'inGame') ? mapSize.y : screenHeight))
        {
            player.bounce.y = -1200;
            player.body.position.y = ((game.state.current == 'inGame') ? mapSize.y : screenHeight) - 5;
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

        leftEnemyText.text = (enemiesData.length + !player.isDead).toString();
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
    if (game.state.current == 'inGame' && roomid !== -2)
    {
        foodChain = data.room.foodchain;
        status = data.room.status;
        updateChat(data.room.chat);
    }
    if (game.state.current != 'main')
    {
        Enemy.getDataFromServer(data.users);
        if (roomid !== -2)
        {
            blocks.forEach(value => value.destroy());
            blocks = [];
            data.room.objects.forEach((value, index) => {
                switch(value.type)
                {
                    case 0:
                        blocks.push(game.add.image(value.x, value.y, 'block'));
                        break;
                    case 1:
                        blocks.push(game.add.image(value.x, value.y, 'breakableBlock'));
                        break;
                }
                blocks[index].rotation = value.rotation;
                blocks[index].scale.setTo(value.size);
                blocks[index].anchor.setTo(0.5);
                blocks[index].type = value.type;
            })
        }
    }
});
socket.on("died", (data) => {
    if (data.id == socket.id)
    {
        player.isDead = true;
        player.body.alpha = 0.5;
        player.body.tint = 0x999999;
        player.tail.forEach(tail => {
            tail.alpha = 0.5;
            tail.tint = 0x999999;
        })
    }
    emitter.x = data.x;
    emitter.y = data.y;
    emitter.start(true, 1500, null, 10);
});
socket.on("gameEnd", (value) => {
    roomid = -2;
    player.gameEnd(value);
});
socket.on("addTail", () => {
    if (game.state.current == 'inGame')
        if (Math.random() >= 0.5)
            player.addTail();
});
socket.on("gameStart", (data) => {
});

// Game
let game = new Phaser.Game(screenWidth, screenHeight, Phaser.CANVAS);

game.state.add('inGame', inGame);
game.state.add('waiting', waiting);
game.state.add('main', main);

game.state.start('main');

function postChat() {
    if (document.getElementById("input").value == "")
        return;
    socket.emit("chatPost", {username: "guest", description: document.getElementById("input").value}) ;   
    document.getElementById("input").value = "";
}

function updateChat(chat) {
    let messageUserElement = document.getElementsByClassName("messageUserName");
    let messageDescriptionElement = document.getElementsByClassName("messageDescription");
    while(chat.length != document.getElementsByClassName("messageUserName").length) {
        if (chat.length > document.getElementsByClassName("messageUserName").length)
            document.getElementById("chat").innerHTML += '<div class="message"><p class="messageUserName"> </p>: <p class="messageDescription"> </p></div>';
        else
            document.getElementById("chat").removeChild("div")
    }

    chat.forEach((message, index) => {
        messageUserElement[index].innerHTML = message.username;
        messageDescriptionElement[index].innerHTML = message.description;
    });
}