
var app = require('http').createServer();
var io = (module.exports.io = require('socket.io')(app));

const PORT = process.env.PORT || 3333;

require('./SocketManager')(io);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to port:' + PORT);
});

