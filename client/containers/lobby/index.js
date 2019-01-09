import React from 'react';
//import PropTypes from 'prop-types';

import PlacementShips from '../placement-ships';
import NewGameForm from '../../components/new-game-creator';

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
