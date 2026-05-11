// sendbird provider component to handle sdk connection and data
export { default as SendBirdProvider } from './lib/Sendbird';

// complete app component - If user wants an out of the box solution
export { default as App } from './modules/App/index';

// Individual modules
export { default as ChannelSettings } from './modules/ChannelSettings';
export { default as ChannelList } from './modules/ChannelList';
export { default as Channel } from './modules/Channel';
export { default as getStringSet } from './ui/Label/stringSet';
export { default as OpenChannel } from './modules/OpenChannel';
export { default as OpenChannelSettings } from './modules/OpenChannelSettings';
export { default as MessageSearch } from './modules/MessageSearch';

// HOC for using ui-kit state
// withBird(MyCustomComponent) will give the sendbird state as props to MyCustomComponent
export { withSendBird } from './lib/Sendbird/index';
export { useSendbirdStateContext } from './lib/Sendbird/context/hooks/useSendbirdStateContext';
export { useSendbird } from './lib/Sendbird/context/hooks/useSendbird';
export { default as sendbirdSelectors } from './lib/selectors';
// for legacy parity, slowly remove
export { default as sendBirdSelectors } from './lib/selectors';

// Public types included in module props and render callbacks
export { TypingIndicatorType } from './types';
export type {
  ClientAdminMessage,
  ClientFileMessage,
  ClientMessage,
  ClientMultipleFilesMessage,
  ClientSentMessages,
  ClientUserMessage,
  EveryMessage,
  HTMLTextDirection,
  Nullable,
  RenderCustomSeparatorProps,
  RenderMessageParamsType,
  RenderMessageProps,
  RenderUserProfileProps,
  ReplyType,
  SendBirdProviderConfig,
  SendbirdTheme,
  SpaceFromTriggerType,
  UploadedFileInfoWithUpload,
  UserListQuery,
} from './types';

// Frequently requested non-smart helpers
export {
  getUIKitMessageType,
  getUIKitMessageTypes,
  isAdminMessage,
  isFileMessage,
  isMultipleFilesMessage,
  isUserMessage,
  isVoiceMessage,
  isVoiceMessageMimeType,
} from './utils';
