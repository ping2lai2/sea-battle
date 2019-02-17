import { CAN_GAMER_SHOOT } from '../actions';

export const canShootReducer = (state = false, action) => {
  switch (action.type) {
  case CAN_GAMER_SHOOT: {
    return action.bool;
  }
  default: {
    return state;
  }
  }
};
