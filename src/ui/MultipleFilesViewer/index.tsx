import React, { ReactElement, useContext, useEffect, useState } from 'react';
import './index.scss';
import { LocalizationContext } from '../../lib/LocalizationContext';
import Avatar from '../Avatar';
import { isImage, isSupportedFileView } from '../../utils';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';

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

export default function MultipleFilesViewer({
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
                  height="24px"
                  width="24px"
                />
              </a>
            </div>
          )
        }
        <div className="sendbird-fileviewer__header__right__actions__close">
          <Icon
            type={IconTypes.CLOSE}
            fillColor={IconColors.ON_BACKGROUND_1}
            height="24px"
            width="24px"
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
        : <div
          className="sendbird-fileviewer__content"
          style={{
            position: 'relative',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              left: 0,
              top: '50%',
              margin: '20px',
              cursor: 'pointer',
            }}
          >
            <Icon
              type={IconTypes.ARROW_LEFT}
              fillColor={IconColors.ON_BACKGROUND_1}
              height="24px"
              width="24px"
              onClick={() => onClickLeft?.()}
            />
          </div>
          <img
            src={url}
            alt={name}
            className="sendbird-fileviewer__content__img"
          />
          <div
            style={{
              right: 0,
              top: '50%',
              margin: '20px',
              transform: 'rotate(180deg)',
              cursor: 'pointer',
            }}
          >
            <Icon
              type={IconTypes.ARROW_RIGHT}
              fillColor={IconColors.ON_BACKGROUND_1}
              height="24px"
              width="24px"
              onClick={() => onClickRight?.()}
            />
          </div>
        </div>
    }
  </div>;
}
