import React from 'react';
import ImageRenderer from '../index';

import Icon, { IconTypes, IconColors } from '../../Icon';

const description = `
  \`import ImageRenderer from "@sendbird/uikit-react/ui/ImageRenderer";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ImageRenderer',
  component: ImageRenderer,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const WithControl = (arg) => (
  <ImageRenderer
    {...arg}
    defaultComponent={
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    }
  />
);

export const setDefaultComponent = () => (
  <ImageRenderer
    url=""
    width="36px"
    height="36px"
    defaultComponent={
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    }
  />
);
export const appliedSource = () => ([
  <ImageRenderer
    url="https://static.sendbird.com/sample/profiles/profile_12_512px.png"
    width="36px"
    height="36px"
    defaultComponent={
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    }
  />,
  <ImageRenderer
    url="..."
    width="36px"
    height="36px"
    defaultComponent={
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    }
  />,
  <ImageRenderer
    url="https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/upload/n/8af7775ca1d34d7681d7e61b56067136.jpg"
    width="36px"
    height="36px"
    defaultComponent={
      <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
    }
  />,
]);
