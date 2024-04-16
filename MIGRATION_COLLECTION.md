# Migration guide of GroupChannel

We have been handling core aspects of chat, such as channel lists and chat rooms, through modules named `Channel` and `ChannelList`. However, there were some areas in need of improvement within these module components, leading us to introduce `GroupChannel` and `GroupChannelList` through these enhancements.

Firstly, there was an issue related to names. The term "Channel" is widely used, causing our existing `OpenChannel` component to appear as if it's on a lower level than `Channel`, despite being on the same level and representing a different type of channel. Therefore, the new name, `GroupChannel`, clearly conveys that it is on the same level as `OpenChannel` while indicating a different channel type.

Secondly, there was an internal logic issue. While the Chat SDK has been providing local caching and collection features since v4, UIKit React hasn't supported these functionalities, unlike on other platforms. With the introduction of `GroupChannel` and `GroupChannelList`, a new local caching feature has been added, allowing you to experience a more efficient chat environment.

We provide a massive component called `App` that combines all the features. From now on, this component will use `GroupChannel` and `GroupChannelList` instead of `Channel` and `ChannelList`. If you wish to continue using `Channel` and `ChannelList`, you can use `enableLegacyChannelModules` to ensure the previous components are still available for use.

```tsx
import SendbirdApp from '@sendbird/uikit-react/App';

const App = () => (
  <SendbirdApp
    // ...
    enableLegacyChannelModules
  />
);
```

Furthermore, here are the paths where you can import modules related to GroupChannel and GroupChannelList. Import them as follows:

```tsx
// GroupChannelList
import { GroupChannelList } from '@sendbird/uikit-react/GroupChannelList';
import { GroupChannelListProvider, useGroupChannelListContext } from '@sendbird/uikit-react/GroupChannelList/context';
import { AddGroupChannel } from '@sendbird/uikit-react/GroupChannelList/components/AddGroupChannel';
import { GroupChannelListUI } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListUI';
import { GroupChannelListHeader } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader';
import { GroupChannelListItem } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelListItem';
import { GroupChannelPreviewAction } from '@sendbird/uikit-react/GroupChannelList/components/GroupChannelPreviewAction';

// GroupChannel
import { GroupChannel } from '@sendbird/uikit-react/GroupChannel';
import { GroupChannelProvider, useGroupChannelContext } from '@sendbird/uikit-react/GroupChannel/context';
import { GroupChannelHeader } from '@sendbird/uikit-react/GroupChannel/components/GroupChannelHeader';
import { GroupChannelUI } from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';
import { FileViewer } from '@sendbird/uikit-react/GroupChannel/components/FileViewer';
import { FrozenNotification } from '@sendbird/uikit-react/GroupChannel/components/FrozenNotification';
import { Message } from '@sendbird/uikit-react/GroupChannel/components/Message';
import { MessageInputWrapper, VoiceMessageInputWrapper } from '@sendbird/uikit-react/GroupChannel/components/MessageInputWrapper';
import { MessageList } from '@sendbird/uikit-react/GroupChannel/components/MessageList';
import { RemoveMessageModal } from '@sendbird/uikit-react/GroupChannel/components/RemoveMessageModal';
import { TypingIndicator } from '@sendbird/uikit-react/GroupChannel/components/TypingIndicator';
import { UnreadCount } from '@sendbird/uikit-react/GroupChannel/components/UnreadCount';
import { SuggestedMentionList } from '@sendbird/uikit-react/GroupChannel/components/SuggestedMentionList';
```

## Migrate `ChannelList` to `GroupChannelList`

### What has been changed in the props of GroupChannelList?

If you have been using `ChannelList` or `ChannelListProvider` and now want to switch to the new `GroupChannelList` or `GroupChannelListProvider`, you need to know which props have been changed, added, or removed.

#### Some props has been added

