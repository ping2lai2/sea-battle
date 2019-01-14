import React from 'react';

import PropTypes from 'prop-types';

import './style.css';

export const NewGameCreator = ({ canRunGame }) => (
  <div className="new-game-creator">
    <input className="user-name" type="text" placeholder="твоё имя..." />
    <div className="type-checkers">
      <div className="opponent-type">случайный</div>
      <div className="opponent-type">знакомый</div>
    </div>
    <input className="user-name room" type="text" placeholder="комната" />
    <button onClick={canRunGame}>Играть</button>
  </div>
);

NewGameCreator.propTypes = {
  canRunGame: PropTypes.func.isRequired,
};

export default NewGameCreator;
