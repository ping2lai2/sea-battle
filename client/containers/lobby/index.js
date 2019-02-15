import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import { setInfo } from '../../actions';

import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
} from '../../actions/shipsPlacement';

import {
  setRoomId,
  resetRoomId,
  setPlayerType,
  setSpectatorType,
} from '../../actions/userData';

import phrases from '../../api/phrases';

import {
  RECEIVE_OWN_ROOM,
  RECEIVE_RANDOM_ROOM,
  REQUEST_OWN_ROOM,
  REQUEST_RANDOM_ROOM,
  JOIN_RANDOM_GAME,
  JOIN_OWN_GAME,
  CLOSE_RANDOM_GAME,
  CLOSE_OWN_GAME,
  DELETE_OWN_ROOM,
  CHOOSE_PLAYER_TYPE,
} from '../../../common/socketEvents';

import PlacementGrid from '../../components/placement-grid';
import NewGameCreator from '../../components/new-game-creator';

import './style.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket, setInfo } = this.props;
    setInfo(phrases.init);
    socket.on(RECEIVE_OWN_ROOM, this.handleReceiveOwnRoom);
    socket.on(RECEIVE_RANDOM_ROOM, this.handleReceiveRandomRoom);
  }
  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeEventListener(RECEIVE_OWN_ROOM, this.handleReceiveOwnRoom);
    socket.removeEventListener(
      RECEIVE_RANDOM_ROOM,
      this.handleReceiveRandomRoom
    );
  }
  handleReceiveOwnRoom = roomId => {
    const { history, setRoomId } = this.props;
    setRoomId(roomId);
    history.push(`/${roomId}`);
  };

  handleReceiveRandomRoom = roomId => {
    const { setRoomId, setInfo, socket } = this.props;
    setRoomId(roomId);
    console.log('received', roomId);
    setInfo(phrases.waitOpponent);
    socket.emit(JOIN_RANDOM_GAME, { roomId });
  };
  deleteOwnRoom = () => {
    const { socket, setInfo, resetRoomId, userData, history } = this.props;
    socket.emit(DELETE_OWN_ROOM, { roomId: userData.roomId });
    setInfo(phrases.init);
    resetRoomId();
    history.replace('/');
  };
  //TODO: некорректный нейминг, переименуй, ты только запрашиваешь комнату, а не запускаешь игру
  requestRoom = req => {
    const { shipsPlacement, socket, setInfo } = this.props;
    if (
      !shipsPlacement.ships.includes(undefined) &&
      !shipsPlacement.ships.includes(null) //&& !shipsPlacement.ships.includes(null)
    ) {
      socket.emit(req);
      return true;
    } else {
      setInfo(phrases.notPut);
      return false;
    }
  };
  closeGame = req => {
    const { socket, setInfo, resetRoomId, userData } = this.props;
    setInfo(phrases.init);
    socket.emit(req, { roomId: userData.roomId });
    resetRoomId();
  };
  //TODO: плохие названия
  requestRandomRoom = () => {
    this.requestRoom(REQUEST_RANDOM_ROOM);
  };
  requestOwnRoom = () => {
    this.requestRoom(REQUEST_OWN_ROOM);
  };

  joinOwnGame = () => {
    const { socket, userData, setInfo } = this.props;
    setInfo(phrases.waitOpponent);
    socket.emit(JOIN_OWN_GAME, userData);
  };
  closeRandomGame = () => {
    this.closeGame(CLOSE_RANDOM_GAME);
  };

  closeOwnGame = () => {
    this.closeGame(CLOSE_OWN_GAME);
    this.props.history.replace('/');
  };

  render() {
    const {
      shipsPlacement,
      recalculateShipsData,
      clearShipsData,
      addToBusyCells,
      removeFromBusyCells,
      changeShipPosition,
      setRoomId,
      resetRoomId,
      userData,
      history,
      ownGame,
      setPlayerType,
      setSpectatorType,
    } = this.props;
    return (
      <div className="lobby">
        <div className="lobby__inner">
          <PlacementGrid
            ships={shipsPlacement.ships}
            busyCellsMatrix={shipsPlacement.busyCellsMatrix}
            recalculateShipsData={recalculateShipsData}
            clearShipsData={clearShipsData}
            addToBusyCells={addToBusyCells}
            removeFromBusyCells={removeFromBusyCells}
            changeShipPosition={changeShipPosition}
          />

          <NewGameCreator
            requestRandomRoom={this.requestRandomRoom}
            requestOwnRoom={this.requestOwnRoom}
            closeRandomGame={this.closeRandomGame}
            closeOwnGame={this.closeOwnGame}
            joinOwnGame={this.joinOwnGame}
            deleteOwnRoom={this.deleteOwnRoom}
            userData={userData}
            setRoomId={setRoomId}
            resetRoomId={resetRoomId}
            history={history}
            ownGame={ownGame}
            setPlayerType={setPlayerType}
            setSpectatorType={setSpectatorType}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ shipsPlacement, userData }) => ({
  shipsPlacement,
  userData,
});

const mapDispatchToProps = dispatch => ({
  removeFromBusyCells: index => dispatch(removeFromBusyCells(index)),

  addToBusyCells: index => dispatch(addToBusyCells(index)),

  changeShipPosition: (index, ship) =>
    dispatch(changeShipPosition(index, ship)),

  clearShipsData: () => dispatch(clearShipsData()),

  recalculateShipsData: (ships, busyCellsMatrix) =>
    dispatch(recalculateShipsData(ships, busyCellsMatrix)),

  setInfo: phrase => dispatch(setInfo(phrase)),
  setRoomId: roomId => dispatch(setRoomId(roomId)),
  resetRoomId: () => dispatch(resetRoomId()),
  setPlayerType: () => dispatch(setPlayerType()),
  setSpectatorType: () => dispatch(setSpectatorType()),
});

Lobby.propTypes = {
  shipsPlacement: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  recalculateShipsData: PropTypes.func.isRequired,
  clearShipsData: PropTypes.func.isRequired,
  addToBusyCells: PropTypes.func.isRequired,
  removeFromBusyCells: PropTypes.func.isRequired,
  changeShipPosition: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
