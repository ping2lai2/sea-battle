import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types';

import {
  createReceivedOpponentData,
  putCellToOpponentData,
  putShipToOpponentData,
  restoreInitialTimer,
  setInfo,
  determineWinner,
  restoreInitialWinner,
} from '../../actions';

import Chat from '../chat';
import UserGrid from '../../components/user-grid';
import OpponentGrid from '../../components/opponent-grid';

import phrases from '../../api/phrases';

import './style.css';

import {
  OPPONENT_LEFT,
  REQUEST_GAME_DATA,
  RECEIVE_GAME_DATA,
  RECEIVE_DESTROYED_SHIP,
  RECEIVE_SHOOT_FEEDBACK,
  USER_HAS_WON,
  LEAVE_ROOM,
} from '../../../common/socketEvents';

class Game extends React.PureComponent {
  state = {
    gamersId: {},
  };
  componentDidMount() {
    const { socket, restoreInitialWinner, match, setInfo } = this.props;


    restoreInitialWinner();
    setInfo(phrases.screen);

    socket.on(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.on(RECEIVE_GAME_DATA, this.handleReceiveGameData);
    socket.on(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.on(USER_HAS_WON, this.handleUserHasWon);
    socket.on(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);

    socket.emit(REQUEST_GAME_DATA, match.params.roomID);
    console.log(match.params);
  }
  componentWillUnmount() {
    const { socket, match} = this.props;
    //TODO: сбрось всё
    socket.removeListener(OPPONENT_LEFT, this.handleOpponentLeft);
    socket.removeListener(RECEIVE_GAME_DATA, this.handleReceiveGameData);
    socket.removeListener(RECEIVE_SHOOT_FEEDBACK, this.handleReceiveShootFeedback);
    socket.removeListener(USER_HAS_WON, this.handleUserHasWon);
    socket.removeListener(RECEIVE_DESTROYED_SHIP, this.handleReceiveDestroyedShip);
    socket.emit(LEAVE_ROOM, match.params.roomID);
  }
  handleReceiveGameData = data => {
    if (Object.entries(this.state.gamersId).length === 0) {
      this.setState({
        gamersId: {
          [data.socketId]: 'B',
        },
      });
      this.props.createReceivedOpponentData(data.ships, data.busyCellsMatrix, 'A');
    } else {
      this.setState({
        gamersId: {
          ...this.state.gamersId,
          [data.socketId]: 'A',
        },
      });
      this.props.createReceivedOpponentData(data.ships, data.busyCellsMatrix, 'B');
    }
    console.log(this.state);
    console.log(this.props.opponentDataA);
    console.log(this.props.opponentDataB);
  };

  // получили результат выстрела
  handleReceiveShootFeedback = data => {
    console.log(data.socketId);
    console.log(data);
    const { putCellToOpponentData, setInfo } = this.props;
    if (data.hit) {
      setInfo(phrases.user);
    } else {
      setInfo(phrases.opponent);
    }
    console.log(this.state.gamersId);
    console.log(data.socketId);
    console.log(this.state.gamersId[data.socketId]);
    console.log(typeof this.state.gamersId[data.socketId]);
    putCellToOpponentData(data.cell, data.hit, this.state.gamersId[data.socketId]);
  };

  handleReceiveDestroyedShip = data => {
    console.log(data.socketId);
    console.log(data);
    const { putShipToOpponentData, setInfo } = this.props;
    setInfo(phrases.user);
    console.log(this.state.gamersId);
    console.log(data.socketId);
    console.log(this.state.gamersId[data.socketId]);
    console.log(typeof this.state.gamersId[data.socketId]);
    putShipToOpponentData(data.index, data.ship, this.state.gamersId[data.socketId]);
  };

  //TODO: прокидывать id
  handleUserHasWon = () => {
    const { setInfo, determineWinner } = this.props;
    setInfo(phrases.win);
    determineWinner(true);
  };
  //TODO: прокидывать id
  handleOpponentLeft = () => {
    const { setInfo, determineWinner, gameStatus } = this.props;
    if (gameStatus) {
      setInfo(phrases.disconnect);
      determineWinner(true);
    }
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
          <UserGrid {...opponentDataA} />
          <UserGrid {...opponentDataB} />
        </div>
        <Chat />
      </div>
    );
  }
}

const mapStateToProps = ({
  userData,
  opponentDataA,
  opponentDataB,
  gameStatus,
  winnerStatus,
}) => ({
  userData,
  opponentDataA,
  opponentDataB,
  gameStatus,
  winnerStatus,
});

const mapDispatchToProps = dispatch => ({
  restoreInitialTimer: () => dispatch(restoreInitialTimer()),

  restoreInitialWinner: () => dispatch(restoreInitialWinner()),

  createReceivedOpponentData: (ships, busyCellsMatrix, name) =>
    dispatch(createReceivedOpponentData(ships, busyCellsMatrix, name)),

  putCellToOpponentData: (cell, hit, name) =>
    dispatch(putCellToOpponentData(cell, hit, name)),
  putShipToOpponentData: (index, ship, name) =>
    dispatch(putShipToOpponentData(index, ship, name)),

  setInfo: phrase => dispatch(setInfo(phrase)),

  determineWinner: bool => dispatch(determineWinner(bool)),
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
