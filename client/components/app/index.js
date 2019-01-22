import React from 'react';
import { Route, Switch } from 'react-router';

import io from 'socket.io-client';

import Lobby from '../../containers/lobby';
import Game from '../../containers/game';
import GameRoute from '../../containers/game-route';
import GameInfo from '../../containers/game-info';

import './style.css';

//const socket = io('/');
const socket = io('http://localhost:3333');


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
            path="/:roomID"
            render={(props, match) => (
              <GameRoute socket={socket} {...match} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
