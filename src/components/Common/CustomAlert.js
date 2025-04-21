import React from 'react';
import { Alert } from 'reactstrap';
import PropTypes from 'prop-types';

const CustomAlert = ({ color, className, toggle, children, fade = true }) => {
  return (
    <Alert
      color={color}
      className={className}
      toggle={toggle}
      fade={fade}
      transition={{
        timeout: 300,
        appear: true,
        enter: true,
        exit: true
      }}
    >
      {children}
    </Alert>
  );
};

CustomAlert.propTypes = {
  color: PropTypes.string.isRequired,
  className: PropTypes.string,
  toggle: PropTypes.func,
  children: PropTypes.node.isRequired,
  fade: PropTypes.bool
};

export default CustomAlert; 