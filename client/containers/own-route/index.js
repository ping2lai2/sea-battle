import React from 'react';
import { connect } from 'react-redux';

import MainRoute from '../../components/main-route';
import PropTypes from 'prop-types';

import {
  RECEIVE_CHECK_ROOM,
  REQUEST_CHECK_ROOM,
} from '../../../common/socketEvents';

import { setRoomId } from '../../actions/userData';

class OwnRoute extends React.Component {
  componentDidMount() {
    const { socket, match } = this.props;
    /* нужно проверить есть ли комната, если есть, то закинуть в 
    стейт румайди, проверку наличия кораблей нужно перенести чуть дальше,
    либо распараллелить, кроме этого, мне нужно как-то прокинуть состояние
    для гейм-креатора, можно в нем проверку какую сделать, мол
    если хистори и пропса стора совпадают, то показывать кнопки выбора типа игрока
     */
    socket.on(RECEIVE_CHECK_ROOM, this.handleReceiveCheckRoom);
console.log(match.params.roomId);
    socket.emit(REQUEST_CHECK_ROOM, { roomId: match.params.roomId });
  }
  componentWillUnmount() {
    const { socket } = this.props;
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

const mapStateToProps = ({ shipsPlacement }) => ({
  shipsPlacement,
});

const mapDispatchToProps = dispatch => ({
  setRoomId: roomId => dispatch(setRoomId(roomId)),
});

OwnRoute.propTypes = {
  socket: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  createGameData: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OwnRoute);
