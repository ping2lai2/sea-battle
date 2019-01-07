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

import PropTypes from 'prop-types';

import './style.css';

class PlacementShips extends React.Component {
  constructor(props) {
    super(props);
    this.userCanvas = React.createRef();
    this.opponentCanvas = React.createRef();
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.userCtx = null;
    this.opponentCtx = null;
  }
  componentDidMount() {
    this.userCtx = this.userCanvas.current.getContext('2d');
    this.opponentCtx = this.opponentCanvas.current.getContext('2d');
    this.userCanvas.current.width = this.canvasWidth; //TODO: надо как-то иначе, имхо
    this.userCanvas.current.height = this.canvasHeight;
    this.opponentCanvas.current.width = this.canvasWidth;
    this.opponentCanvas.current.height = this.canvasHeight;

    this.drawCanvas(this.userCtx);
    this.drawCanvas(this.opponentCtx);
    //this.props.ships
    //this.drawCanvas(this.ctx, this.canvasShipsData);
    //this.props.opponentShips
    //this.drawCanvas(this.ctx, this.canvasShipsData);
  }

  drawCanvas = ctx => {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    //ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    // drawShips(ctx, ships);
  };
  _mouseDown = e => {
    //check opponentsMatrix
    // if 0 redux->shoot
  };
  _mouseMove = e => {
    //check opponentsMatrix
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);
    this.drawCanvas(this.opponentCtx);

    drawShootAccessFrame(this.opponentCtx, mx, my);
    //this.drawCanvas(this.userCtx);
  };

  _mouseLeave = e => {
    // this.drawCanvas(this.ctx, this.canvasShipsData);
  };
  render() {
    return (
      <div className="field">
        <div className="user-grid">
          <canvas
            ref={this.userCanvas}
            width={this.width}
            height={this.height}
          />
        </div>
        <div className="opponent-grid">
          <canvas
            ref={this.opponentCanvas}
            onMouseDown={this._mouseDown}
            onMouseMove={this._mouseMove}
            onMouseLeave={this._mouseLeave}
            width={this.width}
            height={this.height}
          />
        </div>
      </div>
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
export default connect(
  mapStateToProps
  /*mapDispatchToProps*/
)(PlacementShips);
