import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import { Types } from './type';
import { Colors } from './colors';
import {
  changeColorToClassName,
  changeTypeToIconClassName,
} from './utils';

import IconAdd from '../../svgs/icon-add.svg';
import IconArrowLeft from '../../svgs/icon-arrow-left.svg';
import IconAttach from '../../svgs/icon-attach.svg';
import IconAudioOnLined from '../../svgs/icon-audio-on-lined.svg';
import IconBan from '../../svgs/icon-ban.svg';
import IconBroadcast from '../../svgs/icon-broadcast.svg';
import IconCamera from '../../svgs/icon-camera.svg';
import IconChannels from '../../svgs/icon-channels.svg';
import IconChat from '../../svgs/icon-chat.svg';
import IconChatFilled from '../../svgs/icon-chat-filled.svg';
import IconChevronDown from '../../svgs/icon-chevron-down.svg';
import IconChevronRight from '../../svgs/icon-chevron-right.svg';
import IconClose from '../../svgs/icon-close.svg';
import IconCollapse from '../../svgs/icon-collapse.svg';
import IconCopy from '../../svgs/icon-copy.svg';
import IconCreate from '../../svgs/icon-create.svg';
import IconDelete from '../../svgs/icon-delete.svg';
import IconDisconnected from '../../svgs/icon-disconnected.svg';
import IconDocument from '../../svgs/icon-document.svg';
import IconDone from '../../svgs/icon-done.svg';
import IconDoneAll from '../../svgs/icon-done-all.svg';
import IconDownload from '../../svgs/icon-download.svg';
import IconEdit from '../../svgs/icon-edit.svg';
import IconEmojiMore from '../../svgs/icon-emoji-more.svg';
import IconError from '../../svgs/icon-error.svg';
import IconExpand from '../../svgs/icon-expand.svg';
import IconFileAudio from '../../svgs/icon-file-audio.svg';
import IconFileDocument from '../../svgs/icon-file-document.svg';
import IconFreeze from '../../svgs/icon-freeze.svg';
import IconGif from '../../svgs/icon-gif.svg';
import IconInfo from '../../svgs/icon-info.svg';
import IconLeave from '../../svgs/icon-leave.svg';
import IconMembers from '../../svgs/icon-members.svg';
import IconMessage from '../../svgs/icon-message.svg';
import IconModerations from '../../svgs/icon-moderations.svg';
import IconMore from '../../svgs/icon-more.svg';
import IconMute from '../../svgs/icon-mute.svg';
import IconNotifications from '../../svgs/icon-notifications.svg';
import IconNotificationsOffFilled from '../../svgs/icon-notifications-off-filled.svg';
import IconOperator from '../../svgs/icon-operator.svg';
import IconPhoto from '../../svgs/icon-photo.svg';
import IconPlay from '../../svgs/icon-play.svg';
import IconPlus from '../../svgs/icon-plus.svg';
import IconQuestion from '../../svgs/icon-question.svg';
import IconRefresh from '../../svgs/icon-refresh.svg';
import IconRemove from '../../svgs/icon-remove.svg';
import IconReply from '../../svgs/icon-reply-filled.svg';
import IconSearch from '../../svgs/icon-search.svg';
import IconSend from '../../svgs/icon-send.svg';
import IconSettingsFilled from '../../svgs/icon-settings-filled.svg';
import IconSpinner from '../../svgs/icon-spinner.svg';
import IconSupergroup from '../../svgs/icon-supergroup.svg';
import IconThumbnailNone from '../../svgs/icon-thumbnail-none.svg';
import IconToggleOff from '../../svgs/icon-toggleoff.svg';
import IconToggleOn from '../../svgs/icon-toggleon.svg';
import IconUser from '../../svgs/icon-user.svg';

