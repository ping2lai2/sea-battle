import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { shipsPlacementReducer } from './shipsPlacementReducer';
import { gamerDataReducer } from './gamerDataReducer';
import { opponentDataReducer } from './opponentDataReducer';
import { canShootReducer } from './canShootReducer';
import { timerReducer } from './timerReducer';
import { gameInfoReducer } from './gameInfoReducer';
import { winnerStatusReducer } from './winnerStatusReducer';
import { gameStatusReducer } from './gameStatusReducer';
import { userDataReducer } from './userDataReducer';
import { createNamedWrapperReducer } from './hor';

export const rootReducer = history =>
  combineReducers({
    shipsPlacement: shipsPlacementReducer,
    gamerData: gamerDataReducer,
    opponentDataA: createNamedWrapperReducer(opponentDataReducer, 'A'),
    opponentDataB: createNamedWrapperReducer(opponentDataReducer, 'B'),
    canShoot: canShootReducer,
    timer: timerReducer,
    gameInfo: gameInfoReducer,
    winnerStatus: winnerStatusReducer,
    gameStatus: gameStatusReducer,
    userData: userDataReducer,
    router: connectRouter(history),
  });
