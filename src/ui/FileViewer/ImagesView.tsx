import React, {useEffect, useRef} from 'react';
import { FileViewerComponentProps, ViewerTypes } from './types';
import Icon, { IconColors, IconTypes } from '../Icon';

const BUTTON_ICON_SIDE_LENGTH = '24px';

export function ImagesView(props: FileViewerComponentProps): React.ReactElement {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  if (props.viewerType === ViewerTypes.MULTI) {
    const { fileInfoList, currentIndex, onClickLeft, onClickRight } = props;
    const { name, url } = fileInfoList[currentIndex];
    return (
      <div className="sendbird-filesviewer-content" ref={ref}>
        <div className="sendbird-filesviewer-arrow left">
          <Icon
            type={IconTypes.SLIDE_LEFT}
            fillColor={IconColors.ON_BACKGROUND_1}
            height={BUTTON_ICON_SIDE_LENGTH}
            width={BUTTON_ICON_SIDE_LENGTH}
            onClick={() => onClickLeft?.()}
          />
        </div>
        <div>
          <img
            src={url}
            alt={name}
            className="sendbird-fileviewer__content__img"
          />
          {/* This maybe supported in the future. It displays which image is currently viewing. */}
          {/* <div className="sendbird-filesviewer-image-content"> */}
          {/*  {`${(currentIndex + 1)} / ${fileInfoList.length}`} */}
          {/* </div> */}
        </div>
        <div
          className="sendbird-filesviewer-arrow right"
          style={{
            transform: 'rotate(180deg)', // FIXME: Remove this after replacing with correct right arrow image.
          }}
        >
          <Icon
            type={IconTypes.SLIDE_LEFT}
            fillColor={IconColors.ON_BACKGROUND_1}
            height={BUTTON_ICON_SIDE_LENGTH}
            width={BUTTON_ICON_SIDE_LENGTH}
            onClick={() => onClickRight?.()}
          />
        </div>
      </div>
    );
  }
  return null;
}
