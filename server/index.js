
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));

const PORT = process.env.PORT || 3333;

app.use(express.static(__dirname + '/../dist'));

require('./SocketManager')(io);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to port:' + PORT);
});

