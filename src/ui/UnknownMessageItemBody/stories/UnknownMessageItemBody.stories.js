import React from 'react';
import UnknownMessageItemBody from '../index.tsx';

export default { title: 'UI Components/UnknownMessageItemBody' };

export const withText = () => (
  <div>
    <UnknownMessageItemBody />
    <br />
    <br />
    <UnknownMessageItemBody isByMe />
  </div>
);
