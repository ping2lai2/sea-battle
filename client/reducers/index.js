import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { shipsPlacementReducer } from './shipsPlacementReducer';
import { userDataReducer } from './userDataReducer';
import { opponentDataReducer } from './opponentDataReducer';
import { canShootReducer } from './canShootReducer';
import { timerReducer } from './timerReducer';
import { gameInfoReducer } from './gameInfoReducer';
import { winnerStatusReducer } from './winnerStatusReducer';

export const rootReducer = history =>
  combineReducers({
    shipsPlacement: shipsPlacementReducer,
    userData: userDataReducer,
    opponentData: opponentDataReducer,
    canShoot: canShootReducer,
    timer: timerReducer,
    gameInfo: gameInfoReducer,
    winnerStatus: winnerStatusReducer,
    router: connectRouter(history),
  });
