import {
  setWinner,
  canGamerShoot,
  resetWinner,
  resetTimer,
  createGamerData,
  createOpponentData,
} from './';

export const determineWinner = bool => dispatch => {
  dispatch(setWinner(bool));
  dispatch(canGamerShoot(false));
};

export const createGameData = (ships, busyCellsMatrix) => dispatch => {
  dispatch(resetWinner());
  dispatch(resetTimer());
  dispatch(createGamerData(ships, busyCellsMatrix));
  dispatch(createOpponentData());
};
