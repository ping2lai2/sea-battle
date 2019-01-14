import {
  CREATE_USER_DATA,
  PUT_CELL_TO_USER_DATA,
  PUT_SHIP_TO_USER_DATA,
  PUT_SHIPS_CELL_TO_USER_DATA,
} from '../actions';

const initialState = {
  ships: Array(10),
  busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
};

export const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case CREATE_USER_DATA: {
    return {
      ...state,
      ships: action.ships,
      busyCellsMatrix: action.busyCellsMatrix,
    };
  }
  case PUT_CELL_TO_USER_DATA: {
    return {
      ...state,
      busyCellsMatrix: state.busyCellsMatrix.map((row, i) =>
        row.map((cell, j) => {
          if (action.cell.x === i && action.cell.y === j) {
            cell = cell === 5 ? 7 : 6;
          }
          return cell;
        })
      ),
    };
  }
  case PUT_SHIPS_CELL_TO_USER_DATA: {
    return {
      ...state,
      ships: state.ships.map((ship, index) => {
        if (index === action.index) {
          let shipIsDestroyed = true;
          ship.coordinates.map(coord => {
            if (coord.x === action.cell.x && coord.y === action.cell.y) {
              coord.isDestroyed = true;
            }
            if (coord.isDestroyed === false) {
              shipIsDestroyed = false;
            }
            return coord;
          });
          ship.isDestroyed = shipIsDestroyed;
        }
        return ship;
      }),
    };
  }
  case PUT_SHIP_TO_USER_DATA: {
    return {
      ...state,
    };
  }
  default:
    return state;
  }
};
