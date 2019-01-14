import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './style.css';

export const GameInfo = ({ phrase }) => (
  <div className="game-info">{phrase}</div>
);

GameInfo.propTypes = {
  phrase: PropTypes.string.isRequired,
};

const mapStateToProps = ({ gameInfo }) => gameInfo;

export default connect(mapStateToProps)(GameInfo);
