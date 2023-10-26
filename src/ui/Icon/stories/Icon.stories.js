import React from 'react';
import Icon, { IconTypes, IconColors } from '../index.tsx';

const description = `
  \`import Icon, { IconTypes, IconColors } from "@sendbird/uikit-react/ui/Icon";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/Icon',
  component: Icon,
  subcomponents: { IconTypes, IconColors },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <Icon {...arg} />
);

export const iconListDefault = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} />
      </div>
    )
  )
];
export const iconListPrimary = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.PRIMARY} />
      </div>
    )
  )
];
export const iconListSecondary = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.SECONDARY} />
      </div>
    )
  )
];
export const iconListContent = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.CONTENT} />
      </div>
    )
  )
];
export const iconListContentInverse = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.CONTENT_INVERSE} />
      </div>
    )
  )
];
export const iconOnBackground2 = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.ON_BACKGROUND_2} />
      </div>
    )
  )
];
export const iconOnBackground3 = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.ON_BACKGROUND_3} />
      </div>
    )
  )
];
export const iconError = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.ERROR} />
      </div>
    )
  )
];
export const iconGray = () => [
  ...Object.keys(IconTypes).map(
    type => (
      <div style={{ margin: '20px', marginBottom: '30px' }}>
        <h3>
          {type}
        </h3>
        <Icon type={type} width={36} height={36} fillColor={IconColors.GRAY} />
      </div>
    )
  )
];
