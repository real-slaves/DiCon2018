// variables
let foodChain = [];
let enemiesData = [];
let playerName = {};
let roomid = -3;
let lastedRoomid = 0;
let roomPassword = "-";
let status = 0;
let map = 0;
let username = "guest";

let roomCreate_number_value = 0;
let roomCreate_mapSize_value = 0;
let roomCreate_mapKind_value = 0;
let roomCreate_object_value = 0;

let blocks = [];
let player = {};
let leftEnemyText = [];
let leftEnemyText2;
let minimapAnchor = [];
let topbar = {};
let roomInfo = {};

let win = {};
let lose = {};
let mainmenu = {};
let regame = {};
let rank = {};

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
    
        game.load.image('leftEnemy', 'src/assets/sprites/UI/inGame/leftEnemy.png');
        game.load.image('minimap', 'src/assets/sprites/UI/inGame/minimap.png');
        game.load.image('anchor', 'src/assets/sprites/UI/inGame/anchor.png');
        game.load.image('lose', 'src/assets/sprites/UI/inGame/lose.png');
        game.load.image('win', 'src/assets/sprites/UI/inGame/win.png');
        game.load.image('regame', 'src/assets/sprites/UI/inGame/regame.png');
        game.load.image('mainmenu', 'src/assets/sprites/UI/inGame/mainmenu.png');

        game.load.image('logo', 'src/assets/sprites/UI/main/logo.png');
        game.load.image('check', 'src/assets/sprites/UI/main/check.png');
        game.load.image('text1', 'src/assets/sprites/UI/main/text1.png');
        game.load.image('text2', 'src/assets/sprites/UI/main/text2.png');
        game.load.image('text3', 'src/assets/sprites/UI/main/text3.png');
        game.load.image('madeBy', 'src/assets/sprites/UI/main/madeBy.png');
        game.load.image('yourName', 'src/assets/sprites/UI/main/yourName.png');
        game.load.image('inputNickname', 'src/assets/sprites/UI/main/inputNickname.png');
        game.load.image('guide', 'src/assets/sprites/UI/main/guide.png');
        game.load.image('openGuide', 'src/assets/sprites/UI/main/openGuide.png');
        game.load.image('closeGuide', 'src/assets/sprites/UI/main/closeGuide.png');

        game.load.image('roomCreate_logo', 'src/assets/sprites/UI/main/roomCreate/roomCreate_logo.png');
        game.load.image('roomCreate_mapSize', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapSize.png');
        game.load.image('roomCreate_mapKind_0', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapKind_0.png');
        game.load.image('roomCreate_mapKind_1', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapKind_1.png');
        game.load.image('roomCreate_mapKind_2', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapKind_2.png');
        game.load.image('roomCreate_mapKind_3', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapKind_3.png');
        game.load.image('roomCreate_mapKind_4', 'src/assets/sprites/UI/main/roomCreate/roomCreate_mapKind_4.png');
        game.load.image('roomCreate_number', 'src/assets/sprites/UI/main/roomCreate/roomCreate_number.png');
        game.load.image('roomCreate_object', 'src/assets/sprites/UI/main/roomCreate/roomCreate_object.png');
        game.load.image('roomCreate_done', 'src/assets/sprites/UI/main/roomCreate/roomCreate_done.png');

        game.load.image('roomJoin_logo', 'src/assets/sprites/UI/main/roomJoin/roomJoin_logo.png');
        game.load.image('roomJoin_code', 'src/assets/sprites/UI/main/roomJoin/roomJoin_code.png');
        game.load.image('roomJoin_password', 'src/assets/sprites/UI/main/roomJoin/roomJoin_password.png');
        game.load.image('roomJoin_done', 'src/assets/sprites/UI/main/roomJoin/roomJoin_done.png');

        game.load.image('previous', 'src/assets/sprites/UI/main/Previous.png');
        game.load.image('next', 'src/assets/sprites/UI/main/Next.png');

        game.load.image('body', 'src/assets/sprites/object/player/body.png');
        game.load.image('tail', 'src/assets/sprites/object/player/tail.png');
    
        game.load.image('particle', 'src/assets/sprites/particle/particle.png');
    
        game.load.image('block', 'src/assets/sprites/object//blocks/block.png');
        game.load.image('breakableBlock', 'src/assets/sprites/object//blocks/breakableBlock.png');
        game.load.image('leaf', 'src/assets/sprites/object//blocks/leaf.png');
        game.load.image('woodleaf', 'src/assets/sprites/object//blocks/woodleaf.png');
        game.load.image('log', 'src/assets/sprites/object//blocks/log.png');
        game.load.image('water', 'src/assets/sprites/object//blocks/water.png');
        game.load.image('cherry1', 'src/assets/sprites/object//blocks/cherry1.png');
        game.load.image('cherry2', 'src/assets/sprites/object//blocks/cherry2.png');
        game.load.image('flower', 'src/assets/sprites/object//blocks/flower.png');
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
        game.add.tileSprite(0, 0, 2000, 2000, 'background');
        player = new Player();
        player.body.position.x = -10;
        player.body.position.y = -10;
        game.camera.follow(null);

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
        this.openRoomCreate = 0;
        this.openRoomJoin = 0;
        this.button = [];
        this.goToWaiting = 0;
        this.isRandomRoom = true;

        this.madeBy = game.add.sprite(screenWidth - 220, screenHeight - 100, 'madeBy');
        this.yourName = game.add.sprite(0, screenHeight - 90, 'yourName');
        this.nickname = game.add.text(10, screenHeight - 55, "guest", { font: "37px Arial bold", fill: "#000000"});
        this.nickname.fontWeight = "bold";
        game.add.button(10, screenHeight - 51, 'inputNickname', () => {
            this.focus = "nickname";
        }, this, 2, 1, 0);
        this.focus = null;
        this.cursor = 0;

        this.logo = game.add.sprite(screenWidth/2, screenHeight/2, 'logo');
        this.logo.anchor.setTo(0.5);
        this.logo.alpha = 0;

        this.button[0] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2, 'check'),
            text:game.add.button(screenWidth/2 - 50, screenHeight/2, 'text1', () => {
                if (this.time >= 3.3 && this.openRoomCreate == 0)
                {
                    this.openRoomCreate = this.time;
                }
            }, this, 2, 1, 0)
        }
        this.button[1] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2 + 80, 'check'),
            text:game.add.button(screenWidth/2 - 50, screenHeight/2 + 80, 'text2', () => {
                if (this.time >= 3.3 && this.openRoomJoin == 0)
                {
                    this.openRoomJoin = this.time;
                }
            }, this, 2, 1, 0)
        }
        this.button[2] = {
            check:game.add.sprite(screenWidth/2 - 50, screenHeight/2 + 160, 'check'),
            text:game.add.button(screenWidth/2 - 50, screenHeight/2 + 160, 'text3', () => {
                if (this.time >= 3.3 && this.goToWaiting === 0)
                {
                    this.isRandomRoom = true;
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

        this.roomCreate_logo = game.add.sprite(-1000, screenHeight/2 - 180, 'roomCreate_logo');
        this.roomCreate_done = game.add.button(-1000, screenHeight/2 - 130, 'roomCreate_done', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1 && this.goToWaiting === 0)
            {
                socket.emit('createCustomRoom', {
                    numberOfUsers: roomCreate_number_value,
                    numberOfObjects: roomCreate_object_value,
                    map: roomCreate_mapKind_value,
                    mapSize: roomCreate_mapSize_value,
                    mapCodeFixed: roomCreate_mapKind_value > 0
                });
                this.goToWaiting = this.time;
                this.isRandomRoom = false;
            }
        }, this, 2, 1, 0)

        this.roomCreate_mapKind = game.add.sprite(-1000, screenHeight/2 - 80, 'roomCreate_mapKind_0');
        this.roomCreate_mapKind_value = 0;
        this.roomCreate_mapKind_previous = game.add.button(-1000, screenHeight/2 - 80, 'previous', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_mapKind_value = (roomCreate_mapKind_value == 0) ? 4 : roomCreate_mapKind_value - 1;
                this.roomCreate_mapKind.destroy();
                this.roomCreate_mapKind = game.add.sprite(10, screenHeight/2 - 80, 'roomCreate_mapKind_' + roomCreate_mapKind_value);
            }
        }, this, 2, 1, 0)
        this.roomCreate_mapKind_next = game.add.button(-1000, screenHeight/2 - 80, 'next', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_mapKind_value = (++roomCreate_mapKind_value) % 5;
                this.roomCreate_mapKind.destroy();
                this.roomCreate_mapKind = game.add.sprite(10, screenHeight/2 - 80, 'roomCreate_mapKind_' + roomCreate_mapKind_value);
            }
        }, this, 2, 1, 0)

        this.roomCreate_mapSize = game.add.sprite(-1000, screenHeight/2 - 20, 'roomCreate_mapSize');
        roomCreate_mapSize_value = 2500;
        this.roomCreate_mapSize_text = game.add.text(-1000, screenHeight/2 - 5, roomCreate_mapSize_value, { font: "35px Arial bold", fill: "#000000"});
        this.roomCreate_mapSize_text.fontWeight = "bold"
        this.roomCreate_mapSize_previous = game.add.button(-1000, screenHeight/2 - 20, 'previous', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_mapSize_value = (roomCreate_mapSize_value == 1500) ? 5000 : roomCreate_mapSize_value - 500;
                this.roomCreate_mapSize_text.text = roomCreate_mapSize_value;
            }
        }, this, 2, 1, 0)
        this.roomCreate_mapSize_next = game.add.button(-1000, screenHeight/2 - 20, 'next', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_mapSize_value = (roomCreate_mapSize_value == 5000) ? 1500 : roomCreate_mapSize_value + 500;
                this.roomCreate_mapSize_text.text = roomCreate_mapSize_value;
            }
        }, this, 2, 1, 0)

        this.roomCreate_object = game.add.sprite(-1000, screenHeight/2 + 40, 'roomCreate_object');
        roomCreate_object_value = 30;
        this.roomCreate_object_text = game.add.text(-1000, screenHeight/2 + 55, roomCreate_object_value, { font: "35px Arial bold", fill: "#000000"});
        this.roomCreate_object_text.fontWeight = "bold"
        this.roomCreate_object_previous = game.add.button(-1000, screenHeight/2 + 40, 'previous', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_object_value = (roomCreate_object_value == 0) ? 50 : roomCreate_object_value - 5;
                this.roomCreate_object_text.text = roomCreate_object_value;
            }
        }, this, 2, 1, 0)
        this.roomCreate_object_next = game.add.button(-1000, screenHeight/2 + 40, 'next', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_object_value = (roomCreate_object_value == 50) ? 0 : roomCreate_object_value + 5;
                this.roomCreate_object_text.text = roomCreate_object_value;
            }
        }, this, 2, 1, 0)

        this.roomCreate_number = game.add.sprite(-1000, screenHeight/2 + 100, 'roomCreate_number');
        roomCreate_number_value = 4;
        this.roomCreate_number_text = game.add.text(-1000, screenHeight/2 + 115, roomCreate_number_value, { font: "35px Arial bold", fill: "#000000"});
        this.roomCreate_number_text.fontWeight = "bold"
        this.roomCreate_number_previous = game.add.button(-1000, screenHeight/2 + 100, 'previous', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_number_value = (roomCreate_number_value == 4) ? 8 : roomCreate_number_value - 1;
                this.roomCreate_number_text.text = roomCreate_number_value;
            }
        }, this, 2, 1, 0)
        this.roomCreate_number_next = game.add.button(-1000, screenHeight/2 + 100, 'next', () => {
            if (this.openRoomCreate && this.time - this.openRoomCreate >= 1)
            {
                roomCreate_number_value = (roomCreate_number_value == 8) ? 4 : roomCreate_number_value + 1;
                this.roomCreate_number_text.text = roomCreate_number_value;
            }
        }, this, 2, 1, 0)

        this.roomJoin_logo = game.add.sprite(screenWidth, screenHeight/2 - 180, 'roomJoin_logo');
        this.roomJoin_done = game.add.button(screenWidth, screenHeight/2 - 130, 'roomJoin_done', () => {
            if (this.openRoomJoin && this.time - this.openRoomJoin >= 1 && this.goToWaiting === 0)
            {
                socket.emit('join', {
                    access: 0,
                    roomid: this.roomJoin_code_value,
                    password: this.roomJoin_password_value,
                    username: username
                });
                this.goToWaiting = this.time;
                this.isRandomRoom = false;
            }
        }, this, 2, 1, 0)

        this.roomJoin_code_value = "-";
        this.roomJoin_code = game.add.sprite(screenWidth, screenHeight/2 - 80, 'roomJoin_code');
        this.roomJoin_code_text = game.add.text(screenWidth, screenHeight/2 - 40, this.roomJoin_code_value, { font: "35px Arial bold", fill: "#000000"});
        this.roomJoin_code_text.fontWeight = "bold"
        this.roomJoin_code_input = game.add.button(screenWidth, screenHeight/2 - 40, 'inputNickname', () => {
            this.focus = "code";
        }, this, 2, 1, 0);

        this.roomJoin_password_value = "-";
        this.roomJoin_password = game.add.sprite(screenWidth, screenHeight/2 + 30, 'roomJoin_password');
        this.roomJoin_password_text = game.add.text(screenWidth, screenHeight/2 + 70, this.roomJoin_password_value, { font: "35px Arial bold", fill: "#000000"});
        this.roomJoin_password_text.fontWeight = "bold"
        this.roomJoin_password_input = game.add.button(screenWidth, screenHeight/2 + 70, 'inputNickname', () => {
            this.focus = "password";
        }, this, 2, 1, 0);

        this.guide = game.add.sprite(screenWidth / 2, screenHeight / 2, 'guide');
        this.guide.anchor.setTo(0.5);
        this.guide.scale.setTo(1.2);
        this.guide.alpha = 0;

        this.openGuide = game.add.button(screenWidth - 100, 5, 'openGuide', () => {
            this.guide.alpha = 1;
            this.closeGuide.alpha = 1;
        }, this, 2, 1, 0);

        this.closeGuide = game.add.button(screenWidth / 2 + 360, screenHeight / 2 - 295, 'closeGuide', () => {
            this.guide.alpha = 0;
            this.closeGuide.alpha = 0;
        }, this, 2, 1, 0);
        this.closeGuide.alpha = 0;

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

        this.fade = game.add.tileSprite(0, 0, 2000, 2000, 'fade');
        this.fade.alpha = 1;
        this.fadeDisappear = true;
    },

    update : function()
    {
        game.world.bringToTop(this.fade);
        this.time += game.time.physicsElapsed;
        player.update();

        this.animation();
        this.cursor += game.time.physicsElapsed;
        if (this.cursor >= 1) this.cursor = 0;

        if (game.input.activePointer.leftButton.isDown)
            this.focus = null;
        
        this.nickname.text = username;
        this.roomJoin_code_text.text = this.roomJoin_code_value;
        this.roomJoin_password_text.text = this.roomJoin_password_value;
        if (this.cursor >= 0.5)
        {
            if (this.focus == "nickname")
                this.nickname.text = username + "|";
            if (this.focus == "code")
                this.roomJoin_code_text.text = this.roomJoin_code_value + "|";
            if (this.focus == "password")
                this.roomJoin_password_text.text = this.roomJoin_password_value + "|";
        }

        // input
        if (game.input.keyboard.downDuration(189, 1)) // minus, underbar
        {
            if (this.focus == "nickname" && username.length < 15)
                username += (game.input.keyboard.isDown(16)) ? "_" : "-";
        }
        if (game.input.keyboard.downDuration(32, 1)) // spacebar
        {
            if (this.focus == "nickname" && username.length < 15)
                username += " ";
        }
        if (game.input.keyboard.downDuration(8, 1)) // backspacebar
        {
            if (this.focus == "nickname")
                username = username.slice(0, username.length - 1);
            if (this.focus == "code")
                this.roomJoin_code_value = this.roomJoin_code_value.slice(0, this.roomJoin_code_value.length - 1);
            if (this.focus == "password")
                this.roomJoin_password_value = this.roomJoin_password_value.slice(0, this.roomJoin_password_value.length - 1);
        }
        for (let i = 65; i <= 90; i++) // alphabet
        {
            if (game.input.keyboard.downDuration(i, 1))
            {
                if (this.focus == "nickname" && username.length < 15)
                    username += (game.input.keyboard.isDown(16)) ? String.fromCharCode(i) : String.fromCharCode(i).toLowerCase();
            }
        }
        for (let i = 48; i <= 57; i++) // number
        {
            if (game.input.keyboard.downDuration(i, 1))
            {
                if (this.focus == "nickname" && username.length < 15)
                    username += String.fromCharCode(i);
                if (this.focus == "code" && this.roomJoin_code_value.length < 5)
                {
                    if (this.roomJoin_code_value == "-")
                        this.roomJoin_code_value = "";
                    this.roomJoin_code_value += String.fromCharCode(i);
                }
                if (this.focus == "password" && this.roomJoin_password_value.length < 5)
                {
                    if (this.roomJoin_password_value == "-")
                        this.roomJoin_password_value = "";
                    this.roomJoin_password_value += String.fromCharCode(i);
                }
            }
        }
    },

    render : function()
    {
    },

    animation : function()
    {
        if (this.openRoomCreate != 0)
        {
            //y=-7x^2+10.5x-3.5
            let x = this.time - this.openRoomCreate;
            if (x >= 1) x = 1;
            let y = -7 * Math.pow(x, 2) + 10.5 * x - 3.5;
            y = y * 100 + 10;

            this.roomCreate_logo.position.x = y + 10;
            this.roomCreate_done.position.x = y + 245;

            this.roomCreate_mapKind.position.x = y + 10;
            this.roomCreate_mapKind_next.position.x = y + 280;
            this.roomCreate_mapKind_previous.position.x = y + 260;

            this.roomCreate_mapSize.position.x = y + 10;
            this.roomCreate_mapSize_text.position.x = y + 138;
            this.roomCreate_mapSize_next.position.x = y + 280;
            this.roomCreate_mapSize_previous.position.x = y + 260;
            
            this.roomCreate_object.position.x = y + 10;
            this.roomCreate_object_text.position.x = y + 138;
            this.roomCreate_object_next.position.x = y + 280;
            this.roomCreate_object_previous.position.x = y + 260;
            
            this.roomCreate_number.position.x = y + 10;
            this.roomCreate_number_text.position.x = y + 138;
            this.roomCreate_number_next.position.x = y + 280;
            this.roomCreate_number_previous.position.x = y + 260;
        }
        if (this.openRoomJoin != 0)
        {
            //y=-7x^2+10.5x-3.5
            let x = this.time - this.openRoomJoin;
            if (x >= 1) x = 1;
            let y = -7 * Math.pow(x, 2) + 10.5 * x - 3.5;
            y = y * 100 + 320;

            this.roomJoin_logo.position.x = screenWidth - y;
            this.roomJoin_done.position.x = screenWidth - y - 5;
            this.roomJoin_code.position.x = screenWidth - y;
            this.roomJoin_code_input.position.x = screenWidth - y;
            this.roomJoin_code_text.position.x = screenWidth - y;
            this.roomJoin_password.position.x = screenWidth - y;
            this.roomJoin_password_input.position.x = screenWidth - y;
            this.roomJoin_password_text.position.x = screenWidth - y;
        }
        if (this.fadeDisappear)
        {
            if (this.fade.alpha <= game.time.physicsElapsed * 2)
            {
                this.fade.alpha = 0;
                this.fadeDisappear = false;
            }
            else
            {
                this.fade.alpha -= game.time.physicsElapsed * 2;
            }
        }
        if (this.goToWaiting !== 0)
        {
            if (roomid == -3 && this.isRandomRoom == false && this.time - this.goToWaiting > 0.15)
            {
                this.goToWaiting = 0;
                this.fade.alpha = 0;
            }
            else
            {
                this.fade.alpha = (((this.time - this.goToWaiting) * 3 > 1) ? 1 : (this.time - this.goToWaiting) * 3);
                if (this.time - this.goToWaiting > 0.5)
                {
                    if (this.isRandomRoom)
                    {
                        roomid = -1;
                        socket.emit('join', {access: 1});
                        game.state.start('waiting');
                    }
                    else
                    {
                        socket.emit('join', {access: 0, roomid: roomid, password: 0, username});
                        game.state.start('waiting');
                    }
                }
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
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
        game.add.tileSprite(0, 0, 2000, 2000, 'fade');
    },

    update : function()
    {
        if (roomid != -1) {
            game.state.start('inGame');
            document.querySelector("#chat").setAttribute("class", "");
        }
    },

    render : function()
    {
    }
}

let inGame = 
{
    preload : function()
    {
    },

    create : function()
    {
        game.stage.backgroundColor = '#f1f1f1';
        game.physics.startSystem(Phaser.Physics.ARCADE);    
        game.world.setBounds(0, 0, mapSize.x, mapSize.y);
        this.tile = game.add.tileSprite(0, 0, 5000, 5000, 'background');
        this.tile.tint = 0xffffff;

        this.minimap = game.add.image(screenWidth - 125, screenHeight - 125, 'minimap');
        this.minimap.fixedToCamera = true;
        this.minimap.anchor.setTo(0.5, 0.5);

        this.mask = game.add.graphics(0, 0);
        this.mask.beginFill(0xffffff);
        this.mask.drawRect(screenWidth - 240, screenHeight - 240, 230, 230);
        this.mask.fixedToCamera = true;

        playerName = {};

        this.leftEnemy = game.add.image(screenWidth - 85, 120, 'leftEnemy');
        this.leftEnemy.fixedToCamera = true;
        this.leftEnemy.anchor.setTo(0.5, 0.5);
        leftEnemyText = [];
        for (let i = 0; i < 8; i++)
        {
            leftEnemyText.push(game.add.text(screenWidth - 145, 20 + i * 21.5, "0", { font: "18px Arial", fill: "#fff"}));
            leftEnemyText[i].fixedToCamera = true;
        }
        leftEnemyText2 = game.add.text(screenWidth - 145, 198, "0", { font: "20px Arial", fill: "#cccccc"});
        leftEnemyText2.fixedToCamera = true;

        player = null;

        blocks.forEach(value => value.destroy());
        blocks = [];

        this.time = 0;
        this.breakCool = 0;
        this.fade = game.add.tileSprite(0, 0, 5000, 5000, 'fade');

        win = game.add.image(screenWidth / 2, screenHeight / 2, 'win');
        win.fixedToCamera = true;
        win.anchor.setTo(0.5);
        win.visible = false;

        topbar = game.add.text(screenWidth / 2, 50, "플레이어를 기다리는 중입니다 (1/4)",
            { font: "bold 30px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" });
        topbar.setTextBounds(0, 0, 0, 0);
        topbar.fontWeight = "bold";
        topbar.fixedToCamera = true;

        roomInfo = game.add.text(10, 10, "방코드: 1\n비밀번호: 12684",
        { font: "bold 20px Arial", fill: "#000"});
        roomInfo.fontWeight = "bold";
        roomInfo.fixedToCamera = true;

        lose = game.add.image(screenWidth / 2, screenHeight / 2, 'lose');
        lose.fixedToCamera = true;
        lose.anchor.setTo(0.5);
        lose.visible = false;

        mainmenu = game.add.button(screenWidth/2 - 250, screenHeight/2 + 270, 'mainmenu', () => {
            if (roomid === -2)
            {
                blocks.forEach(value => value.destroy());
                blocks = [];
                
                roomid = -3;
                game.state.start('main');
                document.querySelector("#chat").setAttribute("class", "hide");
                socket.emit('join', {access: 1});
            }
        }, this, 2, 1, 0)
        mainmenu.fixedToCamera = true;
        mainmenu.anchor.setTo(0.5);
        mainmenu.visible = false;

        regame = game.add.button(screenWidth/2 - 70, screenHeight/2 + 270, 'regame', () => {
            if (roomid === -2)
            {
                blocks.forEach(value => value.destroy());
                blocks = [];
                
                if (roomPassword == "-")
                {
                    roomid = -1;
                    game.state.start('waiting');
                    document.querySelector("#chat").setAttribute("class", "hide");
                    socket.emit('join', {access: 1});
                }
                else
                {
                    roomid = parseInt(lastedRoomid);
                    socket.emit('join', {access: 0, roomid:parseInt(roomid), password: roomPassword, username});
                    document.querySelector("#chat").setAttribute("class", "hide");
                    game.state.start('waiting');
                }
            }
        }, this, 2, 1, 0)

        regame.fixedToCamera = true;
        regame.anchor.setTo(0.5);
        regame.visible = false;

        rank = game.add.text(screenWidth / 2 - 330, screenHeight / 2 - 180, "", { font: "40px Arial", fill: "#fff"});
        rank.fixedToCamera = true;
        rank.visible = false;

        emitter = game.add.emitter(0, 0, 75);
        emitter.makeParticles('particle');
        emitter.setAlpha(1, 0, 1000);
        emitter.minParticleSpeed.setTo(-250, -250);
        emitter.maxParticleSpeed.setTo(250, 250);
        emitter.minParticleScale = 0.5;
        emitter.maxParticleScale = 1.2;
    },

    update : function()
    {
        this.time += game.time.physicsElapsed;
        this.breakCool += game.time.physicsElapsed;

        if (player != null)
            player.update();
        if (roomid != -2) roomInfo.text = "방코드: " + roomid + "\n비밀번호: " + roomPassword;
        if (roomid == -2 || player != null && player.isDead) topbar.text = "";

        this.animaiton();
        this.blockCollision();
        this.setLayer();
        this.setGroundColor();
    },

    render : function()
    {
    },

    setGroundColor : function()
    {
        if (map === 1)
            this.tile.tint = 0xeeeeee;
        else if (map === 2)
            this.tile.tint = 0x91f207;
        else if (map === 3)
            this.tile.tint = 0x07f276;
        else if (map === 4)
            this.tile.tint = 0xbdf207;   
        else
            this.tile.tint = 0xffffff;
    },

    setLayer : function()
    {
        // 1층 : 물
        blocks.filter(element => element.type == 5).forEach(element => game.world.bringToTop(element));

        // 2층 : 플레이어
        if (player != null)
        {
            game.world.bringToTop(player.body);
            player.tail.forEach(element => game.world.bringToTop(element));
        }

        // 3층 : 적
        enemiesData.forEach(element1 => {
            game.world.bringToTop(element1.body);
            element1.tail.forEach(element2 => game.world.bringToTop(element2));
        })

        // 4층 : 구조물
        blocks.filter(element => element.type != 4 && element.type != 5 && element.type != 7 && element.type != 8).forEach(element => game.world.bringToTop(element));
        blocks.filter(element => element.type == 4 || element.type == 7 || element.type == 8).forEach(element => game.world.bringToTop(element));

        // 5층 : 닉네임
        enemiesData.forEach(element => {
            game.world.bringToTop(element.username);
        })

        // 6층 : UI
        minimapAnchor.forEach(element => element.mask = this.mask);

        game.world.bringToTop(this.leftEnemy);
        leftEnemyText.forEach(element => game.world.bringToTop(element));
        game.world.bringToTop(leftEnemyText2);
        game.world.bringToTop(this.minimap);
        minimapAnchor.filter(element => element.type == 5).forEach(element => game.world.bringToTop(element));
        minimapAnchor.filter(element => element.type != 4 && element.type != 5 && element.type != 7 && element.type != 8).forEach(element => game.world.bringToTop(element));
        minimapAnchor.filter(element => element.type == 4 || element.type == 7 || element.type == 8).forEach(element => game.world.bringToTop(element));
        game.world.bringToTop(lose);
        game.world.bringToTop(win);
        game.world.bringToTop(regame);
        game.world.bringToTop(mainmenu);
        game.world.bringToTop(rank);
        game.world.bringToTop(topbar);
        game.world.bringToTop(roomInfo);

        // 7층 : 페이드
        game.world.bringToTop(this.fade);
    },

    animaiton : function()
    {
        this.fade.alpha = 1 - ((this.time >= 0.5) ? 1 : (this.time / 0.5));
    },

    blockCollision : function()
    {
        blocks.forEach((element, index) => {
            if (element.type === 5)
            {
                if (Util.doubleDistance(player.body.position, element.position) <= Math.pow(element.width / 2 + player.body.width / 2, 2))
                {
                    player.slow = 0.4;
                }
            }
            else if (element.type === 3)
            {
                if (Util.doubleDistance(player.body.position, element.position) <= Math.pow(element.width / 2 + player.body.width / 2, 2))
                {
                    let angle = Math.atan2(player.body.position.y - element.position.y, player.body.position.x - element.position.x);
                    player.bounce.x = 800 * Math.cos(angle);
                    player.bounce.y = 800 * Math.sin(angle);
                }
            }
            else if (element.type === 0 || element.type === 1)
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
                        if (element.type === 1 && this.breakCool >= 0.06 && !player.isDead)
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
        this.stamina = 5;
        this.slow = 0;

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
        if (this.collisionCool >= 0.06)
        {
            this.tailCollision();
            this.collisionCool -= 0.06;
        }
        if (this.slow > 0)
        {
            this.slow -= game.time.physicsElapsed;
            if (this.slow <= 0)
                this.slow = 0;
        }
        if (roomid >= 0 && status === 0 || foodChain.findIndex(chain => (chain.hunter === socket.id)) !== -1 )
            this.emitDataToServer();
    }
    
    move()
    {
        // Set Speed
        let defaultSpeed = 300;
        if (this.slow > 0)
            defaultSpeed = 150;
        let speed = defaultSpeed;
        if (game.input.activePointer.leftButton.isDown)
        {
            if (player.isDead)
                speed = 800;
            else if (this.stamina > 0)
            {
                if (this.slow > 0)
                {
                    speed = 300;
                }
                else
                {
                    speed = 600;
                }
                this.stamina -= game.time.physicsElapsed;
                if (this.stamina <= 0) this.stamina = 0;
            }
        }
        else
        {
            this.stamina += game.time.physicsElapsed;
            if (this.stamina >= 10) this.stamina = 10;
        }

        // Set Body's color
        if (!this.isDead)
        {
            let red = Math.round(255 - (25.5 * this.stamina));
            let green = Math.round((425 - (25.5 * this.stamina) >= 255) ? 255 : 425 - (25.5 * this.stamina));
            let blue = 255;
            this.body.tint = blue + Math.pow(16, 2) * green + Math.pow(16, 4) * red;
            let debug = "";
            this.tail.forEach((element, index) => {
                element.tint = blue
                + Math.pow(16, 2) * Math.round((green + (255 - red) * index / (this.tail.length * 1.5) > 255) ? 255 : green + (255 - red) * index / (this.tail.length * 1.5))
                + Math.pow(16, 4) * Math.round(red + (255 - red) * index / (this.tail.length * 1.5))
            });
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
            if (!player.isDead && Math.abs(this.lastAngle - angle) > 2.5 * Math.PI * game.time.physicsElapsed)
            {
                let angle2 = (angle - this.lastAngle);

                if (angle2 < -Math.PI) angle2 += 2 * Math.PI;
                else if (angle2 > Math.PI) angle2 -= 2 * Math.PI;

                if (angle2 < 0) angle = this.lastAngle - (2.5 * Math.PI * game.time.physicsElapsed);
                else angle = this.lastAngle + (2.5 * Math.PI * game.time.physicsElapsed);
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
        if (value.winner.id === socket.id)
        {
            win.visible = true;
            regame.visible = true;
            mainmenu.visible = true;
        }
        else
        {
            lose.visible = true;
            regame.visible = true;
            mainmenu.visible = true;
        }

        value.userInfo.sort((element1, element2) => element2.kill - element1.kill);
        value.userInfo.filter(element => {
            return element.id == socket.id || playerName[element.id] !== undefined;
        }).forEach((element, index) => {
            rank.text += (index + 1) + ". " + ((element.id == socket.id) ? username : playerName[element.id]) + " [" + element.kill + "kill]\n";
        })
        rank.visible = true;
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
            isDead: player.isDead,
            username: username
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
        this.username = undefined;
        this.body = undefined;
        this.tail = [];
    }

    static getDataFromServer(enemies)
    {
        // Destroy last data
        enemiesData.forEach(enemy => {
            enemy.username.destroy();
            enemy.body.destroy();
            enemy.tail.forEach(tail => {
                tail.destroy();
            });
        });
        minimapAnchor.forEach(anchor => {
            anchor.destroy();
        })
        enemiesData = [];
        minimapAnchor = [];

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

        minimapAnchor.push(game.add.sprite(screenWidth - 230 + player.body.position.x * 210 / mapSize.x, screenHeight - 230 + player.body.position.y * 210 / mapSize.y, 'anchor'));
        minimapAnchor[minimapAnchor.length - 1].anchor.setTo(0.5, 0.5);
        minimapAnchor[minimapAnchor.length - 1].rotation = player.body.rotation;
        minimapAnchor[minimapAnchor.length - 1].tint = 0x00fff6;
        minimapAnchor[minimapAnchor.length - 1].fixedToCamera = true;
        minimapAnchor[minimapAnchor.length - 1].scale.setTo(880 / mapSize.x);
        minimapAnchor[minimapAnchor.length - 1].type = -1;

        leftEnemyText.forEach(element => element.text = "");
        leftEnemyText[0].text = username;
        enemiesData.forEach((enemy, index) => {
            leftEnemyText[1 + index].text = enemy.username.text;
            if (foodChain.find(chain => (chain.hunter == socket.id)) != undefined && foodChain.find(chain => (chain.hunter == socket.id)).target == enemy.id)
                leftEnemyText[1 + index].fill = "#f6ff5e";
            else
              leftEnemyText[1 + index].fill = "#ffffff";
        });
        leftEnemyText2.text = (enemiesData.length + (!player.isDead || status == 1)).toString() + " left";
    }

    getDataEach(data)
    {
        // Create body
        this.username = game.add.text(data.x, data.y - 50, data.username,
            { font: "bold 32px Arial", fill: "#000", boundsAlignH: "center", boundsAlignV: "middle" });
        this.username.setTextBounds(0, 0, 0, 0);

        this.body = game.add.sprite(data.x, data.y, 'body');
        this.body.rotation = data.rotation;
        this.body.anchor.setTo(0.5, 0.5);

        minimapAnchor.push(game.add.sprite(screenWidth - 230 + data.x * 210 / mapSize.x, screenHeight - 230 + data.y * 210 / mapSize.y, 'anchor'));
        minimapAnchor[minimapAnchor.length - 1].anchor.setTo(0.5, 0.5);
        minimapAnchor[minimapAnchor.length - 1].rotation = data.rotation;
        minimapAnchor[minimapAnchor.length - 1].fixedToCamera = true;
        minimapAnchor[minimapAnchor.length - 1].scale.setTo(880 / mapSize.x);
        minimapAnchor[minimapAnchor.length - 1].type = -1;

        this.id = data.id;
        if (foodChain.find(chain => (chain.hunter == socket.id)) != undefined && foodChain.find(chain => (chain.hunter == socket.id)).target == data.id)
        {
            this.body.tint = 0xffff00;
            minimapAnchor[minimapAnchor.length - 1].tint = 0xffe13a;
        }
        else
        {
            minimapAnchor[minimapAnchor.length - 1].tint = 0x00ff12;
        }
        data.tail.forEach((tail, index) => {
            this.tail.push(game.add.sprite(tail.x, tail.y, 'tail'));
            this.tail[index].anchor.setTo(0.5, 0.5);
            this.tail[index].scale.setTo(tail.scale.x, tail.scale.y);
            this.tail[index].rotation = game.physics.arcade.angleBetween(this.tail[index].position, (index == 0) ? this.body.position : this.tail[index - 1].position);
            if (foodChain.find(chain => (chain.hunter == socket.id)) != undefined && foodChain.find(chain => (chain.hunter == socket.id)).target == data.id)
                this.tail[index].tint = 0xffff00 + Math.round(255 * (index) / this.tail.length);
        });

        playerName[data.id] = data.username;
    }
}

// Socket IO
let socket = io('http://tail-server-qhjjb.run.goorm.io');
socket.on("update", function(data)
{
    if (game.state.current == 'inGame' && roomid !== -2)
    {
        if (data.room.option != null)
        {
            mapSize.x = data.room.option.mapSize;
            mapSize.y = data.room.option.mapSize;
            game.world.setBounds(0, 0, mapSize.x, mapSize.y);

            if (player == null)
            {
                player = new Player();
                player.body.position.x = game.rnd.realInRange(0, mapSize.x);
                player.body.position.y = game.rnd.realInRange(0, mapSize.y);
                for (let i = 0; i < 4; i++)
                    player.addTail();

                emitter.x = player.body.position.x;
                emitter.y = player.body.position.y;
                emitter.start(true, 1500, null, 10);
            }
    
            map = data.room.map;
            foodChain = data.room.foodchain;
            status = data.room.status;
            roomPassword = (data.room.option.password === null) ? "-" : data.room.option.password;
            if (status == 0)
                topbar.text = "플레이어를 기다리는 중입니다 (" + data.users.length + "/" + data.room.option.numberOfUsers + ")";
            else if (status == 1)
                topbar.text = playerName[foodChain.find(chain => chain.hunter == socket.id).target] + "님을 잡으세요!";
            updateChat(data.room.chat);
        }
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
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'block'));
                        break;
                    case 1:
                        blocks.push(game.add.image(value.x, value.y, 'breakableBlock'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'breakableBlock'));
                        break;
                    case 2:
                        blocks.push(game.add.image(value.x, value.y, 'leaf'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'leaf'));
                        break;
                    case 3:
                        blocks.push(game.add.image(value.x, value.y, 'log'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'log'));
                        break;
                    case 4:
                        blocks.push(game.add.image(value.x, value.y, 'woodleaf'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'woodleaf'));
                        break;
                    case 5:
                        blocks.push(game.add.image(value.x, value.y, 'water'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'water'));
                        break;
                    case 6:
                        blocks.push(game.add.image(value.x, value.y, 'cactus'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'cactus'));
                        break;
                    case 7:
                        blocks.push(game.add.image(value.x, value.y, 'cherry1'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'cherry1'));
                        break;
                    case 8:
                        blocks.push(game.add.image(value.x, value.y, 'cherry2'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'cherry2'));
                        break;
                    case 9:
                        blocks.push(game.add.image(value.x, value.y, 'flower'));
                        minimapAnchor.push(game.add.sprite(screenWidth - 230 + value.x * 210 / mapSize.x, screenHeight - 230 + value.y * 210 / mapSize.y, 'flower'));
                        break;
                }
                blocks[index].rotation = value.rotation;
                blocks[index].scale.setTo(value.size);
                blocks[index].anchor.setTo(0.5);
                blocks[index].type = value.type;
                if ((value.type == 2 || value.type == 4 || value.type == 7 || value.type == 8 || value.type == 9))
                {
                    if (Util.doubleDistance(player.body.position, blocks[index].position) <= Math.pow(blocks[index].width * 3 / 5, 2))
                        blocks[blocks.length - 1].alpha = 0.5;
                    else
                    {
                        enemiesData.forEach(enemy => {
                            if (Util.doubleDistance(enemy.body.position, blocks[index].position) <= Math.pow(blocks[index].width / 2, 2))
                                enemy.username.text = "";
                        })
                    }
                }

                minimapAnchor[minimapAnchor.length - 1].anchor.setTo(0.5, 0.5);
                minimapAnchor[minimapAnchor.length - 1].rotation = value.rotation;
                minimapAnchor[minimapAnchor.length - 1].fixedToCamera = true;
                minimapAnchor[minimapAnchor.length - 1].scale.setTo(220 / mapSize.x * value.size);
                minimapAnchor[minimapAnchor.length - 1].type = value.type;
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
        leftEnemyText[0].fill = "#999999";
    }
    emitter.x = data.x;
    emitter.y = data.y;
    emitter.start(true, 1500, null, 10);
});
socket.on("gameEnd", (value) => {
    lastedRoomid = parseInt(roomid);
    roomid = -2;
    player.gameEnd(value);
});
socket.on("addTail", () => {
    if (game.state.current == 'inGame')
        if (Math.random() >= 0.5)
            player.addTail();
});
socket.on("roomCreated", (data) => {
    if (game.state.current == 'main')
    {
        roomid = data.roomid;
    }
});
socket.on("joinSuccess", (data) => {
    if (game.state.current == 'main')
    {
        roomid = data.roomid;
    }
});
socket.on("joinFailed", (data) => {
    if (game.state.current == 'main')
    {
        if (data.error == 1) alert("존재하지 않는 방입니다.");
        if (data.error == 2) alert("비밀번호가 틀렸습니다.");
        if (data.error == 3) alert("이미 시작한 방입니다.");
        if (data.error == 4) alert("존재하지 않는 방입니다.");
    }
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
    socket.emit("chatPost", {username: username, description: document.getElementById("input").value}) ;   
    document.getElementById("input").value = "";
}

function updateChat(chat) {
    let messageUserElement = document.getElementsByClassName("messageUserName");
    let messageDescriptionElement = document.getElementsByClassName("messageDescription");
    while(chat.length != document.getElementsByClassName("messageUserName").length) {
        if (chat.length > document.getElementsByClassName("messageUserName").length)
            document.getElementById("chat").innerHTML += '<div class="message"><p class="messageUserName"> </p> : <p class="messageDescription"> </p></div>';
        else
            break;
    }

    chat.forEach((message, index) => {
        messageUserElement[index].innerHTML = message.username;
        messageDescriptionElement[index].innerHTML = message.description;
    });
}