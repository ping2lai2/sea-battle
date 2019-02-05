import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { shipsPlacementReducer } from './shipsPlacementReducer';
import { userDataReducer } from './userDataReducer';
import { opponentDataReducer } from './opponentDataReducer';
import { canShootReducer } from './canShootReducer';
import { timerReducer } from './timerReducer';
import { gameInfoReducer } from './gameInfoReducer';
import { winnerStatusReducer } from './winnerStatusReducer';
import { gameStatusReducer } from './gameStatusReducer';
import { gameTypeReducer } from './gameTypeReducer';
import { createNamedWrapperReducer } from './hor';

export const rootReducer = history =>
  combineReducers({
    shipsPlacement: shipsPlacementReducer,
    userData: userDataReducer,
    opponentDataA: createNamedWrapperReducer(opponentDataReducer, 'A'),
    opponentDataB: createNamedWrapperReducer(opponentDataReducer, 'B'),
    canShoot: canShootReducer,
    timer: timerReducer,
    gameInfo: gameInfoReducer,
    winnerStatus: winnerStatusReducer,
    gameStatus: gameStatusReducer,
    gameType: gameTypeReducer,
    router: connectRouter(history),
  });
