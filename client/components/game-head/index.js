import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const GameHead = ({ children }) => <div className="game-head">{children}</div>;

GameHead.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
};

export default GameHead;
