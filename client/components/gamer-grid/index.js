import React from 'react';

import PropTypes from 'prop-types';

import {
  drawGrid,
  drawShips,
  createGameCanvasData,
  drawShipsMap,
  drawMatrixState,
} from '../../api/canvasLogic';

import { hardClone } from '../../api/mainLogic';

import './style.css';

class GamerGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.ctx = null;
    this.canvasShipsData = [];
  }
  componentDidMount() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvas.current.width = this.canvasWidth;
    this.canvas.current.height = this.canvasHeight;
    this.ctx = this.canvas.current.getContext('2d');
    this.canvasShipsData = hardClone(createGameCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
  }
  componentDidUpdate() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvasShipsData = hardClone(createGameCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
  }
  drawCanvas = (ctx, ships, busyCellsMatrix) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
    drawMatrixState(ctx, busyCellsMatrix);
    drawShipsMap(ctx, ships);
  };
  render() {
    return (
      <div className="grid">
        <canvas ref={this.canvas} />
      </div>
    );
  }
}

GamerGrid.propTypes = {
  ships: PropTypes.array.isRequired,
  busyCellsMatrix: PropTypes.array.isRequired,
};

export default GamerGrid;
