export const SET_WINNER = 'SET_WINNER';
export const RESET_WINNER = 'RESET_WINNER';


export const setWinner = bool => ({
  type: SET_WINNER,
  bool
});

export const resetWinner = () => ({
  type: RESET_WINNER,
});
