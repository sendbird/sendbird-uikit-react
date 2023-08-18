import React from "react";
import {FileViewerComponentProps, ViewerTypes} from "./types";
import Icon, { IconColors, IconTypes } from '../Icon';
import {isImage} from "../../utils";
import Label, { LabelTypography, LabelColors } from '../Label';

const BUTTON_ICON_SIDE_LENGTH = '24px';

export function ImagesView({ props, stringSet }: {
  props: FileViewerComponentProps,
  stringSet?: any,
}) {
  if (props.viewerType === ViewerTypes.MULTI) {
    const {fileInfoList, currentIndex, onClickLeft, onClickRight } = props;
    const { name, url, type } = fileInfoList[currentIndex];
    return (
      !isImage(type) || fileInfoList.length <= 1
        ? <div className="sendbird-fileviewer__content">
          <div
            className="sendbird-fileviewer__content__unsupported"
          >
            <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
              {stringSet?.UI__FILE_VIEWER__UNSUPPORT || 'Unsupported message'}
            </Label>
          </div>
        </div>
        : <div className="sendbird-filesviewer-content">
          <div className="sendbird-filesviewer-arrow left">
            <Icon
              type={IconTypes.ARROW_LEFT}
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
            <div className="sendbird-filesviewer-image-content">
              {`${(currentIndex + 1)} / ${fileInfoList.length}`}
            </div>
          </div>
          <div
            className="sendbird-filesviewer-arrow right"
            style={{
              transform: 'rotate(180deg)', // FIXME: Remove this after replacing with correct right arrow image.
            }}
          >
            <Icon
              type={IconTypes.ARROW_RIGHT}
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