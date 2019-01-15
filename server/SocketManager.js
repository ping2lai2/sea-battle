const {
  RECEIVE_GAME_ROOM,
  JOIN_GAME,
  OPPONENT_LEFT,
  CAN_USER_SHOOT,
  SEND_SHOOT,
  RECEIVE_SHOOT,
  SEND_SHOOT_FEEDBACK,
  RECEIVE_SHOOT_FEEDBACK,
  SEND_DESTROYED_SHIP,
  RECEIVE_DESTROYED_SHIP,
  OPPONENT_HAS_WON,
  USER_HAS_WON,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  ALL_PLAYERS_CONNECTED,
  FIND_ROOM,
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

const randomOpponentRooms = [];
//const customOpponentRooms = [];

module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on(FIND_ROOM, handleFindRoom);

    function handleFindRoom() {
      let roomID = randomOpponentRooms.shift();
      if (roomID) {
        socket.emit(RECEIVE_GAME_ROOM, roomID);
      } else {
        roomID = createRoom();
        randomOpponentRooms.push(roomID);
      }
      socket.on('disconnect', function() {
        //  если в комнате один игрок и он вышел, то комната не удаляется из списка!
        // заходит второй игрок, комната удаляется из списка, проверяем наличие игроков, если меньше нужного, объявляем победу
        socket.broadcast.to(roomID).emit(OPPONENT_LEFT);
      });
    }
    function handleJoinGame(roomID) {
      socket.join(roomID);
      const clients = io.sockets.adapter.rooms[roomID];
      if (clients.length === 2) {
        io.in(roomID).emit(ALL_PLAYERS_CONNECTED); // получившие эту запись являются игроками
        const gameRoom = io.sockets.adapter.rooms[roomID];
        const first = Object.keys(gameRoom.sockets)[1 - defineFirst()];
        io.sockets.connected[first].emit(CAN_USER_SHOOT);
      }
    }
    function createRoom() {
      const roomID = uuidv4();
      socket.emit(RECEIVE_GAME_ROOM, roomID);
      return roomID;
    }

    /*
    
    socket.on(CREATE_CUSTOM_ROOM, handleCreateCustomRoom);
    socket.on(JOIN_CUSTOM_ROOM, handleJoinCustomRoom);

    function handleCreateCustomRoom() {
      const roomID = uuidv4();
      socket.emit(RECEIVE_CUSTOM_ROOM, roomID); //отправили айдишник в форму и на кнопку
    }

    function handleJoinCustomRoom(roomID) { //зашли с кнопки при создании
      socket.join(roomID);
      socket.emit(RECEIVE_GAME_ROOM, roomID);
      customOpponentRooms.push(roomID);
    }
*/


    socket.on(JOIN_GAME, handleJoinGame);
    socket.on(SEND_SHOOT, handleSendShoot);
    socket.on(SEND_SHOOT_FEEDBACK, handleSendShootFeedback);
    socket.on(SEND_DESTROYED_SHIP, handleSendDestroyedShip);
    socket.on(OPPONENT_HAS_WON, handleOpponentWinning);
    socket.on(SEND_MESSAGE, handleReceiveMessage);

    function handleOpponentWinning(payload) {
      socket.broadcast.to(payload.roomID).emit(USER_HAS_WON);
    }

    function handleSendDestroyedShip(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_DESTROYED_SHIP, {
        index: payload.index,
        ship: payload.ship,
      });
    }

    function handleSendShootFeedback(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT_FEEDBACK, {
        cell: payload.cell,
        hit: payload.hit,
      });
    }

    function handleSendShoot(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT, payload.cell);
    }
    function handleReceiveMessage(payload) {
      socket.broadcast.to(payload.gameId).emit(RECEIVE_MESSAGE, {
        name: payload.name,
        text: payload.text,
      });
    }

    function defineFirst() {
      return Math.floor(Math.random() * 2);
    }
  });
};
