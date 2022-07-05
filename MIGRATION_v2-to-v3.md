# Migration Guide for v2 to v3

If you are using v2 and want to upgrade to v3, we have tried to keep the changes minimum. We did this by keeping the prop shapes of smart-components in the new modules. We tried to simplify certain aspects by removing certain arguments from renderProps(especially in renders that deal with messasge, input and title), but it should be easily migrated if you follow this guide

## Common changes
* Installation `npm i @sendbird/uikit-react`
* There are no changes to App, withSendbird, useSendbirdStateContext etc,
* import path should start from `"@sendbird/uikit-react`!

## SendbirdProvider
### Changes
  * `UserListQuery.next(callback: unknown): void;` changed to `next(): Promise<User[]>;`(chat v4 change)

## Sendbird Selectors
We renamed `sendBirdSelectors` to `sendbirdSelectors`. And importing path has been changed.
```jsx
/* from */
import { sendBirdSelectors } from 'sendbird-uikit';
/* to */
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors';
```

<!-- This is for getting sdk and pubSub
in v2
```jsx
import { useSendbirdStateContext, sendBirdSelectors } from 'sendbird-uikit';

  // inside of the component
  const store = useSendbirdStateContext();
  const sdk = sendBirdSelectors.getSdk(store);
```
in v3
```jsx
import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext';
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors';

  // inside of the component
  const state = useSendbirdStateContext();
  const sdk = sendbirdSelectors.getSdk(state);
``` -->

### Changes
We made a little change on some methods. Here are the description and code snippets for them.

<!-- This is a description that I tried -->
#### Sending messages
`getSendUserMessage` and `getOpenChannelSendUserMessage` has been combined to the **getSendUserMessage**. This method generates a function that returns `UIKitMessageHandler` to send user message in GroupChannel and OpenChannel.

<!-- This is the content -->
* getSendUserMessage & getOpenChannelSendUserMessage --> getSendUserMessage
* Generating a function returns `UIKitMessageHandler` to send user messages in GroupChannel and OpenChannel
* before:
  ```jsx
  const sendUserMessage = sendBirdSelectors.getSendUserMessage(store);
  const params = new sdk.UserMessageParams();
  sendUserMessage('channel-url', params)
    .then((message) => {})
    .catch((error) => {})
  ```
* after:
  ```tsx
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(state);
  sendUserMessage(channel, {} as UserMessageCreateParams)
    .onPending((message) => {})
    .onFailed((error, message) => {})
    .onSucceeded((message) => {})
  ```
<!-- File message -->
* getSendFileMessage & getOpenChannelSendFileMessage --> getSendFileMessage
* Generating a function returns `UIKitMessageHandler` to send file messages in GroupChannel and OpenChannel
* before:
  ```jsx
  const sendFileMessgae = sendBirdSelectors.getSendFileMessage(store);
  const params = new sdk.FileMessageParams();
  sendFileMessage('channel-url', params)
    .then((message) => {})
    .catch((error) => {})
  ```
* after:
  ```tsx
  const sendFileMessage = sendbirdSelectors.getSendFileMessage(state);
  sendFileMessage(channel, {} as FileMessageCreateParams)
    .onPending((message) => {})
    .onFailed((error, message) => {})
    .onSucceeded((message) => {})
  ```
<!-- getting sdk -->
* getSdk --> getSdk so no naming change
* Getting sendbird chat sdk instance form `SendbirdState`. Since UIKit v2 it has returned a sendbird instance(Chat v3), but now getSdk returns sendbird chat instance(Chat v4)
<!-- create channels -->
  <!-- create group channel -->
  * getCreateChannel --> **getCreateGroupChannel**
  * Generating a function returns `Promise` to create GroupChannel
  * before:
    ```jsx
    const createChannel = sendBirdSelectors.getCreateChannel(store);
    const params = new sdk.GroupChannelParams();
    createChannel(params)
      .then((channel) => {})
      .catch((error) => {})
    ```
  * after:
    ```tsx
    const createGroupChannel = sendbirdSelectors.getCreateGroupChannel(state);
    createGroupChannel({} as GroupChannelCreateParams)
      .then((channel) => {})
      .catch((error) => {})
    ```
  <!-- create open channel -->
  * getCreateOpenChannel --> getCreateOpenChannel so no name change
  * Generating a function returns `Promise` to create OpenChannel
  * before:
    ```jsx
    const createOpenChannel = sendBirdSelectors.getCreateOpenChannel(store);
    const params = new sdk.OpenChannelParams();
    createOpenChannel(params)
      .then((channel) => {})
      .catch((error) => {})
    ```
  * after:
    ```tsx
    const createOpenChannel = sendbirdSelectors.getCreateOpenChannel(state);
    createOpenChannel({} as OpenChannelCreateParams)
      .then((channel) => {})
      .catch((error) => {})
    ```
