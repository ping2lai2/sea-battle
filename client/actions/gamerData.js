export const PUT_CELL_TO_GAMER_DATA = 'PUT_CELL_TO_GAMER_DATA';
export const PUT_SHIP_TO_GAMER_DATA = 'PUT_SHIP_TO_GAMER_DATA';
export const PUT_SHIPS_CELL_TO_GAMER_DATA = 'PUT_SHIPS_CELL_TO_GAMER_DATA';
export const CREATE_GAMER_DATA = 'CREATE_GAMER_DATA';

export const putCellToGamerData = cell => ({
  type: PUT_CELL_TO_GAMER_DATA,
  cell,
});

export const putShipToGamerData = ship => ({
  type: PUT_SHIP_TO_GAMER_DATA,
  ship,
});

export const putShipsCellToGamerData = (index, cell) => ({
  type: PUT_SHIPS_CELL_TO_GAMER_DATA,
  index,
  cell,
});

export const createGamerData = (ships, busyCellsMatrix) => ({
  type: CREATE_GAMER_DATA,
  ships,
  busyCellsMatrix,
});
