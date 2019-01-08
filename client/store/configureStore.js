import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import { rootReducer } from '../reducers';
import { createBrowserHistory } from 'history';

// https://github.com/notrab/create-react-app-redux/blob/e3ce6666ab51277ae5a3674ff8844b728284b9c9/src/store.js

export const history = createBrowserHistory();

const initialState = {};
const middleware = [routerMiddleware(history)];
const enhancers = [];

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

export const store = createStore(
  rootReducer(history),
  initialState,
  composedEnhancers
);
