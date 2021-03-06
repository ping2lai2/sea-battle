import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { decrementTimer } from '../../actions';
import phrases from '../../api/phrases';

import { OPPONENT_HAS_WON } from '../../../common/socketEvents';

import './style.css';

class Timer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }
  componentDidMount() {
    this.props.resetTimer();
    const decrementTimerWrap = () => {
      const {
        socket,
        canShoot,
        timer,
        roomId,
        determineWinner,
        decrementTimer,
        winnerStatus,
        setInfo,
      } = this.props;
      if (timer == 0) {
        clearInterval(this.timer);
        if (canShoot) {
          setInfo(phrases.loose);
          socket.emit(OPPONENT_HAS_WON, { roomId });
          determineWinner(false);
        }
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
const mapStateToProps = ({timer}) => timer;

const mapDispatchToProps = dispatch => ({
  decrementTimer: time => dispatch(decrementTimer(time)),
});

Timer.propTypes = {
  decrementTimer: PropTypes.func.isRequired,
  determineWinner: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
  canShoot: PropTypes.bool.isRequired,
  socket: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
  winnerStatus: PropTypes.bool,
  resetTimer: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
