/* global io */

var Pong = require('../elements/pong').Pong;
var Lobby = require('../elements/lobby').Lobby;


window.onload = function() {
  var
    _io = io(),
    canvas = document.querySelector('canvas'),
    ctx;

  var lobby = new Lobby(_io);

  _io.on('game:ready', function() {

    lobby.hide();
    ctx = canvas.getContext('2d');
    canvas.width = Math.max(window.innerWidth, window.innerHeight);
    canvas.height = Math.min(window.innerWidth, window.innerHeight);
    var p = new Pong(_io, ctx);
    p.draw();
  });

};
