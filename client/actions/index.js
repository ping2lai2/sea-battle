export const CHANGE_SHIP_POSITION = 'CHANGE_SHIP_POSITION';
export const CLEAR_SHIPS_DATA = 'CLEAR_SHIPS_DATA';
export const ADD_TO_BUSY_CELLS = 'ADD_TO_BUSY_CELLS';
export const REMOVE_FROM_BUSY_CELLS = 'REMOVE_FROM_BUSY_CELLS';
export const RECALCULATE_SHIPS_DATA = 'RECALCULATE_SHIPS_DATA';

/********************************************************/

export const CAN_USER_SHOOT = 'CAN_USER_SHOOT';
export const DETERMINE_WINNER = 'DETERMINE_WINNER';

export const CREATE_USER_DATA = 'CREATE_USER_DATA';
export const CREATE_OPPONENT_DATA = 'CREATE_OPPONENT_DATA';

export const PUT_CELL_TO_OPPONENT_DATA = 'PUT_CELL_TO_OPPONENT_DATA';
export const PUT_SHIP_TO_OPPONENT_DATA = 'PUT_SHIP_TO_OPPONENT_DATA';
export const PUT_CELL_TO_USER_DATA = 'PUT_CELL_TO_USER_DATA';
export const PUT_SHIP_TO_USER_DATA = 'PUT_SHIP_TO_USER_DATA';
export const PUT_SHIPS_CELL_TO_USER_DATA = 'PUT_SHIPS_CELL_TO_USER_DATA';

export const DECREMENT_TIMER = 'DECREMENT_TIMER';
export const RESTORE_INITIAL_TIMER = 'RESTORE_INITIAL_TIMER';

export const SET_INFO = 'SET_INFO';
//TODO: ВЕРНИ ПЭЙЛОАД

/*_________________ LOBBY ACTIONS______________________ */

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

/*_________________ GAME ACTIONS_______________________ */

export const createUserData = (ships, busyCellsMatrix) => ({
  type: CREATE_USER_DATA,
  ships,
  busyCellsMatrix,
});

export const createOpponentData = () => ({
  type: CREATE_OPPONENT_DATA,
});

export const createGameData = (ships, busyCellsMatrix) => dispatch => {
  dispatch(createUserData(ships, busyCellsMatrix)),
  dispatch(createOpponentData());
};

export const canUserShoot = bool => ({
  type: CAN_USER_SHOOT,
  bool,
});

export const putCellToUserData = cell => ({
  type: PUT_CELL_TO_USER_DATA,
  cell,
});

export const putCellToOpponentData = (cell, hit) => ({
  type: PUT_CELL_TO_OPPONENT_DATA,
  cell,
  hit,
});

export const putShipToUserData = ship => ({
  type: PUT_SHIP_TO_USER_DATA,
  ship,
});

export const putShipToOpponentData = (index, ship) => ({
  type: PUT_SHIP_TO_OPPONENT_DATA,
  index,
  ship,
});

export const putShipsCellToUserData = (index, cell) => ({
  type: PUT_SHIPS_CELL_TO_USER_DATA,
  index,
  cell,
});

export const determineWinner = bool => ({
  type: DETERMINE_WINNER,
  bool,
});

/*_________________ TIMER ACTIONS____________________ */

export const decrementTimer = () => ({
  type: DECREMENT_TIMER,
});

export const restoreInitialTimer = () => ({
  type: RESTORE_INITIAL_TIMER,
});

/*
export const decrementTimerWithCheck = time => dispatch => {
  if (time !== 0) {
    dispatch(decrementTimer());
  } else {
    dispatch(determineWinner(false));
  }
};
*/

/*_________________ GAME INFO ACTIONS__________________ */

export const setInfo = phrase => ({
  type: SET_INFO,
  phrase,
});
