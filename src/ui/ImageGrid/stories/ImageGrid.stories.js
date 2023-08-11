import React from 'react';
import ImageGrid from '../index.tsx';
import ImageRenderer from "../../ImageRenderer";
import Icon, {IconColors, IconTypes} from "../../Icon";

const PROFILE_IMAGE = "https://static.sendbird.com/sample/profiles/profile_12_512px.png";
const EARTH_IMAGE = "https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/" +
  "upload/n/8af7775ca1d34d7681d7e61b56067136.jpg";

const description = `
  \`import ImageGrid from "@sendbird/uikit-react/ui/ImageGrid";\`
`;

export default {
  title: '@sendbird/uikit-react/ui/ImageGrid',
  component: ImageGrid,
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
};

export const withImages = () => {
  const imageRenderers = [
    <ImageRenderer
      url={PROFILE_IMAGE}
      width='200px'
      height='200px'
      borderRadius='6px'
      defaultComponent={
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      }
    />,
    <ImageRenderer
      url={EARTH_IMAGE}
      width='200px'
      height='200px'
      borderRadius='6px'
      defaultComponent={
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      }
    />,
    <ImageRenderer
      url={EARTH_IMAGE}
      width='200px'
      height='200px'
      borderRadius='6px'
      defaultComponent={
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      }
    />,
    <ImageRenderer
      url={PROFILE_IMAGE}
      width='200px'
      height='200px'
      borderRadius='6px'
      defaultComponent={
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      }
    />,
    <ImageRenderer
      url={PROFILE_IMAGE}
      width='200px'
      height='200px'
      borderRadius='6px'
      defaultComponent={
        <Icon type={IconTypes.ADD} fillColor={IconColors.PRIMARY} />
      }
    />,
  ];
  return <ImageGrid>{ imageRenderers }</ImageGrid>;
}
