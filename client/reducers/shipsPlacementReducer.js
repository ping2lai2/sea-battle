import {
  RECALCULATE_SHIPS_DATA,
  CLEAR_SHIPS_DATA,
  ADD_TO_BUSY_CELLS,
  REMOVE_FROM_BUSY_CELLS,
  CHANGE_SHIP_POSITION,
} from '../actions/ships';

const initialState = {
  ships: Array(10), //TODO:
  busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)),
};

//TODO: херовая тема проводить какие-то манипуляции, хранить логику в редьюсерах
//TODO: будет время - заюзать immer
// здесь просто нужно сводить в общую картину, переделай всё к чертям
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
    //TODO: дублируешь
    const currentShip = state.ships[action.index];
    const busyX = currentShip.busyCellsX;
    const busyY = currentShip.busyCellsY;
    const coordsMin = currentShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
    const coordsMax = currentShip.coordinates[currentShip.length - 1]; //право-низ (x, y, isDestroyed)
    const busyCellsMatrix = state.busyCellsMatrix.map((row, i) =>
      row.map((cell, j) => {
        if (
          i >= busyX[0] &&
            i <= busyX[1] &&
            j >= busyY[0] &&
            j <= busyY[1]
        ) {
          if (
            i >= coordsMin[0] &&
              i <= coordsMax[0] &&
              j >= coordsMin[1] &&
              j <= coordsMax[1]
          ) {
            cell = 5;
          } else if (cell < 4) {
            cell++;
          }
        }
        return cell;
      })
    );
    return {
      ...state,
      busyCellsMatrix,
    };
  }

  case REMOVE_FROM_BUSY_CELLS: {
    const currentShip = state.ships[action.index];
    const busyX = currentShip.busyCellsX;
    const busyY = currentShip.busyCellsY;

    const coordsMin = currentShip.coordinates[0]; //лево-верх (x, y, isDestroyed)
    const coordsMax = currentShip.coordinates[currentShip.length - 1]; //право-низ (x, y, isDestroyed)

    const busyCellsMatrix = state.busyCellsMatrix.map((row, i) =>
      row.map((cell, j) => {
        if (
          i >= busyX[0] &&
            i <= busyX[1] &&
            j >= busyY[0] &&
            j <= busyY[1]
        ) {
          if (
            i >= coordsMin[0] &&
              i <= coordsMax[0] &&
              j >= coordsMin[1] &&
              j <= coordsMax[1]
          ) {
            cell = 0;
          } else if (cell > 0) {
            cell--;
          }
        }
        return cell;
      })
    );
    return {
      ...state,
      busyCellsMatrix,
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
      busyCellsMatrix: Array.from(Array(10), () => Array(10).fill(0)), //TODO: что-то надо придумать сэтим, не торт же
    };
  }
  default:
    return state;
  }
};
