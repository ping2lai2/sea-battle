import React from 'react';
import { connect } from 'react-redux';
import { readyCheck } from '../../actions/ships';

import PropTypes from 'prop-types';

import './style.css';

class NewGameCreator extends React.Component {
  render() {
    return (
      <div className="new-game-creator">
        <input className="user-name" type="text" placeholder="твоё имя..." />
        <div className="type-checkers">
          <div className="opponent-type">случайный</div>
          <div className="opponent-type">знакомый</div>
          <div className="opponent-type">бот</div>
        </div>
        <button>играть</button>
      </div>
    );
  }
}

const mapStateToProps = ({ shipsPlacement }) => shipsPlacement;

const mapDispatchToProps = dispatch => ({
  readyCheck: (ships) => dispatch(readyCheck(ships)),
});

// TODO: проптайпс где?
NewGameCreator.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGameCreator);
