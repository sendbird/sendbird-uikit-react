import React, { ReactElement, useContext, useEffect, useState } from 'react';
import './index.scss';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Avatar from '../Avatar';
import { isImage, isSupportedFileView } from '../../utils';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';

const BUTTON_ICON_SIDE_LENGTH = '24px';

export interface FileInfo {
  name: string;
  type: string;
  url: string;
}
interface Props {
  profileUrl: string;
  nickname: string;
  fileInfoList: FileInfo[];
  currentIndex: number;
  onClickLeft: () => void;
  onClickRight: () => void;
  onClose: () => void;
}

export default function FilesViewer({
  profileUrl,
  nickname,
  fileInfoList,
  currentIndex,
  onClickLeft,
  onClickRight,
  onClose,
}: Props): ReactElement {
  const [currentFileInfo, setCurrentFileInfo] = useState<FileInfo>();
  const { stringSet } = useContext(LocalizationContext);

  useEffect(() => {
    if (fileInfoList && currentIndex > -1) {
      setCurrentFileInfo(fileInfoList[currentIndex]);
    } else {
      setCurrentFileInfo(null);
    }
  }, [fileInfoList, currentIndex]);

  const onKeyDown = (event) => {
    switch (event.key) {
      case 'Escape':
        onClose?.();
        break;
      case 'ArrowLeft':
        onClickLeft?.();
        break;
      case 'ArrowRight':
        onClickRight?.();
        break;
      default:
    }
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  if (!currentFileInfo) return null;

  const { name, type, url } = currentFileInfo;

  return <div className="sendbird-fileviewer">
    <div className="sendbird-fileviewer__header">
      <div className="sendbird-fileviewer__header__left">
        <div className="sendbird-fileviewer__header__left__avatar">
          <Avatar height="32px" width="32px" src={profileUrl} />
        </div>
        <Label
          className="sendbird-fileviewer__header__left__filename"
          type={LabelTypography.H_2}
          color={LabelColors.ONBACKGROUND_1}
        >
          {currentFileInfo.name}
        </Label>
        <Label
          className="sendbird-fileviewer__header__left__sender-name"
          type={LabelTypography.BODY_1}
          color={LabelColors.ONBACKGROUND_2}
        >
          {nickname}
        </Label>
      </div>
      <div
        className="sendbird-fileviewer__header__right"
      >
        {
          isSupportedFileView(currentFileInfo.type) && (
            <div className="sendbird-fileviewer__header__right__actions" >
              <a
                className="sendbird-fileviewer__header__right__actions__download"
                rel="noopener noreferrer"
                href={currentFileInfo.url}
                target="_blank"
              >
                <Icon
                  type={IconTypes.DOWNLOAD}
                  fillColor={IconColors.ON_BACKGROUND_1}
                  height={BUTTON_ICON_SIDE_LENGTH}
                  width={BUTTON_ICON_SIDE_LENGTH}
                />
              </a>
            </div>
          )
        }
        <div className="sendbird-fileviewer__header__right__actions__close">
          <Icon
            type={IconTypes.CLOSE}
            fillColor={IconColors.ON_BACKGROUND_1}
            height={BUTTON_ICON_SIDE_LENGTH}
            width={BUTTON_ICON_SIDE_LENGTH}
            onClick={() => onClose?.()}
          />
        </div>
      </div>
    </div>
    {
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
    }
  </div>;
}
