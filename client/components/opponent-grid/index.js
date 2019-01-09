import React from 'react';

import {
  drawGrid,
  drawShips,
  createCanvasData,
  createDataForShip,
  getCanvasCellCoordinate,
  drawShootAccessFrame,
} from '../../api/canvasLogic';

import './style.css';

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
    this.ctx = this.canvas.current.getContext('2d');
    this.canvas.current.width = this.canvasWidth; //TODO: надо как-то иначе, имхо
    this.canvas.current.height = this.canvasHeight;

    this.drawCanvas(this.ctx);
    //this.props.ships
    //this.drawCanvas(this.ctx, this.canvasShipsData);
    //this.props.opponentShips
    //this.drawCanvas(this.ctx, this.canvasShipsData);
  }

  drawCanvas = ctx => {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    drawGrid(ctx);
  };
  _mouseDown = e => {
    //check opponentsMatrix
    // if 0 redux->shoot
  };
  _mouseMove = e => {
    //check opponentsMatrix
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);
    this.drawCanvas(this.ctx);

    drawShootAccessFrame(this.ctx, mx, my);
    //this.drawCanvas(this.userCtx);
  };
  _mouseLeave = e => {
    // this.drawCanvas(this.ctx, this.canvasShipsData);
  };

  render() {
    //const {} = this.props;
    return (
      <div className="grid">
        <canvas
          ref={this.canvas}
          onMouseDown={this._mouseDown}
          onMouseMove={this._mouseMove}
          onMouseLeave={this._mouseLeave}
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
