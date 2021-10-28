import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';
import Type from './type';

import IconAdd from '../../svgs/icon-add.svg';
import IconArrowLeft from '../../svgs/icon-arrow-left.svg';
import IconAttach from '../../svgs/icon-attach.svg';
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

const Colors = {
  DEFAULT: 'DEFAULT',
  PRIMARY: 'PRIMARY',
  SECONDARY: 'SECONDARY',
  CONTENT: 'CONTENT',
  CONTENT_INVERSE: 'CONTENT_INVERSE',
  WHITE: 'WHITE',
  GRAY: 'GRAY',
  SENT: 'SENT',
  READ: 'READ',
  ON_BACKGROUND_1: 'ON_BACKGROUND_1',
  ON_BACKGROUND_2: 'ON_BACKGROUND_2',
  ON_BACKGROUND_3: 'ON_BACKGROUND_3',
  BACKGROUND_3: 'BACKGROUND_3',
  ERROR: 'ERROR',
};

function changeColorToClassName(color) {
  switch (color) {
    case Colors.PRIMARY: return 'sendbird-icon-color--primary';
    case Colors.SECONDARY: return 'sendbird-icon-color--secondary';
    case Colors.CONTENT: return 'sendbird-icon-color--content';
    case Colors.CONTENT_INVERSE: return 'sendbird-icon-color--content-inverse';
    case Colors.WHITE: return 'sendbird-icon-color--white';
    case Colors.GRAY: return 'sendbird-icon-color--gray';
    case Colors.SENT: return 'sendbird-icon-color--sent';
    case Colors.READ: return 'sendbird-icon-color--read';
    case Colors.ON_BACKGROUND_1: return 'sendbird-icon-color--on-background-1';
    case Colors.ON_BACKGROUND_2: return 'sendbird-icon-color--on-background-2';
    case Colors.ON_BACKGROUND_3: return 'sendbird-icon-color--on-background-3';
    case Colors.BACKGROUND_3: return 'sendbird-icon-color--background-3';
    case Colors.ERROR: return 'sendbird-icon-color--error';
    default: return '';
  }
}

function changeTypeToIconComponent(type) {
  switch (type) {
    case Type.ADD: return <IconAdd />;
    case Type.ARROW_LEFT: return <IconArrowLeft />;
    case Type.ATTACH: return <IconAttach />;
    case Type.BAN: return <IconBan />;
    case Type.BROADCAST: return <IconBroadcast />;
    case Type.CAMERA: return <IconCamera />;
    case Type.CHANNELS: return <IconChannels />;
    case Type.CHAT: return <IconChat />;
    case Type.CHAT_FILLED: return <IconChatFilled />;
    case Type.CHEVRON_DOWN: return <IconChevronDown />;
    case Type.CHEVRON_RIGHT: return <IconChevronRight />;
    case Type.CLOSE: return <IconClose />;
    case Type.COLLAPSE: return <IconCollapse />;
    case Type.COPY: return <IconCopy />;
    case Type.CREATE: return <IconCreate />;
    case Type.DELETE: return <IconDelete />;
    case Type.DISCONNECTED: return <IconDisconnected />;
    case Type.DOCUMENT: return <IconDocument />;
    case Type.DONE: return <IconDone />;
    case Type.DONE_ALL: return <IconDoneAll />;
    case Type.DOWNLOAD: return <IconDownload />;
    case Type.EDIT: return <IconEdit />;
    case Type.EMOJI_MORE: return <IconEmojiMore />;
    case Type.ERROR: return <IconError />;
    case Type.EXPAND: return <IconExpand />;
    case Type.FILE_AUDIO: return <IconFileAudio />;
    case Type.FILE_DOCUMENT: return <IconFileDocument />;
    case Type.FREEZE: return <IconFreeze />;
    case Type.GIF: return <IconGif />;
    case Type.INFO: return <IconInfo />;
    case Type.LEAVE: return <IconLeave />;
    case Type.MEMBERS: return <IconMembers />;
    case Type.MESSAGE: return <IconMessage />;
    case Type.MODERATIONS: return <IconModerations />;
    case Type.MORE: return <IconMore />;
    case Type.MUTE: return <IconMute />;
    case Type.NOTIFICATIONS: return <IconNotifications />;
    case Type.NOTIFICATIONS_OFF_FILLED: return <IconNotificationsOffFilled />;
    case Type.OPERATOR: return <IconOperator />;
    case Type.PHOTO: return <IconPhoto />;
    case Type.PLAY: return <IconPlay />;
    case Type.PLUS: return <IconPlus />;
    case Type.QUESTION: return <IconQuestion />;
    case Type.REFRESH: return <IconRefresh />;
    case Type.REMOVE: return <IconRemove />;
    case Type.REPLY: return <IconReply />;
    case Type.SEARCH: return <IconSearch />;
    case Type.SEND: return <IconSend />;
    case Type.SETTINGS_FILLED: return <IconSettingsFilled />;
    case Type.SPINNER: return <IconSpinner />;
    case Type.SUPERGROUP: return <IconSupergroup />;
    case Type.THUMBNAIL_NONE: return <IconThumbnailNone />;
    case Type.TOGGLE_OFF: return <IconToggleOff />;
    case Type.TOGGLE_ON: return <IconToggleOn />;
    case Type.USER: return <IconUser />;
    default: return 'icon'; // If you see this text 'icon' replace icon for it
  }
}

