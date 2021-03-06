import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { persistStore, persistReducer } from 'redux-persist';
import { rootReducer } from '../reducers';
import storage from 'redux-persist/lib/storage';
import { createBrowserHistory } from 'history';
import thunk from 'redux-thunk';

export const history = createBrowserHistory();

const initialState = {};
const middleware = [thunk, routerMiddleware(history)];
const enhancers = [];

const persistConfig = {
  key: 'root',
  whitelist: ['shipsPlacement'],
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer(history));

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export let store = createStore(
  persistedReducer,
  //rootReducer(history),
  initialState,
  composedEnhancers
);
export let persistor = persistStore(store);
