import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const ReturnButton = ({ children }) => <div className="return-button">{children}</div>;

ReturnButton.propTypes = {
  children: PropTypes.object,
};

export default ReturnButton;
