import React from 'react';
//import PropTypes from 'prop-types';

import PlacementShips from '../../containers/placement-ships'; //placement-ships
import NewGameForm from '../../containers/new-game-creator';

import './style.css';

const Lobby = () => {
  return (
    <div className="lobby">
      <PlacementShips />
      <NewGameForm />
    </div>
  );
};

export default Lobby;
