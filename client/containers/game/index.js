import React from 'react';
import { connect } from 'react-redux';
import {} from '../../actions/ships';
import { createBusyCells } from '../../api/mainLogic';
import {
  drawGrid,
  drawShips,
  createCanvasData,
  createDataForShip,
  getCanvasCellCoordinate,
  drawShootAccessFrame,
} from '../../api/canvasLogic';

import Chat from '../chat';
import Time from '../../components/time';
import UserGrid from '../../components/user-grid';
import OpponentGrid from '../../components/opponent-grid';

import PropTypes from 'prop-types';

import './style.css';

class Game extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <>
        <Time />
        <div className="field">
          <UserGrid />
          <OpponentGrid />
        </div>
        <Chat />
      </>
    );
  }
}
// TODO: проптайпс где?

const mapStateToProps = ({ shipsPlacement }) => shipsPlacement;

/*
const mapDispatchToProps = dispatch => ({
  removeFromBusyCells: index => dispatch(removeFromBusyCells(index)),
  addToBusyCells: index => dispatch(addToBusyCells(index)),

  changeShipPosition: (index, ship) =>
    dispatch(changeShipPosition(index, ship)),

  clearShipsData: () => dispatch(clearShipsData()),
  recalculateShipsData: (ships, busyCellsMatrix) =>
    dispatch(recalculateShipsData(ships, busyCellsMatrix)),
});
*/
export default Game;

/*
export default connect(
  mapStateToProps
  /*mapDispatchToProps
)(Game);
*/