export function changeTypeToIconClassName(type) {
  switch (type) {
    case Type.ADD: return 'sendbird-icon-add';
    case Type.ARROW_LEFT: return 'sendbird-icon-arrow-left';
    case Type.ATTACH: return 'sendbird-icon-attach';
    case Type.BAN: return 'sendbird-icon-ban';
    case Type.BROADCAST: return 'sendbird-icon-broadcast';
    case Type.CAMERA: return 'sendbird-icon-camera';
    case Type.CHANNELS: return 'sendbird-icon-channels';
    case Type.CHAT: return 'sendbird-icon-chat';
    case Type.CHAT_FILLED: return 'sendbird-icon-chat-filled';
    case Type.CHEVRON_DOWN: return 'sendbird-icon-chevron-down';
    case Type.CHEVRON_RIGHT: return 'sendbird-icon-chevron-right';
    case Type.CLOSE: return 'sendbird-icon-close';
    case Type.COLLAPSE: return 'sendbird-icon-collapse';
    case Type.COPY: return 'sendbird-icon-copy';
    case Type.CREATE: return 'sendbird-icon-create';
    case Type.DELETE: return 'sendbird-icon-delete';
    case Type.DISCONNECTED: return 'sendbird-icon-disconnected';
    case Type.DOCUMENT: return 'sendbird-icon-document';
    case Type.DONE: return 'sendbird-icon-done';
    case Type.DONE_ALL: return 'sendbird-icon-done-all';
    case Type.DOWNLOAD: return 'sendbird-icon-down-load';
    case Type.EDIT: return 'sendbird-icon-edit';
    case Type.EMOJI_MORE: return 'sendbird-icon-emoji-more';
    case Type.ERROR: return 'sendbird-icon-error';
    case Type.EXPAND: return 'sendbird-icon-expand';
    case Type.FILE_AUDIO: return 'sendbird-icon-file-audio';
    case Type.FILE_DOCUMENT: return 'sendbird-icon-file-document';
    case Type.FREEZE: return 'sendbird-icon-freeze';
    case Type.GIF: return 'sendbird-icon-gif';
    case Type.INFO: return 'sendbird-icon-info';
    case Type.LEAVE: return 'sendbird-icon-leave';
    case Type.MEMBERS: return 'sendbird-icon-members';
    case Type.MESSAGE: return 'sendbird-icon-message';
    case Type.MODERATIONS: return 'sendbird-icon-moderations';
    case Type.MORE: return 'sendbird-icon-more';
    case Type.MUTE: return 'sendbird-icon-mute';
    case Type.NOTIFICATIONS: return 'sendbird-icon-notifications';
    case Type.NOTIFICATIONS_OFF_FILLED: return 'sendbird-icon-notifications-off-filled';
    case Type.OPERATOR: return 'sendbird-icon-operator';
    case Type.PHOTO: return 'sendbird-icon-photo';
    case Type.PLAY: return 'sendbird-icon-play';
    case Type.PLUS: return 'sendbird-iconn-plus';
    case Type.QUESTION: return 'sendbird-icon-question';
    case Type.REFRESH: return 'sendbird-icon-refresh';
    case Type.REMOVE: return 'sendbird-icon-remove';
    case Type.REPLY: return 'sendbird-icon-reply';
    case Type.SEARCH: return 'sendbird-icon-search';
    case Type.SEND: return 'sendbird-icon-send';
    case Type.SETTINGS_FILLED: return 'sendbird-icon-settings-filled';
    case Type.SPINNER: return 'sendbird-icon-spinner';
    case Type.SUPERGROUP: return 'sendbird-icon-supergroup';
    case Type.THUMBNAIL_NONE: return 'sendbird-icon-thumbnail-none';
    case Type.TOGGLE_OFF: return 'sendbird-icon-toggle-off';
    case Type.TOGGLE_ON: return 'sendbird-icon-toggle-on';
    case Type.USER: return 'sendbird-icon-user';
    default: return 'sendbird-icon-unknown'; // If you see this text 'icon' replace icon for it
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
  type: PropTypes.oneOfType([
    PropTypes.oneOf(Object.keys(Type)),
    PropTypes.string,
  ]).isRequired,
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

export const IconTypes = Type;
export const IconColors = Colors;
