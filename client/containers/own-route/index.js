import React from 'react';
import { connect } from 'react-redux';

import MainRoute from '../../containers/main-route';
import PropTypes from 'prop-types';

import {
  RECEIVE_CHECK_ROOM,
  REQUEST_CHECK_ROOM,
  CLOSE_OWN_GAME,
} from '../../../common/socketEvents';

import { setRoomId } from '../../actions';

class OwnRoute extends React.Component {
  componentDidMount() {
    const { socket, match } = this.props;

    socket.on(RECEIVE_CHECK_ROOM, this.handleReceiveCheckRoom);
    socket.emit(REQUEST_CHECK_ROOM, { roomId: match.params.roomId });
  }
  componentWillUnmount() {
    const { socket, userData } = this.props;
    if (userData.roomId) {
      socket.emit(CLOSE_OWN_GAME, userData);
    }
    socket.removeEventListener(RECEIVE_CHECK_ROOM, this.handleReceiveCheckRoom);
  }
  handleReceiveCheckRoom = data => {
    if (data.checked) {
      this.props.setRoomId(data.roomId);
    } else {
      this.props.history.replace('/');
    }
  };
  render() {
    return <MainRoute {...this.props} ownGame={true} />;
  }
}

const mapStateToProps = ({ shipsPlacement, userData }) => ({
  shipsPlacement,
  userData
});

const mapDispatchToProps = dispatch => ({
  setRoomId: roomId => dispatch(setRoomId(roomId)),
});

OwnRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnRoute);
