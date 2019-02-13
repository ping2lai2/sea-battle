import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import {
  canUserShoot,
  putCellToUserData,
  putShipToUserData,
  putShipsCellToUserData,
  putCellToOpponentData,
  putShipToOpponentData,
  restoreInitialTimer,
  setInfo,
  determineWinner,
  runGame,
  disableGame,
  createGameData,
} from '../../actions';

import Chat from '../chat';
import Timer from '../../containers/timer';
import UserGrid from '../../components/user-grid';
import OpponentGrid from '../../components/opponent-grid';

import phrases from '../../api/phrases';

import './style.css';

import {
  OPPONENT_LEFT,
  ALL_PLAYERS_CONNECTED,
  JOIN_RANDOM_GAME,
  USERS_TURN,
  SEND_SHOOT,
  SEND_DESTROYED_SHIP,
  SEND_SHOOT_FEEDBACK,
  RECEIVE_SHOOT,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  USER_HAS_WON,
  OPPONENT_HAS_WON,
  GET_GAME_DATA,
  POST_GAME_DATA,
} from '../../../common/socketEvents';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const {
      socket,
      createGameData,
      shipsPlacement,
      runGame,
      setInfo,
    } = this.props;
    createGameData(shipsPlacement.ships, shipsPlacement.busyCellsMatrix);
    setInfo(phrases.opponent);
    runGame();

    // socket.on(ALL_PLAYERS_CONNECTED, this.handlePlayersConnected);
    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.on(USERS_TURN, this.handleUsersTurn);
    socket.on(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(USER_HAS_WON, this.handleUserHasWon);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
    socket.on(GET_GAME_DATA, this.handleGetGameData);
  }
  componentWillUnmount() {
    const { socket } = this.props;

    socket.removeEventListener(
      ALL_PLAYERS_CONNECTED,
      this.handlePlayersConnected
    );
    socket.removeEventListener(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.removeEventListener(USERS_TURN, this.handleUsersTurn);
    socket.removeEventListener(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.removeEventListener(
      RECEIVE_SHOOT_FEEDBACK,
      this.handleReceiveShootFeedback
    );
    socket.removeEventListener(USER_HAS_WON, this.handleUserHasWon);
    socket.removeEventListener(
      RECEIVE_DESTROYED_SHIP,
      this.handleReceiveDestroyedShip
    );
    socket.removeEventListener(GET_GAME_DATA, this.handleGetGameData);
  }

  handleUsersTurn = data => {
    const { canUserShoot, setInfo, socket } = this.props;
    if (data.socketId === socket.id) {
      canUserShoot(true);
      setInfo(phrases.user);
    }
  };
  handleSendShoot = cell => {
    const {
      canShoot,
      canUserShoot,
      restoreInitialTimer,
      socket,
      roomId,
    } = this.props;
    console.log(roomId);
    if (canShoot) {
      socket.emit(SEND_SHOOT, { roomId, cell });
      canUserShoot(false);
      restoreInitialTimer();
    }
  };

  handleReceiveShoot = cell => {
    const {
      userData,
      socket,
      roomId,
      putShipsCellToUserData,
      putCellToUserData,
      determineWinner,
      restoreInitialTimer,
      canUserShoot,
      setInfo,
    } = this.props;
    console.log('received shoot')
    if (userData.busyCellsMatrix[cell.x][cell.y] === 5) {
      // индекс корабля, в который попали
      const shipIndex = userData.ships.findIndex(ship => {
        return ship.coordinates.find(coord => {
          return coord.x === cell.x && coord.y === cell.y;
        });
      });
      putShipsCellToUserData(shipIndex, cell);
      const newUserData = this.props.userData;
      if (newUserData.ships[shipIndex].isDestroyed) {
        socket.emit(SEND_DESTROYED_SHIP, {
          index: shipIndex,
          ship: newUserData.ships[shipIndex],
          roomId,
        });
        if (!newUserData.ships.some(ship => ship.isDestroyed === false)) {
          socket.emit(OPPONENT_HAS_WON, { roomId });
          determineWinner(false);
          setInfo(phrases.loose);
        }
      } else {
        socket.emit(SEND_SHOOT_FEEDBACK, {
          cell,
          hit: true,
          roomId,
        });
        canUserShoot(false);
        setInfo(phrases.opponent);
      }
    } else {
      socket.emit(SEND_SHOOT_FEEDBACK, {
        cell,
        hit: false,
        roomId,
      });
      canUserShoot(true);
      setInfo(phrases.user);
    }
    putCellToUserData(cell); //TODO: выше
    restoreInitialTimer();
  };

  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { canUserShoot, setInfo, putCellToOpponentData } = this.props;
    if (data.hit) {
      canUserShoot(true);
      setInfo(phrases.user);
    } else {
      setInfo(phrases.opponent);
    }
    putCellToOpponentData(data.cell, data.hit);
  };

  handleReceiveDestroyedShip = data => {
    const { canUserShoot, putShipToOpponentData, setInfo } = this.props;
    canUserShoot(true);
    setInfo(phrases.user);
    putShipToOpponentData(data.index, data.ship);
  };
  handleUserHasWon = () => {
    const { setInfo, determineWinner } = this.props;
    setInfo(phrases.win);
    determineWinner(true);
  };
  handleGetGameData = socketId => {
    const { opponentData, socket } = this.props;
    socket.emit(POST_GAME_DATA, {
      socketId,
      ...opponentData,
    });
  };
  handlePlayersConnected = () => {
    const { setInfo, runGame } = this.props;
    setInfo(phrases.opponent);
    runGame();
  };

  handleOpponentLeft = () => {
    const { setInfo, determineWinner, winnerStatus } = this.props;
    if (winnerStatus===null) {
      setInfo(phrases.disconnect);
      determineWinner(true);
    }
  };

  render() {
    const {
      userData,
      opponentData,
      socket,
      setInfo,
      roomId,
      winnerStatus,
      determineWinner,
      disableGame,
      canShoot,
    } = this.props;
    return (
      <div className="game">
        <div className="game-head">
          {winnerStatus===null ? (
            <Timer
              socket={socket}
              roomId={roomId}
              winnerStatus={winnerStatus}
              setInfo={setInfo}
              canShoot={canShoot}
              determineWinner={determineWinner}
              restoreInitialTimer={restoreInitialTimer}
            />
          ) : (
            <Link className="return-button" to="/" onClick={disableGame}>
              назад
            </Link>
          )}
        </div>
        <div className="field">
          <UserGrid {...userData} />
          <OpponentGrid {...opponentData} sendShoot={this.handleSendShoot} />
        </div>
        <Chat />
      </div>
    );
  }
}