<!-- leave channel -->
* getLeaveChannel --> **getLeaveGroupChannel**
* Generating a function returns `Promise` to leave GroupChannel
* before:
  ```jsx
  const leaveChannel = sendBirdSelectors.getLeaveChannel(store);
  leaveChannel('channel-url')
    .then((channel) => {})
    .catch((error) => {})
  ```
* after:
  ```tsx
  const leaveGroupChannel = sendbirdSelectors.getLeaveGroupChannel(store);
  leaveGroupChannel('channel-url')
    .then((channel) => {})
    .catch((error) => {})
  ```
  > Same with `getEnterOpenChannel` and `getExitOpenChannel`
<!-- update user message -->
* getUpdateUserMessage & getOpenChannelUpdateUserMessage --> **getUpdateUserMessage**
* Generating a function returns `Promise` to update user messages in GroupChannel and OpenChannel
* before:
  ```jsx
  const updateUserMessage = sendBirdSelectors.getUpdateUserMessage(store);
  const params = new sdk.UserMessageParams();
  updateUserMessage('channel-url', 'message-id(number)', params)
    .then((message) => {})
    .catch((error) => {})
  ```
* after:
  ```tsx
  const updateUserMessage = sendbirdSelectors.getUpdateUserMessage(state);
  updateUserMessage(channel, 'message-id(number)', {} as UserMessageUpdateParams)
    .then((message) => {})
    .catch((error) => {})
  ```
<!-- delete message -->
* getDeleteMessage & getOpenChannelDeleteMessage --> **getDeleteMessage**
* Generating a function returns `Promise` to delete messages in GroupChannel and OpenChannel
* before:
  ```jsx
  const deleteMessage = sendBirdSelectors.getDeleteMessage(store);
  deleteMessage('channel-url', message)
    .then((message) => {})
    .catch((error) => {})
  ```
* after:
  ```tsx
  const deleteMessge = sendbirdSelectors.getDeleteMessage(state);
  deleteMessage(channel, message)
    .then((message) => {})
    .catch((error) => {})
  ```
<!-- resend messages -->
  <!-- resend user message -->
  * getResendUserMessage & getOpenChannelResendUserMessage --> **getResendUserMessage**
  * Generating a function returns `Promise` to resend user messages in GroupChannel and OpenChannel
  * before:
    ```jsx
    const resendUserMessage = sendBirdSelectors.getResendUserMessage(store);
    resendUserMessage('channel-url', failedMessage)
      .then((message) => {})
      .catch((error) => {})
    ```
  * after:
    ```tsx
    const resendUserMessage = sendbirdSelectors.getResendUserMessage(state);
    resendUserMessage(channel, failedMessage)
      .then((message) => {})
      .catch((error) => {})
    ```
  <!-- resend file message -->
  * getResendFileMessage & getOpenChannelResendFileMessage --> **getResendFileMessage**
  * Generating a function returns `Promise` to resend file messages in GroupChannel and OpenChannel
  * before:
    ```jsx
    const resendFileMessage = sendBirdSelectors.getResendFileMessage(store);
    resendFileMessage('channel-url', failedMessage)
      .then((message) => {})
      .catch((error) => {})
    ```
  * after:
    ```tsx
    const resendFileMessage = sendbirdSelectors.getResendFileMessage(state);
    resendFileMessage(channel, failedMessage)
      .then((message) => {})
      .catch((error) => {})
    ```
