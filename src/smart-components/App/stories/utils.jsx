import React from 'react';

export const fitPageSize = (component) => (
  <div
    style={{
      height: '98vh',
      width: '98vw',
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
