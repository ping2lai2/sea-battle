import React from 'react';
import Game from '../../containers/game';
import GameScreen from '../../containers/game-screen';
import PropTypes from 'prop-types';

import {
  RECEIVE_GAME_ROLE,
  REQUEST_GAME_ROLE,
} from '../../../common/socketEvents';

class GameRoute extends React.Component {
  state = {
    isGamer: null,
  };
  componentDidMount() {
    const { socket, match } = this.props;
    socket.on(RECEIVE_GAME_ROLE, this.handleReceiveGameRole);

    socket.emit(REQUEST_GAME_ROLE, match.params.roomID);
  }
  componentWillUnmount() {
    const { socket } = this.props;
    socket.removeListener(RECEIVE_GAME_ROLE, this.handleReceiveGameRole);
  }
  handleReceiveGameRole = data => {
    this.setState({ isGamer: data });
  };
  handleRender = () => {
    //const { isGamer } = this.state;
    switch (this.state.isGamer) {
    case true:
      return <Game {...this.props} />;
    case false:
      return <GameScreen {...this.props} />;
    default:
      return <div />;
    }

    /*
    if (isGamer === true) return <Game {...this.props} />;
    else if (isGamer === false) return <GameScreen {...this.props} />;
    else return <div />;
    */
  };
  render() {
    return this.handleRender();
  }
}

GameRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default GameRoute;
