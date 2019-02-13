import { RESET_ROOM_ID, SET_ROOM_ID } from '../actions/roomId';

const initialState = null;

export const userDataReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_ROOM_ID: {
    return action.roomId;
  }
  case RESET_ROOM_ID: {
    return initialState;
  }
  default:
    return state;
  }
};
