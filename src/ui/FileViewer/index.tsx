import './index.scss';

import React, { MouseEvent, ReactElement, useContext, useRef } from 'react';
import { FileMessage } from '@sendbird/chat/message';
import { createPortal } from 'react-dom';

import { LocalizationContext } from '../../lib/LocalizationContext';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';
import { isImage, isVideo, isSupportedFileView } from '../../utils';

import Avatar from '../Avatar/index';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';
import { FileViewerComponentProps, ViewerType, ViewerTypes } from './types';
import { useViewerState } from './hooks/useViewerState';
import { useKeyPress } from './hooks/useKeyPress';
import { noop } from '../../utils/utils';
import ImageGrid from "../ImageGrid";

export const FileViewerComponent = (props: FileViewerComponentProps): ReactElement => {
  const ref = useRef<HTMLDivElement>(null);
  // common props
  const { profileUrl, nickname, onClose, isByMe, fileInfoList } = props;

  // const {
  //   idx,
  //   incrementIdx,
  //   decrementIdx,
  //   hasPrev,
  //   hasNext,
  //   name,
  //   type,
  //   url,
  // } = useViewerState({ props });
  // useKeyPress({
  //   ref,
  //   incrementIdx,
  //   decrementIdx,
  //   onClose: onClose || noop,
  // });
  const { stringSet } = useContext(LocalizationContext);

  return (
    <div className="sendbird-fileviewer" ref={ref}>
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
                {/* decide this  - do you imeplemnt for MULTI?*/}
                {/* Either way, move to useViewerState */}
                {/* {
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
                } */}
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
              className="sendbird-fileviewer__content__img"
            />
          )
        }
        {
          !isSupportedFileView(type) && (
            <div
              className="sendbird-fileviewer__content__unsupported"
            >
              <Label type={LabelTypography.H_1} color={LabelColors.ONBACKGROUND_1}>
                {stringSet?.UI__FILE_VIEWER__UNSUPPORT || 'Unsupported message'}
              </Label>
            </div>
          )
        }
      </div>
      {
        fileInfoList?.length > 1 && <ImageGrid />
      }
      {/*
        if multi, add left/right buttons
        if hasPrev, show left button
        if hasNext, show right button
       */}
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
  // check if the message is single/multi
  if (message?.isMultipleFilesMessage()) {
    return (
      <FileViewerComponent
        profileUrl={message?.sender?.profileUrl}
        nickname={message?.sender?.nickname}
        viewerType={ViewerTypes.MULTI}
        fileInfoList={message?.fileInfoList}
        currentIndex={0}
        onClickLeft={() => { }}
        onClickRight={() => { }}
        onClose={onClose}
      />
    )
  }
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
