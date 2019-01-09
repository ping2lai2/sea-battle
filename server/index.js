const app = require('http').createServer();
const io = require('socket.io')(app);

const PORT = process.env.PORT || 3333;

const SocketManager = require('./SocketManager');

io.on('connection', SocketManager);

app.listen(PORT, error => {
  if (error) {
    console.log(error);
  }
  console.log('Connected to port:' + PORT);
});
/*

app.listen(port);

io.on('connection', function(socket) {
  console.log('connected');
  socket.on('CHANGE_CLIENT', function(data) {
    socket.broadcast.emit('CHANGE_SERVER', data);
  });
});
*/
