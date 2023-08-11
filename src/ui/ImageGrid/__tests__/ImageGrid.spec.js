import React from 'react';
import ImageGrid from "../index";
import { render } from '@testing-library/react';
import ImageRenderer from "../../ImageRenderer";
import Icon, {IconColors, IconTypes} from "../../Icon";

const PROFILE_IMAGE = "https://static.sendbird.com/sample/profiles/profile_12_512px.png";
const EARTH_IMAGE = "https://sendbird-upload.s3.amazonaws.com/2D7B4CDB-932F-4082-9B09-A1153792DC8D/" +
  "upload/n/8af7775ca1d34d7681d7e61b56067136.jpg";

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
  ];

describe('ui/ImageGrid', () => {
  it('should do a snapshot test of the ImageGrid DOM', function() {
    const { asFragment } = render(
      <ImageGrid items={imageRenderers} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
