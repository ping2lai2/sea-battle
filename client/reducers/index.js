import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'
import { shipsPlacementReducer } from './shipsPlacementReducer';


export const rootReducer = (history) => combineReducers({
  shipsPlacement: shipsPlacementReducer,
  router: connectRouter(history)
});
