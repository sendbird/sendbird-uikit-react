import React from 'react';

export const fitPageSize = (component: JSX.Element): JSX.Element => (
  <div style={{
    height: '90vh',
    width: '90vw',
    paddingLeft: '10px',
    paddingTop: '10px',
  }}>
    {component}
  </div>
);

export default {
  fitPageSize,
};
