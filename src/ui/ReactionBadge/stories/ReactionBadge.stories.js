import React from 'react';
import ReactionBadge from '../index';
import Icon, { IconTypes } from '../../Icon';

const description = `
  \`import ReactionBadge from "@sendbird/uikit-react/ui/ReactionBadge";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ReactionBadge',
  component: ReactionBadge,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <ReactionBadge {...arg}>
    <Icon type={IconTypes.CREATE} width="20px" height="20px" />
  </ReactionBadge>
);

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
