import React from 'react';
import { connect } from 'react-redux';
import {
  recalculateShipsData,
  clearShipsData,
  addToBusyCells,
  removeFromBusyCells,
  changeShipPosition,
} from '../../actions/ships';
import {
  generateRandomShipsCoordinates,
  createBusyCells,
} from '../../api/mainLogic';
import {
  abroadShips,
  drawGrid,
  drawShips,
  isShipOnGrid,
  createCanvasData,
  canPutShipInCell,
  drawAccessFrame,
  restoreCellCoordinate,
  getCellCoordinate,
} from '../../api/canvasLogic';

import PropTypes from 'prop-types';

import './style.css';

class PlacementShips extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.ctx = null;
    this.canvasShipsData = [];
    this.canvasShipIndex = null;
    this.currentCanvasShip = {};
    this.clonedCanvasShip = {};
  }
  componentDidMount() {
    this.canvas.current.width = 640;
    this.canvas.current.height = 400;
    this.ctx = this.canvas.current.getContext('2d');
    //TODO: можно тестить пропсы на наличие данных о местоположении кораблей, если есть, то не генерировать заново
    this.randomGenerate();
  }

  drawCanvas = (ctx, ships) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
  };
  randomGenerate = () => {
    const { ships, busyCellsMatrix } = generateRandomShipsCoordinates();
    this.props.recalculateShipsData(ships, busyCellsMatrix);
    this.canvasShipsData = createCanvasData(ships);
    this.drawCanvas(this.ctx, this.canvasShipsData);
  };
  clearGrid = () => {
    this.props.clearShipsData();
    // TODO: не порядок вообще
    this.canvasShipsData = JSON.parse(JSON.stringify(abroadShips));
    this.drawCanvas(this.ctx, this.canvasShipsData);
  };

  // TODO: всплытия останови и прочее

  _mouseDown = e => {
    //current mouse position
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);
    this.canvasShipIndex = this.canvasShipsData.findIndex(
      ship =>
        mx > ship.x &&
        mx < ship.x + ship.width &&
        my > ship.y &&
        my < ship.y + ship.height
    );

    if (this.canvasShipIndex >= 0) {
      this.currentCanvasShip = this.canvasShipsData[this.canvasShipIndex];

      if (isShipOnGrid(this.currentCanvasShip)) {
        this.props.removeFromBusyCells(this.canvasShipIndex);
      }
      //FIXIT: shallow или по барабану на мутации данных в канвасе?
      this.clonedCanvasShip = { ...this.canvasShipsData[this.canvasShipIndex] };

      this.currentCanvasShip.ox = mx;
      this.currentCanvasShip.oy = my;
    } else {
      this.canvasShipIndex = null;
    }
  };

  _mouseMove = e => {
    if (this.canvasShipIndex !== null) {
      const mx = parseInt(e.nativeEvent.offsetX);
      const my = parseInt(e.nativeEvent.offsetY);
      this.currentCanvasShip.x += mx - this.currentCanvasShip.ox;
      this.currentCanvasShip.y += my - this.currentCanvasShip.oy;
      this.drawCanvas(this.ctx, this.canvasShipsData);
      this.currentCanvasShip.ox = mx;
      this.currentCanvasShip.oy = my;
      drawAccessFrame(
        this.ctx,
        this.currentCanvasShip,
        this.props.busyCellsMatrix
      );
    }
  };

  _mouseUp = () => {
    if (this.canvasShipIndex !== null) {
      if (isShipOnGrid(this.currentCanvasShip)) {
        const newShip = canPutShipInCell(
          this.currentCanvasShip,
          this.props.busyCellsMatrix
        );
        if (newShip) {
          newShip.busyCellsX = createBusyCells(
            newShip.x,
            newShip.x + newShip.width - 1
          );
          newShip.busyCellsY = createBusyCells(
            newShip.y,
            newShip.y + newShip.height - 1
          );

          this.props.changeShipPosition(this.canvasShipIndex, newShip);
          const coords = restoreCellCoordinate(
            getCellCoordinate(this.currentCanvasShip)
          );
          this.currentCanvasShip.x = coords.x;
          this.currentCanvasShip.y = coords.y;

        } else {
          if (this.props.ships[this.canvasShipIndex]) {
            this.canvasShipsData[this.canvasShipIndex] = {
              ...this.clonedCanvasShip,
            };
          } else {
            this.canvasShipsData[this.canvasShipIndex] = {
              ...abroadShips[this.canvasShipIndex],
            };
            this.drawCanvas(this.ctx, this.canvasShipsData);
            this.canvasShipIndex = null;
            return false;
          }
        }
        this.props.addToBusyCells(this.canvasShipIndex);
      } else {
        this.canvasShipsData[this.canvasShipIndex] = {
          ...abroadShips[this.canvasShipIndex],
        };
      }

      this.drawCanvas(this.ctx, this.canvasShipsData);
      this.canvasShipIndex = null;
    }
  };
  _mouseLeave = () => {
    // TODO: !!!
    if (this.canvasShipIndex !== null) {
      this.canvasShipsData[this.canvasShipIndex] = {
        ...abroadShips[this.canvasShipIndex],
      };
      this.drawCanvas(this.ctx, this.canvasShipsData);
      this.canvasShipIndex = null;
    }
  };
  _keyDown = e => {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    if (this.canvasShipIndex !== null && e.keyCode === 32) {
      // TODO: мб сделать const {} = this.currentCanvasShip или const ship = this.currentCanvasShip? а то
      //смотрится жутко
      const width = this.currentCanvasShip.width;
      this.currentCanvasShip.width = this.currentCanvasShip.height;
      this.currentCanvasShip.height = width;

      //разница между позицией мыши и позицией самого корабля(верхнего левого)
      const dx = this.currentCanvasShip.ox - this.currentCanvasShip.x;
      const dy = this.currentCanvasShip.oy - this.currentCanvasShip.y;

      this.currentCanvasShip.x = this.currentCanvasShip.ox - dy;
      this.currentCanvasShip.y = this.currentCanvasShip.oy - dx;

      this.drawCanvas(this.ctx, this.canvasShipsData);

      drawAccessFrame(
        this.ctx,
        this.currentCanvasShip,
        this.props.busyCellsMatrix
      );
    }
  };
  render() {
    return (
      <div className="user-field">
        <div className="user-grid">
          <canvas
            ref={this.canvas}
            onMouseDown={this._mouseDown}
            onMouseMove={this._mouseMove}
            onMouseUp={this._mouseUp}
            onKeyDown={this._keyDown}
            onMouseLeave={this._mouseLeave}
            tabIndex="0"
          />
        </div>
        <div className="generate-ships-position">
          <div
            className="generate-ships-position__item"
            onClick={this.randomGenerate}
          >
            расставить случайно
          </div>
          <div
            className="generate-ships-position__item"
            onClick={this.clearGrid}
          >
            с чистого листа
          </div>
        </div>
      </div>
    );
  }
}
// TODO: проптайпс где?
const mapStateToProps = ({ shipsPlacement}) => (shipsPlacement);

const mapDispatchToProps = dispatch => ({
  removeFromBusyCells: index => dispatch(removeFromBusyCells(index)),
  addToBusyCells: index => dispatch(addToBusyCells(index)),

  changeShipPosition: (index, ship) =>
    dispatch(changeShipPosition(index, ship)),

  clearShipsData: () => dispatch(clearShipsData()),
  recalculateShipsData: (ships, busyCellsMatrix) =>
    dispatch(recalculateShipsData(ships, busyCellsMatrix)),
});

PlacementShips.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlacementShips);
