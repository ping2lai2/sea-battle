import { CAN_USER_SHOOT } from '../actions';

export const canShootReducer = (state = false, action) => {
  switch (action.type) {
  case CAN_USER_SHOOT: {
    return action.bool;
  }
  default: {
    return state;
  }
  }
};
