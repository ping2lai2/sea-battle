import React from 'react';
import { Route, Switch } from 'react-router';

import io from 'socket.io-client';

import Lobby from '../../containers/lobby';
import Game from '../../containers/game';
import GameInfo from '../../containers/game-info';

import './style.css';

const socket = io('http://localhost:3333');

// TODO: поглядеть, что пробрасываешь
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <GameInfo />
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
      </div>
    );
  }
}

export default App;
