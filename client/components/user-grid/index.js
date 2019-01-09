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

class UserGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    //TODO проще прокинуть в пропсы
    this.canvasWidth = 520;
    this.canvasHeight = 400;
    this.ctx = null;
    
  }
  componentDidMount() {
    this.canvas.current.width = this.canvasWidth; //TODO: надо как-то иначе, имхо
    this.canvas.current.height = this.canvasHeight;
    this.ctx = this.canvas.current.getContext('2d');

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

  render() {
    //const {} = this.props;
    return (
      <div className="grid">
        <canvas ref={this.canvas} width={this.width} height={this.height} />
      </div>
    );
  }
}

export default UserGrid;
