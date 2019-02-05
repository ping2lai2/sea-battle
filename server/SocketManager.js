const {
  RECEIVE_GAME_ROOM,
  JOIN_GAME,
  OPPONENT_LEFT,
  USERS_TURN,
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
  LEAVE_ROOM,
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

const randomOpponentRooms = [];
const openedRooms = [];

module.exports = function(io) {
  io.on('connection', function(socket) {
    
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

    function handleFindRoom() {
      let roomID = randomOpponentRooms[0];

      if (roomID) {
        socket.emit(RECEIVE_GAME_ROOM, roomID);
      } else {
        roomID = createRoom();
        randomOpponentRooms.push(roomID);
        openedRooms.push({ roomID, gamers: [] });
      }
    }
    function handleJoinGame(roomID) {
      const roomIndex = openedRooms.findIndex(room => room.roomID === roomID);

      if (roomIndex < 0 || openedRooms[roomIndex].gamers.includes(socket.id)) {
        return false;
      }

      socket.join(roomID);
      openedRooms[roomIndex].gamers.push(socket.id);
      if (
        !!openedRooms[roomIndex] &&
        openedRooms[roomIndex].gamers.length === 2
      ) {
        randomOpponentRooms.shift();
        io.in(roomID).emit(ALL_PLAYERS_CONNECTED);

        const first = openedRooms[roomIndex].gamers[1 - defineFirst()];
        io.in(roomID).emit(USERS_TURN, {socketId: first});
        //io.sockets.connected[first].emit(USERS_TURN);
      }

      socket.on('disconnect', function() {
        socket.broadcast
          .to(roomID)
          .emit(OPPONENT_LEFT, { socketId: socket.id });
        io.of('/')
          .in(roomID)
          .clients((error, socketIds) => {
            if (error) throw error;
            socketIds.forEach(socketId => {
              io.sockets.sockets[socketId].leave(roomID);
            });
          });

        const roomIndex = openedRooms.findIndex(room => room.roomID === roomID);
        const randomRoomIndex = randomOpponentRooms.indexOf(roomID);
        if (roomIndex >= 0) {
          openedRooms.splice(roomIndex, 1);
        }
        if (randomRoomIndex >= 0) {
          randomOpponentRooms.splice(randomRoomIndex, 1);
        }
      });
    }
    function handleRequestGameRole(roomID) {
      const roomIndex = openedRooms.findIndex(room => room.roomID === roomID);

      if (
        !!openedRooms[roomIndex] &&
        openedRooms[roomIndex].gamers.length < 2
      ) {
        io.to(`${socket.id}`).emit(RECEIVE_GAME_ROLE, true);
      } else {
        io.to(`${socket.id}`).emit(RECEIVE_GAME_ROLE, false);
      }
    }
    function handleRequestGameData(roomID) {
      if (openedRooms.findIndex(room => room.roomID === roomID) < 0) {
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

    /*-----------------------------------------------*/

    function handleLeaveRoom(payload) {
      socket.leave(payload.roomID);
    }

    function handleOpponentWinning(payload) {
      socket.broadcast
        .to(payload.roomID)
        .emit(USER_HAS_WON, { socketId: socket.id });
      io.of('/')
        .in(payload.roomID)
        .clients((error, socketIds) => {
          if (error) throw error;
          socketIds.forEach(socketId =>
            io.sockets.sockets[socketId].leave(payload.roomID)
          );
        });
      const roomIndex = openedRooms.findIndex(
        room => room.roomID === payload.roomID
      );
      if (roomIndex >= 0) {
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
