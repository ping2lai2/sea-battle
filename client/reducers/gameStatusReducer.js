import { RUN_GAME, DISABLE_GAME } from '../actions';

export const gameStatusReducer = (state = false, action) => {
  switch (action.type) {
  case RUN_GAME: {
    return true;
  }
  case DISABLE_GAME: {
    return false;
  }
  default: {
    return state;
  }
  }
};
