import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import './index.scss';
import Avatar from '../Avatar/index';
import Label, { LabelTypography, LabelColors } from '../Label';
import Icon, { IconColors, IconTypes } from '../Icon';
import { MODAL_ROOT } from '../../hooks/useModal/ModalRoot';

import { isImage, isVideo, isSupportedFileView, getClassName } from '../../utils';

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
  onClose,
  onDelete,
  disableDelete,
}) => (
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
                      onClick={() => { if (!disableDelete) { onDelete() } }}
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
            onClick={onClose}
          />
        </div>
      </div>
    </div>
    <div className="sendbird-fileviewer__content">
      {isVideo(type) && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
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

FileViewerComponent.propTypes = {
  profileUrl: PropTypes.string.isRequired,
  nickname: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isByMe: PropTypes.bool,
};

FileViewerComponent.defaultProps = {
  isByMe: true,
};

export default function FileViewer(props) {
  const {
    message,
    isByMe,
    onClose,
    onDelete,
  } = props;
  const {
    sender,
    type,
    url,
    name = '',
    threadInfo = {},
  } = message;
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
        onClose={onClose}
        onDelete={onDelete}
        isByMe={isByMe}
        disableDelete={disableDelete}
      />
    ),
    document.getElementById(MODAL_ROOT),
  );
}

FileViewer.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.shape({
      profileUrl: PropTypes.string,
      nickname: PropTypes.string,
    }),
    type: PropTypes.string,
    url: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  isByMe: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

FileViewer.defaultProps = {
  isByMe: true,
};
