var game = new Phaser.Game(innerWidth, innerHeight, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

// Player
var player =
{
    body:undefined,
    tail:[]
};

player.addTail = function()
{
    // Create Tail
    if (player.tail.length == 0)
    {
        player.tail.push(game.add.sprite(player.body.body.position.x, player.body.body.position.y, 'tail'));
    }
    else
    {
        player.tail.push(game.add.sprite(player.tail[player.tail.length - 1].body.position.x, player.tail[player.tail.length - 1].body.position.y, 'tail'));
    }

    player.tail[player.tail.length - 1].anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player.tail[player.tail.length - 1]);
    player.tail[player.tail.length - 1].tint = game.rnd.integerInRange(0, Math.pow(16, 6) - 1);

    // Set Tails's Scale and Layer
    for (let i = player.tail.length - 1; i >= 0; i--)
    {
        game.world.bringToTop(player.tail[i]);
        player.tail[i].scale.setTo(0.2 + (player.tail.length - i - 1) * 0.8 / (player.tail.length), 0.2 + (player.tail.length - i - 1) * 0.8 / (player.tail.length));
    }
    game.world.bringToTop(player.body);
}

player.update = function()
{
    player.move();
}

player.move = function()
{
    let defaultSpeed = 300;
    let speed = defaultSpeed;
    let interval = 0.5;
    if (game.input.activePointer.leftButton.isDown)
    {
        speed = 600;
        interval = 1;
    }

    // Body Move
    if (Util.distance(player.body.body.position.x + player.body.width / 2, player.body.body.position.y + player.body.height / 2, game.input.activePointer.x + game.camera.position.x, game.input.activePointer.y + game.camera.position.y) <= player.body.width / 2)
    {
        player.body.body.velocity.setTo(0, 0);
    }
    else
    {
        player.body.body.velocity.x = speed * Math.cos(game.physics.arcade.angleBetween(player.body, {x:game.input.activePointer.position.x + game.camera.position.x, y:game.input.activePointer.position.y + game.camera.position.y}));
        player.body.body.velocity.y = speed * Math.sin(game.physics.arcade.angleBetween(player.body, {x:game.input.activePointer.position.x + game.camera.position.x, y:game.input.activePointer.position.y + game.camera.position.y}));
    }
    player.body.rotation = game.physics.arcade.angleBetween(player.body, {x:game.input.activePointer.position.x + game.camera.position.x, y:game.input.activePointer.position.y + game.camera.position.y});

    // Tail Move
    for (let i = 0; i < player.tail.length; i++)
    {
        if (i == 0)
        {
            let distance = Util.distance(player.tail[i].position.x - player.tail[i].width/2, player.tail[i].position.y - player.tail[i].height/2, player.body.position.x - player.body.width/2, player.body.position.y - player.body.height/2);
            if (distance <= (player.tail[i].height + player.tail[i].height) / 2 * interval)
            {
                player.tail[i].body.velocity.setTo(0, 0);
            }
            else
            {
                player.tail[i].body.velocity.x = distance / player.tail[i].width * defaultSpeed * Math.cos(game.physics.arcade.angleBetween({x:(player.tail[i].position.x - player.tail[i].width/2), y:(player.tail[i].position.y - player.tail[i].height/2)}, {x:(player.body.position.x - player.body.width/2), y:(player.body.position.y - player.body.height/2)}));
                player.tail[i].body.velocity.y = distance / player.tail[i].width * defaultSpeed * Math.sin(game.physics.arcade.angleBetween({x:(player.tail[i].position.x - player.tail[i].width/2), y:(player.tail[i].position.y - player.tail[i].height/2)}, {x:(player.body.position.x - player.body.width/2), y:(player.body.position.y - player.body.height/2)}));
            }
            player.tail[i].rotation = game.physics.arcade.angleBetween(player.tail[i], player.body);
        }
        else
        {
            let distance = Util.distance(player.tail[i].position.x, player.tail[i].position.y, player.tail[i - 1].position.x, player.tail[i - 1].position.y);
            if (distance <= (player.tail[i].height + player.tail[i - 1].height) / 2 * interval)
            {
                player.tail[i].body.velocity.setTo(0, 0);
            }
            else
            {
                player.tail[i].body.velocity.x = distance / player.tail[i].width * defaultSpeed * Math.cos(game.physics.arcade.angleBetween(player.tail[i], player.tail[i-1]));
                player.tail[i].body.velocity.y = distance / player.tail[i].width * defaultSpeed * Math.sin(game.physics.arcade.angleBetween(player.tail[i], player.tail[i-1]));
            }
            player.tail[i].rotation = game.physics.arcade.angleBetween(player.tail[i], player.tail[i-1]);
        }
    }
}

// Game
function preload()
{
    game.load.image('body', 'sprites/body.png');
    game.load.image('tail', 'sprites/tail.png');
    game.load.image('background', 'sprites/background.jpg');
}

function create()
{
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#99ffcc';

    game.add.tileSprite(0, 0, 5000, 5000, 'background'); 
    game.world.setBounds(0, 0, 5000, 5000);

    player.body = game.add.sprite(game.world.centerX, game.world.centerY, 'body');
    player.body.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player.body);
    game.camera.follow(player.body);

    player.body.tint = game.rnd.integerInRange(0, Math.pow(16, 6) - 1);

    for (let i = 0; i < 10; i++)
    {
        player.addTail();
    }
}

function update()
{
    player.update();
    if (game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).justDown)
    {
        player.addTail();
    }
}

function render()
{
    game.debug.cameraInfo(game.camera, 32, 32);
}