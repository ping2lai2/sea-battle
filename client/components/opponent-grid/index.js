import React from 'react';

import {
  drawGrid,
  drawShips,
  createCanvasData,
  createDataForShip,
  getCanvasCellCoordinate,
  drawMatrixState,
  drawShootAccessFrame,
  getCurrentCellOnGrid,
} from '../../api/canvasLogic';

import { hardClone } from '../../api/mainLogic';

import './style.css';

//TODO: нужно в хок скрутить, они идентичны практически по функционалу


class OpponentGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    //TODO проще прокинуть в пропсы
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.ctx = null;
  }
  componentDidMount() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvas.current.width = this.canvasWidth;
    this.canvas.current.height = this.canvasHeight;
    this.ctx = this.canvas.current.getContext('2d');
    this.canvasShipsData = hardClone(createCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
  }

  componentDidUpdate() {
    const { ships, busyCellsMatrix } = this.props;
    this.canvasShipsData = hardClone(createCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
    console.log(this.canvasShipsdata);
  }
  
  drawCanvas = (ctx, ships, busyCellsMatrix) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
    drawMatrixState(ctx, busyCellsMatrix);
  };
  _mouseDown = e => {
    const { sendShoot, busyCellsMatrix } = this.props;
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);

    //TODO: сначала сверить с данными, потом отправлять
    //console.log(busyCellsMatrix);
    const cell = getCurrentCellOnGrid({ x: mx, y: my });
    cell && busyCellsMatrix[cell.x][cell.y] === 0 && sendShoot(cell);
    //cell && this.props.sendShoot(cell);
  };
  _mouseMove = e => {
    //check opponentsMatrix
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);
    const { ships, busyCellsMatrix } = this.props;
    this.canvasShipsData = hardClone(createCanvasData(ships));
    
    this.drawCanvas(this.ctx, this.canvasShipsData, busyCellsMatrix);
    drawShootAccessFrame(this.ctx, mx, my);

  };
  render() {
    //const {} = this.props;
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

export default OpponentGrid;

//TODO: проптайпс
// TODO: деление на user-opponent для наблюдателя условное или хрен знает, надо думать, одному сложновато
