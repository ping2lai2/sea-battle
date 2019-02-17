import { SET_WINNER, RESET_WINNER } from '../actions';

const initialState = null;


export const winnerStatusReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_WINNER: {
    return action.bool;
  }
  case RESET_WINNER: {
    return initialState;
  }
  default: {
    return state;
  }
  }
};
