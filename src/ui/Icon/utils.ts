import { Types } from './type';
import { Colors } from './colors';

export function changeColorToClassName(color: Colors): string {
  switch (color) {
    case Colors.PRIMARY: return 'sendbird-icon-color--primary';
    case Colors.PRIMARY_2: return 'sendbird-icon-color--primary-2';
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

export function changeTypeToIconClassName(type: Types): string {
  switch (type) {
    case Types.ADD: return 'sendbird-icon-add';
    case Types.ARROW_LEFT: return 'sendbird-icon-arrow-left';
    case Types.ATTACH: return 'sendbird-icon-attach';
    case Types.AUDIO_ON_LINED: return 'sendbird-icon-audio-on-lined';
    case Types.BAN: return 'sendbird-icon-ban';
    case Types.BROADCAST: return 'sendbird-icon-broadcast';
    case Types.CAMERA: return 'sendbird-icon-camera';
    case Types.CHANNELS: return 'sendbird-icon-channels';
    case Types.CHAT: return 'sendbird-icon-chat';
    case Types.CHAT_FILLED: return 'sendbird-icon-chat-filled';
    case Types.CHEVRON_DOWN: return 'sendbird-icon-chevron-down';
    case Types.CHEVRON_RIGHT: return 'sendbird-icon-chevron-right';
    case Types.CLOSE: return 'sendbird-icon-close';
    case Types.COLLAPSE: return 'sendbird-icon-collapse';
    case Types.COPY: return 'sendbird-icon-copy';
    case Types.CREATE: return 'sendbird-icon-create';
    case Types.DELETE: return 'sendbird-icon-delete';
    case Types.DISCONNECTED: return 'sendbird-icon-disconnected';
    case Types.DOCUMENT: return 'sendbird-icon-document';
    case Types.DONE: return 'sendbird-icon-done';
    case Types.DONE_ALL: return 'sendbird-icon-done-all';
    case Types.DOWNLOAD: return 'sendbird-icon-down-load';
    case Types.EDIT: return 'sendbird-icon-edit';
    case Types.EMOJI_MORE: return 'sendbird-icon-emoji-more';
    case Types.ERROR: return 'sendbird-icon-error';
    case Types.EXPAND: return 'sendbird-icon-expand';
    case Types.FILE_AUDIO: return 'sendbird-icon-file-audio';
    case Types.FILE_DOCUMENT: return 'sendbird-icon-file-document';
    case Types.FREEZE: return 'sendbird-icon-freeze';
    case Types.GIF: return 'sendbird-icon-gif';
    case Types.INFO: return 'sendbird-icon-info';
    case Types.LEAVE: return 'sendbird-icon-leave';
    case Types.MEMBERS: return 'sendbird-icon-members';
    case Types.MESSAGE: return 'sendbird-icon-message';
    case Types.MODERATIONS: return 'sendbird-icon-moderations';
    case Types.MORE: return 'sendbird-icon-more';
    case Types.MUTE: return 'sendbird-icon-mute';
    case Types.NOTIFICATIONS: return 'sendbird-icon-notifications';
    case Types.NOTIFICATIONS_OFF_FILLED: return 'sendbird-icon-notifications-off-filled';
    case Types.OPERATOR: return 'sendbird-icon-operator';
    case Types.PHOTO: return 'sendbird-icon-photo';
    case Types.PLAY: return 'sendbird-icon-play';
    case Types.PLUS: return 'sendbird-iconn-plus';
    case Types.QUESTION: return 'sendbird-icon-question';
    case Types.REFRESH: return 'sendbird-icon-refresh';
    case Types.REMOVE: return 'sendbird-icon-remove';
    case Types.REPLY: return 'sendbird-icon-reply';
    case Types.SEARCH: return 'sendbird-icon-search';
    case Types.SEND: return 'sendbird-icon-send';
    case Types.SETTINGS_FILLED: return 'sendbird-icon-settings-filled';
    case Types.SPINNER: return 'sendbird-icon-spinner';
    case Types.SUPERGROUP: return 'sendbird-icon-supergroup';
    case Types.THUMBNAIL_NONE: return 'sendbird-icon-thumbnail-none';
    case Types.TOGGLE_OFF: return 'sendbird-icon-toggle-off';
    case Types.TOGGLE_ON: return 'sendbird-icon-toggle-on';
    case Types.USER: return 'sendbird-icon-user';
    default: return 'sendbird-icon-unknown'; // If you see this text 'icon' replace icon for it
  }
}
