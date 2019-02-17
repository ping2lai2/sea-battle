import React from 'react';
import { connect } from 'react-redux';

import Game from '../../containers/game';
import GameScreen from '../../containers/game-screen';
import Lobby from '../../containers/lobby';

import PropTypes from 'prop-types';

import { ALL_PLAYERS_CONNECTED } from '../../../common/socketEvents';

import { disableGame, runGame, setRoomId, resetRoomId } from '../../actions';

class MainRoute extends React.Component {
  componentDidMount() {
    this.props.socket.on(ALL_PLAYERS_CONNECTED, this.handlePlayersConnected);
  }
  componentWillUnmount() {
    this.props.socket.removeEventListener(
      ALL_PLAYERS_CONNECTED,
      this.handlePlayersConnected
    );
  }
  handlePlayersConnected = () => {
    this.props.runGame();
  };

  handleReceiveOwnRoom = roomId => {
    const { history, setRoomId } = this.props;
    setRoomId(roomId);
    history.replace(`/${roomId}`);
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
      if (this.props.userData.userType === 'players') {
        return <Game {...this.props} />;
      } else {
        return <GameScreen {...this.props} />;
      }
    } else {
      return <Lobby {...this.props} />;
    }
  };
  render() {
    return this.handleRender();
  }
}

const mapStateToProps = ({ gameStatus, userData }) => ({
  gameStatus,
  userData,
});
const mapDispatchToProps = dispatch => ({
  disableGame: () => dispatch(disableGame()),
  runGame: () => dispatch(runGame()),
  setRoomId: roomId => dispatch(setRoomId(roomId)),
  resetRoomId: () => dispatch(resetRoomId()),
});
MainRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  ownGame: PropTypes.bool,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainRoute);
