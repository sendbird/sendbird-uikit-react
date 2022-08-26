# Migration Guide for v2 to v3

UIKit v3 for React is now available. UIKit v3 has a dependency on Chat SDK v4. Before migrating UIKit v2 to v3, refer to the [migration guide of Chat SDK v4 for JavaScript](/docs/chat/v4/javascript/getting-started/migration-guide) for any breaking changes. The Chat SDK must be updated first before proceeding with the latest version of UIKit.

The biggest change from v2 to v3 is modularization, which allows you to build and customize views at a more minute level. You can execute key messaging functions, such as list channels, through modules. The smart components in v2 have now become modules that consist of separate providers and UI components. While the provider manages all the data of each module, the UI component renders user interfaces that are used to display the view of the module. The provider and UI components exchange data using context hooks. This new architecture allows for easier and more detailed customization.

![Image|A side-by-side diagram of component changes from v2 to v3.](https://static.sendbird.com/docs/uikit-react-introduction-migration-guide.png)

When migrating from v2 to v3, there are several breaking changes you need to remember. While the properties of the smart components have relatively remained the same in the modules, some arguments in the render props have been removed. Refer to the breaking changes below.

---

## Modules

You can execute key chat functions through various modules provided by UIKit for React. In each module, there is a provider, a set of pre-built UI components, and a context hook that allows access to the provider's data. Refer to the table below to see which modules we provide and the components that make up each module.

<div component="AdvancedTable" type="4B">

|Module|Provider|Context hook|UI components|
|---|---|---|---|
|[Channel list](/docs/uikit/v3/react/modules/channel-list)|ChannelListProvider|useChannelListContext|ChannelListUI<br/><br/>ChannelListHeader<br/><br/>ChannelPreview|
|[Group channel](/docs/uikit/v3/react/modules/group-channel)|ChannelProvider|useChannelContext|ChannelUI<br/><br/>ChannelHeader<br/><br/>MessageInput<br/><br/>MessageList<br/><br/>Message<br/><br/>FileViewer<br/><br/>FrozenNotification<br/><br/>RemoveMessageModal<br/><br/>TypingIndicator<br/><br/>UnreadCount|
|[Group channel settings](/docs/uikit/v3/react/modules/group-channel-settings)|ChannelSettingsProvider|useChannelSettingsContext|ChannelSettingsUI<br/><br/>AdminPanel<br/><br/>UserPanel<br/><br/>ChannelProfile<br/><br/>EditDetailsModal<br/><br/>exitChannel<br/><br/>UserListItem|
|[Open channel](/docs/uikit/v3/react/modules/open-channel)|OpenChannelProvider|useOpenChannelContext|OpenChannelUI<br/><br/>OpenChannelHeader<br/><br/>OpenChannelInput<br/><br/>OpenChannelMessageList<br/><br/>OpenChannelMessage<br/><br/>FrozenChannelNotification|
|[Open channel settings](/docs/uikit/v3/react/modules/open-channel-settings)|OpenChannelSettingsProvider|useOpenChannelSettingsContext|OpenChannelSettingsUI<br/><br/>OpenChannelProfile<br/><br/>OperatorUI<br/><br/>ParticipantUI<br/><br/>EditDetailsModal|
|[Message search](/docs/uikit/v3/react/modules/message-search)|MessageSearchProvider|useMessageSearchContext|MessageSearchUI|
|[Create a channel](/docs/uikit/v3/react/modules/create-a-channel)|CreateChannelProvider|useCreateChannelContext|CreateChannelUI<br/><br/>InviteMembers<br/><br/>SelectChannelType|
|[Edit user profile](/docs/uikit/v3/react/modules/edit-user-profile)|EditUserProfileProvider|useEditUserProfileContext|EditUserProfileUI|

</div>

---

## Breaking changes

See the breaking changes below for `sendbirdSelectors` and all modules.

### Common changes

The following table shows what common changes were made to the whole UIKit from v2 to v3.

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|npm install sendbird-uikit|npm i @sendbird/uikit-react|
|sendbird-uikit/dist/index.css|@sendbird/uikit-react/dist/index.css|
|SendBirdProvider|SendbirdProvider|
|sendBirdSelectors|sendbirdSelectors|
|withSendBird()|withSendbird()|

</div>

### sendbirdSelectors

The import path for `sendbirdSelectors` has changed after the name changed as shown in the code below.

<div component="AdvancedCode" title="From v2">

```javascript
import { sendBirdSelectors } from 'sendbird-uikit';
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import sendbirdSelectors from '@sendbird/uikit-react/sendbirdSelectors';
```

</div>

#### Added UIKitMessageHandler

A new interface called `UIKitMessageHandler` has been added in `sendbirdSelectors` for handling message events when sending a message. There are three options in the handler as shown in the code below.

```javascript
const globalStore = useSendbirdStateContext();
const sendUserMessage = sendbirdSelectors.sendUserMessage(globalStore);

sendUserMessage(channel, { message: 'Hello world' })
	.onPending((message) => { })
	.onFailed((error, message) => { })
	.onSucceeded((message) => { })
```

#### Added new methods

The folllowing methods have been added for retrieving a channel instance.

<div component="AdvancedTable" type="2B">

|Method name|Description|
|---|---|
|getGetGroupChannel|Specifies a method that returns a `Promise` instance to retrieve a `GroupChannel` instance.|
|getGetOpenChannel|Specifies a method that returns a `Promise` instance to retrieve an `OpenChannel` instance.|

</div>

```javascript
const getGroupChannel = sendbirdSelectors.getGetGroupChannel(globalStore);
getGroupChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})

const getOpenChannel = sendbirdSelectors.getGetOpenChannel(globalStore);
getOpenChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})
```

#### getSendUserMessage

The `getSendUserMessage` method and the `getOpenChannelSendUserMessage` method have combined into one `getSendUserMessage`. This method generates a function that returns `UIKitMessageHandler` to send user messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const sendUserMessage = sendBirdSelectors.getSendUserMessage(store);
const params = new sdk.UserMessageParams();
sendUserMessage('channel-url', params)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const sendUserMessage = sendbirdSelectors.getSendUserMessage(globalStore);
sendUserMessage(channel, {} as UserMessageCreateParams)
	.onPending((message) => {})
	.onFailed((error, message) => {})
	.onSucceeded((message) => {})
```

</div>

#### getSendFileMessage

The `getSendFileMessage` method and the `getOpenChannelSendFileMessage` method have combined into one `getSendFileMessage`. This method generates a function that returns `UIKitMessageHandler` to send file messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const sendFileMessgae = sendBirdSelectors.getSendFileMessage(store);
const params = new sdk.FileMessageParams();
sendFileMessage('channel-url', params)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const sendFileMessage = sendbirdSelectors.getSendFileMessage(globalStore);
sendFileMessage(channel, {} as FileMessageCreateParams)
	.onPending((message) => {})
	.onFailed((error, message) => {})
	.onSucceeded((message) => {})
```

</div>

#### getFreezeChannel parameter

The parameter of `getFreezeChannel` changed from `channel-url` to `GroupChannel` or `OpenChannel`.

<div component="AdvancedCode" title="From v2">

```javascript
const freezeChannel = sendBirdSelectors.getFreezeChannel(store);
freezeChannel('channel-url')
	.then(() => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const freezeChannel = sendbirdSelectors.getFreezeChannel();
freezeChannel(channel: GroupChannel | OpenChannel)
	.then(() => {})
	.catch(() => {})
```
</div>

#### getUnfreezeChannel parameter

The parameter of `getUnfreezeChannel` changed from `channel-url` to `GroupChannel` or `OpenChannel`.

<div component="AdvancedCode" title="From v2">

```javascript
const unfreezeChannel = sendBirdSelectors.getUnfreezeChannel(store);
unfreezeChannel('channel-url')
	.then(() => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const unfreezeChannel = sendbirdSelectors.getUnfreezeChannel();
unfreezeChannel(channel: GroupChannel | OpenChannel)
	.then(() => {})
	.catch(() => {})
```
</div>

#### getCreateGroupChannel

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|getCreateChannel|getCreateGroupChannel|

</div>

When you call the `getCreateGroupChannel` method, it returns a `Promise` instance to create a new group channel.

<div component="AdvancedCode" title="From v2">

```javascript
const createChannel = sendBirdSelectors.getCreateChannel(store);
const params = new sdk.GroupChannelParams();
createChannel(params)
	.then((channel) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const createGroupChannel = sendbirdSelectors.getCreateGroupChannel(globalStore);
createGroupChannel({} as GroupChannelCreateParams)
	.then((channel) => {})
	.catch((error) => {})
```

</div>

#### How to create an open channel

When you call the `getCreateOpenChannel` method, it returns a `Promise` instance to create a new open channel.

<div component="AdvancedCode" title="From v2">

```javascript
const createOpenChannel = sendBirdSelectors.getCreateOpenChannel(store);
const params = new sdk.OpenChannelParams();
createOpenChannel(params)
	.then((channel) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const createOpenChannel = sendbirdSelectors.getCreateOpenChannel(globalStore);
createOpenChannel({} as OpenChannelCreateParams)
	.then((channel) => {})
	.catch((error) => {})
```

</div>

#### getEnterOpenChannel

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|getEnterChannel|getEnterOpenChannel|

</div>

When you call the `getEnterOpenChannel` method, it returns a `Promise` instance to enter an open channel.

<div component="AdvancedCode" title="From v2">

```javascript
const enterChannel = sendBirdSelectors.getEnterChannel(store);
enterChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const enterOpenChannel = sendbirdSelectors.getEnterOpenChannel(globalStore);
enterOpenChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})
```

</div>

#### getExitOpenChannel

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|getExitChannel|getExitOpenChannel|

</div>

When you call the `getExitOpenChannel` method, it returns a `Promise` instance to exit an open channel.

<div component="AdvancedCode" title="From v2">

```javascript
const exitChannel = sendBirdSelectors.getExitChannel(store);
exitChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const exitOpenChannel = sendbirdSelectors.getExitOpenChannel(globalStore);
exitOpenChannel('channel-url')
	.then((channel) => {})
	.catch((error) => {})
```

</div>

#### getUpdateUserMessage

The `getUpdateUserMessage` method and the `getOpenChannelUpdateUserMessage` method have combined into one `getUpdateUserMessage`. This method generates a function that returns a `Promise` instance to update user messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const updateUserMessage = sendBirdSelectors.getUpdateUserMessage(store);
const params = new sdk.UserMessageParams();
updateUserMessage('channel-url', 'message-id(number)', params)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const updateUserMessage = sendbirdSelectors.getUpdateUserMessage(globalStore);
updateUserMessage(channel, 'message-id(number)', {} as UserMessageUpdateParams)
	.then((message) => {})
	.catch((error) => {})
```

</div>

#### getDeleteMessage

The `getDeleteMessage` method and the `getOpenChannelDeleteMessage` method have combined into one `getDeleteMessage`. This method generates a function that returns a `Promise` instance to delete messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const deleteMessage = sendBirdSelectors.getDeleteMessage(store);
deleteMessage('channel-url', message)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const deleteMessge = sendbirdSelectors.getDeleteMessage(globalStore);
deleteMessage(channel, message)
	.then((message) => {})
	.catch((error) => {})
```

</div>

#### getResendUserMessage

The `getResendUserMessage` method and the `getOpenChannelResendUserMessage` method have combined into one `getResendUserMessage`. This method generates a function that returns a `Promise` instance to resend user messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const resendUserMessage = sendBirdSelectors.getResendUserMessage(store);
resendUserMessage('channel-url', failedMessage)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const resendUserMessage = sendbirdSelectors.getResendUserMessage(globalStore);
resendUserMessage(channel, failedMessage)
  	.then((message) => {})
	.catch((error) => {})
```

</div>

#### getResendFileMessage

The `getResendFileMessage` method and the `getOpenChannelResendFileMessage` method have combined into one `getResendFileMessage`. This method generates a function that returns a `Promise` instance to resend file messages in group channels and open channels.

<div component="AdvancedCode" title="From v2">

```javascript
const resendFileMessage = sendBirdSelectors.getResendFileMessage(store);
resendFileMessage('channel-url', failedMessage)
	.then((message) => {})
	.catch((error) => {})
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
const resendFileMessage = sendbirdSelectors.getResendFileMessage(globalStore);
resendFileMessage(channel, failedMessage)
	.then((message) => {})
	.catch((error) => {})
```

</div>

### ChannelList

The `ChannelList` smart component has now become `ChannelList` module. See the codes below on how to import the new channel list module.

<div component="AdvancedCode" title="From v2">

```javascript
import { ChannelList } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import ChannelList from "@sendbird/uikit-react/ChannelList"
// Or
import { ChannelList } from "@sendbird/uikit-react"
```

</div>

#### Added new props

The following table lists properties that were added to the `ChannelList` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderPlaceHolderError|React.ReactElement|Renders a customized placeholder for error messages in the channel list. (Default: `null`)|
|renderPlaceHolderLoading|React.ReactElement|Renders a customized placeholder for loading messages in the channel list. (Default: `null`)|
|renderPlaceHolderEmptyList|React.ReactElement|Renders a customized placeholder message for when the channel list is empty. (Default: `null`)|

</div>

### Channel

The `Channel` smart component has now become `Channel` module. See the codes below on how to import the new group channel module.

<div component="AdvancedCode" title="From v2">

```javascript
import { Channel } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import Channel from "@sendbird/uikit-react/Channel"
// Or
import { Channel } from "@sendbird/uikit-react"
```

</div>

#### Renamed props

The following table lists properties of the `Channel` module that were renamed.

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|useReaction|isReactionEnabled|
|useMessageGrouping|isMessageGroupingEnabled|

</div>

#### Removed render props

The following render props have been removed from UIKit v3:

* `renderCustomMessage`
* `renderChatItem`

#### renderMessage

See the code below on how to implement message-related actions in a group channel using the `sendbirdSelectors` component.

<div component="AdvancedCode" title="From v2">

```javascript
import { Channel, SendbirdProvider } from "sendbird-uikit";

const MyCustomChatMessage = ({ message, onDeleteMessage, onUpdateMessage }) => (
	<div>
		{message.message}
		<button onClick={() => {
			const callback = () => { console.warn('message deleted'); }
			onDeleteMessage(message, callback);
			}}
			> // Delete message.
		</button>
		<button onClick={() => {
			const updatedMessage = Math.random().toString();
			const callback = () => { console.warn('message updated'); }
			onUpdateMessage(message.messageId, updatedMessage, callback);
			}}
			> // Update message.
		</button>
	</div>
);

const App = () => (
	<SendbirdProvider appId={appId} userId={userId}>
		<div style={{ height: '500px' }}>
			<Channel channelUrl={channelUrl} renderChatItem={MyCustomChatMessage} />
		</div>
	</SendbirdProvider>
);
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
<Channel
  renderMessage={MyFileMessageComponent}
/>
const MyFileMessageComponent = ({ message, chainTop, chainBottom }) => {
  const {
    currentGroupChannel,
    scrollToMessage,
  } = useChannelContext();
  const globalStore = useSendbirdStateContext();
  // Use sendbirdSelectors and globalStore to implement onDeleteMessage, onUpdateMessage, onResendMessage.
  const deleteFileMessage = sendbirdSelectors.getDeleteMessage(globalStore);
  if (message.messageType === 'file') {
    return (
      <div className="custom-file-message">
        <button
          className="custom-file-message__delete-button"
          onClick={deleteFileMessage(currentGroupChannel, message)}
        />
        ... // Implement your code here.
      </div>
    )
  }
  return null;
}
```

</div>

#### Function signature

<div component="AdvancedTable" type="3B">

|Render prop|From v2|To v3|
|---|---|---|
|renderMessageInput|({ channel, user, disabled, quoteMessage }) => React.ReactElement|() => React.ReactElement|
|renderChannelHeader|renderChatHeader?: ({ channel, user }) => React.ReactElement|renderChannelHeader?: () => React.ReactElement|

</div>

#### How to render message input

See the code below on how to render the `MessageInput` component with `useChannel` context hook and implement message-related actions in the channel using the `sendbirdSelectors` component.

```javascript
<Channel
  renderMessageInput={MyMessageInput}
/>
const MyMessageInput = ({message, chainTop, chainBottom }) => {
  const {
    currentGroupChannel,
  } = useChannelContext();
  const globalStore = useSendbirdStateContext();
  // Use `sendbirdSelectors` and `globalStore` to implement `getSendUserMessage` and `getSendFileMessage`.
  const sendUserMessage = sendbirdSelectors.getSendUserMessage(globalStore);
  return (
    ...
  );
}
```

#### How to render header

See the code below on how to render channel header with `useChannel`.

```javascript
<Channel
  renderMessageInput={MyChannelHEader}
/>
const MyChannelHEader = () => {
  const {
    currentGroupChannel,
  } = useChannelContext();
  const globalStore = useSendbirdStateContext();
  const user = globalStore?.stores?.userStore?.user;
  return (
    ...
  );
}
```

#### Added new props

The following table lists properties that were added to the `Channel` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderPlaceholderLoader|React.ReactElement|Renders a customized placeholder for loading messages in the channel. (Default: `null`)|
|renderPlaceholderInvalid|React.ReactElement|Renders a customized placeholder for invalid channel state. (Default: `null`)|
|renderPlaceholderEmpty|React.ReactElement|Renders a customized placeholder for an empty channel. (Default: `null`)|
|renderChannelHeader|React.ReactElement|Renders a customized channel header component. (Default: `null`)|
|renderMessage|React.ReactElement|Renders a customized message view in the channel. (Default: `null`)|
|renderMessageInput|React.ReactElement|Renders a customized message input component. (Default: `null`)|
|renderTypingIndicator|React.ReactElement|Renders a customized typing indicator component. (Default: `null`)|
|renderCustomSeperator|React.ReactElement|Renders a customized date separator view in the message list component. (Default: `null`)|

</div>

### ChannelSettings

The `ChannelSettings` smart component has now become `ChannelSettings` module. See the codes below on how to import the new group channel settings module.

<div component="AdvancedCode" title="From v2">

```javascript
import { ChannelSettings } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import ChannelSettings from "@sendbird/uikit-react/ChannelSettings"
// Or
import { ChannelSettings } from "@sendbird/uikit-react"
```

</div>

#### Function signature

<div component="AdvancedTable" type="3B">

|Render prop|From v2|To v3|
|---|---|---|
|renderChannelProfile|({ channel }) => React.ReactElement|() => React.ReactElement|

</div>

#### How to render channel profile

See the code below on how to render channel header with `useChannelSettingsContext`.

```javascript
<ChannelSettings
  renderChannelProfile={MyChannelProfile}
/>
const MyChannelProfile = () => {
  const { channel } = useChannelSettingsContext();
  return (...);
}
```

#### Added new props

The following table lists properties that were added to the `ChannelSettings` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderPlaceHolderError|React.ReactElement|Renders a customized placeholder for error messages that occur in the channel settings menu. (Default: `null`)|
|renderModerationPanel|React.ReactElement|Renders a customized view of the moderation panel that displays the moderation tools for channel operators. (Default: `null`)|
|renderexitChannel|React.ReactElement|Renders a customized leave channel button in the settings module. (Default: `null`)|

</div>

### OpenChannel

The `OpenChannel` smart component has now become `OpenChannel` module. See the codes below on how to import the new open channel module.

<div component="AdvancedCode" title="From v2">

```javascript
import { OpenChannel } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import OpenChannel from "@sendbird/uikit-react/OpenChannel"
// Or
import { OpenChannel } from "@sendbird/uikit-react"
```

</div>

#### Function signature

<div component="AdvancedTable" type="3B">

|Render prop|From v2|To v3|
|---|---|---|
|renderChannelTitle|({channel, user}) => React.ReactElement|() => React.ReactElement|
|renderMessageInput|({channel, user, disabled}) => React.ReactElement|() => React.ReactElement|

</div>

#### Property names

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|renderCustomMessage|renderMessage|
|experimentalMessageLimit|messageLimit|
|useReaction|isReactionEnabled|
|useMessageGrouping|isMessageGroupingEnabled|

</div>

#### How to render message, channel title, and message input

See the code below on how to render the `MessageInput` component with `useOpenChannelContext` context hook and implement message-related actions in the channel using the `sendbirdSelectors` component.

```javascript
<OpenChannel
  renderInput={MyMessage}
/>
const MyMessageInput = () => {
  // Use `useOpenChannelContext` to access current channel.
  const {
    currentOpenChannel,
  } = useOpenChannelContext();
  const globalStore = useSendbirdStateContext();
  // Use `sendbirdSelectors` and `globalStore` to implement `getSendUserMessage` and `getSendFileMessage`.
  const sendMessage = sendbirdSelectors.getSendUserMessage(globalStore);
  return (
    ...
  );
}
```

#### Added new props

The following table lists properties that were added to the `OpenChannel` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderMessage|React.ReactElement|Renders a customized message view in the channel. (Default: `null`)|
|renderHeader|React.ReactElement|Renders a customized channel header component. (Default: `null`)|
|renderInput|React.ReactElement|Renders a customized message input component. (Default: `null`)|
|renderPlaceholderEmptyList|React.ReactElement|Renders a customized placeholder for an empty channel. (Default: `null`)|
|renderPlaceHolderError|React.ReactElement|Renders a customized placeholder for error messages that occur in the channel. (Default: `null`)|
|renderPlaceholderLoading|React.ReactElement|Renders a customized placeholder for loading messages in the channel. (Default: `null`)|

</div>

### OpenChannelSettings

The `OpenChannelSettings` smart component has now become `OpenChannelSettings` module. See the codes below on how to import the new open channel settings module.

<div component="AdvancedCode" title="From v2">

```javascript
import { OpenChannelSettings } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import OpenChannelSettings from "@sendbird/uikit-react/OpenChannelSettings"
// Or
import { OpenChannelSettings } from "@sendbird/uikit-react"
```

</div>

#### Replaced renderChannelProfile

<div component="AdvancedTable" type="2B">

|From v2|To v3|
|---|---|
|renderChannelProfile|renderOperatorUI, renderParticipantList|

</div>

#### Added new props

The following table lists properties that were added to the `OpenChannelSettings` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderOperatorUI|React.ReactElement|Renders a customized view of the channel settings for operators. (Default: `null`)|
|renderParticipantList|React.ReactElement|Renders a customized view of the channel settings for non-operator members. (Default: `null`)|

</div>

### MessageSearch

The `MessageSearch` smart component has now become `MessageSearch` module. See the codes below on how to import the new message search module.

<div component="AdvancedCode" title="From v2">

```javascript
import { MessageSearch } from "sendbird-uikit";
```

</div>

<div component="AdvancedCode" title="To v3">

```javascript
import MessageSearch from "@sendbird/uikit-react/MessageSearch"
// Or
import { MessageSearch } from "@sendbird/uikit-react"
```

</div>

#### Added new props

The following table lists properties that were added to the `MessageSearch` module.

<div component="AdvancedTable" type="3B">

|Property name|Type|Description|
|---|---|---|
|renderPlaceHolderError|React.ReactElement|Renders a customized placeholder for error messages that occur in the search result. (Default: `null`)|
|renderPlaceholderLoading|React.ReactElement|Renders a customized placeholder for loading messages in the search result. (Default: `null`)|
|renderPlaceHolderNoString|React.ReactElement|Renders a customized placeholder for when there are no messages that match the search query.|
|renderPlaceholderEmptyList|React.ReactElement|Renders a customized placeholder for an empty list of search results. (Default: `null`)|

</div>

---

## Added new modules

In v3, `CreateChannel` module and `EditUserProfile` module have been added. Go to the [Create a channel](/docs/uikit/v3/react/modules/create-a-channel) page and [Edit user profile](/docs/uikit/v3/react/modules/edit-user-profile) page to learn more.
