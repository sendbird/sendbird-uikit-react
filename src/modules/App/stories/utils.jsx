import React from 'react';

export const fitPageSize = (component) => (
  <div
    style={{
      height: '100vh',
      width: '100vw',
    }}
  >
    {component}
  </div>
);

export default {
  fitPageSize,
};
