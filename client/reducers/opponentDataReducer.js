import {
  CREATE_OPPONENT_DATA,
  PUT_CELL_TO_OPPONENT_DATA,
  PUT_SHIP_TO_OPPONENT_DATA,
  CREATE_RECEIVED_OPPONENT_DATA,
} from '../actions';

const initialState = {
  ships: Array(10),
  busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
};

export const opponentDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case CREATE_OPPONENT_DATA: {
    return {
      ...state,
      ships: [...initialState.ships],
      busyCellsMatrix: initialState.busyCellsMatrix.map(row => [...row]),
    };
  }
  case CREATE_RECEIVED_OPPONENT_DATA: {
    return {
      ...state,
      ships: action.ships.map(ship => {
        if (ship) {
          return {
            ...ship,
            coordinates: ship.coordinates.map(coordinate => ({
              ...coordinate,
            })),
            busyCellsX: [...ship.busyCellsX],
            busyCellsY: [...ship.busyCellsY],
          };
        } else {
          return ship;
        }
      }),
      busyCellsMatrix: action.busyCellsMatrix.map(row => [...row]),
    };
  }
  case PUT_CELL_TO_OPPONENT_DATA: {
    return {
      ...state,
      busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
        row.map((cell, j) => {
          if (action.cell.x === i && action.cell.y === j) {
            cell = action.hit ? 8 : 6;
          }
          return cell;
        })
      ),
    };
  }
  case PUT_SHIP_TO_OPPONENT_DATA: {
    const ships = [...state.ships];
    const currentShip = action.ship;
    const busyX = currentShip.busyCellsX;
    const busyY = currentShip.busyCellsY;
    const coordsMin = currentShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
    const coordsMax = currentShip.coordinates[currentShip.length - 1]; //право-низ (x, y, isDestroyed)
    return {
      ...state,
      ships: [
        ...ships.slice(0, action.index),
        action.ship,
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
              cell = cell === 0 ? 7 : cell;
            }
          }

          return cell;
        })
      ),
    };
  }
  default:
    return state;
  }
};
