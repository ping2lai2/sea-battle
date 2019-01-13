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
  FIND_ROOM,
  CREATE_ROOM,
} = require('../common/socketEvents');

const uuidv4 = require('uuid/v4');

const randomOpponentRooms = [];
const customOpponentRooms = [];

module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on(FIND_ROOM, handleFindRoom);

    function handleFindRoom() {
      let roomID = randomOpponentRooms.shift();
      console.log(roomID);
      if (roomID) {
        // randomOpponentRooms[0];
        //const roomID = randomOpponentRooms.shift();
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
    // TODO: нужно запрашивать имя
    function handleJoinGame(roomID) {
      socket.join(roomID);
      const clients = io.sockets.adapter.rooms[roomID];
      console.log(roomID);
      console.log(clients.length);
      if (clients.length === 2) {
        console.log('there');
        io.in(roomID).emit(ALL_PLAYERS_CONNECTED); // получившие эту запись являются игроками
        // определить кто первый ходит
        const gameRoom = io.sockets.adapter.rooms[roomID];
        const first = Object.keys(gameRoom.sockets)[1 - defineFirst()];
        console.log(first);
        io.sockets.connected[first].emit(CAN_USER_SHOOT);
      }
    }
    function createRoom() {
      const roomID = uuidv4();
      // socket.join(roomID);
      socket.emit(RECEIVE_GAME_ROOM, roomID);
      return roomID;
    }

    //на это пока забью
    /*
    
    socket.on(CREATE_CUSTOM_ROOM, handleCreateCustomRoom);
    socket.on(JOIN_CUSTOM_ROOM, handleJoinCustomRoom);

    function handleCreateCustomRoom() {
      const roomID = uuidv4();
      socket.emit(RECEIVE_CUSTOM_ROOM, roomID); //отправили айдишник в форму и на кнопку
    }

    //TODO: придумать какой-нибудь параметр на клиенте, чтобы не пулять их на сервер при заходе
    function handleJoinCustomRoom(roomID) { //зашли с кнопки при создании
      socket.join(roomID);
      socket.emit(RECEIVE_GAME_ROOM, roomID);
      customOpponentRooms.push(roomID);
    }
*/

    console.log('connected');
    //socket.on(REQUEST_GAME_ROOM, handleRequestGameRoom); //делаем комнату, конектимся к игре,
    socket.on(JOIN_GAME, handleJoinGame); // присоединились к игре
    //socket.on(USER_READY, handleUserReady); //check

    socket.on(SEND_SHOOT, handleSendShoot);
    socket.on(SEND_SHOOT_FEEDBACK, handleSendShootFeedback);
    socket.on(SEND_DESTROYED_SHIP, handleSendDestroyedShip);
    socket.on(OPPONENT_HAS_WON, handleOpponentWinning);

    function handleOpponentWinning(payload) {
      console.log(payload);
      console.log('yeeeeeee');
      //TODO придется ещё socket.id везде ложить
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

    //ищем пустую комнату, если не находим, то делаем новую

    /*//its works
      console.log(socket.id);
      console.log(io.sockets.connected);
      */

    function defineFirst() {
      return Math.floor(Math.random() * 2);
    }

    function handleUserReady(roomID) {
      socket.broadcast.to(roomID).emit(OPPONENT_READY);
    }
  });
};
