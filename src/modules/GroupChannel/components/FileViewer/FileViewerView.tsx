import './index.scss';
import React, { MouseEvent } from 'react';
import { createPortal } from 'react-dom';

import type { FileViewerProps } from '.';

import type { CoreMessageType, SendableMessageType } from '../../../../utils';
import Avatar from '../../../../ui/Avatar';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import Label, { LabelColors, LabelTypography } from '../../../../ui/Label';
import { isImage, isSupportedFileView, isVideo } from '../../../../utils';
import { MODAL_ROOT } from '../../../../hooks/useModal';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';

type DeleteMessageTypeLegacy = (message: CoreMessageType) => Promise<void>;
export interface FileViewerViewProps extends FileViewerProps {
  deleteMessage: ((message: SendableMessageType) => Promise<void>) | DeleteMessageTypeLegacy;
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
}

export const FileViewerView: React.FC<FileViewerViewProps> = ({
  message,
  onCancel,
  deleteMessage,
  onDownloadClick,
}: FileViewerViewProps): React.ReactNode => {
  const { sender, type, url, name = '', threadInfo } = message;
  const { profileUrl, nickname, userId } = sender;

  const { config } = useSendbirdStateContext();

  return createPortal(
    <FileViewerComponent
      profileUrl={profileUrl}
      nickname={nickname}
      type={type}
      url={url}
      name={name}
      onCancel={onCancel}
      onDelete={() => deleteMessage(message).then(() => onCancel())}
      isByMe={config.userId === userId}
      disableDelete={threadInfo?.replyCount > 0}
      onDownloadClick={onDownloadClick}
    />,
    document.getElementById(MODAL_ROOT),
  );
};

export interface FileViewerUIProps {
  // sender
  profileUrl: string;
  nickname: string;
  // file
  name: string;
  type: string;
  url: string;
  // others
  isByMe: boolean;
  onCancel: () => void;
  onDelete: () => void;
  disableDelete: boolean;
  onDownloadClick?: (e: MouseEvent) => Promise<void>;
}

export const FileViewerComponent = ({
  // sender
  profileUrl,
  nickname,
  // file
  name,
  type,
  url,
  // others
  isByMe,
  onCancel,
  onDelete,
  disableDelete,
  onDownloadClick,
}: FileViewerUIProps) => (
  <div className="sendbird-fileviewer">
    <div className="sendbird-fileviewer__header">
      <div className="sendbird-fileviewer__header__left">
        <div className="sendbird-fileviewer__header__left__avatar">
          <Avatar height="32px" width="32px" src={profileUrl} />
        </div>
        <Label className="sendbird-fileviewer__header__left__filename" type={LabelTypography.H_2} color={LabelColors.ONBACKGROUND_1}>
          {name}
        </Label>
        <Label className="sendbird-fileviewer__header__left__sender-name" type={LabelTypography.BODY_1} color={LabelColors.ONBACKGROUND_2}>
          {nickname}
        </Label>
      </div>
      <div className="sendbird-fileviewer__header__right">
        {isSupportedFileView(type) && (
          <div className="sendbird-fileviewer__header__right__actions">
            <a
              className="sendbird-fileviewer__header__right__actions__download"
              rel="noopener noreferrer"
              href={url}
              target="_blank"
              onClick={onDownloadClick}
            >
              <Icon type={IconTypes.DOWNLOAD} fillColor={IconColors.ON_BACKGROUND_1} height="24px" width="24px" />
            </a>
            {onDelete && isByMe && (
              <div className="sendbird-fileviewer__header__right__actions__delete">
                <Icon
                  className={disableDelete ? 'disabled' : ''}
                  type={IconTypes.DELETE}
                  fillColor={disableDelete ? IconColors.GRAY : IconColors.ON_BACKGROUND_1}
                  height="24px"
                  width="24px"
                  onClick={() => {
                    if (!disableDelete) {
                      onDelete();
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className="sendbird-fileviewer__header__right__actions__close">
          <Icon type={IconTypes.CLOSE} fillColor={IconColors.ON_BACKGROUND_1} height="24px" width="24px" onClick={onCancel} />
        </div>
      </div>
    </div>
    <div className="sendbird-fileviewer__content">
      {isVideo(type) && (
        <video controls className="sendbird-fileviewer__content__video">
          <source src={url} type={type} />
        </video>
      )}
      {isImage(type) && <img src={url} alt={name} className="sendbird-fileviewer__content__img" />}
      {!isSupportedFileView(type) && (
        <div className="sendbird-fileviewer__content__unsupported">
          <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
            Unsupoprted message
          </Label>
        </div>
      )}
    </div>
  </div>
);
