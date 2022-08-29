import React from 'react';
import TextButton from '../index';
import Label, { LabelTypography, LabelColors } from '../../Label';

const description = `
  \`import TextButton from "@sendbird/uikit-react/ui/TextButton";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/TextButton',
  component: TextButton,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => <TextButton {...arg}>Textbutton</TextButton>;

export const labelTextButton = () => (
  <TextButton>
    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
      Textbutton
    </Label>
  </TextButton>
);
