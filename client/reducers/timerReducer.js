import { DECREMENT_TIMER, RESET_TIMER } from '../actions';

const initialState = {
  timer: 30,
};

export const timerReducer = (state = initialState, action) => {
  switch (action.type) {
  case DECREMENT_TIMER: {
    return {
      ...state,
      timer: state.timer - 1,
    };
  }
  case RESET_TIMER: {
    return {
      ...state,
      timer: initialState.timer,
    };
  }

  default:
    return state;
  }
};