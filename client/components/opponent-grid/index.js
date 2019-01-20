import React from 'react';

import PropTypes from 'prop-types';

import {
  drawGrid,
  drawShips,
  createOpponentCanvasData,
  drawMatrixState,
  drawShipsMap,
  drawShootAccessFrame,
  getCurrentCellOnGrid,
} from '../../api/canvasLogic';

import { hardClone } from '../../api/mainLogic';

import './style.css';


class OpponentGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.ctx = null;
  }
  componentDidMount() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvas.current.width = this.canvasWidth;
    this.canvas.current.height = this.canvasHeight;
    this.ctx = this.canvas.current.getContext('2d');
    this.canvasShipsData = hardClone(createOpponentCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
  }

  componentDidUpdate() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvasShipsData = hardClone(createOpponentCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
    //console.log(this.canvasShipsdata);
  }

  drawCanvas = (ctx, ships, busyCellsMatrix) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
    drawMatrixState(ctx, busyCellsMatrix);
    drawShipsMap(ctx, ships);
  };
  _mouseDown = e => {
    const { sendShoot, busyCellsMatrix } = this.props;

    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);

    const cell = getCurrentCellOnGrid({ x: mx, y: my });
    cell && busyCellsMatrix[cell.x][cell.y] === 0 && sendShoot(cell);
  };
  _mouseMove = e => {
    const { ships, busyCellsMatrix } = this.props;

    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);

    this.canvasShipsData = hardClone(createOpponentCanvasData(ships));

    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
    drawShootAccessFrame(this.ctx, mx, my);
  };
  render() {
    return (
      <div className="grid">
        <canvas
          ref={this.canvas}
          onMouseDown={this._mouseDown}
          onMouseMove={this._mouseMove}
          width={this.width}
          height={this.height}
        />
      </div>
    );
  }
}

OpponentGrid.propTypes = {
  ships: PropTypes.array.isRequired,
  busyCellsMatrix: PropTypes.array.isRequired,
  sendShoot: PropTypes.func.isRequired,
};

export default OpponentGrid;
