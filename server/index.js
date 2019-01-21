
var app = require('http').createServer();
var io = (module.exports.io = require('socket.io')(app));

const PORT = process.env.PORT || 3333;

/*
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = (module.exports.io = require('socket.io')(server));

const PORT = process.env.PORT || 3333;

app.use(express.static(__dirname + '/../dist'));

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to port:' + PORT);
});

*/
require('./SocketManager')(io);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Connected to port:' + PORT);
});

