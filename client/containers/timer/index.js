import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  decrementTimer,
  determineWinner,
  setInfo,
  disableGame,
} from '../../actions';
import phrases from '../../api/phrases';

import { OPPONENT_HAS_WON } from '../../../common/socketEvents';

import './style.css';

class Timer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }
  componentDidMount() {
    const decrementTimerWrap = () => {
      const {
        socket,
        canShoot,
        timer,
        roomID,
        disableGame,
        determineWinner,
        decrementTimer,
        winnerStatus,
      } = this.props;
      if (timer == 0) {
        clearInterval(this.timer);
        if (canShoot) {
          this.props.setInfo(phrases.loose);
          socket.emit(OPPONENT_HAS_WON, { roomID });
          determineWinner(false);
        }
        disableGame();
      } else {
        decrementTimer(timer);
      }
      if (winnerStatus !== null) {
        clearInterval(this.timer);
      }
    };

    this.timer = setInterval(decrementTimerWrap, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    return <div className="timer">{this.props.timer}</div>;
  }
}
const mapStateToProps = ({ timer, winnerStatus, canShoot }) => ({
  ...timer,
  canShoot,
  winnerStatus,
});

const mapDispatchToProps = dispatch => ({
  decrementTimer: time => dispatch(decrementTimer(time)),

  setInfo: bool => dispatch(setInfo(bool)),
  determineWinner: time => dispatch(determineWinner(time)),
  disableGame: () => dispatch(disableGame()),
});

Timer.propTypes = {
  decrementTimer: PropTypes.func.isRequired,
  determineWinner: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  canShoot: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  roomID: PropTypes.string.isRequired,
  winnerStatus: PropTypes.bool,
  disableGame: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
