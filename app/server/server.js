function server(io) {
    var debug = false;
    var timeOutDelay = 2500;
    var maxPlayers = 2;

    var clientPlayers = {};
    var clients = {};
    var hosts = {};
    var games = [];

    function log(msg, type) {
        if (type == undefined) {
            type = 'l';
        }

        if (type == 'e') {
            console.error(msg);
        }
        else if (type == 'w') {
            if (debug) {
                console.warn(msg);
            }
        }
        else {
            if (debug) {
                console.log(msg);
            }
        }
    }

    function in_array(search, array) {
        return array.indexOf(search) >= 0;
    }

    function makeGameId() {
        var r;
        do {
            r = (0|Math.random()*9e6).toString(36).substring(0,4);
        }
        while (in_array(r, games));
        return r;
    }

    function roomExists(room) {
        return io.nsps["/"].adapter.rooms[room] != undefined;
    }

    function getSocket(socketId) {
        return io.sockets.connected[socketId];
    }

    function getRoom(room) {
        return io.nsps["/"].adapter.rooms[room];
    }

    function socketsInRoom(room) {
        if (io == undefined) {
            log("io is undefined :\\",'e');
        }

        if (io.nsps["/"] == undefined) {
            log("/ namespace is undefined :\\",'e');
        }

        if (io.nsps["/"].adapter == undefined) {
            log("adapter is undefined :\\",'e');
        }

        if (io.nsps["/"].adapter.rooms == undefined) {
            log("rooms is undefined :\\",'e');
        }

        var r = getRoom(room);
        if (typeof r === 'object') {
            return Object.keys(r);
        }
        else {
            return [];
        }
    }

    function sendError(number, msg, socket, room) {
        try {
            if (room != undefined) {
                socket = socket.to(room);
            }
            socket.emit('errorMsg', {num: number, msg: msg});
        }
        catch(ex) {
            log(ex,'e');
        }
    }

    function startTimeOut(room, playerCounter, times) {
        if (playerCounter == undefined) {
            playerCounter = 0;
        }

        if (times == undefined) {
            times = 0;
        }

        var players = socketsInRoom(room);

        if (times > 3) {
            return;
        }
        else if (playerCounter >= maxPlayers) {
            startTimeOut(room, 0, ++times);
        }
        else {
            var sid = players[playerCounter];
            var socket = io.sockets.connected[players[playerCounter]];
            //var socket = getSocket(sid);
            if (socket != undefined) {
                log('ticking... '+times+' '+ sid);
                socket.emit('timeOut', {times: times}, function (socketId) {
                    log('ticking back... '+times+' '+ socketId);
                    startTimeOut(room, ++playerCounter, times);
                });
            }
            else {
                log('socket not found :\\ '+sid,'e');
            }
        }
    }

    io.on('connection', function(socket) {
        clients[socket.id] = null;

        socket.on('error', function(data) {
            log('onError','e');
            log(data,'e');
        });

        socket.on('host', function(data, ack) {
            var room = makeGameId();
            if (debug) room = 1;
            socket.join(room, function (err) {
                if (!err) {
                    clientPlayers[socket.id] = 0;
                    clients[socket.id] = room;
                    hosts[socket.id] = true;
                    ack(room);
                    log('host '+socket.id+' connected');
                }
                else {
                    log(err,'e');
                    sendError(1, "host: can't join room", socket);
                }
            });
        });

        socket.on('join', function(data, ack) {
            var room = data;
            if (debug) room = 1;
            if (roomExists(room)) {
                var c = socketsInRoom(room).length;
                if (c < 1) {
                    sendError(4, "that room doesn't exists", socket);
                }
                else if (c >= maxPlayers) {
                    sendError(5, "the room is full!", socket);
                }
                else {
                    socket.join(room, function (err) {
                        if (!err) {
                            clients[socket.id] = room;
                            var players = socketsInRoom(room);
                            clientPlayers[socket.id] = players.length - 1;
                            ack({ playersCount: players.length});
                            log('client ' + socket.id + ' connected to room ' + room + ' (' + players.length + '/'+maxPlayers+')');
                            io.to(room).emit('joined', { playersCount: players.length });
                        }
                        else {
                            log(err, 'e');
                            sendError(3, "client: can't join room", socket);
                        }
                    });
                }
            }
            else {
                sendError(2, "that room doesn't exists", socket);
            }
        });

        socket.on('startCounting', function(socketId) {
            var room = clients[socketId];
            var players = socketsInRoom(room);
            if (players.length == maxPlayers) {
                setTimeout(function () {
                    startTimeOut(room);
                }, timeOutDelay);
            }
            else {
                sendError(7, "players are not reachable :\\", socket, room);
            }
        });

        socket.on('disconnect', function() {
            var p = clientPlayers[socket.id];
            clientPlayers[socket.id] = null;
            delete clientPlayers[socket.id];

            var room = clients[socket.id];
            clients[socket.id] = null;
            delete clients[socket.id];

            var players = socketsInRoom(room);

            if (room != null && players.length > 0) {
                io.to(room).emit('playerLeft', { playerLeft: p, playersCount: players.length });

                if (hosts[socket.id] && players.length > 1) {
                    hosts[socket.id] = false;
                    delete hosts[socket.id];

                    var newSocketId = players[Math.floor(Math.random()*players.length)];
                    hosts[newSocketId] = true;

                    //sendError(6, "host left the game", socket, room);
                    getSocket(newSocketId).emit('becomeHost');
                }
                else if (players.length == 1) {
                    sendError(8, "the other players left the game!", socket, room);
                }
            }
            else {
                log('room destroyed');
                if (games[room] != undefined) {
                    delete games[room];
                }
            }
        });

        socket.on('ping', function() {
            socket.emit('pong');
        });

        socket.on('gameUpdate', function(data) {
            var room = clients[data.socketId];
            delete data.socketId;
            io.to(room).emit('clientUpdate', data);
        });
        socket.on('gameScores', function(data) {
            var room = clients[data.socketId];
            delete data.socketId;
            io.to(room).emit('clientUpdateScores', data);
        });
        socket.on('gameBall', function(data) {
            var room = clients[data.socketId];
            delete data.socketId;
            io.to(room).emit('clientUpdateBall', data);
        });
    });
}

module.exports = server;
