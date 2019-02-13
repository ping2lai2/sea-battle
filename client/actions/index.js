export const CAN_USER_SHOOT = 'CAN_USER_SHOOT';

export const RUN_GAME = 'RUN_GAME';
export const DISABLE_GAME = 'DISABLE_GAME';

export const PUT_CELL_TO_OPPONENT_DATA = 'PUT_CELL_TO_OPPONENT_DATA';
export const PUT_SHIP_TO_OPPONENT_DATA = 'PUT_SHIP_TO_OPPONENT_DATA';
export const CREATE_RECEIVED_OPPONENT_DATA = 'CREATE_RECEIVED_OPPONENT_DATA';

export const PUT_CELL_TO_USER_DATA = 'PUT_CELL_TO_USER_DATA';
export const PUT_SHIP_TO_USER_DATA = 'PUT_SHIP_TO_USER_DATA';
export const PUT_SHIPS_CELL_TO_USER_DATA = 'PUT_SHIPS_CELL_TO_USER_DATA';

export const DECREMENT_TIMER = 'DECREMENT_TIMER';
export const RESTORE_INITIAL_TIMER = 'RESTORE_INITIAL_TIMER';

export const SET_INFO = 'SET_INFO';

export const CREATE_USER_DATA = 'CREATE_USER_DATA';
export const CREATE_OPPONENT_DATA = 'CREATE_OPPONENT_DATA';

export const DETERMINE_WINNER = 'DETERMINE_WINNER';
export const RESTORE_INITIAL_WINNER = 'RESTORE_INITIAL_WINNER';


/*_________________ CAN SHOOT ACTIONS__________________ */

export const canGamerShoot = bool => ({
  type: CAN_USER_SHOOT,
  bool,
});


/*_________________ GAME ACTIONS_______________________ */
//TODO: OPEN_GAME, CLOSE_GAME
export const runGame = () => ({
  type: RUN_GAME,
});

export const disableGame = () => ({
  type: DISABLE_GAME,
});


/*_______________ OPPONENT DATA ACTIONS________________ */

export const putCellToOpponentData = (cell, hit, name = 'A') => ({
  type: PUT_CELL_TO_OPPONENT_DATA,
  cell,
  hit,
  name,
});

export const putShipToOpponentData = (index, ship, name = 'A') => ({
  type: PUT_SHIP_TO_OPPONENT_DATA,
  index,
  ship,
  name,
});

//if gamer is spectator
export const createReceivedOpponentData = (
  ships,
  busyCellsMatrix,
  name = 'A'
) => ({
  type: CREATE_RECEIVED_OPPONENT_DATA,
  ships,
  busyCellsMatrix,
  name,
});


/*__________________ USER DATA ACTIONS_________________ */

export const putCellToGamerData = cell => ({
  type: PUT_CELL_TO_USER_DATA,
  cell,
});


export const putShipToGamerData = ship => ({
  type: PUT_SHIP_TO_USER_DATA,
  ship,
});

export const putShipsCellToGamerData = (index, cell) => ({
  type: PUT_SHIPS_CELL_TO_USER_DATA,
  index,
  cell,
});


/*_________________ TIMER ACTIONS____________________ */

export const decrementTimer = () => ({
  type: DECREMENT_TIMER,
});

export const restoreInitialTimer = () => ({
  type: RESTORE_INITIAL_TIMER,
});


/*_________________ GAME INFO ACTIONS__________________ */

export const setInfo = phrase => ({
  type: SET_INFO,
  phrase,
});


/*___________________ NESTED ACTIONS___________________ */

export const determineWinner = bool => dispatch => {
  dispatch({ type: DETERMINE_WINNER, bool });
  dispatch(canGamerShoot(false));
};

export const createGameData = (ships, busyCellsMatrix) => dispatch => {
  dispatch({ type: RESTORE_INITIAL_WINNER });
  dispatch(restoreInitialTimer());
  dispatch(({
    type: CREATE_USER_DATA,
    ships,
    busyCellsMatrix,
  }));
  dispatch(({
    type: CREATE_OPPONENT_DATA,
    name: 'A',
  }));
};
