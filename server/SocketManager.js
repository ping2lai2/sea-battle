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
  REQUEST_GAME_ROLE,
  RECEIVE_GAME_ROLE,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  GET_GAME_DATA,
  POST_GAME_DATA,
  LEAVE_ROOM
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

const randomOpponentRooms = [];
const openedRooms = [];



module.exports = function(io) {
  io.on('connection', function(socket) {

    function handleFindRoom() {
      let roomID = randomOpponentRooms[0];

      if (roomID) {
        const roomIndex = openedRooms.findIndex((room)=>room.roomID===roomID);
        openedRooms[roomIndex].gamers.push(socket.id);
        socket.emit(RECEIVE_GAME_ROOM, roomID);
      } else {
        roomID = createRoom();
        randomOpponentRooms.push(roomID);
        openedRooms.push({roomID, gamers: [socket.id] });
      }
    }
    function handleJoinGame(roomID) {
      
      if (openedRooms.findIndex((room)=>room.roomID===roomID) < 0) {
        return false;
      }
      socket.join(roomID);
      const clients = io.sockets.adapter.rooms[roomID];
      if (clients.length === 2) {
        randomOpponentRooms.shift();
        io.in(roomID).emit(ALL_PLAYERS_CONNECTED); // получившие эту запись являются игроками
        console.log('game is started');
        const gameRoom = io.sockets.adapter.rooms[roomID];
        const first = Object.keys(gameRoom.sockets)[1 - defineFirst()];
        io.sockets.connected[first].emit(CAN_USER_SHOOT);
      }
      socket.on('disconnect', function() {
        //  если в комнате один игрок и он вышел, то комната не удаляется из списка!
        // заходит второй игрок, комната удаляется из списка, проверяем наличие игроков, если меньше нужного, объявляем победу
        //TODO: при перезагрузке страницы всё идет не так как надо
        socket.broadcast.to(roomID).emit(OPPONENT_LEFT);
        io.of('/')
          .in(roomID)
          .clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId => {
              console.log('disconnected ', socketId);
              io.sockets.sockets[socketId].leave(roomID);
            });
          });
        console.log('--------disconect');
        console.log(openedRooms);
        console.log(openedRooms.findIndex((room)=>room.roomID===roomID));
        const roomIndex = openedRooms.findIndex((room)=>room.roomID===roomID);
        const randomRoomIndex = randomOpponentRooms.findIndex((room)=>room.roomID===roomID); //если создали комнату и задисконнектили, её нужно удалить из этого списка
        if (roomIndex > 0) {
          openedRooms.splice(roomIndex, 1);
        }
        if (roomIndex > 0) {
          randomOpponentRooms.splice(randomRoomIndex, 1);
        }
      });
    }
    function handleRequestGameRole(roomID) {
      const clients = io.sockets.adapter.rooms[roomID];
      if (clients === undefined || clients.length < 2) {
        io.to(`${socket.id}`).emit(RECEIVE_GAME_ROLE, true);
      } else {
        io.to(`${socket.id}`).emit(RECEIVE_GAME_ROLE, false);
      }
    }
    function handleRequestGameData(roomID) {
      if (openedRooms.findIndex((room)=>room.roomID===roomID) < 0) {
        return false;
      }
      socket.join(roomID);
      //const clients = io.sockets.adapter.rooms[roomID];
      io.in(roomID).emit(GET_GAME_DATA, socket.id); // получившие эту запись являются игроками
    }
    function handlePostGameData(data) {
      io.to(`${data.socketId}`).emit(RECEIVE_GAME_DATA, {
        busyCellsMatrix: data.busyCellsMatrix,
        ships: data.ships,
        socketId: socket.id,
      });
    }
    function createRoom() {
      const roomID = uuidv4();
      socket.emit(RECEIVE_GAME_ROOM, roomID);
      return roomID;
    }

    socket.on(JOIN_GAME, handleJoinGame);
    socket.on(SEND_SHOOT, handleSendShoot);
    socket.on(SEND_SHOOT_FEEDBACK, handleSendShootFeedback);
    socket.on(SEND_DESTROYED_SHIP, handleSendDestroyedShip);
    socket.on(OPPONENT_HAS_WON, handleOpponentWinning);
    socket.on(SEND_MESSAGE, handleReceiveMessage);
    socket.on(FIND_ROOM, handleFindRoom);
    socket.on(REQUEST_GAME_ROLE, handleRequestGameRole);
    socket.on(REQUEST_GAME_DATA, handleRequestGameData);
    socket.on(POST_GAME_DATA, handlePostGameData);
    socket.on(LEAVE_ROOM, handleLeaveRoom);

    function handleLeaveRoom(payload) {

      socket.leave(payload);
    }

    function handleOpponentWinning(payload) {
      socket.broadcast.to(payload.roomID).emit(USER_HAS_WON);
      io.of('/')
        .in(payload.roomID)
        .clients((error, socketIds) => {
          if (error) throw error;
          socketIds.forEach(socketId =>
            io.sockets.sockets[socketId].leave(payload.roomID)
          );
        });
      const roomIndex = openedRooms.findIndex((room)=>room.roomID===payload.roomID);
      if (roomIndex > 0) {
        openedRooms.splice(roomIndex, 1);
      }
    }

    function handleSendDestroyedShip(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_DESTROYED_SHIP, {
        index: payload.index,
        ship: payload.ship,
        socketId: socket.id,
      });
    }

    function handleSendShootFeedback(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT_FEEDBACK, {
        cell: payload.cell,
        hit: payload.hit,
        socketId: socket.id,
      });
    }

    function handleSendShoot(payload) {
      socket.broadcast.to(payload.roomID).emit(RECEIVE_SHOOT, payload.cell);
    }
    function handleReceiveMessage(payload) {
      socket.broadcast.to(payload.gameId).emit(RECEIVE_MESSAGE, {
        name: payload.name,
        text: payload.text,
        socketId: socket.id,
      });
    }

    function defineFirst() {
      return Math.floor(Math.random() * 2);
    }
  });
};

/*
      if (gameIsRunRooms.indexOf(roomID) >= 0) {
        //TODO: дублируешь дисконект
        console.log('ffffff');
        socket.broadcast.to(roomID).emit(OPPONENT_LEFT);
        io.of('/')
          .in(roomID)
          .clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId =>
              io.sockets.sockets[socketId].leave(roomID)
            );
          });
        gameIsRunRooms.splice(gameIsRunRooms.indexOf(roomID), 1); //TODO:!!!!!!!
        openedRooms.splice(openedRooms.indexOf(roomID), 1);
        //TODO: кидать сообщение, что комната закрылась т.к. перезагрузили страницу
        console.log('--------------------reload');
        console.log('gameIsRunRooms', gameIsRunRooms);
        console.log('openedRooms', openedRooms);
        return false;
      }
      */
