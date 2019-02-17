import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
  setInfo,
  setPlayerType,
  setSpectatorType,
} from '../../actions';

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
  GAME_IS_ALREADY_RUNNING,
  RECEIVE_USERS_COUNT,
} from '../../../common/socketEvents';

import PlacementGrid from '../../components/placement-grid';
import NewGameCreator from '../../components/new-game-creator';
import LobbyLayout from '../../components/lobby-layout';


class Lobby extends React.Component {
  state = {
    playersCount: null,
    spectatorsCount: null,
    ownGameSelected: false,
    randomGameSelected: false,
  };
  componentDidMount() {
    const { socket, setInfo } = this.props;
    setInfo(phrases.init);
    socket.on(RECEIVE_OWN_ROOM, this.handleReceiveOwnRoom);
    socket.on(RECEIVE_USERS_COUNT, this.handleReceiveUsersCount);
    socket.on(RECEIVE_RANDOM_ROOM, this.handleReceiveRandomRoom);
    socket.on(GAME_IS_ALREADY_RUNNING, this.handleGameIsRunning);
  }

  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeEventListener(RECEIVE_OWN_ROOM, this.handleReceiveOwnRoom);
    socket.removeEventListener(
      RECEIVE_RANDOM_ROOM,
      this.handleReceiveRandomRoom
    );
    socket.removeEventListener(
      RECEIVE_USERS_COUNT,
      this.handleReceiveUsersCount
    );
    socket.removeEventListener(
      GAME_IS_ALREADY_RUNNING,
      this.handleGameIsRunning
    );
  }

  handleReceiveUsersCount = data => {
    this.setState({
      playersCount: data.playersCount,
      spectatorsCount: data.spectatorsCount,
    });
  };

  handleGameIsRunning = data => {
    const { setInfo, runGame } = this.props;
    if (data.userType === 'spectators') {
      runGame();
    } else {
      setInfo(phrases.isRunning);
      this.setState({
        ownGameSelected: false,
      });
    }
  };

  handleReceiveOwnRoom = roomId => {
    const { history, setRoomId } = this.props;
    setRoomId(roomId);
    history.replace(`/${roomId}`);
  };

  handleReceiveRandomRoom = roomId => {
    const { setRoomId, setInfo, socket } = this.props;
    setRoomId(roomId);
    setInfo(phrases.waitOpponent);
    socket.emit(JOIN_RANDOM_GAME, { roomId });
  };

  requestRoom = req => {
    const { shipsPlacement, socket, setInfo } = this.props;
    if (
      !shipsPlacement.ships.includes(undefined) &&
      !shipsPlacement.ships.includes(null)
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
    socket.emit(req, userData);
    resetRoomId();
  };

  requestRandomRoom = () => {
    this.requestRoom(REQUEST_RANDOM_ROOM);
    this.setState({
      randomGameSelected: true,
    });
    this.props.setPlayerType();
  };

  requestOwnRoom = () => {
    this.requestRoom(REQUEST_OWN_ROOM);
  };

  joinOwnGame = () => {
    const { socket, userData, setInfo } = this.props;
    setInfo(phrases.waitOpponent);
    socket.emit(JOIN_OWN_GAME, userData);
    this.setState({
      ownGameSelected: true,
    });
  };

  closeRandomGame = () => {
    this.closeGame(CLOSE_RANDOM_GAME);
    this.setState({
      randomGameSelected: false,
    });
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
      <LobbyLayout>
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
          userData={userData}
          setRoomId={setRoomId}
          resetRoomId={resetRoomId}
          history={history}
          ownGame={ownGame}
          setPlayerType={setPlayerType}
          setSpectatorType={setSpectatorType}
          {...this.state}
        />
      </LobbyLayout>
    );
  }
}

const mapStateToProps = ({ shipsPlacement }) => ({
  shipsPlacement,
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
