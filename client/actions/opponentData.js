export const PUT_CELL_TO_OPPONENT_DATA = 'PUT_CELL_TO_OPPONENT_DATA';
export const PUT_SHIP_TO_OPPONENT_DATA = 'PUT_SHIP_TO_OPPONENT_DATA';
export const CREATE_RECEIVED_OPPONENT_DATA = 'CREATE_RECEIVED_OPPONENT_DATA';
export const CREATE_OPPONENT_DATA = 'CREATE_OPPONENT_DATA';

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

export const createOpponentData = (name = 'A') => ({
  type: CREATE_OPPONENT_DATA,
  name
});
