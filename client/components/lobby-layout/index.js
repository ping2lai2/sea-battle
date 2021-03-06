import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const LobbyLayout = ({ children }) => (
  <div className="lobby">
    <div className="lobby__inner">{children}</div>
  </div>
);

LobbyLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
};

export default LobbyLayout;
