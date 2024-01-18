import './index.scss';

import React, { MouseEvent, ReactElement, useContext, useRef } from 'react';
import { FileMessage, MultipleFilesMessage } from '@sendbird/chat/message';
import { createPortal } from 'react-dom';
import { LocalizationContext } from '../../lib/LocalizationContext';
import { MODAL_ROOT } from '../../hooks/useModal';
import { isFileMessage, isImage, isMultipleFilesMessage, isSupportedFileView, isVideo } from '../../utils';
import { noop } from '../../utils/utils';
import Avatar from '../Avatar/index';
import Label, { LabelColors, LabelTypography } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';
import { FileInfo, FileViewerComponentProps, MultiFilesViewer, ViewerTypes } from './types';
import { mapFileViewerComponentProps } from './utils';
import { DeleteButton } from './DeleteButton';
import { Slider } from './Slider';
import { useKeyDown } from '../../hooks/useKeyDown/useKeyDown';
import { UploadedFileInfoWithUpload } from '../../types';

export const FileViewerComponent = (props: FileViewerComponentProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  const { profileUrl, nickname, onClose } = props;
  const { onClickLeft, onClickRight } = props as MultiFilesViewer;
  const onKeyDown = useKeyDown(ref, {
    Escape: (e) => onClose?.(e),
    ArrowLeft: () => onClickLeft?.(),
    ArrowRight: () => onClickRight?.(),
  });
  const { name, type, url } = mapFileViewerComponentProps({ props });
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div
      className="sendbird-fileviewer"
      onKeyDown={onKeyDown}
      // to focus
      tabIndex={1}
      ref={ref}
    >
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
        <div
          className="sendbird-fileviewer__header__right"
        >
          {
            isSupportedFileView(type) && (
              <div className="sendbird-fileviewer__header__right__actions" >
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
                <DeleteButton
                  className='sendbird-fileviewer__header__right__actions__delete'
                  {...props}
                />
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
          <video
            controls
            className="sendbird-fileviewer__content__video"
          >
            <source src={url} type={type} />
          </video>
        )}
        {
          isImage(type) && (
            <img
              src={url}
              alt={name}
              className={
                props.viewerType === ViewerTypes.MULTI
                  ? 'sendbird-fileviewer__content__img__multi'
                  : 'sendbird-fileviewer__content__img'
              }
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
        <Slider {...props} />
      </div>
    </div>
  );
};

export interface FileViewerProps {
  message?: FileMessage | MultipleFilesMessage;
  statefulFileInfoList?: UploadedFileInfoWithUpload[]
  isByMe?: boolean;
  currentIndex?: number;
  onClose: (e: MouseEvent) => void;
  onDelete?: (e: MouseEvent) => void;
  onClickLeft?: () => void;
  onClickRight?: () => void;
}

export default function FileViewer({
  message,
  statefulFileInfoList = [],
  onClose,
  isByMe = false,
  onDelete,
  currentIndex,
  onClickLeft,
  onClickRight,
}: FileViewerProps): ReactElement {
  if (isMultipleFilesMessage(message)) {
    const castedMessage = message as MultipleFilesMessage;
    return (
      <FileViewerComponent
        profileUrl={castedMessage.sender.profileUrl}
        nickname={castedMessage.sender.nickname}
        viewerType={ViewerTypes.MULTI}
        fileInfoList={
          statefulFileInfoList.filter((fileInfo) => {
            return fileInfo.url; // Caution: This assumes that defined url means file upload has completed.
          }).map((fileInfo): FileInfo => {
            return {
              name: fileInfo.fileName || '',
              type: fileInfo.mimeType || '',
              url: fileInfo.url,
            };
          })
        }
        currentIndex={currentIndex || 0}
        onClickLeft={onClickLeft || noop}
        onClickRight={onClickRight || noop}
        onClose={onClose}
      />
    );
  } else if (isFileMessage(message)) {
    const castedMessage = message as FileMessage;
    return createPortal(
      (
        <FileViewerComponent
          profileUrl={castedMessage.sender?.profileUrl}
          nickname={castedMessage.sender?.nickname}
          name={castedMessage.name}
          type={castedMessage.type}
          url={castedMessage?.url}
          isByMe={isByMe}
          disableDelete={(castedMessage.threadInfo?.replyCount || 0) > 0}
          onClose={onClose}
          onDelete={onDelete || noop}
        />
      ),
      (document.getElementById(MODAL_ROOT) as HTMLElement),
    );
  }
  return <></>;
}
