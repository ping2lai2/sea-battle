import React from 'react';
import { Route, Switch } from 'react-router';

import io from 'socket.io-client';

import GameInfo from '../../containers/game-info';
import MainRoute from '../../containers/main-route';
import OwnRoute from '../../containers/own-route';

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
            render={(props) => <MainRoute socket={socket} {...props} />}
          />
          <Route
            path="/:roomId"
            render={(props) => (
              <OwnRoute socket={socket} {...props} />
            )}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
