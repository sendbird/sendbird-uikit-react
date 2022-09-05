// simple component to be used as modal root
import React from 'react';

export const MODAL_ROOT = 'sendbird-modal-root';

export default () => (
  <div id={MODAL_ROOT} role="root" />
);
