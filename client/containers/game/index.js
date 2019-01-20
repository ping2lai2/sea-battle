import React from 'react';
import { connect } from 'react-redux';

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
  JOIN_GAME,
  CAN_USER_SHOOT,
  SEND_SHOOT,
  SEND_DESTROYED_SHIP,
  SEND_SHOOT_FEEDBACK,
  RECEIVE_SHOOT,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  USER_HAS_WON,
  OPPONENT_HAS_WON,
} from '../../../common/socketEvents';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket } = this.props;

    socket.emit(JOIN_GAME, this.props.match.params.roomID);

    socket.on(ALL_PLAYERS_CONNECTED, this.allPlayersConnected);
    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);

    socket.on(CAN_USER_SHOOT, this.handleCanUserShoot);
    socket.on(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(USER_HAS_WON, this.handleUserHasWon);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
  }
  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener(ALL_PLAYERS_CONNECTED, this.allPlayersConnected);
    socket.removeListener(OPPONENT_LEFT, this.handleOpponentLeft);

    socket.removeListener(CAN_USER_SHOOT, this.handleCanUserShoot);
    socket.removeListener(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.removeListener(
      RECEIVE_SHOOT_FEEDBACK,
      this.handleReceiveShootFeedback
    );
    socket.removeListener(USER_HAS_WON, this.handleUserHasWon);
    socket.removeListener(
      RECEIVE_DESTROYED_SHIP,
      this.handleReceiveDestroyedShip
    );
  }

  handleCanUserShoot = () => {
    this.props.canUserShoot(true);
  };
  handleSendShoot = cell => {
    const {
      canShoot,
      match,
      canUserShoot,
      restoreInitialTimer,
      socket,
    } = this.props;
    if (canShoot) {
      socket.emit(SEND_SHOOT, { roomID: match.params.roomID, cell });
      canUserShoot(false);
      restoreInitialTimer();
    }
  };
  //противник получил и обработал
  handleReceiveShoot = cell => {
    const {
      userData,
      socket,
      match,
      putCellToUserData,
      putShipsCellToUserData,
      canUserShoot,
      restoreInitialTimer,
      setInfo,
      determineWinner,
      disableGame
    } = this.props;
    const hit = userData.busyCellsMatrix[cell.x][cell.y] == 5 ? true : false;

    if (hit) {
      // индекс корабля, в который попали
      const shipIndex = userData.ships.findIndex(ship => {
        return ship.coordinates.find(coord => {
          return coord.x === cell.x && coord.y === cell.y;
        });
      });
      putShipsCellToUserData(shipIndex, cell);

      if (userData.ships[shipIndex].isDestroyed) {
        socket.emit(SEND_DESTROYED_SHIP, {
          index: shipIndex,
          ship: userData.ships[shipIndex],
          roomID: match.params.roomID,
        });
        if (!userData.ships.some(ship => ship.isDestroyed === false)) {
          setInfo(phrases.loose);
          determineWinner(false);
          socket.emit(OPPONENT_HAS_WON, { roomID: match.params.roomID });
          disableGame();
        }
      } else {
        socket.emit(SEND_SHOOT_FEEDBACK, {
          cell,
          hit,
          roomID: match.params.roomID,
        });
      }
      canUserShoot(false);
    } else {
      socket.emit(SEND_SHOOT_FEEDBACK, {
        cell,
        hit,
        roomID: match.params.roomID,
      });
      canUserShoot(true);
    }
    putCellToUserData(cell);
    restoreInitialTimer();
  };
  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { canUserShoot, putCellToOpponentData } = this.props;
    if (data.hit) {
      canUserShoot(true);
    }
    putCellToOpponentData(data.cell, data.hit);
  };

  handleReceiveDestroyedShip = data => {
    const { canUserShoot, putShipToOpponentData } = this.props;
    canUserShoot(true);
    putShipToOpponentData(data.index, data.ship);
  };
  handleUserHasWon = () => {
    const { setInfo, determineWinner, disableGame } = this.props;
    setInfo(phrases.win);
    determineWinner(true);
    disableGame();
  };
  allPlayersConnected = () => {
    const { setInfo, runGame } = this.props;
    setInfo(phrases.run);
    runGame();
  };

  handleOpponentLeft = () => {
    const { setInfo, determineWinner, gameStatus } = this.props;
    if (gameStatus) {
      setInfo(phrases.disconnect);
      determineWinner(true);
      disableGame();
    }
    
  };

  render() {
    const { userData, opponentData, socket, match, gameStatus, winnerStatus } = this.props;
    return (
      <div className="game">
        <div className="game-head">
          {gameStatus ? (
            <Timer socket={socket} roomID={match.params.roomID}  winnerStatus={winnerStatus}/>
          ) : (
            <a className="return-button" href="/">
              назад
            </a>
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

const mapStateToProps = ({ userData, opponentData, canShoot, gameStatus }) => ({
  userData,
  opponentData,
  canShoot,
  gameStatus,
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
  disableGame: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
