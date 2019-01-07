import { combineReducers } from 'redux';
import { shipsPlacementReducer } from './shipsPlacementReducer';


export const rootReducer = combineReducers({
  shipsPlacement: shipsPlacementReducer,
});
