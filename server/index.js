const app = require('http').createServer();
const io = require('socket.io')(app);

app.listen(3333);

io.on('connection', function(socket) {
  console.log('connected');
  socket.on('CHANGE_CLIENT', function(data) {
    socket.broadcast.emit('CHANGE_SERVER', data);
  });
});
