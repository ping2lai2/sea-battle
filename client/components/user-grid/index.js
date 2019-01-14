import React from 'react';

import {
  drawGrid,
  drawShips,
  createCanvasData,
  createDataForShip,
  drawShipsMap,
  drawMatrixState,
  getCanvasCellCoordinate,
  drawShootAccessFrame,
} from '../../api/canvasLogic';

import { hardClone } from '../../api/mainLogic';

//TODO: нужно в хок скрутить, они идентичны практически по функционалу

import './style.css';

class UserGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    //TODO проще прокинуть в пропсы
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.ctx = null;
    this.canvasShipsData = [];
  }
  componentDidMount() {
    const {ships, busyCellsMatrix} = this.props;
    this.canvas.current.width = this.canvasWidth;
    this.canvas.current.height = this.canvasHeight;
    this.ctx = this.canvas.current.getContext('2d');
    this.canvasShipsData = hardClone(createCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData,busyCellsMatrix);
  }
  componentDidUpdate() {
    const {ships, busyCellsMatrix} = this.props;
    this.canvasShipsData = hardClone(createCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
  }
  drawCanvas = (ctx, ships, busyCellsMatrix) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
    drawMatrixState(ctx, busyCellsMatrix, true);
    drawShipsMap(ctx, ships);
  };
  //TODO: прокидываю width={this.width} а ещё есть this.canvas.current.widt this.canvasWidth, что хотел - хз
  render() {
    return (
      <div className="grid">
        <canvas ref={this.canvas} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default UserGrid;
