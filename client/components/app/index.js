import React from 'react';
import { Route, Switch } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { Link } from 'react-router-dom';
import Lobby from '../../containers/lobby';
import Game from '../../containers/game';

import './style.css';

//import socket from '../../socket.js';
const App = ({ history }) => {
  return (
    <ConnectedRouter history={history}>
      <>
        <>
          <Link to="/">Home</Link> <Link to="/game">Hello</Link>
        </>
        <Switch>
          <Route exact path="/" component={Lobby} />
          <Route path="/game" component={Game} />
        </Switch>
      </>
    </ConnectedRouter>
  );
};

export default App;
