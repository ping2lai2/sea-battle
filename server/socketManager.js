const {
  RECEIVE_RANDOM_ROOM,
  RECEIVE_OWN_ROOM,
  REQUEST_RANDOM_ROOM,
  REQUEST_OWN_ROOM,
  JOIN_RANDOM_GAME,
  JOIN_OWN_GAME,
  CLOSE_RANDOM_GAME,
  CLOSE_OWN_GAME,
  REQUEST_CHECK_ROOM,
  RECEIVE_CHECK_ROOM,
  OPPONENT_LEFT,
  USERS_TURN,
  SEND_SHOOT,
  RECEIVE_SHOOT,
  SEND_SHOOT_FEEDBACK,
  RECEIVE_SHOOT_FEEDBACK,
  SEND_DESTROYED_SHIP,
  RECEIVE_DESTROYED_SHIP,
  OPPONENT_HAS_WON,
  GAMER_HAS_WON,
  SEND_MESSAGE,
  RECEIVE_MESSAGE,
  ALL_PLAYERS_CONNECTED,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  GET_GAME_DATA,
  POST_GAME_DATA,
  GREETINGS_TO_ALL,
  RECEIVE_GREETING,
  LEAVE_ROOM,

  GAME_IS_ALREADY_RUNNING,
  RECEIVE_USERS_COUNT,
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

const openedRandomRoomsBuffer = [];
const ownRooms = [];
const randomRooms = [];

module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on(REQUEST_RANDOM_ROOM, handleRequestRandomRoom);
    socket.on(REQUEST_OWN_ROOM, handleRequestOwnRoom);

    socket.on(REQUEST_CHECK_ROOM, handleRequestCheckRoom);

    socket.on(JOIN_RANDOM_GAME, handleJoinRandomGame);
    socket.on(JOIN_OWN_GAME, handleJoinOwnGame);

    socket.on(CLOSE_RANDOM_GAME, handleCloseRandomGame);
    socket.on(CLOSE_OWN_GAME, handleCloseOwnGame);

    socket.on(SEND_SHOOT, handleSendShoot);
    socket.on(SEND_SHOOT_FEEDBACK, handleSendShootFeedback);
    socket.on(SEND_DESTROYED_SHIP, handleSendDestroyedShip);
    socket.on(OPPONENT_HAS_WON, handleOpponentWinning);
    socket.on(SEND_MESSAGE, handleReceiveMessage);
    socket.on(REQUEST_GAME_DATA, handleRequestGameData);
    socket.on(POST_GAME_DATA, handlePostGameData);
    socket.on(GREETINGS_TO_ALL, handleGreetingToAll);
    socket.on(LEAVE_ROOM, handleLeaveRoom);

    function handleRequestOwnRoom() {
      const roomId = uuidv4();
      socket.emit(RECEIVE_OWN_ROOM, roomId);
      ownRooms.push({ roomId, players: [], spectators: [], gameIsRun: false });
    }
    function handleRequestRandomRoom() {
      let roomId = openedRandomRoomsBuffer[0];

      if (roomId) {
        socket.emit(RECEIVE_RANDOM_ROOM, roomId);
      } else {
        roomId = uuidv4();
        socket.emit(RECEIVE_RANDOM_ROOM, roomId);
        openedRandomRoomsBuffer.push(roomId);
        randomRooms.push({ roomId, players: [] });
      }
    }
    function handleJoinRandomGame(payload) {
      socket.join(payload.roomId);
      const clients = io.sockets.adapter.rooms[payload.roomId];
      if (clients.length === 2) {
        io.in(payload.roomId).emit(ALL_PLAYERS_CONNECTED);
        openedRandomRoomsBuffer.shift();
        const first = Object.keys(clients.sockets)[1 - defineFirst()];
        io.in(payload.roomId).emit(USERS_TURN, { socketId: first });
      }
      socket.on('disconnect', function() {
        socket.broadcast
          .to(payload.roomId)
          .emit(OPPONENT_LEFT, { socketId: socket.id });
        io.of('/')
          .in(payload.roomId)
          .clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId => {
              io.sockets.sockets[socketId].leave(payload.roomId);
            });
          });
      });
    }
    function handleJoinOwnGame(payload) {
      const { roomId, userType } = payload;
      const roomIndex = ownRooms.findIndex(room => room.roomId === roomId);
      const currentRoom = ownRooms[roomIndex];
      if (roomIndex < 0) {
        socket.emit(RECEIVE_CHECK_ROOM, {
          roomId: roomId,
          checked: false,
        });
        return false;
      }
      if (currentRoom[userType].includes(socket.id)) {
        return false;
      }

      if (userType === 'players') {
        if (currentRoom.gameIsRun) {
          //game is running
          socket.emit(GAME_IS_ALREADY_RUNNING, {
            roomId,
            userType,
          });
          return false;
        } else {
          socket.join(roomId);
          currentRoom.players.push(socket.id);
          io.in(roomId).emit(RECEIVE_USERS_COUNT, {
            playersCount: currentRoom.players.length,
            spectatorsCount: currentRoom.spectators.length,
          });
          if (currentRoom.players.length === 2) {
            io.in(roomId).emit(ALL_PLAYERS_CONNECTED);
            currentRoom.gameIsRun = true;
            const first = currentRoom.players[1 - defineFirst()];
            io.in(roomId).emit(USERS_TURN, { socketId: first });
          }
          socket.on(
            'disconnect',
            function() {
              const roomIndex = ownRooms.findIndex(
                room => room.roomId === roomId
              );
              socket.broadcast
                .to(roomId)
                .emit(OPPONENT_LEFT, { socketId: socket.id });
              io.of('/')
                .in(roomId)
                .clients((error, socketIds) => {
                  if (error) throw error;
                  socketIds.forEach(socketId => {
                    io.sockets.sockets[socketId].leave(roomId);
                  });
                });
              if (roomIndex > -1) {
                ownRooms.splice(roomIndex, 1);
              }
            }
            //socket.removeListener('disconnect', _listener);
          );
        }
      } else {
        socket.join(roomId);
        currentRoom.spectators.push(socket.id);
        io.in(roomId).emit(RECEIVE_USERS_COUNT, {
          playersCount: currentRoom.players.length,
          spectatorsCount: currentRoom.spectators.length,
        });
        if (currentRoom.gameIsRun) {
          //game is running
          socket.emit(GAME_IS_ALREADY_RUNNING, {
            roomId,
            userType,
          });
        }
        socket.on('disconnect', function() {
          const gamerIndex = currentRoom[userType].findIndex(
            gamerId => gamerId === socket.id
          );
          currentRoom[userType].splice(gamerIndex, 1);
          //socket.leave(roomId); //Rooms are left automatically upon disconnection.
        });
      }
    }
    function handleCloseRandomGame(payload) {
      const randomRoomIndex = openedRandomRoomsBuffer.indexOf(payload.roomId);
      socket.leave(payload.roomId);
      openedRandomRoomsBuffer.splice(randomRoomIndex, 1);
    }

    function handleCloseOwnGame(payload) {
      const roomIndex = ownRooms.findIndex(
        room => room.roomId === payload.roomId
      );
      if (roomIndex < 0) {
        socket.emit(RECEIVE_CHECK_ROOM, {
          roomId: payload.roomId,
          checked: false,
        });
        return false;
      }
      const clients = io.sockets.adapter.rooms[payload.roomId];
      const currentRoom = ownRooms[roomIndex];
      const gamerIndex = currentRoom[payload.userType].findIndex(
        gamerId => gamerId === socket.id
      );
      if (!clients || clients.length < 2) {
        ownRooms.splice(roomIndex, 1);
      } else if (gamerIndex > -1) {
        currentRoom[payload.userType].splice(gamerIndex, 1);
        io.in(payload.roomId).emit(RECEIVE_USERS_COUNT, {
          playersCount: currentRoom.players.length,
          spectatorsCount: currentRoom.spectators.length,
        });
      }
      socket.leave(payload.roomId);
    }

    function handleRequestCheckRoom(payload) {
      const roomIndex = ownRooms.findIndex(
        room => room.roomId === payload.roomId
      );
      if (roomIndex < 0) {
        socket.emit(RECEIVE_CHECK_ROOM, {
          roomId: payload.roomId,
          checked: false,
        });
      } else {
        const currentRoom = ownRooms[roomIndex];
        socket.emit(RECEIVE_CHECK_ROOM, {
          roomId: payload.roomId,
          checked: true,
        });
        //TODO: разве это надо
        socket.emit(RECEIVE_USERS_COUNT, {
          playersCount: currentRoom.players.length,
          spectatorsCount: currentRoom.spectators.length,
        });
      }
    }

    /*-----------------------------------------------*/

    function handleGreetingToAll(payload) {
      socket
        .to(payload.roomId)
        .emit(RECEIVE_GREETING, { playersId: socket.id });
    }
    function handleRequestGameData(payload) {
      io.to(payload.roomId).emit(GET_GAME_DATA, socket.id);
    }

    function handlePostGameData(payload) {
      io.to(`${payload.socketId}`).emit(RECEIVE_GAME_DATA, {
        busyCellsMatrix: payload.busyCellsMatrix,
        ships: payload.ships,
        socketId: socket.id,
      });
    }

    function handleLeaveRoom(payload) {
      const { roomId, userType } = payload;
      const roomIndex = ownRooms.findIndex(room => room.roomId === roomId);
      const currentRoom = ownRooms[roomIndex];
      if (roomIndex > -1) {
        const gamerIndex = currentRoom[userType].findIndex(
          gamerId => gamerId === socket.id
        );
        currentRoom[userType].splice(gamerIndex, 1);
      }

      socket.leave(roomId);
    }

    function handleOpponentWinning(payload) {
      socket.broadcast
        .to(payload.roomId)
        .emit(GAMER_HAS_WON, { socketId: socket.id });
      io.of('/')
        .in(payload.roomId)
        .clients((error, socketIds) => {
          if (error) throw error;
          socketIds.forEach(socketId =>
            io.sockets.sockets[socketId].leave(payload.roomId)
          );
        });
      const roomIndex = randomRooms.findIndex(
        room => room.roomId === payload.roomId
      );
      if (roomIndex > -1) {
        randomRooms.splice(roomIndex, 1);
      }
    }

    function handleSendDestroyedShip(payload) {
      socket.broadcast.to(payload.roomId).emit(RECEIVE_DESTROYED_SHIP, {
        index: payload.index,
        ship: payload.ship,
        socketId: socket.id,
      });
    }

    function handleSendShootFeedback(payload) {
      socket.broadcast.to(payload.roomId).emit(RECEIVE_SHOOT_FEEDBACK, {
        cell: payload.cell,
        hit: payload.hit,
        socketId: socket.id,
      });
    }

    function handleSendShoot(payload) {
      socket.broadcast.to(payload.roomId).emit(RECEIVE_SHOOT, payload.cell);
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
