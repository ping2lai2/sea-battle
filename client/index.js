import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router';
import { history, store } from './store/configureStore';
import App from './components/app';

import Lobby from './containers/lobby';
import Game from './containers/game';

import './static/styles/reset.css';

const root = document.createElement('div');
root.id = 'root';

document.body.appendChild(root);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App history={history}>
        {/*<Switch>
          <Route exact path="/" component={Lobby} />
          <Route path="/:gameRoom" component={Game} />
        </Switch>*/}
      </App>
    </ConnectedRouter>
  </Provider>,
  root
);

/*
render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  root
);
*/
