import React from 'react';
import Label, { LabelTypography, LabelColors } from '../index.tsx';

const description = `
  \`import Label, { LabelTypography, LabelColors }  from "@sendbird/uikit-react/ui/Accordion";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Label',
  component: Label,
  subcomponents: { LabelTypography, LabelColors },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <Label {...arg}>Sample String</Label>
);

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
