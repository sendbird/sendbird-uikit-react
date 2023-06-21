import React from 'react';

export const fitPageSize = (component, style = {}) => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
      ...style,
    }}
  >
    {component}
  </div>
);

export default {
  fitPageSize,
};
