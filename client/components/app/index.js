import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { Link } from 'react-router-dom';
import Lobby from '../lobby';
import Game from '../../containers/game';

import './style.css';

//import socket from '../../socket.js';
const App = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <div>
        <div>
          <Link to="/">Home</Link> <Link to="/game">Hello</Link>
        </div>
        <Switch>
          <Route exact path="/" component={Lobby} />
          <Route path="/game" component={Game} />
        </Switch>
      </div>
    </ConnectedRouter>
  );
};

export default App;
