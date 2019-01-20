import { DETERMINE_WINNER, RESTORE_INITIAL_WINNER } from '../actions';

const initialState = null;


export const winnerStatusReducer = (state = initialState, action) => {
  switch (action.type) {
  case DETERMINE_WINNER: {
    return action.bool;
  }
  case RESTORE_INITIAL_WINNER: {
    return initialState;
  }
  default: {
    return state;
  }
  }
};
