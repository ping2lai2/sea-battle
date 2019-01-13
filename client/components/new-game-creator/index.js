import React from 'react';
import { push } from 'connected-react-router';
import {
  REQUEST_GAME_ROOM,
  RECEIVE_GAME_ROOM,
} from '../../../common/socketEvents';

import PropTypes from 'prop-types';

import './style.css';

class NewGameCreator extends React.Component {

  render() {
    const { canRunGame } = this.props;
    return (
      <div className="new-game-creator">
        <input className="user-name" type="text" placeholder="твоё имя..." />
        <div className="type-checkers">
          <div className="opponent-type">случайный</div>
          <div className="opponent-type">знакомый</div>
        </div>
        <input className="user-name room" type="text" placeholder="комната" />
        <button onClick={canRunGame}>играть</button>
      </div>
    );
  }
}

// TODO: проптайпс где?
NewGameCreator.propTypes = {
  canRunGame: PropTypes.func.isRequired,
};

export default NewGameCreator;
