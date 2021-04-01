import React from 'react';
import PropTypes from 'prop-types';

export const ModalHeader = ({ children }) => (
  <div className="sendbird-modal--header">
    { children }
  </div>
);
ModalHeader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export const ModalClose = ({ children }) => (
  <div className="sendbird-modal--close">
    { children }
  </div>
);
ModalClose.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};

export const ModalFooter = ({ children }) => (
  <div className="sendbird-modal--footer">
    { children }
  </div>
);
ModalFooter.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]).isRequired,
};
