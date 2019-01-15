import { DETERMINE_WINNER } from '../actions';

const initialState = null;


export const winnerStatusReducer = (state = initialState, action) => {
  switch (action.type) {
  case DETERMINE_WINNER: {
    return action.bool;
  }
  default: {
    return state;
  }
  }
};
