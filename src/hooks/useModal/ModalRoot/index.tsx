// simple component to be used as modal root
import React, { ReactElement } from 'react';

export const MODAL_ROOT = 'sendbird-modal-root';

export const ModalRoot = (): ReactElement => (
  <div id={MODAL_ROOT} className={MODAL_ROOT} />
);
export default ModalRoot;
