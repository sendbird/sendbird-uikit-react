import React from 'react';
import SortByRow from '../index.jsx';
import Icon, { IconTypes } from '../../Icon';

const description = `
  \`import SortByRow from "@sendbird/uikit-react/ui/SortByRow";\`
  \n Util to render components in rows
`;

export default {
  title: '@sendbird/uikit-react/ui/SortByRow',
  component: SortByRow,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

const array = new Array(10).fill(0);

export const WithControl = (arg) => (
  <SortByRow maxItemCount={3} {...arg}>
    {
      array.map(() => (
        <Icon type={IconTypes.ADD} width="28px" height="28px" />
      ))
    }
  </SortByRow>
);