function changeTypeToIconComponent(type) {
  switch (type) {
    case Types.ADD: return <IconAdd />;
    case Types.ARROW_LEFT: return <IconArrowLeft />;
    case Types.ATTACH: return <IconAttach />;
    case Types.AUDIO_ON_LINED: return <IconAudioOnLined />;
    case Types.BAN: return <IconBan />;
    case Types.BROADCAST: return <IconBroadcast />;
    case Types.CAMERA: return <IconCamera />;
    case Types.CHANNELS: return <IconChannels />;
    case Types.CHAT: return <IconChat />;
    case Types.CHAT_FILLED: return <IconChatFilled />;
    case Types.CHEVRON_DOWN: return <IconChevronDown />;
    case Types.CHEVRON_RIGHT: return <IconChevronRight />;
    case Types.CLOSE: return <IconClose />;
    case Types.COLLAPSE: return <IconCollapse />;
    case Types.COPY: return <IconCopy />;
    case Types.CREATE: return <IconCreate />;
    case Types.DELETE: return <IconDelete />;
    case Types.DISCONNECTED: return <IconDisconnected />;
    case Types.DOCUMENT: return <IconDocument />;
    case Types.DONE: return <IconDone />;
    case Types.DONE_ALL: return <IconDoneAll />;
    case Types.DOWNLOAD: return <IconDownload />;
    case Types.EDIT: return <IconEdit />;
    case Types.EMOJI_MORE: return <IconEmojiMore />;
    case Types.ERROR: return <IconError />;
    case Types.EXPAND: return <IconExpand />;
    case Types.FILE_AUDIO: return <IconFileAudio />;
    case Types.FILE_DOCUMENT: return <IconFileDocument />;
    case Types.FREEZE: return <IconFreeze />;
    case Types.GIF: return <IconGif />;
    case Types.INFO: return <IconInfo />;
    case Types.LEAVE: return <IconLeave />;
    case Types.MEMBERS: return <IconMembers />;
    case Types.MESSAGE: return <IconMessage />;
    case Types.MODERATIONS: return <IconModerations />;
    case Types.MORE: return <IconMore />;
    case Types.MUTE: return <IconMute />;
    case Types.NOTIFICATIONS: return <IconNotifications />;
    case Types.NOTIFICATIONS_OFF_FILLED: return <IconNotificationsOffFilled />;
    case Types.OPERATOR: return <IconOperator />;
    case Types.PHOTO: return <IconPhoto />;
    case Types.PLAY: return <IconPlay />;
    case Types.PLUS: return <IconPlus />;
    case Types.QUESTION: return <IconQuestion />;
    case Types.REFRESH: return <IconRefresh />;
    case Types.REMOVE: return <IconRemove />;
    case Types.REPLY: return <IconReply />;
    case Types.SEARCH: return <IconSearch />;
    case Types.SEND: return <IconSend />;
    case Types.SETTINGS_FILLED: return <IconSettingsFilled />;
    case Types.SPINNER: return <IconSpinner />;
    case Types.SUPERGROUP: return <IconSupergroup />;
    case Types.THUMBNAIL_NONE: return <IconThumbnailNone />;
    case Types.TOGGLE_OFF: return <IconToggleOff />;
    case Types.TOGGLE_ON: return <IconToggleOn />;
    case Types.USER: return <IconUser />;
    default: return 'icon'; // If you see this text 'icon' replace icon for it
  }
}

export default function Icon({
  className,
  type,
  fillColor,
  width,
  height,
  onClick,
  children,
}) {
  const iconStyle = {
    width: typeof width === 'string' ? width : `${width}px`,
    minWidth: typeof width === 'string' ? width : `${width}px`,
    height: typeof height === 'string' ? height : `${height}px`,
    minHeight: typeof height === 'string' ? height : `${height}px`,
  };
  return (
    <div
      className={[
        ...Array.isArray(className) ? className : [className],
        'sendbird-icon',
        changeTypeToIconClassName(type),
        changeColorToClassName(fillColor),
      ].join(' ')}
      role="button"
      onClick={onClick}
      onKeyDown={onClick}
      tabIndex="0"
      style={iconStyle}
    >
      {children || changeTypeToIconComponent(type)}
    </div>
  );
}

Icon.propTypes = {
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Type: Use strings from below list */
  type: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(Types)),
    PropTypes.string,
  ]).isRequired,
  /** Type: Use Colors from below list */
  fillColor: PropTypes.oneOf(Object.keys(Colors)),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  height: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClick: PropTypes.func,
  children: PropTypes.element,
};

Icon.defaultProps = {
  className: '',
  fillColor: Colors.DEFAULT,
  width: 26,
  height: 26,
  onClick: () => { },
  children: null,
};

export const IconTypes = Types;
export const IconColors = Colors;
