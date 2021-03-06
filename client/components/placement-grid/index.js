import React from 'react';
import PropTypes from 'prop-types';

import {
  generateRandomShipsCoordinates,
  createBusyCells,
  hardClone,
} from '../../api/mainLogic';
import {
  abroadShips,
  drawGrid,
  drawShips,
  isShipOnGrid,
  createPlacementCanvasData,
  canPutShipInCell,
  drawAccessFrame,
  restoreCellCoordinate,
  getRoundedCellCoordinate,
} from '../../api/canvasLogic';

import './style.css';

class PlacementGrid extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.ctx = null;
    this.canvasShipsData = [];
    this.shipIndex = null;
    this.canvasShip = {}; //canvasShipsData reference
    this.clonedCanvasShip = {};
  }
  componentDidMount() {
    this.canvas.current.width = 640;
    this.canvas.current.height = 400;
    this.ctx = this.canvas.current.getContext('2d');
    const { ships } = this.props;
    this.canvasShipsData = hardClone(createPlacementCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData);
  }

  drawCanvas = (ctx, ships) => {
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    drawGrid(ctx);
    drawShips(ctx, ships);
  };
  randomGenerate = () => {
    const { ships, busyCellsMatrix } = generateRandomShipsCoordinates();
    this.props.recalculateShipsData(ships, busyCellsMatrix);
    this.canvasShipsData = hardClone(createPlacementCanvasData(ships));
    this.drawCanvas(this.ctx, this.canvasShipsData);
  };
  clearGrid = () => {
    this.props.clearShipsData();
    this.canvasShipsData = hardClone(abroadShips);
    this.drawCanvas(this.ctx, this.canvasShipsData);
  };

  _mouseDown = e => {
    const mx = parseInt(e.nativeEvent.offsetX);
    const my = parseInt(e.nativeEvent.offsetY);
    this.shipIndex = this.canvasShipsData.findIndex(
      ship =>
        mx > ship.x &&
        mx < ship.x + ship.width &&
        my > ship.y &&
        my < ship.y + ship.height
    );

    if (this.shipIndex >= 0) {
      this.canvasShip = this.canvasShipsData[this.shipIndex];
      if (isShipOnGrid(this.canvasShip)) {
        this.props.removeFromBusyCells(this.shipIndex);
      }
      this.clonedCanvasShip = { ...this.canvasShipsData[this.shipIndex] };
      this.canvasShip.ox = mx;
      this.canvasShip.oy = my;
    } else {
      this.shipIndex = null;
    }
  };

  _mouseMove = e => {
    if (this.shipIndex !== null) {
      const mx = parseInt(e.nativeEvent.offsetX);
      const my = parseInt(e.nativeEvent.offsetY);

      this.canvasShip.x += mx - this.canvasShip.ox;
      this.canvasShip.y += my - this.canvasShip.oy;
      this.canvasShip.ox = mx;
      this.canvasShip.oy = my;

      this.canvasShipsData[this.shipIndex] = this.canvasShip;
      this.drawCanvas(this.ctx, this.canvasShipsData);
      drawAccessFrame(this.ctx, this.canvasShip, this.props.busyCellsMatrix);
    }
  };

  _mouseUp = () => {
    const {
      ships,
      busyCellsMatrix,
      changeShipPosition,
      addToBusyCells,
    } = this.props;

    if (this.shipIndex !== null) {
      // мы на сетке?
      if (isShipOnGrid(this.canvasShip)) {
        //получаем новые данные корабля, который мы пытаемся воткнуть
        // если на месте нового корабля уже есть корабль, то возвращает false
        const newShip = canPutShipInCell(this.canvasShip, busyCellsMatrix);
        // мы на позиции другого корабля?
        if (newShip) {
          // дополняем остальными данными
          newShip.busyCellsX = createBusyCells(
            newShip.x,
            newShip.x + newShip.width - 1
          );
          newShip.busyCellsY = createBusyCells(
            newShip.y,
            newShip.y + newShip.height - 1
          );
          // обновляем данные списка кораблей
          changeShipPosition(this.shipIndex, newShip);

          //правим данные у канваса
          const coords = restoreCellCoordinate(
            getRoundedCellCoordinate(this.canvasShip)
          );
          this.canvasShip.x = coords.x;
          this.canvasShip.y = coords.y;
        } else {
          // наш корабль попал на другой корабь
          // мы изначально были на сетке?
          if (ships[this.shipIndex]) {
            // возвращаем в положение, занимаемое им ранее
            this.canvasShipsData[this.shipIndex] = {
              ...this.clonedCanvasShip,
            };
          } else {
            // мы изначально не были на сетке
            // возвращаем за пределы сетки, он ещё не в списке и не в матрице
            this.canvasShipsData[this.shipIndex] = {
              ...abroadShips[this.shipIndex],
            };
            this.drawCanvas(this.ctx, this.canvasShipsData);
            this.shipIndex = null;
            return false;
          }
        }
        // наш корабль на сетке, так что надо обновить данные в матрице
        addToBusyCells(this.shipIndex);
      } else {
        //не на сетке
        // перемещаем изображение за пределы сетки
        this.canvasShipsData[this.shipIndex] = {
          ...abroadShips[this.shipIndex],
        };
        // зачищаем данные в списке кораблей
        changeShipPosition(this.shipIndex, undefined);
      }
      this.drawCanvas(this.ctx, this.canvasShipsData);
      this.shipIndex = null;
    }
  };
  _mouseLeave = () => {
    if (this.shipIndex !== null) {
      this.canvasShipsData[this.shipIndex] = {
        ...abroadShips[this.shipIndex],
      };
      this.props.changeShipPosition(this.shipIndex, undefined);
      this.drawCanvas(this.ctx, this.canvasShipsData);
      this.shipIndex = null;
    }
  };
  _keyDown = e => {
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();
    if (this.shipIndex !== null && e.keyCode === 32) {
      const { width, height, ox, oy, x, y } = this.canvasShip;
      this.canvasShip = {
        ...this.canvasShip,
        width: height,
        height: width,
        x: ox - oy + y,
        y: oy - ox + x,
      };

      this.canvasShipsData[this.shipIndex] = this.canvasShip;

      this.drawCanvas(this.ctx, this.canvasShipsData);

      drawAccessFrame(this.ctx, this.canvasShip, this.props.busyCellsMatrix);
    }
  };
  render() {
    return (
      <div className="gamer-field">
        <div className="gamer-grid">
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

PlacementGrid.propTypes = {
  ships: PropTypes.arrayOf(
    PropTypes.shape({
      length: PropTypes.number,
      width: PropTypes.number,
      height: PropTypes.number,
      x: PropTypes.number,
      y: PropTypes.number,
      coordinates: PropTypes.arrayOf(
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
          isDestroyed: PropTypes.bool,
        })
      ),
      busyCellsX: PropTypes.arrayOf(PropTypes.number),
      busyCellsY: PropTypes.arrayOf(PropTypes.number),
      isDestroyed: PropTypes.bool,
    })
  ).isRequired,
  busyCellsMatrix: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    .isRequired,
  recalculateShipsData: PropTypes.func.isRequired,
  clearShipsData: PropTypes.func.isRequired,
  addToBusyCells: PropTypes.func.isRequired,
  removeFromBusyCells: PropTypes.func.isRequired,
  changeShipPosition: PropTypes.func.isRequired,
};

export default PlacementGrid;
