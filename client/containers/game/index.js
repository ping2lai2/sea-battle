import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import {
  canGamerShoot,
  putCellToGamerData,
  putShipToGamerData,
  putShipsCellToGamerData,
  putCellToOpponentData,
  putShipToOpponentData,
  resetTimer,
  setInfo,
  determineWinner,
  createGameData,
} from '../../actions';

import Chat from '../chat';
import Timer from '../../containers/timer';
import GamerGrid from '../../components/gamer-grid';
import OpponentGrid from '../../components/opponent-grid';
import GameHead from '../../components/game-head';
import Grids from '../../components/grids';
import ReturnButton from '../../components/return-button';

import phrases from '../../api/phrases';

import {
  OPPONENT_LEFT,
  ALL_PLAYERS_CONNECTED,
  USERS_TURN,
  SEND_SHOOT,
  SEND_DESTROYED_SHIP,
  SEND_SHOOT_FEEDBACK,
  RECEIVE_SHOOT,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  GAMER_HAS_WON,
  OPPONENT_HAS_WON,
  GET_GAME_DATA,
  POST_GAME_DATA,
  GREETINGS_TO_ALL,
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
      userData,
      setInfo,
    } = this.props;
    createGameData(shipsPlacement.ships, shipsPlacement.busyCellsMatrix);
    setInfo(phrases.opponent);
    runGame();

    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.on(USERS_TURN, this.handleGamersTurn);
    socket.on(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(GAMER_HAS_WON, this.handleGamerHasWon);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
    socket.on(GET_GAME_DATA, this.handleGetGameData);

    socket.emit(GREETINGS_TO_ALL, { roomId: userData.roomId });
  }
  componentWillUnmount() {
    const { socket } = this.props;

    socket.removeEventListener(
      ALL_PLAYERS_CONNECTED,
      this.handlePlayersConnected
    );
    socket.removeEventListener(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.removeEventListener(USERS_TURN, this.handleGamersTurn);
    socket.removeEventListener(RECEIVE_SHOOT, this.handleReceiveShoot);
    socket.removeEventListener(
      RECEIVE_SHOOT_FEEDBACK,
      this.handleReceiveShootFeedback
    );
    socket.removeEventListener(GAMER_HAS_WON, this.handleGamerHasWon);
    socket.removeEventListener(
      RECEIVE_DESTROYED_SHIP,
      this.handleReceiveDestroyedShip
    );
    socket.removeEventListener(GET_GAME_DATA, this.handleGetGameData);
  }

  handleGamersTurn = data => {
    const { canGamerShoot, setInfo, socket } = this.props;
    if (data.socketId === socket.id) {
      canGamerShoot(true);
      setInfo(phrases.gamer);
    }
  };
  handleSendShoot = cell => {
    const {
      canShoot,
      canGamerShoot,
      resetTimer,
      socket,
      userData,
    } = this.props;
    if (canShoot) {
      socket.emit(SEND_SHOOT, { roomId: userData.roomId, cell });
      canGamerShoot(false);
      resetTimer();
    }
  };

  handleReceiveShoot = cell => {
    const {
      gamerData,
      socket,
      userData,
      putShipsCellToGamerData,
      putCellToGamerData,
      determineWinner,
      resetTimer,
      canGamerShoot,
      setInfo,
    } = this.props;
    if (gamerData.busyCellsMatrix[cell.x][cell.y] === 5) {
      // индекс корабля, в который попали
      const shipIndex = gamerData.ships.findIndex(ship => {
        return ship.coordinates.find(coord => {
          return coord.x === cell.x && coord.y === cell.y;
        });
      });
      putShipsCellToGamerData(shipIndex, cell);
      const newGamerData = this.props.gamerData;
      if (newGamerData.ships[shipIndex].isDestroyed) {
        socket.emit(SEND_DESTROYED_SHIP, {
          index: shipIndex,
          ship: newGamerData.ships[shipIndex],
          roomId: userData.roomId,
        });
        if (!newGamerData.ships.some(ship => ship.isDestroyed === false)) {
          socket.emit(OPPONENT_HAS_WON, { roomId: userData.roomId });
          determineWinner(false);
          setInfo(phrases.loose);
        }
      } else {
        socket.emit(SEND_SHOOT_FEEDBACK, {
          cell,
          hit: true,
          roomId: userData.roomId,
        });
        canGamerShoot(false);
        setInfo(phrases.opponent);
      }
    } else {
      socket.emit(SEND_SHOOT_FEEDBACK, {
        cell,
        hit: false,
        roomId: userData.roomId,
      });
      canGamerShoot(true);
      setInfo(phrases.gamer);
      putCellToGamerData(cell);
    }
    resetTimer();
  };

  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { canGamerShoot, setInfo, putCellToOpponentData } = this.props;
    if (data.hit) {
      canGamerShoot(true);
      setInfo(phrases.gamer);
    } else {
      setInfo(phrases.opponent);
    }
    putCellToOpponentData(data.cell, data.hit);
  };

  handleReceiveDestroyedShip = data => {
    const { canGamerShoot, putShipToOpponentData, setInfo } = this.props;
    canGamerShoot(true);
    setInfo(phrases.gamer);
    putShipToOpponentData(data.index, data.ship);
  };
  handleGamerHasWon = () => {
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
    if (winnerStatus === null) {
      setInfo(phrases.disconnect);
      determineWinner(true);
    }
  };

  render() {
    const {
      gamerData,
      opponentData,
      socket,
      setInfo,
      userData,
      winnerStatus,
      determineWinner,
      disableGame,
      canShoot,
    } = this.props;
    return (
      <>
        <GameHead>
          {winnerStatus === null ? (
            <Timer
              socket={socket}
              roomId={userData.roomId}
              winnerStatus={winnerStatus}
              setInfo={setInfo}
              canShoot={canShoot}
              determineWinner={determineWinner}
              resetTimer={resetTimer}
            />
          ) : (
            <ReturnButton>
              <Link to="/" onClick={disableGame}>
                назад
              </Link>
            </ReturnButton>
          )}
        </GameHead>
        <Grids>
          <GamerGrid {...gamerData} />
          <OpponentGrid {...opponentData} sendShoot={this.handleSendShoot} />
        </Grids>
        <Chat />
      </>
    );
  }
}

