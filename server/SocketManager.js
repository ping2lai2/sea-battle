const {
  REQUEST_GAME_ROOM,
  RECEIVE_GAME_ROOM,
  DISABLE_GAME,
  JOIN_GAME,
  OPPONENT_READY,
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
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

// TODO: проверить, работает ли, если с разных заходить
module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on(REQUEST_GAME_ROOM, handleRequestGameRoom); //делаем комнату, конектимся к игре,
    socket.on(JOIN_GAME, handleJoinGame); // присоединились к игре
    //socket.on(USER_READY, handleUserReady); //check

    socket.on(SEND_SHOOT, handleSendShoot);
    socket.on(SEND_SHOOT_FEEDBACK, handleSendShootFeedback);
    socket.on(SEND_DESTROYED_SHIP, handleSendDestroyedShip);
    socket.on(OPPONENT_HAS_WON, handleOpponentWinning);


    function handleOpponentWinning(payload) {
      console.log(payload);
      console.log('yeeeeeee');
      socket.broadcast.to(payload.roomID).emit(USER_HAS_WON);
    }

    function handleSendDestroyedShip(payload) {
      console.log(payload);
      socket.broadcast.to(payload.roomID).emit(RECEIVE_DESTROYED_SHIP, {
        index: payload.index,
        ship: payload.ship,
      });
    }

    function handleSendShootFeedback(payload) {
      console.log(payload);
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT_FEEDBACK, {
        cell: payload.cell,
        hit: payload.hit,
      });
    }

    function handleSendShoot(payload) {
      console.log(payload);
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT, payload.cell);
    }
    function handleRequestGameRoom() {
      //ищем пустую комнату, если не находим, то делаем новую

      /*//its works
      console.log(socket.id);
      console.log(io.sockets.connected);
      */
      const rooms = io.sockets.adapter.rooms;
      for (let roomID in rooms) {
        const gameRoom = rooms[roomID];
        if (gameRoom.isEmpty !== undefined && gameRoom.isEmpty) {
          //если нашли пустую комнату, заходим туда с криком, что заняли
          //так как это второй игрок, то начинаем игру

          //socket.broadcast.to(gameRoom).emit(OPPONENT_READY);
          gameRoom.isEmpty = false;
          socket.emit(RECEIVE_GAME_ROOM, roomID);
          socket.join(roomID);
          io.in(roomID).emit(ALL_PLAYERS_CONNECTED);
          console.log(gameRoom.sockets);
          const first = Object.keys(gameRoom.sockets)[1 - defineFirst()];
          io.sockets.connected[first].emit(CAN_USER_SHOOT);

          return false;
        }
      }
      console.log('create neew');
      createNewRoom();
    }
    function createNewRoom() {
      let roomID = uuidv4();
      while (true) {
        if (Object.keys(io.sockets.adapter.rooms).indexOf(roomID) > -1) {
          roomID = uuidv4();
        } else {
          socket.emit(RECEIVE_GAME_ROOM, roomID);
          socket.join(roomID);
          io.sockets.adapter.rooms[roomID].isEmpty = true;
          break;
        }
      }
    }
    function defineFirst() {
      return Math.floor(Math.random() * 2);
    }

    function handleUserReady(roomID) {
      socket.broadcast.to(roomID).emit(OPPONENT_READY);
    }
    // TODO: странные проверки
    function handleJoinGame(roomID) {
      console.log('two', roomID);

      //socket.broadcast.to(roomID).emit('lol');
      const clients = io.sockets.adapter.rooms[roomID];
      if (clients !== undefined && clients.length === 2) {
      }

      if (clients === undefined || clients.length < 2) {
      } else {
        // это надо отрезать и нужно два типа игр, пока по шаблону
        console.log('leave');
        socket.emit(DISABLE_GAME);
        socket.leave(roomID);
      }
      if (clients === undefined) {
        io.sockets.adapter.rooms[roomID].isEmpty = true;
        //ТУТ НИЧЕГО ДЕЛАТЬ НЕ НАДО
        // если клиентов нет, то... входящий - ходит первым TODO: (переделать)
        socket.emit(CAN_USER_SHOOT);
      }
      if (clients !== undefined && clients.length === 1) {
        io.sockets.adapter.rooms[roomID].isEmpty = false;
        console.log('yes2');
        io.in(roomID).emit(ALL_PLAYERS_CONNECTED);
        console.log(io.sockets.adapter.rooms[roomID]);
        //ВСЕ ИГРОКИ ПОДСОЕДИНИЛИСЬ НУЖНА РУЛЕТКА НА ПРАВО ПЕРВОГО ХОДА
      }
      socket.on('disconnect', function() {
        socket.broadcast.to(roomID).emit(OPPONENT_LEFT);
      });
    }
  });
};
