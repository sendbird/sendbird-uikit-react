import React, { ReactElement } from 'react';

interface ModalElementProps {
  children: ReactElement;
}
export const ModalHeader = ({ children }: ModalElementProps): ReactElement => (
  <div className="sendbird-modal--header">
    { children }
  </div>
);

export const ModalClose = ({ children }: ModalElementProps): ReactElement => (
  <div className="sendbird-modal--close">
    { children }
  </div>
);

export const ModalFooter = ({ children }: ModalElementProps): ReactElement => (
  <div className="sendbird-modal--footer">
    { children }
  </div>
);
