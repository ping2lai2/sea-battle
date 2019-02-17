import {
  RESET_ROOM_ID,
  SET_ROOM_ID,
  SET_PLAYER_TYPE,
  SET_SPECTATOR_TYPE,
} from '../actions';



const initialState = {
  roomId: null,
  userType: 'players',
};
export const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_ROOM_ID: {
    return {
      ...state,
      roomId: action.roomId,
    };
  }
  case RESET_ROOM_ID: {
    return {
      ...state,
      roomId: initialState.roomId,
    };
  }
  case SET_PLAYER_TYPE: {
    return {
      ...state,
      userType: 'players',
    };
  }
  case SET_SPECTATOR_TYPE: {
    return {
      ...state,
      userType: 'spectators',
    };
  }
  default:
    return state;
  }
};
