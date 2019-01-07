import React from 'react';

import Lobby from '../lobby';

import './style.css';

//import socket from '../../socket.js';

// 1:20
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <Lobby />
        {/*<ShipPlacementContainer />
        <textarea
          value={this.state.value}
          className="tested"
          onChange={this.handleChange}
        />
        */}
      </div>
    );
  }
}
//1-09/ 1-13
// yarn add express
// npm i --save socket.io-client
export default App;
