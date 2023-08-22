import React from 'react';
import { FileViewerComponentProps, ViewerTypes } from './types';
import Icon, { IconColors, IconTypes } from '../Icon';

const BUTTON_ICON_SIDE_LENGTH = '32px';

// this is a slider component that is used to navigate between images
export function Slider(props: FileViewerComponentProps): React.ReactElement {
  if (props.viewerType === ViewerTypes.MULTI) {
    const { onClickLeft, onClickRight } = props;
    return (
      <div className="sendbird-file-viewer-slider">
        <div className="sendbird-file-viewer-arrow--left">
          <Icon
            type={IconTypes.SLIDE_LEFT}
            fillColor={IconColors.ON_BACKGROUND_1}
            height={BUTTON_ICON_SIDE_LENGTH}
            width={BUTTON_ICON_SIDE_LENGTH}
            onClick={(e) => {
              onClickLeft?.();
              e.stopPropagation();
            }}
          />
        </div>
        <div
          className="sendbird-file-viewer-arrow--right"
        >
          <Icon
            type={IconTypes.SLIDE_LEFT}
            fillColor={IconColors.ON_BACKGROUND_1}
            height={BUTTON_ICON_SIDE_LENGTH}
            width={BUTTON_ICON_SIDE_LENGTH}
            onClick={(e) => {
              e.stopPropagation();
              onClickRight?.();
            }}
          />
        </div>
      </div>
    );
  }
  // return empty fragment if viewerType is not ViewerTypes.MULTI
  return <></>;
}
