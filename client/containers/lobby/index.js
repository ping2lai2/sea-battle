import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
  createUserData,
  createOpponentData,
  createGameData,
} from '../../actions/ships';

import {
  REQUEST_GAME_ROOM,
  RECEIVE_GAME_ROOM,
} from '../../../common/socketEvents';

import PlacementGrid from '../../components/placement-grid';
import NewGameCreator from '../../components/new-game-creator';

import './style.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket, history } = this.props;
    socket.on(RECEIVE_GAME_ROOM, gameRoom => {
      history.push(`/game/${gameRoom}`);
    });
  }

  _onClick = () => {
    const { shipsPlacement, createGameData, socket } = this.props;
    if (!shipsPlacement.ships.includes(undefined)) {
      socket.emit(REQUEST_GAME_ROOM);
      createGameData(shipsPlacement.ships, shipsPlacement.busyCellsMatrix);
      console.log(this.props.userData);
      //createUserData(shipsPlacement.ships, shipsPlacement.busyCellsMatrix);
      //createOpponentData();
    }
  };
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
        <NewGameCreator canRunGame={this._onClick} />
      </div>
    );
  }
}

// TODO: проптайпс где?

const mapStateToProps = ({ shipsPlacement, userData }) => ({
  shipsPlacement,
  userData,
});

const mapDispatchToProps = dispatch => ({
  removeFromBusyCells: index => dispatch(removeFromBusyCells(index)),

  addToBusyCells: index => dispatch(addToBusyCells(index)),

  changeShipPosition: (index, ship) =>
    dispatch(changeShipPosition(index, ship)),

  clearShipsData: () => dispatch(clearShipsData()),

  recalculateShipsData: (ships, busyCellsMatrix) =>
    dispatch(recalculateShipsData(ships, busyCellsMatrix)),

  createUserData: (ships, busyCellsMatrix) =>
    dispatch(createUserData(ships, busyCellsMatrix)),

  createGameData: (ships, busyCellsMatrix) =>
    dispatch(createGameData(ships, busyCellsMatrix)),

  createOpponentData: () => dispatch(createOpponentData()),
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
