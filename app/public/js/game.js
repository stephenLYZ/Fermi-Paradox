function Pong() {
    var self = this;
    var socket = io();
    socket.on('disconnect', function(data) {
        var msg = 'Connection loss :\\';
        console.error(msg+"\n"+data);
        window.alert(msg+"\n"+data);
        location.href = location.href.replace(location.hash,"");
    });
    socket.on('error', function(data) {
        console.error(data);
        window.alert(data);
        location.href = location.href.replace(location.hash,"");
    });
    socket.on('errorMsg', function(data) {
        console.error("[Error:"+data.num+"] "+data.msg);
        window.alert("Error "+data.num+"\n"+data.msg);
        location.href = location.href.replace(location.hash,"");
    });

    var pingTime;
    var ping;
    socket.on('pong', function () {
        latency = Date.now() - pingTime;
        ping = latency;
    });

    function measurePing() {
        setTimeout(function () {
            pingTime = Date.now();
            socket.emit('ping');
            measurePing();
        }, 2000);
    }
    measurePing();

    var debug = false;

    var gameDiv = "game";
    var gameWidth = parseInt(document.getElementById(gameDiv).offsetWidth);
    var gameHeight = parseInt(document.getElementById(gameDiv).offsetHeight);

    var game = new Phaser.Game(gameWidth, gameHeight, debug ? Phaser.CANVAS : Phaser.AUTO, gameDiv, null, false, false);

    var host = false;
    var paddles = [];
    var sprites;
    var ball;

    var currentPlayer = -1;
    var master = false;
    var cursors;

    var colors = ["ff0000", "00ff00", "0000ff", "ffff00"];

    var ballSize = 10;
    var halfBallSize = ballSize / 2;
    var padSize = 8;
    var halfPadSize = padSize / 2;
    var moveFactor = 5;
    var maxScore = 10;

    function demoMovements(inactivePlayers) {
        if (inactivePlayers == undefined) {
            inactivePlayers = {0:true, 1:true};
        }

        for (var i in paddles) {
            if (!inactivePlayers[i]) {
                continue;
            }

            var p = paddles[i];
            var pH2 = p.body.height/2;
            var pW2 = p.body.width/2;
            switch (parseInt(i)) {
                case 0:
                case 2:
                    if (ball.body.x >= pW2 && ball.body.x <= game.world.width - pW2) {
                        p.position.x = ball.position.x;
                    }
                break;
                case 1:
                case 3:
                    if (ball.body.y >= pH2 && ball.body.y <= game.world.height - pH2) {
                        p.position.y = ball.position.y;
                    }
                break;
            }
        }
    }

    var BootState = {
        preload: function () {
            game.load.image('loadingBar', 'res/textures/loading.png');
        },
        create: function () {
            game.state.start('preload');
        }
    };

    var LoadingState = {
        preload: function () {
            game.stage.disableVisibilityChange = true;

            this.loadingBar = game.add.sprite(0, 0, 'loadingBar');
            // Center the preload bar
            this.loadingBar.x = game.world.centerX - this.loadingBar.width / 2;
            this.loadingBar.y = game.world.centerY - this.loadingBar.height / 2;
            game.load.setPreloadSprite(this.loadingBar);

            game.load.image('pixel', 'res/sprites/pixel.png');
        },
        create: function () {
            this.loadingBar.destroy();

            game.physics.startSystem(Phaser.Physics.ARCADE);

            sprites = game.add.group();

            ball = sprites.create(game.world.centerX - halfBallSize, game.world.centerY - halfBallSize, 'pixel');
            ball.name = 'ball';
            ball.scale.setTo(ballSize, ballSize);
            ball.anchor.setTo(0.5, 0.5);

            game.physics.enable([ball], Phaser.Physics.ARCADE);
            var sign = game.rnd.integerInRange(0,1) == 0 ? 1 : -1;
            ball.body.velocity.x = game.rnd.integerInRange(100, 250) * sign;
            ball.body.velocity.y = game.rnd.integerInRange(100, 250) * sign;
            ball.body.bounce.x = 1;
            ball.body.bounce.y = 1;
            ball.body.minBounceVelocity = 0;
            ball.player = -1;

            paddles = [];
            paddles.push(sprites.create(game.world.centerX - halfPadSize, halfPadSize, 'pixel'));
            paddles.push(sprites.create(halfPadSize, game.world.height / 2 - halfPadSize, 'pixel'));
            paddles.push(sprites.create(game.world.centerX - halfPadSize, game.world.height - halfPadSize, 'pixel'));
            paddles.push(sprites.create(game.world.width - halfPadSize, game.world.centerY - halfPadSize, 'pixel'));

            paddles[0].tint = 0xffffff;
            paddles[1].tint = 0x000000;
            paddles[2].tint = 0xffffff;
            paddles[3].tint = 0x000000;

            for (var i in paddles) {
                paddles[i].op = paddles[i].position;
                paddles[i].player = i;
                paddles[i].name = 'Player' + (parseInt(i) + 1);
                if (i % 2 == 0) {
                    paddles[i].scale.setTo(padSize*10, 10);
                }
                else {
                    paddles[i].scale.setTo(10, game.world.height);
                }
                paddles[i].anchor.setTo(0.5, 0.5);
                game.physics.enable([ paddles[i] ], Phaser.Physics.ARCADE);
                paddles[i].body.bounce.x = 1;
                paddles[i].body.bounce.y = 1;
                paddles[i].body.minBounceVelocity = 0;
                paddles[i].body.immovable = true;
                paddles[i].body.collideWorldBounds = true;
            }
        },
        update: function () {
            game.physics.arcade.collide(ball, paddles, function (ball, player) {
                ball.tint = 0xffffff;
            });

            demoMovements();
        }
    };

    var SynchState = {
        p: false,
        players: 0,
        countdown: false,
        init: function (data) {
            game.stage.disableVisibilityChange = true;

            var self = this;

            self.players = parseInt(data.playersCount);
            if (data.hosting) {
                self.p = 0;
                host = true;
                socket.emit('startCounting', socket.id);
            }
            else {
                self.p = data.playersCount -1;
                socket.on('joined', function (data) {
                    self.players = parseInt(data.playersCount);
                });
                socket.on('playerLeft', function (data) {
                    self.players = parseInt(data.playersCount);
                });
            }
            socket.on('timeOut', function(data, ack) {
                self.countdown = parseInt(data.times);
                ack(socket.id);
            });
        },
        preload: function () {
            cursors = game.input.keyboard.createCursorKeys();
        },
        create: function () {
            var style = {font: "30px Arial", fill: "#ffffff", align: "center"};
            this.text = game.add.text(game.world.centerX, game.world.centerY, "Awaiting other players (" + this.players + "/2)", style);
            this.text.anchor.setTo(0.5, 0.5);
        },
        update: function () {
            game.physics.arcade.collide(ball, paddles, function (ball, player) {
                ball.tint = 0xffffff;
            });

            if (this.countdown === false) {
                demoMovements();
            }
            else {
                this.initGame(this.countdown);
            }

            if (this.countdown !== false) {
                this.text.text = "Ready to start...";
            }
            else if (host || this.players == 2) {
                this.text.text = "Waiting for sync...";
            }
            else {
                this.text.text = "Awaiting other players (" + this.players + "/2)";
            }
        },
        initGame: function(phase) {
            switch(phase) {
                case 1:
                    ball.position.setTo(game.world.width / 2, game.world.height / 2);
                    ball.tint = 0xffffff;
                    ball.player = -1;
                    ball.body.velocity.x = 0;
                    ball.body.velocity.y = 0;
                case 2:
                    for (var i in paddles) {
                        paddles[i].position.setTo(paddles[i].op.x,paddles[i].op.y);
                    }
                    this.text.text = "GO!";
                case 3:
                    socket.removeAllListeners('joined');
                    socket.removeAllListeners('timeOut');
                    socket.removeAllListeners('playerLeft');
                    this.text.destroy();
                    game.state.start("game", false, false, { player: this.p });
                break;
            }
        }
    };

    var GameState = {
        inactivePlayers: { 0:false, 1:false },
        gameRunning: false,
        init: function (data) {
            game.stage.disableVisibilityChange = true;

            var self = this;
            currentPlayer = data.player;
            master = data.player == 0;

            socket.on('playerLeft', function (data) {
                self.inactivePlayers[parseInt(data.playerLeft)] = true;
            });
            socket.on('clientUpdate', function(data) {
                self.updateClient(data);
            });
            socket.on('clientUpdateScores', function(data) {
                self.updateClientScores(data);
            });
            socket.on('clientUpdateBall', function (data) {
                self.updateClientBall(data);
            });
            socket.on('becomeHost', function (data) {
                master = true;
                ball.body.velocity.x = ball.currentSpeedX;
                ball.body.velocity.y = ball.currentSpeedY;
            });
        },
        create: function () {
            if (!master) {
                ball.body.velocity.x = 0;
                ball.body.velocity.y = 0;
            }
            else {
                var sign = game.rnd.integerInRange(0,1) == 0 ? 1 : -1;
                ball.body.velocity.x = game.rnd.integerInRange(100, 250) * sign;
                ball.body.velocity.y = game.rnd.integerInRange(100, 250) * sign;
            }

            var scoresPos = [
                {w: game.world.centerX, h: game.world.centerY - 100},
                {w: game.world.centerX - 100, h: game.world.centerY},
                {w: game.world.centerX, h: game.world.centerY + 100},
                {w: game.world.centerX + 100, h: game.world.centerY}
            ];

            for (var i in paddles) {
                paddles[i].position.setTo(paddles[i].op.x,paddles[i].op.y);
                var style = {font: "50px Arial", fill: "#" + colors[i], align: "center"};
                paddles[i].scoreLabel = game.add.text(scoresPos[i].w, scoresPos[i].h, "0", style);
                paddles[i].scoreLabel.anchor.setTo(0.5, 0.5);
            }

            this.gameRunning = true;
        },
        update: function () {
            if (this.gameRunning) {
                for (var i in paddles) {
                    if (paddles[i].scoreLabel.text >= maxScore) {
                        this.endGame(paddles[i]);
                        return;
                    }
                }

                if (master) {
                    game.physics.arcade.collide(ball, paddles, function (ball, player) {
                        ball.tint = player.tint;
                        ball.player = player.player;

                        var data = {socketId: socket.id};
                        data['ballTint'] = ball.tint;
                        socket.emit('gameBall', data);
                    });
                    this.checkScore();
                }
                this.inputManagement();
                demoMovements(this.inactivePlayers);
                this.updateServer();
            }
        },
        checkScore: function () {
            if (master) {
                var scored = false;
                if (ball.body.y < -ball.body.height) {
                    scored = true;
                    if (ball.player == -1 || ball.player == 0) {
                        paddles[0].scoreLabel.text--;
                        scored = true;
                    }
                    else {
                        paddles[ball.player].scoreLabel.text++;
                    }
                }
                else if (ball.body.y > game.world.height + ball.body.height) {
                    scored = true;
                    if (ball.player == -1 || ball.player == 2) {
                        paddles[2].scoreLabel.text--;
                    }
                    else {
                        paddles[ball.player].scoreLabel.text++;
                    }
                }

                if (scored) { //reset ball position
                    var data = { socketId: socket.id };
                    data['scores'] = [];
                    for(var i in paddles) {
                        data['scores'].push(parseInt(paddles[i].scoreLabel.text));
                    }
                    socket.emit('gameScores', data);

                    ball.body.position.setTo(game.world.centerX, game.world.centerY);
                    ball.player = -1;
                    ball.tint = 0xffffff;

                    var sign = game.rnd.integerInRange(0,1) == 0 ? 1 : -1;
                    ball.body.velocity.x = game.rnd.integerInRange(100, 250) * sign;
                    ball.body.velocity.y = game.rnd.integerInRange(100, 250) * sign;
                }
            }
        },
        inputManagement: function () {
            var p = paddles[currentPlayer];

            if (cursors.left.isDown || cursors.up.isDown) {
                switch (currentPlayer) {
                    case 0:
                    case 2:
                        p.position.x -= moveFactor;
                    break;
                    case 1:
                    case 3:
                        p.position.y -= moveFactor;
                    break;
                }
            }
            else if (cursors.right.isDown || cursors.down.isDown) {
                switch (currentPlayer) {
                    case 0:
                    case 2:
                        p.position.x += moveFactor;
                    break;
                    case 1:
                    case 3:
                        p.position.y += moveFactor;
                    break;
                }
            }
            else {
                switch (currentPlayer) {
                    case 0: case 2:
                        if (game.input.activePointer.x >= paddles[currentPlayer].position.x + moveFactor) {
                            p.position.x += moveFactor;
                        }
                        else if (game.input.activePointer.x <= paddles[currentPlayer].position.x - moveFactor) {
                            p.position.x -= moveFactor;
                        }
                    break;
                    case 1: case 3:
                        if (game.input.activePointer.y >= paddles[currentPlayer].position.y + moveFactor) {
                            p.position.y += moveFactor;
                        }
                        else if (game.input.activePointer.y <= paddles[currentPlayer].position.y - moveFactor) {
                            p.position.y -= moveFactor;
                        }
                    break;
                }
            }

            var pH2 = p.body.height/2;
            var pW2 = p.body.width/2;
            switch (currentPlayer) {
                case 0: case 2:
                    if (p.position.x < pW2) {
                        p.position.x = pW2;
                    }
                    else if (p.position.x > game.world.width - pW2) {
                        p.position.x = game.world.width - pW2;
                    }
                break;
                case 1: case 3:
                    if (p.position.y < pH2) {
                        p.position.y = pH2;
                    }
                    else if (p.position.y > game.world.height - pH2) {
                        p.position.y = game.world.height - pH2;
                    }
                break;
            }
        },
        endGame: function (player) {
            this.gameRunning = false;

            for (var i in paddles) {
                paddles[i].scoreLabel.destroy();
                paddles[i].destroy();
            }

            ball.destroy();
            var style = {font: "50px Arial", fill: "#ffffff", align: "center"};
            var wonSentence = player.player == currentPlayer ? "You win!" : player.name + " wins!";
            var text = game.add.text(game.world.centerX, game.world.centerY, wonSentence, style);
            text.anchor.setTo(0.5, 0.5);

            socket.removeAllListeners('playerLeft');
            socket.removeAllListeners('clientUpdate');
            socket.removeAllListeners('clientUpdateScores');
            socket.removeAllListeners('clientUpdateBall');
            socket.removeAllListeners('becomeHost');
            socket.removeAllListeners('disconnect');
            socket.removeAllListeners('errorMsg');
            socket.removeAllListeners('error');

            $("#connect tr").addClass("hide");
            $("#endContainer").removeClass("hide");
            $("#connect").removeClass("hide").css("background-color", "transparent");

            setTimeout(function() {
                socket.disconnect();
            }, 5000);
        },
        socketTiming: 0,
        socketDelay: 16,
        getSocketDelay: function() {
            return ping < this.socketDelay ? ping : this.socketDelay;
        },
        updateServer: function () {
            this.socketTiming+=game.time.elapsed;
            if (this.socketTiming < this.getSocketDelay()) {
                return;
            }
            this.socketTiming = 0;
            var data = { socketId: socket.id };

            if (master) {
                data['ball'] = true;
                data['ballX'] = parseFloat(ball.position.x).toFixed(2);
                data['ballY'] = parseFloat(ball.position.y).toFixed(2);
                data['ballSpeedX'] = parseFloat(ball.body.velocity.x).toFixed(2);
                data['ballSpeedY'] = parseFloat(ball.body.velocity.y).toFixed(2);
            }
            else {
                data['ball'] = false;
            }

            data['player'] = parseInt(currentPlayer);
            switch(data['player']) {
                case 0:
                case 2:
                    data['paddle'] = parseFloat(paddles[currentPlayer].position.x).toFixed(2);
                break;
                case 1:
                case 3:
                    data['paddle'] = parseFloat(paddles[currentPlayer].position.y).toFixed(2);
                break;
            }

            socket.emit('gameUpdate', data);
        },
        updateClient: function (data) {
            if (!master && data.ball == true) {
                ball.position.x = parseFloat(data.ballX);
                ball.position.y = parseFloat(data.ballY);
                ball.currentSpeedX = parseFloat(data.ballSpeedX);
                ball.currentSpeedY = parseFloat(data.ballSpeedY);
            }

            if (currentPlayer != data.player) {
                switch(parseInt(data.player)) {
                    case 0:
                    case 2:
                        paddles[data.player].position.x = parseFloat(data.paddle);
                    break;
                    case 1:
                    case 3:
                        paddles[data.player].position.y = parseFloat(data.paddle);
                    break;
                }
            }
        },
        updateClientScores: function(data) {
            if (!master) {
                ball.tint = 0xffffff;
                for(var i in data.scores) {
                    paddles[i].scoreLabel.text = parseInt(data.scores[i]);
                }
            }
        },
        updateClientBall: function(data) {
            if (!master) {
                ball.tint = data.ballTint;
            }
        },
        render: function () {
            if (debug) {
                game.debug.body(ball);
                for (var i in paddles) {
                    game.debug.body(paddles[i]);
                }
            }
        }
    };

    game.state.add("boot", BootState, true);
    game.state.add("preload", LoadingState, false);
    game.state.add("sync", SynchState, false);
    game.state.add("game", GameState, false);

    this.switchToSync = function(data) {
        game.state.start("sync", false, false, data);
    };

    this.getSocket = function() {
        return socket;
    };

    return this;
}

Pong.prototype.getSocket = function () {
    return this.getSocket();
};
Pong.prototype.sync = function(data) {
    this.switchToSync(data);
};