const mapStateToProps = ({
  userData,
  opponentDataA,
  canShoot,
  gameStatus,
  winnerStatus,
  shipsPlacement,
  roomId,
}) => ({
  userData,
  opponentData: opponentDataA,
  canShoot,
  gameStatus,
  winnerStatus,
  shipsPlacement,
  roomId,
});

const mapDispatchToProps = dispatch => ({
  canUserShoot: bool => dispatch(canUserShoot(bool)),

  restoreInitialTimer: () => dispatch(restoreInitialTimer()),

  putCellToUserData: cell => dispatch(putCellToUserData(cell)),
  putShipsCellToUserData: (shipIndex, cell) =>
    dispatch(putShipsCellToUserData(shipIndex, cell)), //меняем флаг isDestroyed у одной ячейки корабля и у всего корабля
  putShipToUserData: ship => dispatch(putShipToUserData(ship)), //меняем флаг isDestroyed у всего корабля
  putCellToOpponentData: (cell, hit) =>
    dispatch(putCellToOpponentData(cell, hit)),
  putShipToOpponentData: (index, ship) =>
    dispatch(putShipToOpponentData(index, ship)),

  createGameData: (ships, busyCellsMatrix) =>
    dispatch(createGameData(ships, busyCellsMatrix)),

  setInfo: phrase => dispatch(setInfo(phrase)),

  determineWinner: bool => dispatch(determineWinner(bool)),

  runGame: () => dispatch(runGame()),
  disableGame: () => dispatch(disableGame()),
});

Game.propTypes = {
  userData: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  opponentData: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  userShoot: PropTypes.bool,
  gameStatus: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  runGame: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
