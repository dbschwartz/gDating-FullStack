var io = require('socket.io')();

io.on('connection', function (socket) {
  socket.emit('gdating.ping', 'You are connected to the gDating socket!');
});

module.exports = io;
