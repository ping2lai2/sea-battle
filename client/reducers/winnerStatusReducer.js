import { DETERMINE_WINNER } from '../actions';

export const winnerStatusReducer = (state = null, action) => {
  switch (action.type) {
  case DETERMINE_WINNER: {
    return action.bool;
  }
  default: {
    return state;
  }
  }
};

