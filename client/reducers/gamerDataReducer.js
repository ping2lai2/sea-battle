import {
  CREATE_GAMER_DATA,
  PUT_CELL_TO_GAMER_DATA,
  PUT_SHIP_TO_GAMER_DATA,
  PUT_SHIPS_CELL_TO_GAMER_DATA,
} from '../actions';

const initialState = {
  ships: Array(10),
  busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
};

export const gamerDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case CREATE_GAMER_DATA: {
    return {
      ...state,
      ships: action.ships.map(ship => ({
        ...ship,
        coordinates: ship.coordinates.map(coordinate => ({ ...coordinate })),
        busyCellsX: [...ship.busyCellsX],
        busyCellsY: [...ship.busyCellsY],
      })),
      busyCellsMatrix: action.busyCellsMatrix.map(row => [...row]),
    };
  }
  case PUT_CELL_TO_GAMER_DATA: {
    return {
      ...state,
      busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
        row.map((cell, j) => {
          if (action.cell.x === i && action.cell.y === j) {
            cell = cell === 5 ? 8 : 6;
          }
          return cell;
        })
      ),
    };
  }
  case PUT_SHIPS_CELL_TO_GAMER_DATA: {
    const ships = [...state.ships];
    let shipIsDestroyed = true;
    const currentShip = state.ships[action.index];
    const returnedShip = {
      ...currentShip,
      coordinates: currentShip.coordinates.map(coord => {
        if (coord.x === action.cell.x && coord.y === action.cell.y) {
          coord = { ...coord, isDestroyed: true };
        }
        if (coord.isDestroyed === false) {
          shipIsDestroyed = false;
        }
        return coord;
      }),
    };

    if (shipIsDestroyed) {
      const busyX = returnedShip.busyCellsX;
      const busyY = returnedShip.busyCellsY;
      const coordsMin = returnedShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
      const coordsMax = returnedShip.coordinates[returnedShip.length - 1]; //право-низ
      return {
        ...state,
        ships: [
          ...ships.slice(0, action.index),

          {
            ...returnedShip,
            coordinates: returnedShip.coordinates.map(coordinate => ({
              ...coordinate,
            })),
            busyCellsX: [...returnedShip.busyCellsX],
            busyCellsY: [...returnedShip.busyCellsY],
            isDestroyed: shipIsDestroyed,
          },
          ...ships.slice(action.index + 1),
        ],
        busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
          row.map((cell, j) => {
            if (
              i >= busyX[0] &&
                i <= busyX[1] &&
                j >= busyY[0] &&
                j <= busyY[1]
            ) {
              if (
                i >= coordsMin.x &&
                  i <= coordsMax.x &&
                  j >= coordsMin.y &&
                  j <= coordsMax.y
              ) {
                cell = 8;
              } else {
                cell = cell <= 4 ? 7 : cell;
              }
            }
            return cell;
          })
        ),
      };
    } else {
      return {
        ...state,
        ships: [
          ...ships.slice(0, action.index),
          {
            ...returnedShip,
            coordinates: returnedShip.coordinates.map(coordinate => ({
              ...coordinate,
            })),
            busyCellsX: [...returnedShip.busyCellsX],
            busyCellsY: [...returnedShip.busyCellsY],
            isDestroyed: shipIsDestroyed,
          },
          ...ships.slice(action.index + 1),
        ],
        busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
          row.map((cell, j) => {
            if (action.cell.x === i && action.cell.y === j) {
              cell = cell === 5 ? 8 : 6;
            }
            return cell;
          })
        ),
      };
    }
  }
  case PUT_SHIP_TO_GAMER_DATA: {
    return {
      ...state,
    };
  }
  default:
    return state;
  }
};
