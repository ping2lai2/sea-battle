import React from 'react';
import { connect } from 'react-redux';
import { decrementTimer } from '../../actions';

import './style.css';

class GameInfo extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timerR = null;
  }

  componentDidMount() {
    const { decrementTimer } = this.props;
    this.timer = setInterval(decrementTimer, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return (
      <div className="game-information">
        <div className="time">{this.props.timer}</div>
        <div className="game-state">{'you loose'}</div>
      </div>
    );
  }
}

const mapStateToProps = ({ timer }) => timer;

const mapDispatchToProps = dispatch => ({
  decrementTimer: () => dispatch(decrementTimer()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameInfo);

