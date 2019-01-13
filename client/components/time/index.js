import React from 'react';

import './style.css';

class GameInfo extends React.PureComponent {
  state = {
    timer: null,
    counter: 30,
    canShoot: this.props.canShoot,
  };
  componentDidMount() {
    let timer = setInterval(this.tick, 1000);
    this.setState({ timer });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.canShoot !== state.canShoot) {
      return {
        canShoot: props.canShoot,
        counter: 30,
      };
    }
    return null;
  }
  componentWillUnmount() {
    clearInterval(this.state.timer);
  }
  tick = () => {
    if (this.state.counter !== 0) {
      this.setState({
        counter: this.state.counter - 1,
      });
    } else {
      console.log('fired');
    }
  };

  render() {
    return (
      <div className="game-information">
        <div className="time">{this.state.counter}</div>
        <div className="game-state">{'you loose'}</div>
      </div>
    );
  }
}

/*
const GameInfo = ({}) => (
  <div className="game-information">
    <div className="time">{'10: 10'}</div>
    <div className="game-state">{'you loose'}</div>
  </div>
);
*/
//TODO: проптайпс

export default GameInfo;
