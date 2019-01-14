import {
  RECALCULATE_SHIPS_DATA,
  CLEAR_SHIPS_DATA,
  ADD_TO_BUSY_CELLS,
  REMOVE_FROM_BUSY_CELLS,
  CHANGE_SHIP_POSITION,
} from '../actions';

const initialState = {
  ships: Array(10),
  busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
};

export const shipsPlacementReducer = (state = initialState, action) => {
  switch (action.type) {
  case CHANGE_SHIP_POSITION: {
    const ships = [...state.ships];
    return {
      ...state,
      ships: [
        ...ships.slice(0, action.index),
        action.ship,
        ...ships.slice(action.index + 1),
      ],
    };
  }

  case ADD_TO_BUSY_CELLS: {
    return {
      ...state,
      busyCellsMatrix: changeBusyCells(
        state.ships[action.index],
        state.busyCellsMatrix,
        true
      ),
    };
  }
  case REMOVE_FROM_BUSY_CELLS: {
    return {
      ...state,
      busyCellsMatrix: changeBusyCells(
        state.ships[action.index],
        state.busyCellsMatrix
      ),
    };
  }
  case RECALCULATE_SHIPS_DATA: {
    const ships = action.ships.map(ship => ({ ...ship }));
    const busyCellsMatrix = action.busyCellsMatrix.map(row => [...row]);
    return { ...state, ships, busyCellsMatrix };
  }
  case CLEAR_SHIPS_DATA: {
    return {
      ships: Array(10),
      busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
    };
  }
  default:
    return state;
  }
};

const changeBusyCells = (currentShip, busyCellsMatrix, isAdding = false) => {
  const busyX = currentShip.busyCellsX;
  const busyY = currentShip.busyCellsY;
  const coordsMin = currentShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
  const coordsMax = currentShip.coordinates[currentShip.length - 1]; //право-низ (x, y, isDestroyed)

  return busyCellsMatrix.map((row, i) =>
    row.map((cell, j) => {
      if (i >= busyX[0] && i <= busyX[1] && j >= busyY[0] && j <= busyY[1]) {
        if (
          i >= coordsMin.x &&
          i <= coordsMax.x &&
          j >= coordsMin.y &&
          j <= coordsMax.y
        ) {
          cell = isAdding ? 5 : 0;
        } else if (!isAdding && cell > 0) {
          cell--;
        } else if (isAdding && cell < 4) {
          cell++;
        }
      }
      return cell;
    })
  );
};
