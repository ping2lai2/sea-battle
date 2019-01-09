export const CHANGE_SHIP_POSITION = 'CHANGE_SHIP_POSITION';
export const CLEAR_SHIPS_DATA = 'CLEAR_SHIPS_DATA';
export const ADD_TO_BUSY_CELLS = 'ADD_TO_BUSY_CELLS';
export const REMOVE_FROM_BUSY_CELLS = 'REMOVE_FROM_BUSY_CELLS';
export const RECALCULATE_SHIPS_DATA = 'RECALCULATE_SHIPS_DATA';


export const IS_READY = 'IS_READY';
export const NOT_READY = 'NOT_READY';
export const READY_CHECK = 'READY_CHECK';

//отказался от payload т.к. местами данные не являются плоскими
export const changeShipPosition = (index, ship) => ({
  type: CHANGE_SHIP_POSITION,
  index,
  ship,
});

export const clearShipsData = () => ({
  type: CLEAR_SHIPS_DATA,
});

export const removeFromBusyCells = index => ({
  type: REMOVE_FROM_BUSY_CELLS,
  index,
});

export const addToBusyCells = index => ({
  type: ADD_TO_BUSY_CELLS,
  index,
});

export const recalculateShipsData = (ships, busyCellsMatrix) => ({
  type: RECALCULATE_SHIPS_DATA,
  ships,
  busyCellsMatrix,
});


//TODO: вообще нужен ли тут редьюсер

export const readyCheck = (ships) => ({
  type: READY_CHECK,
  ships
});
