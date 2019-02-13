import React from 'react';
import { connect } from 'react-redux';

import Game from '../../containers/game';
import GameScreen from '../../containers/game-screen';
import PropTypes from 'prop-types';


import {
  RECEIVE_GAME_ROLE,
  REQUEST_GAME_ROLE,
} from '../../../common/socketEvents';

import { createGameData } from '../../actions';

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
    socket.removeEventListener(RECEIVE_GAME_ROLE, this.handleReceiveGameRole);
  }
  handleReceiveGameRole = data => {
    this.setState({ isGamer: data });
  };
  handleRender = () => {
    const { isGamer } = this.state;
    const { shipsPlacement } = this.props;
    if (
      isGamer === true &&
      !(shipsPlacement.ships.includes(undefined) ||
        shipsPlacement.ships.includes(null))
    ) {
      return <Game {...this.props} />;
    } else if (isGamer !== null) {
      return <GameScreen {...this.props} />;
    }
    return <div />;
  };
  render() {
    return this.handleRender();
  }
}

const mapStateToProps = ({ shipsPlacement }) => ({
  shipsPlacement,
});

const mapDispatchToProps = dispatch => ({
  createGameData: (ships, busyCellsMatrix) =>
    dispatch(createGameData(ships, busyCellsMatrix)),
});

GameRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  createGameData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameRoute);
