import React from 'react';

import PropTypes from 'prop-types';

import './style.css';

export const NewGameCreator = ({ canRunGame }) => (
  <div className="new-game-creator">
    {/*<input className="user-name" type="text" placeholder="твоё имя..." />*/}
    <div className="run-game-button" onClick={canRunGame}>Играть</div>
  </div>
);

NewGameCreator.propTypes = {
  canRunGame: PropTypes.func.isRequired,
};

export default NewGameCreator;
