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
import UserGrid from '../../components/user-grid';

import phrases from '../../api/phrases';

import './style.css';

import {
  ALL_PLAYERS_CONNECTED,
  OPPONENT_LEFT,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  USER_HAS_WON,
  LEAVE_ROOM,
} from '../../../common/socketEvents';

class Game extends React.Component {
  state = {
    gamersId: {},
  };
  componentDidMount() {
    const { socket, match, setInfo } = this.props;

    setInfo(phrases.screen);

    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.on(USER_HAS_WON, this.handleUserHasWon);
    socket.on(ALL_PLAYERS_CONNECTED, this.handleAllPlayersConnected);

    socket.on(RECEIVE_GAME_DATA, this.handleReceiveGameData);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);


    socket.emit(REQUEST_GAME_DATA, match.params.roomID);
  }
  componentWillUnmount() {
    const { socket, match } = this.props;
    socket.removeListener(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.removeListener(
      ALL_PLAYERS_CONNECTED,
      this.handleAllPlayersConnected
    );
    socket.removeListener(RECEIVE_GAME_DATA, this.handleReceiveGameData);
    socket.removeListener(
      RECEIVE_SHOOT_FEEDBACK,
      this.handleReceiveShootFeedback
    );
    socket.removeListener(USER_HAS_WON, this.handleUserHasWon);
    socket.removeListener(
      RECEIVE_DESTROYED_SHIP,
      this.handleReceiveDestroyedShip
    );


    socket.emit(LEAVE_ROOM, { roomID: match.params.roomID }); //need to test
  }
  handleReceiveGameData = data => {
    if (Object.entries(this.state.gamersId).length === 0) {
      this.setState({
        gamersId: {
          [data.socketId]: 'B',
        },
      });
      this.props.createReceivedOpponentData(
        data.ships,
        data.busyCellsMatrix,
        'A'
      );
    } else {
      this.setState({
        gamersId: {
          ...this.state.gamersId,
          [data.socketId]: 'A',
        },
      });
      this.props.createReceivedOpponentData(
        data.ships,
        data.busyCellsMatrix,
        'B'
      );
    }
  };


  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    const { putCellToOpponentData, setInfo } = this.props;
    if (!data.hit) {
      setInfo(`Ходит Игрок ${this.state.gamersId[data.socketId]}`);
    }

    putCellToOpponentData(
      data.cell,
      data.hit,
      this.state.gamersId[data.socketId]
    );
  };

  handleReceiveDestroyedShip = data => {
    const { putShipToOpponentData } = this.props;
    putShipToOpponentData(
      data.index,
      data.ship,
      this.state.gamersId[data.socketId]
    );
  };
  handleAllPlayersConnected = () => {
    if (Object.entries(this.state.gamersId).length < 2) {
      this.setState({
        gamersId: {},
      });
      const { socket, match } = this.props;
      socket.emit(REQUEST_GAME_DATA, match.params.roomID);
    }
  };

  handleUserHasWon = data => {
    const { setInfo } = this.props;
    setInfo(`Игрок ${this.state.gamersId[data.socketId]} проиграл`);
  };

  handleOpponentLeft = data => {
    const { setInfo } = this.props;
    setInfo(`Игрок ${this.state.gamersId[data.socketId]} вышел`);
  };

  render() {
    const { opponentDataA, opponentDataB } = this.props;
    return (
      <div className="game">
        <div className="game-head">
          <Link className="return-button" to="/">
            назад
          </Link>
        </div>
        <div className="field">
          <div>
            <UserGrid {...opponentDataA} />
            {'Игрок A'}
          </div>
          <div>
            <UserGrid {...opponentDataB} />
            {'Игрок B'}
          </div>
        </div>
        <Chat />
      </div>
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
