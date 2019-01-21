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
  restoreInitialWinner,
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
    const { socket, restoreInitialWinner } = this.props;
    restoreInitialWinner();

    socket.emit(JOIN_GAME, this.props.match.params.roomID);
    /*TODO: сообщаем о присоединении к комнате (JOIN_GAME не подходит, нужно что-то типа GET_GAME_ROLE),
    получаем идентификатор о том, кто мы,
    если игрок, то котейнер game с подписками на возможность выстрелить и (JOIN_GAME), если нет, то
    только на получение данных (предполагается, что игроки уже в игре), т.е. у нас должно быть 2 хока 
    (контейнер game и компонента grid).
    Игроки должны прокидывать не просто результаты с координаты, а ВСЁ поле и ВЕСЬ список
    подбитых кораблей (тем самым мы позволим зрителям иметь полный актуальный список данных, даже 
    если они зашли позже начала игры), т.е. нам надо всё перестроить: противнику и зрителю отправляется 
    отфильтрованная userData с его промахами и попаданиями и userList с уничтоженными кораблями,
    в редьюсере собирается корректная сетка (сейчас отправляется СТРОГО ТОЧКА ИЛИ СТРОГО КОРАБЛЬ)
    */
    /*
    так же нам придется прокидывать идентификатор сокета и прицепить его к конкретной сетке (при этом
    игрокам на эти идентификаторы плевать, это нужно только зрителям)
    (когда creategameData, в opponentData и, наверное, юзердата, кидать id, кроме всего прочего,
    эти данные теперь должны делаться строго тогда, когда оба игрока в игре),
    при этом надо помнить, что 1 сокет может быть в разных комнатах,
    */
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
    const { canUserShoot, setInfo } = this.props;
    canUserShoot(true);
    setInfo(phrases.user);
  };
  handleSendShoot = cell => {
    const {
      canShoot,
      match,
      canUserShoot,
      restoreInitialTimer,
      socket,
      setInfo,
    } = this.props;
    if (canShoot) {
      socket.emit(SEND_SHOOT, { roomID: match.params.roomID, cell });
      canUserShoot(false);
      setInfo(phrases.waitSmth);
      restoreInitialTimer();
    }
  };
  //противник получил и обработал
  //TODO: antida-sea-battle REMOTE!!!
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
          socket.emit(OPPONENT_HAS_WON, { roomID: match.params.roomID });
          determineWinner(false);
          setInfo(phrases.loose);
        }
      } else {
        socket.emit(SEND_SHOOT_FEEDBACK, {
          cell,
          hit,
          roomID: match.params.roomID,
        });
        canUserShoot(false);
        setInfo(phrases.opponent);
      }
    } else {
      socket.emit(SEND_SHOOT_FEEDBACK, {
        cell,
        hit,
        roomID: match.params.roomID,
      });
      canUserShoot(true);
      setInfo(phrases.user);
    }
    putCellToUserData(cell);
    restoreInitialTimer();
  };
  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { canUserShoot, putCellToOpponentData, setInfo } = this.props;
    if (data.hit) {
      canUserShoot(true);
      setInfo(phrases.user);
    }
    else {
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
  allPlayersConnected = () => {
    const { setInfo, runGame } = this.props;
    setInfo(phrases.opponent);
    runGame();
  };

  handleOpponentLeft = () => {
    const { setInfo, determineWinner, gameStatus } = this.props;
    if (gameStatus) {
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
      match,
      gameStatus,
      winnerStatus,
      determineWinner,
      canShoot,
    } = this.props;
    return (
      <div className="game">
        <div className="game-head">
          {gameStatus ? (
            <Timer
              socket={socket}
              roomID={match.params.roomID}
              winnerStatus={winnerStatus}
              setInfo={setInfo}
              canShoot={canShoot}
              determineWinner={determineWinner}
            />
          ) : (
            <Link className="return-button" to="/">
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
  opponentData,
  canShoot,
  gameStatus,
  winnerStatus,
}) => ({
  userData,
  opponentData,
  canShoot,
  gameStatus,
  winnerStatus,
});

const mapDispatchToProps = dispatch => ({
  canUserShoot: bool => dispatch(canUserShoot(bool)),

  restoreInitialTimer: () => dispatch(restoreInitialTimer()),

  restoreInitialWinner: () => dispatch(restoreInitialWinner()),

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
