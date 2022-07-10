import React from 'react';
import ReactionButton from '../index.jsx';
import Icon, { IconTypes } from '../../Icon';

const description = `
  \`import ReactionButton from "@sendbird/uikit-react/ui/ReactionButton";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ReactionButton',
  component: ReactionButton,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <ReactionButton {...arg}>
    <Icon type={IconTypes.ADD} width="28px" height="28px" />
  </ReactionButton>
);

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
