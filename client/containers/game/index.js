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
  GET_GAME_DATA,
  POST_GAME_DATA,
} from '../../../common/socketEvents';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket, restoreInitialWinner, match, disableGame } = this.props;
    restoreInitialWinner();
    disableGame();
    /*TODO: 
    Игроки должны прокидывать не просто результаты с координаты, а ВСЁ поле и ВЕСЬ список
    подбитых кораблей (тем самым мы позволим зрителям иметь полный актуальный список данных, даже 
    если они зашли позже начала игры), т.е. нам надо всё перестроить: противнику и зрителю отправляется 
    отфильтрованная userData с его промахами и попаданиями и userList с уничтоженными кораблями,
    в редьюсере собирается корректная сетка (сейчас отправляется СТРОГО ТОЧКА ИЛИ СТРОГО КОРАБЛЬ)

    UPDATE: сохраняю прокидку с точкой и кораблем, на хероку всё жестко тормозит, лучше меньше данных
    зрители при заходе в игру трясут данные с игроков
    
    сообщаем о присоединении к комнате (JOIN_GAME не подходит, нужно что-то типа GET_GAME_ROLE),
    получаем идентификатор о том, кто мы,
    если игрок, то котейнер game с подписками на возможность выстрелить и (JOIN_GAME), если нет, то
    только на получение данных (предполагается, что игроки уже в игре), т.е. у нас должно быть 2 хока 
    (контейнер game и компонента grid).

    игроки бросаются данными с идентификаторами сокетов, зрители хранят айдишники в стейте и как-то должны
    связывать их с данными стора, предполагаю, что можно при заходе зрителя бросать эмит, чтобы игроки сказали
    свои идентификаторы, кто первый пришлет, тот получает... в оообщем, сделай ещё хор для оппонентДата
    https://github.com/reduxjs/redux/blob/e7097be3edcc2ba76cbb6d3aea77e63be2d7e80c/docs/recipes/structuring-reducers/ReusingReducerLogic.md
    
    UPDATE: зачем мне засорять стор данными, которые нужны строго в одном месте и вполне определенных чайлдах, при анмаунте их хранить
    нахер не сдалось, в общем, стэйт в помощь НО!!! придется дублировать логику из редьюсера в стэйте, вот такая вот фигня, странный зверёк получается

    UPDATE2: с моими загонами я никогда не закончу этот проект
    https://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application
    https://medium.com/@mange_vibration/reducer-composition-with-higher-order-reducers-35c3977ed08f
    
     UPDATE3: HOR на opponentDataReducer

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
    socket.on(GET_GAME_DATA, this.handleGetGameData);
    //TODO: при выходе, перезагрузке и прочем, можно на джоин что-нибудь кидать для проверки, мертва комната или нет
    //вообще получилась какая-то каша
    socket.emit(JOIN_GAME, match.params.roomID);
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
      //setInfo(phrases.waitSmth);
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
      const newUserData = this.props.userData; //ох, какой ужс, а есть другое решение
      if (newUserData.ships[shipIndex].isDestroyed) {
        socket.emit(SEND_DESTROYED_SHIP, {
          index: shipIndex,
          ship: newUserData.ships[shipIndex],
          roomID: match.params.roomID,
        });
        if (!newUserData.ships.some(ship => ship.isDestroyed === false)) {
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
    putCellToUserData(cell);//TODO: выше
    restoreInitialTimer();
  };

  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { canUserShoot, putCellToOpponentData, setInfo } = this.props;
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
  allPlayersConnected = () => {
    const { setInfo, runGame } = this.props;
    setInfo(phrases.opponent);
    runGame();
  };

  handleOpponentLeft = () => {
    //TODO: кидается при релоаде страницы, что не торт, т.е., если произошел релоад, надо засчитывать победу 100%, либо как-то запретить
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
  opponentDataA,
  canShoot,
  gameStatus,
  winnerStatus,
}) => ({
  userData,
  opponentData: opponentDataA,
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


/*
 
case PUT_SHIPS_CELL_TO_USER_DATA: {
    //TODO: здесь мы должны нетолько с кораблями манипуляции проводить
    // но и запихивать в матрицу точки, которые уже однозначно не будут
    // содержать корабли
    const ships = [...state.ships];
    let shipIsDestroyed = true;
    const currentShip = {...state.ships[action.index]};
    const returnedShip = {
      ...currentShip,
      coordinates: currentShip.coordinates.map(coord => {
        if (coord.x === action.cell.x && coord.y === action.cell.y) {
          coord.isDestroyed = true;
        }
        if (coord.isDestroyed === false) {
          shipIsDestroyed = false;
        }
        return {...coord};
      }),
    };
    returnedShip.isDestroyed = shipIsDestroyed;
    if (shipIsDestroyed) {
      const busyX = returnedShip.busyCellsX;
      const busyY = returnedShip.busyCellsY;
      //const coordsMin = returnedShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
      //const coordsMax = returnedShip.coordinates[returnedShip.length - 1]; //право-низ (x, y, isDestroyed)
      return {
        ...state,
        ships: [
          ...ships.slice(0, action.index),

          {
            ...returnedShip,
            coordinates: returnedShip.coordinates.map(coordinate => ({
              ...coordinate,
            })),
            busyCellsX: [...returnedShip.busyCellsX],
            busyCellsY: [...returnedShip.busyCellsY],
          },
          ...ships.slice(action.index + 1),
        ],
        busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
          row.map((cell, j) => {
            if (
              i >= busyX[0] &&
                i <= busyX[1] &&
                j >= busyY[0] &&
                j <= busyY[1]
            ) {
              return (cell = cell <= 4 ? 7 : cell);
            }
          })
        ),
      };
    } else {
      return {
        ...state,
        ships: [
          ...ships.slice(0, action.index),
          {
            ...returnedShip,
            coordinates: returnedShip.coordinates.map(coordinate => ({
              ...coordinate,
            })),
            busyCellsX: [...returnedShip.busyCellsX],
            busyCellsY: [...returnedShip.busyCellsY],
          },
          ...ships.slice(action.index + 1),
        ],
      };
    }
  }


 */