# Migration Guide for v2 to v3

If you are using v2 and want to upgrade to v3, we have tried to keep the changes minimum. We did this by keeping the prop shapes of smart-components in the new modules. We tried to simplify certain aspects by removing certain arguments from renderProps(especially in renders that deal with messasge, input and title), but it should be easily migrated if you follow this guide

## Common changes
* Installation `npm i @sendbird/uikit-react`
* There are no changes to SendbirdProvider, App, withSendbird, useSendbirdStateContext etc,
* import path should start from `"@sendbird/uikit-react`!

## ChannelList

Can be imported as `import { ChannelList } from "@sendbird/uikit-react"`
or `import ChannelList from "@sendbird/uikit-react/ChannelList"`

### Changes - none
### Added props
  * renderPlaceHolderError?: (props: void) => React.ReactNode;
  * renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  * renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;

## Channel

Can be imported as `import { Channel } from "@sendbird/uikit-react"`
or `import Channel from "@sendbird/uikit-react/Channel"`

### Changes
  * Removed renderCustomMessage, renderChatItem. Use renderMessage instead
  Current channel can be obtained from `useChannel()`
  Message related actions should be implemented using sendbirdSelectors
  ```jsx
    <Channel renderMessage={MyFileMessageComponent} />
    const MyFileMessageComponent = ({ message, chainTop, chainBottom }) => {
      const {
        currentGroupChannel,
        scrollToMessage,
      } = useChannel();
      const globalStore = useSendbirdStateContext();
      // use sendbirdSelectors and globalStore to implement onDeleteMessage, onUpdateMessage, onResendMessage
      const deleteFileMessage = sendBirdSelectors.getDeleteMessage(globalStore);
      if (message.messageType === 'file') {
        return (
          <div className="custom-file-message">
            <button
              className="cusotmo-file-message__delete-button"
              onClick={deleteFileMessage(currentGroupChannel, message)}
            />
            ... implement your component
          </div>
        )
      }
      return null;
    }
  ```
  * Changed signature of renderMessageInput to `() => React.ReactNode`
    Current channel can be obtained from `useChannel()`
    Message related actions should be implemented using sendbirdSelectors
  ```jsx
    <Channel renderMessageInput={MyMessageInput} />
    const MyMessageInput = ({message, chainTop, chainBottom }) => {
      const {
        currentGroupChannel,
      } = useChannel();
      const globalStore = useSendbirdStateContext();
      // use sendbirdSelectors and globalStore to implement getSendUserMessage, getSendFileMessage
      const sendMessage = sendBirdSelectors.getSendUserMessage(globalStore);
      return (
        ...
      );
    }
  ```
  * Changed signature of renderChatHeader to `?: () => React.ReactNode`
    Similar to before, use `useChannel` to access current channel
### Added props
  * renderPlaceholderLoader?: () => React.ReactNode;
  * renderPlaceholderInvalid?: () => React.ReactNode;
  * renderPlaceholderEmpty?: () => React.ReactNode;
  * renderChannelHeader?: () => React.ReactNode;
  * renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  * renderMessageInput?: () => React.ReactNode;
  * renderTypingIndicator?: () => React.ReactNode;
  * renderCustomSeperator?: () => React.ReactNode;

## ChannelSettings

Can be imported as `import { ChannelSettings } from "@sendbird/uikit-react"`
or `import ChannelSettings from "@sendbird/uikit-react/ChannelSettings"`

### Changes
  * renderChannelProfile new signature `() => React.ReactNode`
  Use `useChannelSettings` to access current channel

  ```jsx
  <ChannelSettings
    renderChannelProfile={MyChannelProfile}
  />
  const MyChannelProfile = () => {
    const { channel } = useChannelSettings();
    return (...);
  }
  ```
### Added props
  * renderPlaceholderError?: () => React.ReactNode;
  * renderModerationPanel?: () => React.ReactNode;
  * renderLeaveChannel?: () => React.ReactNode;

## OpenChannel

Can be imported as `import { OpenChannel } from "@sendbird/uikit-react"`
or `import OpenChannel from "@sendbird/uikit-react/OpenChannel"`

### Changes
  * fetchingParticipants false by default
  * renderCustomMessage is now renderMessage
  renderMessage is similar to renderMessage in <Channel />
  ```jsx
    // use useOpenChannel to access current channel
    // use sendbirdSelectors for message-actions
    const {
      currentOpenChannel,
    } = useOpenChannel();

  ```
  * experimentalMessageLimit renamed to messageLimit
  * renderChannelTitle signature changed so that you will not recive channel from props, use `useOpenChannel` to access it
  * renderMessageInput signature changed same as in <Channel /> component,
  use `useOpenChannel` to access current channel and use `sendbirdSelectors` for message actions
### Added props
  * renderMessage?: (props: RenderMessageProps) => React.ReactNode;
  * renderHeader?: () => React.ReactNode;
  * renderInput?: () => React.ReactNode;
  * renderPlaceHolderEmptyList?: () => React.ReactNode;
  * renderPlaceHolderError?: () => React.ReactNode;
  * renderPlaceHolderLoading?: () => React.ReactNode;

## OpenChannelSettings

Can be imported as `import { OpenChannelSettings } from "@sendbird/uikit-react"`
or `import OpenChannelSettings from "@sendbird/uikit-react/OpenChannelSettings"`

### Changes
  * Removed renderChannelProfile, use renderOperatorUI or renderParticipantList instead
### Added props
  * renderOperatorUI?: () => React.ReactNode;
  * renderParticipantList?: () => React.ReactNode;

## MessageSearch

Can be imported as `import { MessageSearch } from "@sendbird/uikit-react"`
or `import MessageSearch from "@sendbird/uikit-react/MessageSearch"`

### Changes - none
### Added props
  * renderPlaceHolderError?: (props: void) => React.ReactNode;
  * renderPlaceHolderLoading?: (props: void) => React.ReactNode;
  * renderPlaceHolderNoString?: (props: void) => React.ReactNode;
  * renderPlaceHolderEmptyList?: (props: void) => React.ReactNode;

> We have added many more new components, to see them, visit documentation or [exports.js](exports.js)
