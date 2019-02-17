import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import {
  createReceivedOpponentData,
  putCellToOpponentData,
  putShipToOpponentData,
  setInfo,
} from '../../actions';

import Chat from '../chat';
import GamerGrid from '../../components/gamer-grid';
import GameHead from '../../components/game-head';
import Grids from '../../components/grids';
import ReturnButton from '../../components/return-button';

import phrases from '../../api/phrases';


import {
  ALL_PLAYERS_CONNECTED,
  OPPONENT_LEFT,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  GAMER_HAS_WON,
  LEAVE_ROOM,
  RECEIVE_GREETING,
} from '../../../common/socketEvents';

class Game extends React.Component {
  state = {
    playersId: {},
  };
  componentDidMount() {
    const { socket, userData, setInfo } = this.props;

    setInfo(phrases.screen);

    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.on(GAMER_HAS_WON, this.handleGamerHasWon);
    socket.on(ALL_PLAYERS_CONNECTED, this.handleAllPlayersConnected);

    socket.on(RECEIVE_GAME_DATA, this.handleReceiveData);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
    socket.on(RECEIVE_GREETING, this.handleReceiveInitialData);

    socket.emit(REQUEST_GAME_DATA, { roomId: userData.roomId });
  }
  componentWillUnmount() {
    const { socket, userData } = this.props;
    socket.removeEventListener(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.removeEventListener(
      ALL_PLAYERS_CONNECTED,
      this.handleAllPlayersConnected
    );
    socket.removeEventListener(RECEIVE_GAME_DATA, this.handleReceiveData);
    socket.removeEventListener(
      RECEIVE_SHOOT_FEEDBACK,
      this.handleReceiveShootFeedback
    );
    socket.removeEventListener(GAMER_HAS_WON, this.handleGamerHasWon);
    socket.removeEventListener(
      RECEIVE_DESTROYED_SHIP,
      this.handleReceiveDestroyedShip
    );

    socket.emit(LEAVE_ROOM, { userData }); //need to test
  }
  handleReceiveInitialData = data => isReq => {
    //the number of user IDs.
    switch (Object.entries(this.state.playersId).length) {
    case 0: {
      this.setState({
        playersId: {
          [data.socketId]: 'A',
        },
      });
      isReq &&
          this.props.createReceivedOpponentData(
            data.ships,
            data.busyCellsMatrix,
            'B'
          );
      break;
    }
    case 1: {
      if (!Object.keys(this.state.playersId).includes(data.socketId)) {
        this.setState({
          playersId: {
            ...this.state.playersId,
            [data.socketId]: 'B',
          },
        });
        isReq &&
            this.props.createReceivedOpponentData(
              data.ships,
              data.busyCellsMatrix,
              'A'
            );
      }
      break;
    }
    }
  };
  handleReceiveData = data => {
    this.handleReceiveInitialData(data)(true);
  };

  handleReceiveShootFeedback = data => {
    const { putCellToOpponentData, setInfo } = this.props;
    if (!data.hit) {
      setInfo(`Ходит Игрок ${this.state.playersId[data.socketId]}`);
    }

    putCellToOpponentData(
      data.cell,
      data.hit,
      this.state.playersId[data.socketId]
    );
  };

  handleReceiveDestroyedShip = data => {
    const { putShipToOpponentData } = this.props;
    putShipToOpponentData(
      data.index,
      data.ship,
      this.state.playersId[data.socketId]
    );
  };
  handleAllPlayersConnected = () => {
    if (Object.entries(this.state.playersId).length < 2) {
      this.setState({
        playersId: {},
      });
      const { socket, userData } = this.props;
      socket.emit(REQUEST_GAME_DATA, { roomId: userData.roomId });
    }
  };

  handleGamerHasWon = data => {
    const { setInfo } = this.props;
    setInfo(`Игрок ${this.state.playersId[data.socketId]} проиграл`);
  };

  handleOpponentLeft = data => {
    const { setInfo } = this.props;
    setInfo(`Игрок ${this.state.playersId[data.socketId]} вышел`);
  };

  render() {
    const { opponentDataA, opponentDataB, disableGame } = this.props;
    return (
      <>
        <GameHead>
          <ReturnButton>
            <Link to="/" onClick={disableGame}>
              назад
            </Link>
          </ReturnButton>
        </GameHead>
        <Grids>
          <div>
            <GamerGrid {...opponentDataA} />
            {'Игрок A'}
          </div>
          <div>
            <GamerGrid {...opponentDataB} />
            {'Игрок B'}
          </div>
        </Grids>
        <Chat />
      </>
    );
  }
}

const mapStateToProps = ({ opponentDataA, opponentDataB }) => ({
  opponentDataA,
  opponentDataB,
});

const mapDispatchToProps = dispatch => ({
  createReceivedOpponentData: (ships, busyCellsMatrix, name) =>
    dispatch(createReceivedOpponentData(ships, busyCellsMatrix, name)),

  putCellToOpponentData: (cell, hit, name) =>
    dispatch(putCellToOpponentData(cell, hit, name)),
  putShipToOpponentData: (index, ship, name) =>
    dispatch(putShipToOpponentData(index, ship, name)),

  setInfo: phrase => dispatch(setInfo(phrase)),
});

Game.propTypes = {
  opponentDataA: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  opponentDataB: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
