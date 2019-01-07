import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store/configureStore';
import Loading from './components/loading';
import Loadable from 'react-loadable';

import './static/styles/reset.css';

const LoadableApp = Loadable({
  loader: () => import('./components/app'),
  loading: Loading,
});

const root = document.createElement('div');
root.id = 'root';

document.body.appendChild(root);

render(
  <Provider store={store}>
    <LoadableApp />
  </Provider>,
  root
);
