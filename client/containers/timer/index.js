import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { decrementTimer, determineWinner, setInfo } from '../../actions';

import phrases from '../../api/phrases';

import './style.css';

class Timer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  componentDidMount() {
    const decrementTimerWrap = () => {
      const { decrementTimer, timer, determineWinner, setInfo } = this.props;
      if (timer === 0) {
        setInfo(phrases.loose);
        determineWinner(false);
        clearInterval(this.timer);
      } else {
        decrementTimer(timer);
      }
    };
    this.timer = setInterval(decrementTimerWrap, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { timer } = this.props;
    return <div className="time">{timer}</div>;
  }
}

const mapStateToProps = ({ timer }) => timer;

const mapDispatchToProps = dispatch => ({
  decrementTimer: time => dispatch(decrementTimer(time)),
  setInfo: bool => dispatch(setInfo(bool)),
  determineWinner: time => dispatch(determineWinner(time)),
});

Timer.propTypes = {
  decrementTimer: PropTypes.func.isRequired,
  determineWinner: PropTypes.func.isRequired,
  setInfo: PropTypes.func.isRequired,
  timer: PropTypes.number.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timer);
