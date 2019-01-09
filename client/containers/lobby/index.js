import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
} from '../../actions/ships';

import PlacementGrid from '../../components/placement-grid';
import NewGameForm from '../../components/new-game-creator';

import './style.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {
      shipsPlacement,
      recalculateShipsData,
      clearShipsData,
      addToBusyCells,
      removeFromBusyCells,
      changeShipPosition,
    } = this.props;
    return (
      <div className="lobby">
        <PlacementGrid
          ships={shipsPlacement.ships}
          busyCellsMatrix={shipsPlacement.busyCellsMatrix}
          recalculateShipsData={recalculateShipsData}
          clearShipsData={clearShipsData}
          addToBusyCells={addToBusyCells}
          removeFromBusyCells={removeFromBusyCells}
          changeShipPosition={changeShipPosition}
        />
        <NewGameForm />
      </div>
    );
  }
}

// TODO: проптайпс где?

const mapStateToProps = ({ shipsPlacement }) => ({
  shipsPlacement,
});

const mapDispatchToProps = dispatch => ({
  removeFromBusyCells: index => dispatch(removeFromBusyCells(index)),

  addToBusyCells: index => dispatch(addToBusyCells(index)),

  changeShipPosition: (index, ship) =>
    dispatch(changeShipPosition(index, ship)),

  clearShipsData: () => dispatch(clearShipsData()),

  recalculateShipsData: (ships, busyCellsMatrix) =>
    dispatch(recalculateShipsData(ships, busyCellsMatrix)),
});

Lobby.propTypes = {
  shipsPlacement: PropTypes.shape({
    ships: PropTypes.array.isRequired,
    busyCellsMatrix: PropTypes.array.isRequired,
  }).isRequired,
  recalculateShipsData: PropTypes.func.isRequired,
  clearShipsData: PropTypes.func.isRequired,
  addToBusyCells: PropTypes.func.isRequired,
  removeFromBusyCells: PropTypes.func.isRequired,
  changeShipPosition: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);

//export default Lobby;
