import React from 'react';
import ReactionBadge from '../index.jsx';
import Icon, { IconTypes } from '../../Icon';

export default { title: 'UI Components/ReactionBadge' };

export const reactionBadge = () => [
  <h1>OnlyImage</h1>,
  <ReactionBadge>
    <Icon type={IconTypes.CREATE} width="20px" height="20px" />
  </ReactionBadge>,
  <h1>Normal</h1>,
  <ReactionBadge count="1">
    <Icon type={IconTypes.CREATE} width="20px" height="20px" />
  </ReactionBadge>,
  <h1>Selected</h1>,
  <ReactionBadge count="99+" selected>
    <Icon type={IconTypes.CREATE} width="20px" height="20px" />
  </ReactionBadge>,
];
