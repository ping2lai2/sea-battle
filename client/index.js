import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { history, store } from './store/configureStore';
import App from './components/app';

import './static/styles/reset.css';

/*
import Loading from './components/loading';
import Loadable from 'react-loadable';

const LoadableApp = Loadable({
  loader: () => import('./components/app'),
  loading: Loading,
});

    <LoadableApp />
*/
const root = document.createElement('div');
root.id = 'root';

document.body.appendChild(root);

render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  root
);
