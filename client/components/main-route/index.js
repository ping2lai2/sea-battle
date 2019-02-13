import React from 'react';
import { connect } from 'react-redux';

import Game from '../../containers/game';
import Lobby from '../../containers/lobby';

import PropTypes from 'prop-types';

import {
  RECEIVE_OWN_ROOM,
  RECEIVE_RANDOM_ROOM,
  REQUEST_OWN_ROOM,
  REQUEST_RANDOM_ROOM,
  ALL_PLAYERS_CONNECTED,
} from '../../../common/socketEvents';

import { setRoomId, resetRoomId } from '../../actions/roomId';
import { disableGame, runGame } from '../../actions';

class MainRoute extends React.Component {
  componentDidMount() {
    const { socket, history, resetRoomId } = this.props;
    socket.on(ALL_PLAYERS_CONNECTED, this.handlePlayersConnected);
  }
  componentWillUnmount() {
    const { socket, history } = this.props;
    socket.removeEventListener(ALL_PLAYERS_CONNECTED, this.handlePlayersConnected);
  }
  handlePlayersConnected =() => {
    console.log('all connected')
    this.props.runGame();
  }
  handleReceiveOwnRoom = roomId => {
    const { history, setRoomId } = this.props;
    setRoomId(roomId);
    history.push(`/${roomId}`);
  };

  handleReceiveRandomRoom = roomId => {
    this.props.setRoomId(roomId);
  };

  randomGameWillRun = () => {
    this.setState({ willGameRun: true });
  };
  randomGameWillClose = () => {
    this.setState({ willGameRun: false });
  };
  handleRender = () => {
    if (this.props.gameStatus) {
      return (
        <Game {...this.props} />
      );
    } else {
      return (
        <Lobby
          {...this.props}
        />
      );
    }
  };
  render() {
    return this.handleRender();
  }
}

const mapStateToProps = ({ gameStatus }) => ({
  gameStatus,
});
const mapDispatchToProps = dispatch => ({
  disableGame: () => dispatch(disableGame()),
  runGame: () => dispatch(runGame()),
});
MainRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  createGameData: PropTypes.func.isRequired,
  roomId: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainRoute);
