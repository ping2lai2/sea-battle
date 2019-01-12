import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { shipsPlacementReducer } from './shipsPlacementReducer';
import { userDataReducer } from './userDataReducer';
import { opponentDataReducer } from './opponentDataReducer';
import { canShootReducer } from './canShootReducer';

export const rootReducer = history =>
  combineReducers({
    shipsPlacement: shipsPlacementReducer,
    userData: userDataReducer,
    opponentData: opponentDataReducer,
    canShoot: canShootReducer,
    router: connectRouter(history),
  });
