import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
  createGameData,
  setInfo,
} from '../../actions';

import phrases from '../../api/phrases';

import {
  RECEIVE_GAME_ROOM,
  FIND_ROOM,
} from '../../../common/socketEvents';

import PlacementGrid from '../../components/placement-grid';
import NewGameCreator from '../../components/new-game-creator';

import './style.css';

class Lobby extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { socket, history, setInfo } = this.props;
    setInfo(phrases.init);
    socket.on(RECEIVE_GAME_ROOM, gameRoom => {
      history.push(`/${gameRoom}`);
    });
  }

  _onClick = () => {
    const { shipsPlacement, createGameData, socket, setInfo } = this.props;
    if (
      !shipsPlacement.ships.includes(undefined) &&
      !shipsPlacement.ships.includes(null) //&& !shipsPlacement.ships.includes(null)
    ) {
      socket.emit(FIND_ROOM);
      //TODO: opponentData должна создаваться непосредственно в игре, иначе из-за персиста получаем смесь
      createGameData(shipsPlacement.ships, shipsPlacement.busyCellsMatrix);
      setInfo(phrases.waitOpponent);
    } else {
      setInfo(phrases.notPut);
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
        <div className="lobby__inner">
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
      </div>
    );
  }
}


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

  createGameData: (ships, busyCellsMatrix) =>
    dispatch(createGameData(ships, busyCellsMatrix)),

  setInfo: phrase => dispatch(setInfo(phrase)),
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
  createGameData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  setInfo: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Lobby);
