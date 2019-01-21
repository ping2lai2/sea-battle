import React from 'react';
import { Route, Switch } from 'react-router';

import io from 'socket.io-client';

import Lobby from '../../containers/lobby';
import Game from '../../containers/game';
import GameInfo from '../../containers/game-info';

import './style.css';

const socket = io('/');

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <GameInfo />
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Lobby socket={socket} {...props} />}
          />
          <Route
            path="/game/:roomID"
            render={(props, match) => (
              <Game socket={socket} {...match} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
