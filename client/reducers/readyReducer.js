import { IS_READY, NOT_READY } from '../actions/ships';

const initialState = {
  readyCheck: false,
};

export const readyReducer = (state = initialState, action) => {
  switch (action.type) {
  case IS_READY: {
    return { ...state, readyCheck: true };
  }
  case NOT_READY: {
    return { ...state, readyCheck: false };
  }
  }
};
