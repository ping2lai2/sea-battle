import React from 'react';
import { Route, Router, Switch } from 'react-router';

import Lobby from '../../containers/lobby';
import Game from '../../containers/game';

import socket from '../../socket';

import './style.css';


// TODO: поглядеть, что пробрасываешь
class App extends React.Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          component={() => <Lobby socket={socket} {...this.props} />}
        />
        <Route
          path="/game/:roomID"
          component={match => (
            <Game socket={socket} {...match} {...this.props} />
          )}
        />
      </Switch>
    );
  }
}

export default App;
