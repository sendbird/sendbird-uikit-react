import React, { MouseEvent, ReactElement, useContext } from 'react';
import { FileMessage } from '@sendbird/chat/message';
import { createPortal } from 'react-dom';

import './index.scss';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';
import { isImage, isVideo, isSupportedFileView } from '../../utils';

import Avatar from '../Avatar/index';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';

interface SenderInfo {
  profileUrl: string;
  nickname: string;
}
interface FileInfo {
  name: string;
  type: string;
  url: string;
}
export interface FileViewerComponentProps extends SenderInfo, FileInfo {
  isByMe?: boolean;
  disableDelete?: boolean;
  onClose: (e: MouseEvent<HTMLDivElement>) => void;
  onDelete: (e: MouseEvent<HTMLDivElement>) => void;
}

export const FileViewerComponent = ({
  profileUrl,
  nickname,
  name,
  type,
  url,
  isByMe = true,
  disableDelete = false,
  onClose,
  onDelete,
}: FileViewerComponentProps): ReactElement => {
  const { stringSet } = useContext(LocalizationContext);
  return (
    <div className="sendbird-fileviewer">
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
            {name}
          </Label>
          <Label
            className="sendbird-fileviewer__header__left__sender-name"
            type={LabelTypography.BODY_1}
            color={LabelColors.ONBACKGROUND_2}
          >
            {nickname}
          </Label>
        </div>
        <div className="sendbird-fileviewer__header__right">
          {
            isSupportedFileView(type) && (
              <div className="sendbird-fileviewer__header__right__actions">
                <a
                  className="sendbird-fileviewer__header__right__actions__download"
                  rel="noopener noreferrer"
                  href={url}
                  target="_blank"
                >
                  <Icon
                    type={IconTypes.DOWNLOAD}
                    fillColor={IconColors.ON_BACKGROUND_1}
                    height="24px"
                    width="24px"
                  />
                </a>
                {
                  onDelete && isByMe && (
                    <div className="sendbird-fileviewer__header__right__actions__delete">
                      <Icon
                        className={disableDelete ? 'disabled' : ''}
                        type={IconTypes.DELETE}
                        fillColor={disableDelete ? IconColors.GRAY : IconColors.ON_BACKGROUND_1}
                        height="24px"
                        width="24px"
                        onClick={(e) => { if (!disableDelete) { onDelete?.(e); } }}
                      />
                    </div>
                  )
                }
              </div>
            )
          }
          <div className="sendbird-fileviewer__header__right__actions__close">
            <Icon
              type={IconTypes.CLOSE}
              fillColor={IconColors.ON_BACKGROUND_1}
              height="24px"
              width="24px"
              onClick={(e) => onClose?.(e)}
            />
          </div>
        </div>
      </div>
      <div className="sendbird-fileviewer__content">
        {isVideo(type) && (
          <video controls className="sendbird-fileviewer__content__video">
            <source src={url} type={type} />
          </video>
        )}
        {
          isImage(type) && (
            <img
              src={url}
              alt={name}
              className="sendbird-fileviewer__content__img"
            />
          )
        }
        {
          !isSupportedFileView(type) && (
            <div className="sendbird-fileviewer__content__unsupported">
              <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
                {stringSet?.UI__FILE_VIEWER__UNSUPPORT || 'Unsupported message'}
              </Label>
            </div>
          )
        }
      </div>
    </div>
  );
};

export interface FileViewerProps {
  message: FileMessage;
  isByMe?: boolean;
  onClose: (e: MouseEvent<HTMLDivElement>) => void;
  onDelete: (e: MouseEvent<HTMLDivElement>) => void;
}

export default function FileViewer({
  message,
  isByMe = false,
  onClose,
  onDelete,
}: FileViewerProps): ReactElement {
  return createPortal(
    (
      <FileViewerComponent
        profileUrl={message?.sender?.profileUrl}
        nickname={message?.sender?.nickname}
        name={message?.name}
        type={message?.type}
        url={message?.url}
        isByMe={isByMe}
        disableDelete={message?.threadInfo?.replyCount > 0}
        onClose={onClose}
        onDelete={onDelete}
      />
    ),
    document.getElementById(MODAL_ROOT),
  );
}