<!-- | in v2 | in v3 | Description |
| -------------- | -------------- | ------------------------------------- |
| getSdk | **getSdk** | Getting sendbird chat sdk instance form `SendbirdState`. Since UIKit v2 it has returned a sendbird instance(Chat v3), but now getSdk returns sendbird chat instance(Chat v4) |
| getCreateChannel | **getCreateGroupChannel** | Generating a function returns `Promise` to create GroupChannel |
| getCreateOpenChannelChannel | **getCreateOpenChannel** | Generating a function returns `Promise` to create OpenChannel |
| getLeaveChannel | **getLeaveGroupChannel** | Generating a function returns `Promise` to leave GroupChannel |
| getSendUserMessage & getOpenChannelSendUserMessage | **getSendUserMessage** | Generating a function returns `UIKitMessageHandler` to send user messages in GroupChannel and OpenChannel |
| getSendFileMessage & getOpenChannelSendFileMessage | **getSendFileMessage** | Generating a function returns `UIKitMessageHandler` to send file messages in GroupChannel and OpenChannel |
| getUpdateUserMessage & getOpenChannelUpdateUserMessage | **getUpdateUserMessage** | Generating a function returns `Promise` to update user messages in GroupChannel and OpenChannel |
| getDeleteMessage & getOpenChannelDeleteMessage | **getDeleteMessage** | Generating a function returns `Promise` to delete messages in GroupChannel and OpenChannel |
| getResendUserMessage & getOpenChannelResendUserMessage | **getResendUserMessage** | Generating a function returns `Promise` to resend user messages in GroupChannel and OpenChannel |
| getResendFileMessage & getOpenChannelResendFileMessage | **getResendFileMessage** | Generating a function returns `Promise` to resend file messages in GroupChannel and OpenChannel | -->

### New functions
A new interface `UIKitMessageHandler` has been added for handling message event when sending messages. There are three options in the handler.
```jsx
const state = useSendbirdStateContext();
const sendUserMessage = sendbirdSelectors.sendUserMessage(state);

sendUserMessage(channel, { message: 'Hello world' })
  .onPending((message) => { })
  .onFailed((error, message) => { })
  .onSucceeded((message) => { })
```

Also we're providing new functions. Here is a table shows what has been added in sendbirdSelectors in v3.

| New in v3 | Description |
| --------- | ---------------------- |
| **getGetGroupChannel** | Generating a function returns `Promise` to get a GroupChannel instance |
| **getGetOpenChannel** | Generating a function returns `Promise` to get a OpenChannel instance |

<!-- code snippets -->
```tsx
const getGroupChannel = sendbirdSelectors.getGetGroupChannel(state);
getGroupChannel('channel-url')
  .then((channel) => {})
  .catch((error) => {})

const getOpenChannel = sendbirdSelectors.getGetOpenChannel(state);
getOpenChannel('channel-url')
  .then((channel) => {})
  .catch((error) => {})
```

## ChannelList

Can be imported as `import { ChannelList } from "@sendbird/uikit-react"`
or `import ChannelList from "@sendbird/uikit-react/ChannelList"`

### Changes
  * queries.channelListQuery.memberStateFilter -> queries.channelListQuery.myMemberStateFilter
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
  * `queries.MessageListParams.messageType?: string;` -> queries.MessageListParams.messageTypeFilter?: [MessageTypeFilter](https://sendbird.com/docs/chat/v4/javascript/ref/enums/_sendbird_chat_message.MessageTypeFilter.html);
  * `queries.MessageListParams.customType`| `queries.MessageListParams.customTypes` -> queries.MessageListParams.customTypesFilter?: string[];
  * `queries.MessageListParams.senderUserIds` -> queries.MessageListParams.senderUserIdsFilter?: string[];

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
  * `queries.MessageListParams.messageType?: string;` -> queries.MessageListParams.messageTypeFilter?: [MessageTypeFilter](https://sendbird.com/docs/chat/v4/javascript/ref/enums/_sendbird_chat_message.MessageTypeFilter.html);
  * `queries.MessageListParams.customType`| `queries.MessageListParams.customTypes` -> queries.MessageListParams.customTypesFilter?: string[];
  * `queries.MessageListParams.senderUserIds` -> queries.MessageListParams.senderUserIdsFilter?: string[];

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
