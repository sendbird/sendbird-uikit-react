import React from 'react';
import Label, { LabelTypography, LabelColors } from '../index.jsx';

export default { title: 'ruangkelas/UI Components/Label' };

export const OnBackground_1 = () => [
  ...Object.keys(LabelTypography)
    .map(
      type =>
        <div>
          <Label type={type} color={LabelColors.ONBACKGROUND_1}>{type}</Label>
          <p />
        </div>
    )
];

export const OnBackground_2 = () => [
  ...Object.keys(LabelTypography)
    .map(
      type =>
        <div>
          <Label type={type} color={LabelColors.ONBACKGROUND_2}>{type}</Label>
          <p />
        </div>
    )
];

export const OnBackground_3 = () => [
  ...Object.keys(LabelTypography)
    .map(type =>
      <div>
        <Label type={type} color={LabelColors.ONBACKGROUND_3}>{type}</Label>
        <p />
      </div>
    )
];

export const OnContent = () => [
  ...Object.keys(LabelTypography)
    .map(type =>
      <div>
        <Label type={type} color={LabelColors.ONCONTENT_1}>{type}</Label>
        <p />
      </div>
    )
];

export const Primary = () => [
  ...Object.keys(LabelTypography)
    .map(type =>
      <div>
        <Label type={type} color={LabelColors.PRIMARY}>{type}</Label>
        <p />
      </div>
    )
];

export const Error = () => [
  ...Object.keys(LabelTypography)
    .map(type =>
      <div>
        <Label type={type} color={LabelColors.ERROR}>{type}</Label>
        <p />
      </div>
    )
];