const mapStateToProps = ({
  gamerData,
  opponentDataA,
  canShoot,
  winnerStatus,
  shipsPlacement,
}) => ({
  gamerData,
  opponentData: opponentDataA,
  canShoot,
  winnerStatus,
  shipsPlacement,
});

const mapDispatchToProps = dispatch => ({
  canGamerShoot: bool => dispatch(canGamerShoot(bool)),
  resetTimer: () => dispatch(resetTimer()),
  putCellToGamerData: cell => dispatch(putCellToGamerData(cell)),
  putShipsCellToGamerData: (shipIndex, cell) =>
    dispatch(putShipsCellToGamerData(shipIndex, cell)), //меняем флаг isDestroyed у одной ячейки корабля и у всего корабля
  putShipToGamerData: ship => dispatch(putShipToGamerData(ship)), //меняем флаг isDestroyed у всего корабля
  putCellToOpponentData: (cell, hit) =>
    dispatch(putCellToOpponentData(cell, hit)),
  putShipToOpponentData: (index, ship) =>
    dispatch(putShipToOpponentData(index, ship)),
  createGameData: (ships, busyCellsMatrix) =>
    dispatch(createGameData(ships, busyCellsMatrix)),
  setInfo: phrase => dispatch(setInfo(phrase)),
  determineWinner: bool => dispatch(determineWinner(bool)),
});

Game.propTypes = {
  gamerData: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  opponentData: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  gamerShoot: PropTypes.bool,
  gameStatus: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  runGame: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
