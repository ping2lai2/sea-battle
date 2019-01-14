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
} from '../../actions';

import Chat from '../chat';
import Timer from '../../containers/timer';
import UserGrid from '../../components/user-grid';
import OpponentGrid from '../../components/opponent-grid';
import GameInfo from '../../containers/game-info';

import phrases from '../../api/phrases';

import './style.css';

import {
  OPPONENT_LEFT,
  ALL_PLAYERS_CONNECTED,
  JOIN_GAME, //TODO: надо обдумать этот момент + хз что делать со зрителем
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
    //TODO: видимо, здесь придется проверять зрителя, либо надо было продумать какую-то оболочку
    // либо на этапе рендеринга, но, наверное, лучше тогда здесь
    super(props);
  }
  componentDidMount() {
    //TODO: при загрузке приходит ответ с сервера с флагом роли, сетки свернуть в ХОК, прокидывать с оппонента не просто клетку или корабль
    //TODO: а всю актуальную матрицу и лист уничтоженных кораблей

    const { socket } = this.props;
    console.log('fuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu');
    //this.props.socket.emit(JOIN_GAME, roomID);//TODO:
    socket.on(ALL_PLAYERS_CONNECTED, () => console.log('yes')); //дуплит аж 4 раза
    socket.emit(JOIN_GAME, this.props.match.params.roomID);
    // socket.on(OPPONENT_LEFT, this.handleOpponentDeparture);
    // socket.on(DISABLE_GAME, this.handleDisableGame); //TODO:
    socket.on(CAN_USER_SHOOT, this.handleCanUserShoot);
    socket.on(RECEIVE_SHOOT, this.handleReceiveShoot); //получили выстрел с сервера
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback); //получили выстрел
    socket.on(USER_HAS_WON, this.handleUserHasWon);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
  }

  handleCanUserShoot = () => {
    this.props.canUserShoot(true);
  };
  handleSendShoot = cell => {
    const { canShoot, match, canUserShoot, restoreInitialTimer } = this.props;
    if (canShoot) {
      this.props.socket.emit(SEND_SHOOT, { roomID: match.params.roomID, cell });
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
    } = this.props;
    const hit = userData.busyCellsMatrix[cell.x][cell.y] == 5 ? true : false;
    console.log('-89-/n',userData)
    console.log(userData.busyCellsMatrix[cell.x][cell.y])
    console.log('-9q-/n',hit);
    if (hit) {
      // индекс корабля, в который попали (а можно было бы дергать и индекс координаты)
      const shipIndex = userData.ships.findIndex(ship => {
        return ship.coordinates.find(coord => {
          return coord.x === cell.x && coord.y === cell.y;
        });
      });
      putShipsCellToUserData(shipIndex, cell);
      console.log('-98-/n',userData); 
      console.log(userData.ships[shipIndex].isDestroyed);

      //TODO: тут надо искать и проверять корректный корабль
      // и отправлять socket.emit(SEND_DESTROYED_SHIP,... если его уничтожили
      if (userData.ships[shipIndex].isDestroyed) {
        socket.emit(SEND_DESTROYED_SHIP, {
          index: shipIndex,
          ship: userData.ships[shipIndex],
          roomID: match.params.roomID,
        });
        if (!userData.ships.some(ship => ship.isDestroyed === false)) {
          console.log('im loose');
          socket.emit(OPPONENT_HAS_WON, { roomID: match.params.roomID });
        }
      } else {
          console.log('yes1');
        socket.emit(SEND_SHOOT_FEEDBACK, {
          cell,
          hit,
          roomID: match.params.roomID,
        });
      }
      canUserShoot(false);
    } else {
      console.log('yes1');
      socket.emit(SEND_SHOOT_FEEDBACK, {
        cell,
        hit,
        roomID: match.params.roomID,
      });
      canUserShoot(true);
    }
    putCellToUserData(cell);
    console.log('-130-/n',userData);
    restoreInitialTimer();
  };
  // получили результат выстрела
  handleReceiveShootFeedback = data => { //проблемы где-то здесь
    // const { userData, socket, match, putCellToUserData } = this.props;
    if (data.hit) {
      this.props.canUserShoot(true);
    }
    this.props.putCellToOpponentData(data.cell, data.hit);
    console.log(this.props.opponentData.busyCellsMatrix);
  };

  handleReceiveDestroyedShip = data => {
    console.log(data);
    this.props.canUserShoot(true);
    this.props.putShipToOpponentData(data.index, data.ship);
    console.log(this.props.opponentData);
  };

  handleUserHasWon = () => {
    console.log('im winner! bitch~!');
  };

  handleStartGame = () => {
    console.log('game is running');
    //TODO: запихать оповещалку, точнее удалить
  };
  handleOpponentLeft = () => {
    // TODO: кидать экшн о победе и почему победил
  };

  render() {
    const { userData, opponentData } = this.props;

    return (
      <div className="game">
        <Timer />
        <div className="field">
          <UserGrid {...userData} />
          <OpponentGrid {...opponentData} sendShoot={this.handleSendShoot} />
        </div>
        <Chat />
      </div>
    );
  }
}
// TODO: проптайпс где?

const mapStateToProps = ({ userData, opponentData, canShoot }) => ({
  userData,
  opponentData,
  canShoot,
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
  socket: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
