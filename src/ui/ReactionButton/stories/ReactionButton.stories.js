import React from 'react';
import ReactionButton from '../index.jsx';
import Icon, { IconTypes } from '../../Icon';

export default { title: 'UI Components/ReactionButton' };

export const reactionButton = () => [
  <h2>normal</h2>,
  <ReactionButton width="36px" height="36px" onClick={() => { console.log('click reaction button') }}>
    <Icon type={IconTypes.ADD} width="28px" height="28px" />
  </ReactionButton>,
  <h2>selected</h2>,
  <ReactionButton width="36px" height="36px" onClick={() => { console.log('click reaction button') }} selected>
    <Icon type={IconTypes.ADD} width="28px" height="28px" />
  </ReactionButton>,
];

