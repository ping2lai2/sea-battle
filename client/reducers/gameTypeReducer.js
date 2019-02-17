import { SET_GAME_TYPE } from '../actions';


export const gameTypeReducer = (state = null, action) => {
  switch (action.type) {
  case SET_GAME_TYPE: {
    return {
      ...state,
      gameType: action.gameType,
    };
  }

  default:
    return state;
  }
};