|     Props name     |                        Type                         | Description                                                                                                                                                                                                                                                                                                                                                   |
| :----------------: | :-------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onChannelCreated` | `onChannelCreated: (channel: GroupChannel) => void` | We already provide the `onChannelSelect` prop. However, this callback function is invoked not only when a channel is selected but also when it is created, despite its name. We found this behavior to be confusing, and felt the need to distinguish between when a channel is selected and when it is created. Therefore, we introduced `onChannelCreated`. |

Were you customizing to set the current channel using onChannelSelect? If so, in the future, if you want to set the current channel to the newly created channel when a channel is created, you should use onChannelCreated for that purpose.

```tsx
const App = () => {
  const [currentChannel, setCurrentChannel] = useState(null);

  const handleSetCurrentChannel = (channel: GroupChannel) => {
    setCurrentChannel(channel);
  };

  return (
    <div>
      <GroupChannelList onChannelSelect={handleSetCurrentChannel} onChannelCreated={handleSetCurrentChannel} />
      <GroupChannel channelUrl={currentChannel?.url ?? ''} />
    </div>
  );
};
```

### Some props has been renamed

|       Previous prop        |         New prop         | Description                                                                                                                    |
| :------------------------: | :----------------------: | :----------------------------------------------------------------------------------------------------------------------------- |
|     `activeChannelUrl`     |   `selectedChannelUrl`   | The name has been changed to align with the role of this prop. The type has been preserved.                                    |
|   `onProfileEditSuccess`   |  `onUserProfileUpdated`  | The name has been changed to align with the role of this prop. The type has been preserved.                                    |
|    `overrideInviteUser`    |  `onCreateChannelClick`  | The name has been changed to align with the role of this prop. The type has been preserved.                                    |
| `queries.channelListQuery` | `channelListQueryParams` | The depth of props has been reduced by one level, the names of props have changed, and there have been changes in their types. |

#### Some props has been removed

The `applicationUserListQuery` that was previously contained within the `queries` props has been removed as it was not being used internally. You can now customize the `applicationUserListQuery` when creating a channel in the `CreateChannel`.

### What has been changed in the context of GroupChannelList?

If you have been customizing using the `ChannelListProvider` and now want to switch to using the `GroupChannelListProvider`, you need to understand how the contexts provided by `useGroupChannelListContext` have changed. Some contexts have had their names modified, new contexts have been introduced, and contexts that are no longer needed have been removed.

#### Some context has been added

| Context name |         Type          | Description                                                                                                            |
| :----------: | :-------------------: | :--------------------------------------------------------------------------------------------------------------------- |
|  `refresh`   | `() => Promise<void>` | This is a function to refresh the channel list. You can use it when you want to forcibly refresh the channel list.     |
| `refreshing` |       `boolean`       | It becomes `true` while refreshing the channel list. It can be used to display a loading status UI during the refresh. |

#### Some context has been renamed

|  Previous context  |   New context   | Description                                                                                    |
| :----------------: | :-------------: | :--------------------------------------------------------------------------------------------- |
|   `allChannels`    | `groupChannels` | The name has been changed to align with the role of this context. The type has been preserved. |
| `fetchChannelList` |   `loadMore`    | The name has been changed to align with the role of this context. The type has been preserved. |

#### Some context has been removed

We no longer manage context using the dux pattern internally and rely on the logic of the Chat SDK collections. Therefore, the contexts related to this, such as `channelListDispatcher` and `channelSource`, have been removed. Additionally, `currentUserId` has been removed because you can obtain this value through the `SendbirdContext`. The `loading` has also been removed, and you can use `initialized` instead.

## Migrate `Channel` to `GroupChannel`

### What has been changed in the props of GroupChannel?

If you're a user looking to use `GroupChannel` or `GroupChannelProvider`, you need to understand how the previously used props have changed and how to adapt these changed props to the new format. Please review the following contents and make necessary changes to the prop names or modify functions to align with the updated types. If you were using any props that have been removed, you should remove them accordingly.

#### Some props behavior has been changed

|      Props      |                             Before                             | After                                                                                             |
| :-------------: | :------------------------------------------------------------: | :------------------------------------------------------------------------------------------------ |
| `renderMessage` | Customizes all child components of the each message component. | A function that customizes the rendering of each message component in the message list component. |

For example, if you want to customize the children of the message component, you must use the `Message` component.

```tsx
// Before
<Channel
  renderMessage={(props) => {
    return <div>{'my custom message child'}</div>;
  }}
