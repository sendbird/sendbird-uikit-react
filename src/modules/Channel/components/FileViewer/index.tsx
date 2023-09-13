import React from 'react';
import { createPortal } from 'react-dom';
import type { FileMessage } from '@sendbird/chat/message';

import './file-viewer.scss';
import Avatar from '../../../../ui/Avatar';
import Label, { LabelTypography, LabelColors } from '../../../../ui/Label';
import Icon, { IconColors, IconTypes } from '../../../../ui/Icon';
import { MODAL_ROOT } from '../../../../hooks/useModal';

import { isImage, isVideo, isSupportedFileView } from '../../../../utils';
import useSendbirdStateContext from '../../../../hooks/useSendbirdStateContext';
import { useChannelContext } from '../../context/ChannelProvider';
import { EveryMessage } from '../../../../types';

type FileViewerUIProps = {
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
};

export const FileViewerComponent: React.FC<FileViewerUIProps> = ({
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
}: FileViewerUIProps) => (
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
                      onClick={() => { if (!disableDelete) { onDelete(); } }}
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
            onClick={onCancel}
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
              Unsupoprted message
            </Label>
          </div>
        )
      }
    </div>
  </div>
);

type FileViewerProps = {
  onCancel:() => void;
  message: FileMessage;
};

const FileViewer: React.FC<FileViewerProps> = ({ onCancel, message }: FileViewerProps) => {
  const { deleteMessage } = useChannelContext();
  const {
    sender,
    type,
    url,
    name = '',
    threadInfo,
  } = message;
  const user = useSendbirdStateContext()?.config?.userId;
  const isByMe = user === message?.sender?.userId;
  const disableDelete = threadInfo?.replyCount > 0;
  const { profileUrl, nickname = '' } = sender;
  return createPortal(
    (
      <FileViewerComponent
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onCancel={onCancel}
        onDelete={() => {
          deleteMessage(message as EveryMessage).then(() => {
            onCancel();
          });
        }}
        isByMe={isByMe}
        disableDelete={disableDelete}
      />
    ),
    document.getElementById(MODAL_ROOT),
  );
};

export default FileViewer;
