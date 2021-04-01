import React from 'react';
import TextButton from '../index.jsx';
import Label, { LabelTypography, LabelColors } from '../../Label';

export default { title: 'UI Components/TextButton' };

export const defaultTextButton = () => <TextButton>Textbutton</TextButton>;

export const labelTextButton = () => (
  <TextButton>
    <Label type={LabelTypography.SUBTITLE_1} color={LabelColors.ONBACKGROUND_1}>
      Textbutton
    </Label>
  </TextButton>
);