/>;

// After
import { Message } from '@sendbird/uikit-react/GroupChannel/components/Message';

<GroupChannel
  renderMessage={(props) => {
    return <Message {...props}>{'my custom message child'}</Message>;
  }}
/>;
```

#### Some props has been renamed

|        Previous prop        |         New prop         | Description                                                                                                                    |
| :-------------------------: | :----------------------: | :----------------------------------------------------------------------------------------------------------------------------- |
|      `animatedMessage`      |   `animatedMessageId`    | The name has been changed to align with the role of this props. The type has been preserved.                                   |
|      `onReplyInThread`      |  `onReplyInThreadClick`  | The function's parameter structure has been preserved.                                                                         |
| `queries.messageListParams` | `messageListQueryParams` | The depth of props has been reduced by one level, the names of props have changed, and there have been changes in their types. |

#### Some props changed their types

|             Props name             | Previous type                                                                                                                      | New type                                                                                                                     |
| :--------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
|     `onBeforeSendUserMessage`      | `onBeforeSendUserMessage?(text: string, quotedMessage?: SendableMessageType): UserMessageCreateParams`                             | `onBeforeSendUserMessage?: (params: UserMessageCreateParams) => Promise<UserMessageCreateParams>`                            |
|     `onBeforeSendFileMessage`      | `onBeforeSendFileMessage?(file: File, quotedMessage?: SendableMessageType): FileMessageCreateParams`                               | `onBeforeSendFileMessage?: (params: FileMessageCreateParams) => Promise<FileMessageCreateParams>`                            |
|     `onBeforeSendVoiceMessage`     | `onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams`                          | `onBeforeSendVoiceMessage?: (params: FileMessageCreateParams) => Promise<FileMessageCreateParams>`                           |
| `onBeforeSendMultipleFilesMessage` | `onBeforeSendMultipleFilesMessage?: (files: Array<File>, quotedMessage?: SendableMessageType) => MultipleFilesMessageCreateParams` | `onBeforeSendMultipleFilesMessage?: (params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessageCreateParams>` |
|    `onBeforeUpdateUserMessage`     | `onBeforeUpdateUserMessage?(text: string): UserMessageUpdateParams`                                                                | `onBeforeUpdateUserMessage?: (params: UserMessageUpdateParams) => Promise<UserMessageUpdateParams>`                          |

For example, I will attach a code snippet to demonstrate how to migrate `onBeforeSendUserMessage`.

```tsx
// Before
<Channel
  onBeforeSendUserMessage={(text, quotedMessage) => {
    const params = new UserMessageCreateParams();
    params.message = text;
    params.parentMessageId = quotedMessage.messageId;
    params.customType = 'custom-type';
    return params;
  }}
/>

// After
<GroupChannel
  onBeforeSendUserMessage={(params) => {
    return {
      ...params,
      customType: 'custom-type',
    };
  }}
/>
```

#### Some props has been removed

Highlighting message has been deprecated and merged to animating message. So we removed two props for highlighting message, `highlightedMessage` and `onMessageHighlighted`. Furthermore, we have removed the `isLoading` prop, which has existed until now but was not reflected in the internal logic.
<br><br>
Also, `filterMessageList` has been removed, because you can filter message using the `renderMessage` props instead.

```tsx
<GroupChannel
  renderMessage={({ message }) => {
    if (message.type === 'filtered') return <></>; // render empty component.
    return null; // render default component.
  }}
/>
```

### What has been changed in the context of GroupChannel?

If you have been customizing using the `ChannelProvider`, you have likely been using the `useChannelContext` hook to access channel context. The new group channel also provides the `useGroupChannelContext` hook in the same manner. However, some values provided within the context have been changed. Contexts that are no longer needed have been removed, and new contexts like `scrollToBottom` have been added. Additionally, there are contexts where only the names or types have been modified, so it's important to review and make necessary modifications accordingly.

#### Some context has been added

|   Context name   |         Type          | Description                                                                                                            |
| :--------------: | :-------------------: | :--------------------------------------------------------------------------------------------------------------------- |
|    `refresh`     | `() => Promise<void>` | This is a function to refresh the message list. You can use it when you want to forcibly refresh the message list.     |
|   `refreshing`   |       `boolean`       | It becomes `true` while refreshing the message list. It can be used to display a loading status UI during the refresh. |
|  `loadPrevious`  | `() => Promise<void>` | This is a function to fetch more previous messages. You can call it when the scroll is reached to the top.             |
|    `loadNext`    | `() => Promise<void>` | This is a function to fetch more next messages. You can call it when the scroll is reached to the bottom.              |
| `scrollToBottom` | `() => Promise<void>` | If you want to scroll the message list to the bottom, you can call this function.                                      |

#### Some context has been renamed

| Previous context |     New context     |                                              Description                                              |
| :--------------: | :-----------------: | :---------------------------------------------------------------------------------------------------: |
|  `allMessages`   |     `messages`      |    The name has been changed to align with the role of this context. The type has been preserved.     |
|  `sendMessage`   |  `sendUserMessage`  | Due to changes in the function parameter types, please refer to the following table for more details. |
| `updateMessage`  | `updateUserMessage` | Due to changes in the function parameter types, please refer to the following table for more details. |
|  `hasMorePrev`   |    `hasPrevious`    |              The type has been changed from `boolean` to `a function returning boolean`.              |
|  `hasMoreNext`   |      `hasNext`      |              The type has been changed from `boolean` to `a function returning boolean`.              |

#### Some context changed their types

|        Context name        | Previous type                                                                                          | New type                                                                       |
| :------------------------: | :----------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
|     `sendUserMessage`      | `(params: SendMessageParams) => void`                                                                  | `(params: UserMessageCreateParams) => Promise<UserMessage>`                    |
|    `updateUserMessage`     | `(params: UpdateMessageParams, callback?: (err: SendbirdError, message: UserMessage) => void) => void` | `(messageId: number, params: UserMessageUpdateParams) => Promise<UserMessage>` |
|     `sendFileMessage`      | `(file: File, quoteMessage?: SendableMessageType) => Promise<FileMessage>`                             | `sendFileMessage: (params: FileMessageCreateParams) => Promise<FileMessage>`   |
|     `sendVoiceMessage`     | `(file: File, duration: number, quoteMessage?: SendableMessageType) => Promise<FileMessage>`           | `(params: FileMessageCreateParams, duration: number) => Promise<FileMessage>`  |
| `sendMultipleFilesMessage` | `(files: Array<File>, quoteMessage?: SendableMessageType) => Promise<MultipleFilesMessage>`            | `(params: MultipleFilesMessageCreateParams) => Promise<MultipleFilesMessage>`  |

For example, I will attach a code snippet to demonstrate how to migrate `sendUserMessage`.

```tsx
// Before
const { sendMessage } = useChannelContext();
sendMessage({
  message: message,
  quoteMessage: parentMessage,
  mentionedUsers: mentionedUsers,
  mentionTemplate: mentionTemplate,
});

// After
const { sendUserMessage } = useGroupChannelContext();
sendUserMessage({
  message: message,
  parentMessageId: parentMessage.messageId,
  mentionedUsers: mentionedUsers,
  mentionedMessageTemplate: mentionTemplate,
})
  .then((message) => {
    // handle sending success
  })
  .catch((err) => {
    // handle sending failure
  });
```

#### Some context has been removed

With the introduction of collections, there is no longer a need to distinguish between `allMessages` and `localMessages` based on the `sendingStatus` of messages. As a result, `localMessages` has been removed.
We no longer manage context using the dux pattern internally and rely on the logic of the Chat SDK collections. Therefore, the contexts related to this, such as `messagesDispatcher`, `messageActionTypes`, `oldestMessageTimeStamp`, `lastMessageTimeStamp`, `initialTimeStamp`, and `setInitialTimeStamp` have been removed. The scrolling logic has been simplified and unified, resulting in the removal of `isScrolled`, `setIsScrolled`, `onScrollCallback`, and `onScrollDownCallback`. Furthermore, the no longer needed `emojiAllMap` has been removed.
