import React from 'react';
import { Fade } from 'reactstrap';

const Notification = ({ isOpen, toggle, message, type = 'success' }) => {
  return (
    <Fade in={isOpen} timeout={300}>
      <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
        {message}
        <button type="button" className="btn-close" onClick={toggle} aria-label="Close"></button>
      </div>
    </Fade>
  );
};

export default Notification; 