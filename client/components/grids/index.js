import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

const Grids = ({ children }) => <div className="grids">{children}</div>;

Grids.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object
  ]),
};

export default Grids;
