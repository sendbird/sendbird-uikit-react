import React from 'react';

export const fitPageSize = (component) => (
  <div
    style={{
      height: '95vh',
      width: '95vw',
      paddingLeft: '10px',
      paddingTop: '10px',
    }}
  >
    {component}
  </div>
);

export default {
  fitPageSize,
};
