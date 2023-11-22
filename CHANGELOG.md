# Changelog - v3

## [v3.9.0] (Nov 22 2023)

### Features:
#### Typing indicator bubble feature

`TypingIndicatorBubble` is a new typing indicator UI that can be turned on through `uikitOptions`. When turned on, it will be displayed in `Channel` upon receiving typing event in real time.

* Added `typingIndicatorTypes` global option
* Added `TypingIndicatorType` enum
  * How to use?
  ```tsx
  <App
    appId={appId}
    userId={userId}
    uikitOptions={{
      groupChannel: {
        // Below turns on both bubble and text typing indicators. Default is Text only.
        typingIndicatorTypes: new Set([TypingIndicatorType.Bubble, TypingIndicatorType.Text]),
      }
    }}
  />
  ```
* Added `TypingIndicatorBubble`
  * How to use?
  ```tsx
  const moveScroll = (): void => {
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      if (scrollBottom < bottom && scrollBottom < SCROLL_BUFFER) {
        // Move the scroll as much as the height of the message has changed
        current.scrollTop += bottom - scrollBottom;
      }
    }
  };
  
  return (
    <TypingIndicatorBubble
      typingMembers={typingMembers}
      handleScroll={moveScroll} // Scroll to the rendered typing indicator message IFF current scroll is bottom.
    />
  );
  ```

#### Others
* Added support for `eventHandlers.connection.onFailed` callback in `setupConnection`. This callback will be called on connection failure
  * How to use?
  ```tsx
    <Sendbird
      appId={appId}
      userId={undefined} // this will cause an error 
      eventHandlers={{
        connection: {
          onFailed: (error) => {
            alert(error?.message); // display a browser alert and print the error message inside
          }
        }
      }}
    >
  ```
* Added new props to the `MessageContent` component: `renderMessageMenu`, `renderEmojiMenu`, and `renderEmojiReactions`
  * How to use?
  ```tsx
  <Channel
  renderMessageContent={(props) => {
    return <MessageContent
      {...props}
      renderMessageMenu={(props) => {
        return <MessageMenu {...props} />
      }}
      renderEmojiMenu={(props) => {
        return <MessageEmojiMenu {...props} />
      }}
      renderEmojiReactions={(props) => {
        return <EmojiReactions {...props} />
      }}
    />
  }}
  />
  ```
* Added `onProfileEditSuccess` prop to `App` and `ChannelList` components
* Added `renderFrozenNotification` in `ChannelUIProps`
  * How to use?
  ```tsx
    <Channel
      channelUrl={channelUrl}
      renderFrozenNotification={() => {
        return (
          <div
            className="sendbird-notification sendbird-notification--frozen sendbird-conversation__messages__notification"
          >My custom Frozen Notification</div>
        );
      }}
    />
  ```

### Fixes:
* Fixed a bug where setting `startingPoint` scrolls to the middle of the target message when it should be at the top of the message
* Applied dark theme to the slide left icon
* Fixed a bug where changing current channel not clearing pending and failed messages from the previous channel
* Fixed a bug where the thumbnail image of `OGMessage` being displayed as not fitting the container
* Fixed a bug where resending a failed message in `Thread` results in displaying resulting message in `Channel`


## [v3.8.2] (Nov 10 2023)

### Features:
* `MessageContent` is not customizable with three new optional properties:
  * `renderSenderProfile`, `renderMessageBody`, and `renderMessageHeader`
  * How to use?
    ```tsx
    import Channel from '@sendbird/uikit-react/Channel'
    import { useSendbirdStateContext } from '@sendbird/uikit-react/useSendbirdStateContext'
    import { useChannelContext } from '@sendbird/uikit-react/Channel/context'
    import MessageContent from '@sendbird/uikit-react/ui/MessageContent'

    const CustomChannel = () => {
      const { config } = useSendbirdStateContext();
      const { userId } = config;
      const { currentGroupChannel } = useChannelContext();
      return (
        <Channel
          ...
          renderMessage={({ message }) => {
            return (
              <MessageContent
                userId={userId}
                channel={currentGroupChannel}
                message={message}
                ...
                renderSenderProfile={(props: MessageProfileProps) => (
                  <MessageProfile {...props}/>
                )}
                renderMessageBody={(props: MessageBodyProps) => (
                  <MessageBody {...props}/>
                )}
                renderMessageHeader={(props: MessageHeaderProps) => (
                  <MessageHeader {...props}/>
                )}
              />
            )
          }}
        />
      )
    }
    ```

### Fixes:
* Fix runtime error due to publishing modules
* Add missing date locale to the `UnreadCount` banner since string
* Use the more impactful value between the `resizingWidth` and `resizingHeight`
  * So, the original images' ratio won't be broken
* Apply the `ImageCompression` to the `Thread` module
* Apply the `ImageCompression` for sending file message and multiple files message

### Improvements:
* Use `channel.members` instead of fetching for non-super group channels in the `SuggestedMentionList`

## [v3.8.1] (Nov 10 2023) - DEPRECATED

## [v3.8.0] (Nov 3 2023)

### Feat:
* Added a feature to support predefined suggested reply options for AI chatbot trigger messages.
* Introduced custom date format string sets, allowing users to customize the date format for `DateSeparators` and `UnreadCount`.
* Exported the `initialMessagesFetch` callback from the hook to provide more flexibility in UIKit customization.

### Fixes:
* Removed duplicate `UserProfileProvider` in `OpenChannelSettings``.
* Removed the logic blocking the addition of empty channels to the ChannelList.
* Fixed a runtime error in empty channels.
* Added precise object dependencies in effect hooks to prevent unnecessary re-renders in the Channel module.
* Used channel members instead of fetch when searched.

### Chores:
* Migrated the rest of modules & UI components to TypeScript from Javascript.
* Introduced new build settings:
  * Changes have been made to export modules using the [sub-path exports](https://nodejs.org/api/packages.html#subpath-exports) in the `package.json`. If you were using the package in a Native CJS environment, this might have an impact.
  In that case, you can migrate the path as follows:
    ```diff
    - const ChannelList = require('@sendbird/uikit-react/cjs/ChannelList');
    + const ChannelList = require('@sendbird/uikit-react/ChannelList');
    ```
  * TypeScript support also has been improved. Now, precise types based on the source code are used.

## [v3.7.0] (Oct 23 2023)

### Multiple Files Message
Now we are supporting Multiple Files Message feature!<br/>
You can select some **multiple files** in the message inputs, and send **multiple images** in one message.<br/>
If you select several types of files, only images will be combined in the message and the other files will be sent separately.
Also we have resolved many issues found during QA.

#### How to enable this feature?
You can turn it on in four places.

1. App Component
```tsx
import App from '@sendbird/uikit-react/App'

<App
  ...
  isMultipleFilesMessageEnabled
/>
```
2. SendbirdProvider
```tsx
import { SendbirdProvider } from '@sendbird/uikit-react/SendbirdProvider'

<SendbirdProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</SendbirdProvider>
```
3. Channel
```tsx
import Channel from '@sendbird/uikit-react/Channel';
import { ChannelProvider } from '@sendbird/uikit-react/Channel/context';

<Channel
  ...
  isMultipleFilesMessageEnabled
/>
<ChannelProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</ChannelProvider>
```
3. Thread
```tsx
import Thread from '@sendbird/uikit-react/Thread';
import { ThreadProvider } from '@sendbird/uikit-react/Thread/context';

<Thread
  ...
  isMultipleFilesMessageEnabled
/>
<ThreadProvider
  ...
  isMultipleFilesMessageEnabled
>
  {...}
</ThreadProvider>
```

### Interface change/publish
* The properties of the `ChannelContext` and `ThreadContext` has been changed little bit.
  * `allMessages` of the ChannelContext has been divided into `allMessages` and `localMessages`
  * `allThreadMessages` of the ThreadContext has been divided into `allThreadMessages` and `localThreadMessages`
  * Each local messages includes `pending` and `failed` messages, and the all messages will contain only `succeeded` messages
  * **Please keep in mind, you have to migrate to using the local messages, IF you have used the `local messages` to draw your custom message components.**
* pubSub has been published
  * `publishingModules` has been added to the payload of pubSub.publish
    You can specify the particular modules that you propose for event publishing
  ```tsx
  import { useCallback } from 'react'
  import { SendbirdProvider, useSendbirdStateContext } from '@sendbird/uikit-react/SendbirdProvider'
  import { PUBSUB_TOPICS as topics, PublishingModuleTypes } from '@sendbird/uikit-react/pubSub/topics'

  const CustomApp = () => {
    const globalState = useSendbirdStateContext();
    const { stores, config } = globalState;
    const { sdk, initialized } = stores.sdkStore;
    const { pubSub } = config;

    const onSendFileMessageOnlyInChannel = useCallback((channel, params) => {
      channel.sendFileMessage(params)
        .onPending((pendingMessage) => {
          pubSub.publish(topics.SEND_MESSAGE_START, {
            channel,
            message: pendingMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
        .onFailed((failedMessage) => {
          pubSub.publish(topics.SEND_MESSAGE_FAILED, {
            channel,
            message: failedMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
        .onSucceeded((succeededMessage) => {
          pubSub.publish(topics.SEND_FILE_MESSAGE, {
            channel,
            message: succeededMessage,
            publishingModules: [PublishingModuleTypes.CHANNEL],
          });
        })
    }, []);

    return (<>...</>)
  };

  const App = () => (
    <SendbirdProvider>
      <CustomApp />
    </SendbirdProvider>
  );
  ```

### Fixes:
* Improve the pubSub&dispatch logics
* Allow deleting failed messages
* Check applicationUserListQuery.isLoading before fetching user list
  * Fix the error message: "Query in progress."
* Fix missed or wrong type definitions
  * `quoteMessage` of ChannelProviderInterface
  * `useEditUserProfileProviderContext` has been renamed to `useEditUserProfileContext`
    ```tsx
    import { useEditUserProfileProviderContext } from '@sendbird/uikit-react/EditUserProfile/context'
    // to
    import { useEditUserProfileContext } from '@sendbird/uikit-react/EditUserProfile/context'
    ```

## [v3.6.10] (Oct 11 2023)
### Fixes:
* (in Safari) Display the placeholder of the MessageInput when the input text is cleared
* Remove duplicated CSS line
* (in iOS) fix focusing on the chat screen starts from the top in Mobile device
* Move to the top in the ChannelList when the current user but a different peer sends a message
  
## [v3.6.9] (Oct 6 2023)
### Fixes:
* Able to see the quoted messages regardless of the ReplyType
* Improve the types of the function props of `ui/MessageInput` component
  ```ts
  interface MessageInputProps {
    ...
    onFileUpload?: (fileList: FileList) => void;
    onSendMessage?: (props: { message: string, mentionTemplate: string }) => void;
    onUpdateMessage?: (props: { messageId: string, message: string, mentionTemplate: string }) => void;
  }
  ```
* Move to the channel list when current user is banned or the channel is deleted in MobileLayout
* Add new iconColor: THUMBNAIL_ICON which doesn't change by theme
* Add some props types that we have missed in the public interface
  * ChannelProvider
    * Add
      ```ts
      interface ChannelContextProps {
        onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
      }
      ```
    * Usage
      ```tsx
      import { ChannelProvider } from '@sendbird/uikit-react/Channel/context'

      <ChannelProvider
        onBeforeSendVoiceMessage={() => {}}
      />
      ```
  * ThreadProvider
    * Add
      ```ts
      interface ThreadProviderProps {
        onBeforeSendUserMessage?: (message: string, quotedMessage?: SendableMessageType) => UserMessageCreateParams;
        onBeforeSendFileMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
        onBeforeSendVoiceMessage?: (file: File, quotedMessage?: SendableMessageType) => FileMessageCreateParams;
      }
      ```
    * Usage
      ```tsx
      import { ThreadProvider } from '@sendbird/uikit-react/Thread/context'

      <ThreadProvider
        onBeforeSendUserMessage={() => {}}
        onBeforeSendFileMessage={() => {}}
        onBeforeSendVoiceMessage={() => {}}
      />
      ```
  * ui/Button
    * Add
      ```ts
      enum ButtonTypes {
        PRIMARY = 'PRIMARY',
        SECONDARY = 'SECONDARY',
        DANGER = 'DANGER',
        DISABLED = 'DISABLED',
      }
      enum ButtonSizes {
        BIG = 'BIG',
        SMALL = 'SMALL',
      }
      ```
    * Usage
      ```ts
      import Button, { ButtonTypes, ButtonSizes } from '@sendbird/uikit-react/ui/Button'

      <Button
        type={ButtonTypes.PRIMARY}
        size={ButtonSizes.BIG}
      />
      ```
  * ui/Icon
    * Add
      ```ts
      export enum IconTypes {
        ADD = 'ADD',
        ARROW_LEFT = 'ARROW_LEFT',
        ATTACH = 'ATTACH',
        AUDIO_ON_LINED = 'AUDIO_ON_LINED',
        BAN = 'BAN',
        BROADCAST = 'BROADCAST',
        CAMERA = 'CAMERA',
        CHANNELS = 'CHANNELS',
        CHAT = 'CHAT',
        CHAT_FILLED = 'CHAT_FILLED',
        CHEVRON_DOWN = 'CHEVRON_DOWN',
        CHEVRON_RIGHT = 'CHEVRON_RIGHT',
        CLOSE = 'CLOSE',
        COLLAPSE = 'COLLAPSE',
        COPY = 'COPY',
        CREATE = 'CREATE',
        DELETE = 'DELETE',
        DISCONNECTED = 'DISCONNECTED',
        DOCUMENT = 'DOCUMENT',
        DONE = 'DONE',
        DONE_ALL = 'DONE_ALL',
        DOWNLOAD = 'DOWNLOAD',
        EDIT = 'EDIT',
        EMOJI_MORE = 'EMOJI_MORE',
        ERROR = 'ERROR',
        EXPAND = 'EXPAND',
        FILE_AUDIO = 'FILE_AUDIO',
        FILE_DOCUMENT = 'FILE_DOCUMENT',
        FREEZE = 'FREEZE',
        GIF = 'GIF',
        INFO = 'INFO',
        LEAVE = 'LEAVE',
        MEMBERS = 'MEMBERS',
        MESSAGE = 'MESSAGE',
        MODERATIONS = 'MODERATIONS',
        MORE = 'MORE',
        MUTE = 'MUTE',
        NOTIFICATIONS = 'NOTIFICATIONS',
        NOTIFICATIONS_OFF_FILLED = 'NOTIFICATIONS_OFF_FILLED',
        OPERATOR = 'OPERATOR',
        PHOTO = 'PHOTO',
        PLAY = 'PLAY',
        PLUS = 'PLUS',
        QUESTION = 'QUESTION',
        REFRESH = 'REFRESH',
        REPLY = 'REPLY',
        REMOVE = 'REMOVE',
        SEARCH = 'SEARCH',
        SEND = 'SEND',
        SETTINGS_FILLED = 'SETTINGS_FILLED',
        SLIDE_LEFT = 'SLIDE_LEFT',
        SPINNER = 'SPINNER',
        SUPERGROUP = 'SUPERGROUP',
        THREAD = 'THREAD',
        THUMBNAIL_NONE = 'THUMBNAIL_NONE',
        TOGGLE_OFF = 'TOGGLE_OFF',
        TOGGLE_ON = 'TOGGLE_ON',
        USER = 'USER',
      }
      export enum IconColors {
        DEFAULT = 'DEFAULT',
        PRIMARY = 'PRIMARY',
        PRIMARY_2 = 'PRIMARY_2',
        SECONDARY = 'SECONDARY',
        CONTENT = 'CONTENT',
        CONTENT_INVERSE = 'CONTENT_INVERSE',
        WHITE = 'WHITE',
        GRAY = 'GRAY',
        THUMBNAIL_ICON = 'THUMBNAIL_ICON',
        SENT = 'SENT',
        READ = 'READ',
        ON_BACKGROUND_1 = 'ON_BACKGROUND_1',
        ON_BACKGROUND_2 = 'ON_BACKGROUND_2',
        ON_BACKGROUND_3 = 'ON_BACKGROUND_3',
        ON_BACKGROUND_4 = 'ON_BACKGROUND_4',
        BACKGROUND_3 = 'BACKGROUND_3',
        ERROR = 'ERROR',
      }
      ```
    * Usage
      ```ts
      import Icon, { IconTypes, IconColors } from '@sendbird/uikit-react/ui/Icon'

      <Icon
        type={IconTypes.INFO}
        fillColor={IconColors.PRIMARY}
      />
      ```

## [v3.6.8] (Sep 1 2023)
### Feats:
* Update `ui/FileViewer` to support multiple images
  * Modify the props structure
    ```typescript
    export enum ViewerTypes {
      SINGLE = 'SINGLE',
      MULTI = 'MULTI',
    }
    interface SenderInfo {
      profileUrl: string;
      nickname: string;
    }
    interface FileInfo {
      name: string;
      type: string;
      url: string;
    }
    interface BaseViewer {
      onClose: (e: React.MouseEvent) => void;
    }
    interface SingleFileViewer extends SenderInfo, FileInfo, BaseViewer {
      viewerType?: typeof ViewerTypes.SINGLE;
      isByMe?: boolean;
      disableDelete?: boolean;
      onDelete: (e: React.MouseEvent) => void;
    }
    interface MultiFilesViewer extends SenderInfo, BaseViewer {
      viewerType: typeof ViewerTypes.MULTI;
      fileInfoList: FileInfo[];
      currentIndex: number;
      onClickLeft: () => void;
      onClickRight: () => void;
    }
    export type FileViewerComponentProps = SingleFileViewer | MultiFilesViewer;
    ```
* Export misc. utils
  * `Channel/utils/getMessagePartsInfo`
  * `Channel/utils/compareMessagesForGrouping`
  * `Message/hooks/useDirtyGetMentions`
  * `ui/MessageInput/hooks/usePaste`

### Fixes:
* Apply some props which are related to the `metadata` to the ChannelListQuery
  * Add metadataKey, metadataValues, and metadataStartsWith to the Channel.queries.channelListQuery
  * How to use
    ```javascript
    <Channel or ChannelProvider
      queries={{
        channelListQuery: {
          metadataKey: 'isMatching',
          metadataValues: ['true'],
        }
      }}
    />
    ```
* Improve types of `ui/FileViewer` and `Channel/component/FileViewer`
  * Add some props that have been missed
* Fix `<ImageRenderer />` not converting number to pixel string
* Modify the types on useChannelContext & useThreadContext
  * `useChannelContext.setQuoteMessage` should accept `UserMessage | FileMessage`
  * `useThreadContext.sendMessage` should be `string`

## [v3.6.7] (Aug 11 2023)
### Feats:
* Added a new ImageGrid UI component (for internal use only) (#703)
* Introduced `fetchChannelList` to the `ChannelListContext`.
  * Implemented a custom hook function `useFetchChannelList`.
  * Utilized this function to fetch the channel list within the `ChannelListUI` component.
  * Added relevant tests for this function.
  * Provided the method through the `ChannelListContext`: `fetchChannelList`.
  Example Usage:
    ```jsx
    import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
    import useSendbirdStateContext from '@sendbird/uikit-react/useSendbirdStateContext'
    import { ChannelListProvider, useChannelListContext } from '@sendbird/uikit-react/ChannelList/context'

    const isAboutSame = (a, b, px) => (Math.abs(a - b) <= px);

    const CustomChannelList = () => {
      const {
        allChannels,
        fetchChannelList,
      } = useChannelListContext();

      return (
        <div
          className="custom-channel-list"
          onScroll={(e) => {
            const target = e.target;
            if (isAboutSame(target.clientHeight + target.scrollTop, target.scrollHeight, 10)) {
              fetchChannelList();
            }
          }}
        >
          {allChannels.map((channel) => {
            return // custom channel list item
          })}
        </div>
      );
    };

    const CustomApp = () => {
      return (
        <div className="custom-app">
          <SendbirdProvider ... >
            <ChannelListProvider ... >
              <CustomChannelList />
            </ChannelListProvider>
          </SendbirdProvider>
        </div>
      );
    };
    ```
### Fixes:
* Removed duplicated getEmoji API call from the `useGetChannel` hook (#705).
* Fixed missing `SEND_MESSAGE_FAILED` event publishing (#704):
  * Addressed the failure state in `sendbirdSelectors.getSendUserMessage` and published the `SEND_MESSAGE_FAILED` event.
  * Corrected typo `SEND_MESSAGEGE_FAILURE`.

### Chores:
* Added a troubleshooting guide to the README. (#702)
* Made minor improvements to the onboarding process. (#701)

## [v3.6.6] (Aug 3 2023)
### Feat:
* Add `customExtensionParams` for `sdk.addSendbirdExtensions` (#698)
  The 3rd parameter customData to the `sdk.addSendbirdExtension` function, allowing it to be delivered from outside of UIKit React.
  e.g.
  ```
  // its recommended to memoize customExtensionParams
  const memoizedCustomExtensionParams = useRef({
    // the key-value sets will be passed when sdk.addSendbirdExtensions is called
    ...
  })
  <SendbirdProvider
    customExtensionParams={memoizedCustomExtensionParams.current}
  />
  ```
* Call `sdk.addSendbirdExtensions` during the connection process (#682)

### Fixes:
* Change the MessageInput cursor style from disabled to not-allowed; Thanks @roderickhsiao (#697)
* PendingMsg is missing isUserMessage method (#695)
  This resolves the issue where spreading the message object in the reducer loses some methods like `isUserMessage` and `isFileMessage`
* fix util functions logic of verifying message type. We updated logic in util functions to verify the message type. (#700)


### Chore:
* Update Trunk-Based Development to Scaled Trunk-Based Development (#696)
  It describes the flow with short-lived feature branches, code review, and build automation before integrating into main.

## [v3.6.5] (July 21 2023)
### Feat:
* Add a new prop `sdkInitParams` that allows passing custom parameters when `sdk.init(params)` is called from outside of UIKit.

e.g.
```
// its recommended to memoize sdkInitParams
const memoizedSdkInitParams = useRef({
  appStateToggleEnabled: false,
  debugMode: true,
  // more options can be found here https://sendbird.com/docs/chat/v4/javascript/ref/interfaces/_sendbird_chat.SendbirdChatParams.html
})
<SendbirdProvider
  sdkInitParams={memoizedSdkInitParams.current}
/>
```

## [v3.6.4] (July 20 2023)
### Feat:
* Create a separate package.json for CommonJS (cjs) module during build time. This package.json is located under dist/cjs directory. (#687)
* Add a new prop `isUserIdUsedForNickname` to the public interface. This prop allows using the userId as the nickname. (#683)
* Add an option to the ChannelProvider: `reconnectOnIdle`(default: true), which prevents data refresh in the background. (#690)

### Fixes:
* Fix an issue where the server returns 32 messages even when requesting 31 messages in the Channel. Now, hasMorePrev will not be set to false when the result size is larger than the query. (#688)
* Verify the fetched message list size with the requested size of the MessageListParams. Added a test case for verifying the fetched message list size. (#686)
* Address the incorrect cjs path in package.json. The common js module path in the pacakge.json has been fixed. (#685)


## [v3.6.3] (July 6 2023)
### Feat:
* Add new scrollBehavior prop to Channel (#676)
  The default option is set to "auto," preserving the existing scroll behavior.
  Possible to set smooth for smooth scroll effect.

### Fixes:
* Move message list scroll when the last message is edited (#674)
  Added optional parameters to moveScroll to scroll only when the last message reaches the bottom.
  Scroll is now moved only when the updatedAt property of the last message is changed.
* Add missing `UIKitConfig` to type definition (#677)
  Reported by [GitHub PR #650](https://github.com/sendbird/sendbird-uikit-react/pull/650#issuecomment-1622331367).

## [v3.6.2] (June 30 2023)

### Fixes:
* UIKit@3.6.0 build error on CRA (#668)
  UIKit@3.6.0 wouldnt work by default on CRA
  because of module resolution error on uikit-tools
  This is fixed in uikit-tools, and released in 40.alpha
  see: https://github.com/sendbird/sendbird-uikit-core-ts/pull/55
* Improve invitation modal submit btn disable condition
  Modify the invitation modal disable condition to not include the
  logged-in user for the user counting logic

## [v3.6.1] (June 30 2023)

### Feat:
* Enable channel creation when no user present to select
  If there are no users in the channel creation menu,
  User still get to create an empty channel with themselves
* Mobile: Keep keyboard open after sending the message

### Fixes:
* Update @sendbird/uikit-tools to 0.0.1-alpha.39
    alpha.39 has CJS support, otherwise, UIKit wont work
    on next-js page router

### Chore:
* Update all examples to V4 + StackBlitz
  * Update all sample code to V4
  * Convert CodeSandbox to StackBlitz
  * Render all examples with Vite
  * Thanks @tylerhammer

## [v3.6.0] (June 28 2023)

### Feat:
* Official support for Feature Configuration
  - You can now configure the features of UIKit through the `uikitOptions` prop of `<SendbirdProvider />` or `<App />` component. You can also find the detailed sample usage from [SAMPLE.md#UIKit-Configuration-Samples](./SAMPLES.md#UIKit-Configuration-Samples)
  - The minimum `@sendbird/chat` version has been increased to 4.9.2.
```jsx
  <SendbirdProvider
    uikitOptions={{
      common: {
        enableUsingDefaultUserProfile: true,
      },
      groupChannel: {
        enableMention: false,
        enableOgtag: true,
        enableReaction: true,
        enableTypingIndicator: true,
        input: {
          camera: {
            enablePhoto: true,
            enableVideo: true,
          },
          gallery: {
            enablePhoto: true,
            enableVideo: true,
          },
          enableDocument: true,
        },
      },
      groupChannelList: {
        enableTypingIndicator: true,
        enableMessageReceiptStatus: true,
      },
      groupChannelSettings: {
        enableMessageSearch: true,
      },
      openChannel: {
        enableOgtag: true,
        input: {
          camera: {
            enablePhoto: true,
            enableVideo: true,
          },
          gallery: {
            enablePhoto: true,
            enableVideo: true,
          },
          enableDocument: true,
        },
      },
    }}
  />
```

## [v3.5.2] (June 23 2023)

Fixes:
* Allow to reduce the mobile app height
  It was not able to reduce the height of the mobile app with some wrapper components
* Do not display the UnreadCount(new message notification) comp when unreadSince is null
* Improve sampling and bitrate of Voice Recording
  * sampling rate: 11025
  * bit rate: 12000
* Move scroll every time when message height changes
  It moved scroll only when the last message height changes

## [v3.5.1] (June 15 2023)

Fixes:
* Set fallback values \w global configs in App comp
* Use global config's replyType if channel one is undefined
* Use global disableUserProfile if each context's one is defined
* Clear `scrollBottom` on channel state loading
* Fixes a runtime error
  caused by clicking "Reply in thread" menu from a parent message
* Check if the `message.type` property is empty
  and return false when it is empty in the isVoiceMessage function

## [v3.5.0] (June 14 2023)

### Feat:
* Mobile Browser UX Revamp
  We have revamped the UX to support mobile devices -
  * Revamped Modals
  * Revamped Context Menu -> Long press to open context menu
  * Revamped Message Input

  This feature is disabled by default. To enable this feature, add the following prop to `SendBirdProvider` & `App` component.
  ```javascript
  breakpoint?: string | boolean
  ```

  Example:
  ```javascript
  <SendBirdProvider breakpoint="768px">
  ```
  ```javascript
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  return (
    <SendbirdProvider breakpoint={isMobile} />
      {
        isMobile
          ? <MobileChatLayout />
          : <DesktopChatLayout />
      }
    </SendbirdProvider>
  )
  ```

  Other props:
  * SendbirdProvider?.onUserProfileMessage?: (channel: GroupChannel) => void
  Callback for handling when user sends a user profile message.
  * Channel?.onBackClick?: () => void
  Callback for handling when user clicks on back button in channel.
  This is only applicable for mobile devices.

* Configure UIKit through Dashboard(not released yet)
  We are doing groundwork to support configuring  UIKit through
  the dashboard. This will allow you to configure UIKit without
  having to add props to each component. This feature *will not* be a
  breaking change and will be backwards compatible.

### Chore:
* TSC error in typescript sample
* Samples -> Upgrade vite to 4.3.9

### Fixes:
* Connection
  * Disconnect SDK on Sendbird provider component unmount
* Message
  * Desktop - allow text select on Labels
  * Remove loading placeholder on ThumbnailMessage
  * OGMessage width overflow while adding reaction
  * Center align & remove ellipsis from admin message
* Voice Message
  * Hide download option for voice message
  * Show warning when there is no voice recording permission
  * Race condition in playing audio files simultaneously
  * Stop voice player when recorder exits
  * Pause voice when component is removed from layout
* Replies
  * Quoted text alignment for reply messages
  * MessageList: Triggering of random clicks while scroll to parent
* Thread
  * Improve parent message detection
  * Emoji reactions overflow in message
* Settings
  * <AllMemebers />: Show context menu on click
* Open Channel
  * OpenChannel Context menu click leak
  * Vertical scroll on labels in open channel list

## [v3.4.9] (June 02 2023)

Fixes:
* ChannelList
  * Display a channel on channel list only when there's a message
  * Remove edited message from ChannelPreview

* MarkAsRead & MarkAsDelivered
  * Batch markAsRead & markAsDelivered requests

* Scrolling
  * Various scroll issues in Channel component
  * Shaky scroll on messages when fetching messages
  * Scroll into view when starting point is set
  * Scroll into message on clicking quote reply
  * Inconsistent rendering on scrollToBottom button

* Mention
  * Improve max mention count logic in Messages
  * Improve mention detection when there are curly braces in user's name Mentions
  were not working when user nickname had curly braces

* Special channels
  * Disable mention in the broadcast channel
  * Change OpenChannelInput muted state notice text in broadcast channel

* Reply
  * Apply ellipsis to a sender of quote and admin message

* Thread
  * Add border bottom to the ParentMessageInfo component
  * Modify string set for thread menu "Reply to Thread" -> "Reply in Thread"
    Do not display "Reply in Thread" to the reply messages
  * Prevent hover style of ParentMessageInfo component

* OpenChannel
  * Apply theme to the OpenChannelList header

Chores:
* Add a sample with router
* Add dataId to the every menu items

## [v3.4.8] (May 19 2023)

Fixes:
* Prevent white space only text sending
* Mentioned user Regex parsing
  Mention will now work even if userId has `.*+?^${}()|[\]\\` characters.
* ChannelList blink when when message is send
  Happened when there were two channelLists in the same page with
  different query params.
* ChannelSetting `renderUserProfile` prop
  We were applying `renderChannelProfile` in place of `renderUserProfile`.
* MessageBody: Words break mid word
  Words were breaking midword because all white spaces
  were converted into nbsps. CSS couldnt distinguish nbsps
  as whitespaces, so wrapping didnt work well.

Chores:
* Setup CircleCI
  * We are moving from Github Actions to CircleCI
* Setup Husky
  * Setup lint on post push
  * Auto run yarn install on post pull
* Update EsLint
  * Update version to 8.40.x
  * Apply more strict rules

## [v3.4.7] (May 4 2023)

Important Notes:
* @sendbird/chat@4.8.0 has an issue with `abortcontroller-polyfill` plugin. Please use version 4.7.2 or install it separately.

Features:
* Set Chat SDK v4.3.0 as the minimum required version.
* Add a new UI component, Toggle:
  * `ToggleContainer`: A context provider component that manages only the toggle status.
  * `ToggleUI`: A UI component that does not include the status managing logic.
  * `Toggle`: A combination of ToggleContainer and ToggleUI components.
  * `useToggleContext`: A custom useContext hook that provides context from ToggleContainer.
  ```javascript
  import { Toggle, ToggleContainer, ToggleUI,  useToggleContext } from '@sendbird/ui/Toggle';
  ```
  
Fixes:
* Apply `isMuted` to the participant list. Operators can now unmute the muted participants from the participant list.
* Update the max mention count notice message.
* Modify the URL Regex to filter various types of formats.
* Give a left margin to the link text inside the message.
* Move the message list scroll after the OG image is loaded.
* Specify that getSdk returns SendbirdGroupChannel or SendbirdOpenChannel.
* Fix the issue where the current channel flickers on the ChannelList while creating a new group channel.

Chores: 
* Rewrite the connection logic in sdk/thunks to hooks/useConnect
  ```
  const reconnect = useConnect({
    appId,
    userId,
    accessToken,
  }, {
    logger,
    nickname,
    profileUrl,
    configureSession,
    customApiHost,
    customWebSocketHost,
    sdk: sdkStore?.sdk,
    sdkDispatcher,
    userDispatcher,
  });
  ```
* Rename `smart-components/` to `modules/`.
* Modify Logger method:
  * The first parameter (log message) of the method is now required.
  * Any other values can be passed to the second parameter of the method in a key-value format.

## [v3.4.6] (Apr 21 2023)

Fixes:
* Use markAsReadScheduler in MessageList:
  * `markAsReadScheduler` method throttles `markAsRead` calls.
  * Reduces cmd no ack error.
* Apply common scroll hook to GroupChannel MessageList:
  * Prevent whole page from scrolling when <GroupChannel /> scrolls. This issue occurs when customer implements an <GroupChannel /> in a web page with scroll.
  * This is a same fix that we fixed OpenChannel in `v3.4.4`.
* To unify message sending policies with ios & android:
  * Do not show send button when there is only new line or empty space in the input.
  * Do not trim leading white spaces in message text.
* Optimize lamjs import:
  * Lazy load the audio converting processor(lamejs) only when `isVoiceMessageEnabled` is true.
  * This saves 106KB Gzipped(85KB Brotli) if you are not using the VoiceMessage feature.

## [v3.4.5] (Apr 7 2023)

Features:

* Add a message list filter of UI level in the `Channel` module
  * Add `Channel.filterMessageList?: (messages: BaseMessage): boolean;`, a UI level filter prop
    to Channel. This function will be used to filter messages in `<MessageList />`

    example:
    ```javascript
    // set your channel URL
    const channel = "";
    export const ChannelWithFilter = () => {
      const channelFilter = useCallback((message) => {
        const now = Date.now();
        const twoWeeksAgo = now - 1000 * 60 * 60 * 24 * 14;
        return message.createdAt > twoWeeksAgo;
      }, []);
      return (
        <Channel
              channelUrl={channel}
              filterMessageList={channelFilter}
            />
      );
    };
    ```

* Improve structure of message UI for copying
    Before:
    * The words inside messages were kept in separate spans
    * This would lead to unfavourable formatting when pasted in other applications

    After:
    * Remove span for wrapping simple strings in message body
    * Urls and Mentions will still be wrapped in spans(for formatting)
    * Apply new logic & components(TextFragment) to tokenize strings
    * Improve keys used in rendering inside message,
      * UUIDs are not the optimal way to improve rendering
      * Create a composite key with message.updatedAt
    * Refactor usePaste hook to make mentions work ~
    * Fix overflow of long strings
    * Deprecate `Word` and `convertWordToStringObj`

* Export MessageProvider, a simple provider to avoid prop drilling into Messages
    Note - this is still in works, but these props will remain
    * In the future, we will add methods - to this module - to:
      * Edit & delete callbacks
      * Menu render options(ACLs)
      * Reaction configs
      * This will improve the customizability and remove a lot of prop drilling in Messages

    ```
    export type MessageProviderProps = {
      children: React.ReactNode;
      message: BaseMessage;
      isByMe?: boolean;
    }

    import { MessageProvider, useMessageContext } from '@sendbird/uikit-react/Message/context'
    ```
    Incase if you were using MessageComponents and see error message
    `useMessageContext must be used within a MessageProvider `
    use: `<MessageProvider message={message}><CustomMessage /></MessageProvider>`

* Add a scheduler for calling markAsRead intervally
  * The `markAsRead` is called on individual channels is un-optimal(causes command ack. error)
because we have a list of channels that do this
ideally this should be fixed in server/SDK
this is a work around for the meantime to un-throttle the customer

Fixes:
* Set current channel on `ChannelList` when opening channel from the parent message of `Thread`
  * Issue: The ChannelPreview item is not selected when opening the channel from
  the ParentMessage of the Thread
  * Fix: Set activeChannelUrl of ChannelList
* Detect new lines in safari on the `MessageInput` component
  * Safari puts `<div>text</div>` for new lines inside content editable div(input)
  * Other browsers put newline or `br`

## [v3.4.4] (Mar 31 2023)

Features:
* Increase default maximum recording time of Voice Message to 10 minutes
* Add logger to VoicePlayer, VoiceRecorder, and useSendVoiceMessage hook

Fixes:
* Prevent whole page from scrolling when OpenChannel scrolls
  This issue occurs when customer implements an OpenChannel in a web page with scroll
* Fix edgecase in which voice messages were sent twice
* Clean up Thread interface
  If message.parentMessage doesnt exist, treat message as parentMessage
  `<Thread message={message} />`

## [v3.4.3] (Mar 24 2023)

Features:
* Add rollup-plugin-size-snapshot for bundle-size
  Run rollup-plugin-size-snapshot on build,
  we will check bundle size before every release
* Move old samples to use vite
  React team these days are using vite for their samples,
  CRA is discourged
* Run code coverage on commenting `./coverage`
  Check code coverage on PR comment
* Add prop to disable Channel & Thread inputs
  Add prop: `disabled?: false` for Channel & Thread MessageInputWrapper
* Replace renderToString(react-dom) with custom fn
  Replace renderToString from react-dom/server with custom function
  This function was creating issue in customers with cra@4 & react@17

Fixes:
* Replace outdated CSS rules
  `justify-content: start;` and  `height: fill-available;`
* Menu position in tight screens
  * Condition where some menus get clipped in left side:
    * Usually user profile in channel moderation
  * Context menu of last item in channel gets clipped in the bottom


## [v3.4.2] (Mar 17 2023)

Features:
* Mentions should be preserved when copy pasted from sendbird-messages and message input
  * Make sure you are posting mentions of users from same channel
  * We dont support pasting of rich text from other applications
  * For copying simple text, we recommend using paste option in message context-menu

  * Conditions tested:
    1. paste simple text
    2. paste text with mention
    3. paste text with mention and text
    4. paste text with mention and text and paste again before and after
    5. copy message with mention(only one mention, no other text) and paste
    6. copy message with mention from input and paste(before and after)

Chores:
* Arrange the order of the string set table
Some string-set were missing on the current string set table, so our customers werent able to use the latest state of the string set feature

Library added:
* [dompurify@3.0.1](https://www.npmjs.com/package/dompurify): +8Kb Gzipped

## [v3.4.1] (Mar 10 2023)

Fixes:
* Keep scroll if context menu is opened when receiving messages
* Handle Ephemeral channel
  * Group channel list
    * Remove the message receipt status (channel preview)
    * Remove the unread message count (channel preview)
  * Group channel
    * Remove the message edit
    * Remove the message delete
    * Remove the message reactions
    * Remove the message receipt status (message)
    * Remove the message reply (quote_reply, thread)
  * Group channel settings
    * Remove the search in channel
  * Open channel
    * Remove the message edit
    * Remove the message delete
* Clear timeout in useLayoutEffect of Message
  * This removes memory leak warnings

## [v3.4.0] (Mar 6 2023)

### Voice Message
Voice message is a new type of message and feature that you can use in group channel. You can record your voice on the message input and send it to the channel. Also the messages will be displayed as a new design of the voice message. You are able to use this feature from this version.

#### How to turn on/off
* You can turn this feature on/off using the props `isVoiceMessageEnabled` on the <App /> and <SendbirdProvider /> components. Here is an example.
```javascript
import App from '@sendbird/uikit-react/App'
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
import { useEffect } from 'react'

const QuickStart = () => (<App isVoiceMessageEnabled />)
const CustomApp = () => {
  const [useVoiceMessage, setUseVoiceMessage] = useEffect(true)
  return (
    <SendbirdProvider
      isVoiceMessageEnabled={useVoiceMessage}
    >
      {/* Implement your custom app here */}
    </SendbirdProvider>
  )
}
```

#### How to customize the voice message in Channel and Thread?
You can identify the voice message to check if `message.type` includes `sbu_type=voice`. But you can use `isVoiceMessage` util function to do that.
```javascript
import Channel from '@sendbird/uikit-react/Channel'
import isVoiceMessage from '@sendbird/uikit-react/utils/message/isVoiceMessage'

const CustomChannel = () => {
  return (
    <Channel
      renderMessage={({ message }) => {
        if (isVoiceMessage(message)) {
          // Return your custom voice message item component
        }
        return null
      }}
    />
  )
}
```

#### Limitation & Next step
* For now, it's not able to customize the inner components of VoiceMessageInput. We are going to provide an interface to customize it in the future. Until that time, you can replace the VoiceMessageInput component using the `renderVoiceMessageIcon` props of MessageInput component.

#### What has been changed?
* Add props `isVoiceMessageEnabled` and `voiceRecord` props to the App, `SendbirdProvider`, and `MessageInput` components, to turn on/off the voice message recording feature
  ```javascript
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
  const CustomApp = () => {
    return (
      <SendbirdProvider
        isVoiceMessageEnabled
        voiceRecord={{
          maxRecordingTime: 60000,
          minRecordingTime: 1000,
        }}
      >
        {/* implement custom application */}
      </SendbirdProvider>
    )
  }
  ```
* Add props `onVoiceMessageIconClick` to the `MessageInput` component
* Add props `onBeforeSendVoiceMessage` to the `Channel` component
* Fetch message list including `MetaArray` in the `Channel` and `Thread` modules
* Provide new IconType `AudioOnLined` & new IconColor `Primary2` and `OnBackground4`
* Provide new string sets
  ```javascript
  import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider'
  const CustomApp = () => {
    return (
      <SendbirdProvider
        stringSet={{
          BUTTON__OK: 'OK',
          VOICE_MESSAGE: 'Voice Message',
          MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED: 'You\'re muted by the operator.',
          MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN: 'Channel is frozen.',
        }}
      >
        {/* implement custom application */}
      </SendbirdProvider>
    )
  }
  ```
  * `BUTTON__OK`: 'OK' → Used on the submit button of pop up modal
  * `MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_MUTED`: 'You\'re muted by the operator.' → Used in an alert pop-up modal
  * `MODAL__VOICE_MESSAGE_INPUT_DISABLED__TITLE_FROZEN`: 'Channel is frozen.' → Used in an alert pop-up modal
  * `VOICE_MESSAGE`: 'Voice Message' → Used in ChannelPreviewItem, QuoteMessage, and MessageSearch to appear that the message type is the voice## External Contributions

#### What has been added?
* Install `lamejs` to convert the audio file to mp3 (iOS support)
* UI components
  ```javascript
  import PlaybackTime from "@sendbird/uikit-react/ui/PlaybackTime"
  import ProgressBar from "@sendbird/uikit-react/ui/ProgressBar"
  import VoiceMessageInput from "@sendbird/uikit-react/ui/VoiceMessageInput"
  import VoiceMessageItemBody from "@sendbird/uikit-react/ui/VoiceMessageItemBody"
  ```
  * PlaybackTime: Display the current time in 00:00 format with the received millisecond value
  * ProgressBar: Display the current progress status with the received maxSize and currentSize of millisecond unit value
  * VoiceMessageInput: UI component for recording and playing a voice message
  * VoiceMessageItemBody: UI component for rendering a voice message also able to play voice message
* VoiceRecorder
  ```javascript
  import { VoiceRecorderProvider, useVoiceRecorderContext } from '@sendbird/uikit-react/VoiceRecorder/context'
  import useVoiceRecorder from '@sendbird/uikit-react/VoiceRecorder/useVoiceRecorder'
  ```
  * VoiceRecorderProvider: A react context provider component providing `start`, and `stop` functions
  * useVoiceRecorderContext: A react useContext hook of VoiceRecorderProvider
  * useVoiceRecorder: A react hook that provides advanced context, `recordingLimit`, `recordingTime`, `recordingFile`, and `recordingStatus`. Recommend using this hook in the customized components.
* VoicePlayer
  ```javascript
  import { VoicePlayerProvider, useVoicePlayerContext } from '@sendbird/uikit-react/VoicePlayer/context'
  import useVoicePlayer from '@sendbird/uikit-react/VoicePlayer/useVoicePlayer'
  ```
  * VoicePlayerProvider: A react context provider component providing `play`, and `pause` functions
  * useVoicePlayerContext: A react useContext hook of VoicePlayerProvider
  * useVoicePlayer: A react hook that provides advanced context, `playbackTime`, `duration`, and `playingStatus`. Recommend using this hook in the customized components.
* utils/isVoiceMessage: A function that you can check if the given message is a voice message
  ```javascript
  import isVoiceMessage from '@sendbird/uikit-react/utils/message/isVoiceMessage'
  const isVoiceMsg: boolean = isVoiceMessage(message);
  ```

Features:
* Add props `renderFileUploadIcon`, `renderVoiceMessageIcon`, and `renderSendMessageIcon` into the `Channel`, `ChannelUI`, and `MessageInput` component
  ```javascript
  interface MessageInputProps {
    renderFileUploadIcon?: () =>  React.ReactElement;
    renderVoiceMessageIcon?: () =>  React.ReactElement;
    renderSendMessageIcon?: () =>  React.ReactElement;
  }
  ```

Fixes:
* Use ApplicationUserListQuery on ChannelSettings component
* Fix some visual issues on the normal User Panel of ChannelSettings
* Indentify faulty images in OG message
* Add classname: sendbird-og-message-item-body__og-thumbnail__empty to identify faulty images in OG message
  Clients can use CSS to target this class~
  ```css
  .sendbird-og-message-item-body__og-thumbnail__empty {
    display: none;
  }
  ```

## [v3.3.7] (Feb 24 2023)

Features:
* Add props `activeChannelUrl` to ChannelList to give an option to pragmatically set a channel from a parent component router
  ```javascript
  const MyChannelList = () => {
    const [myActiveChannel] = useState()
    return (<ChannelList activeChannelUrl={myActiveChannel.url} />)
  }
  ```

Fixes:
* Fix not showing newly recived messages in channel which has less messages
* Use a real `channel.invitedAt` value when trying to fetch MessageSearchQuery
* Disable the checkbox of the joined users on the InviteUsersModal
* Set the default value of CheckBox component: `@sendbird/uikit-react/ui/CheckBox` as false

## [v3.3.6] (Feb 13 2023)

Fixes:
* pubsub should be initialized with useState
* update onBeforeCreateChannel example to use chat V4

## [v3.5.0-beta.0] (Feb 6 2023)

### Notification Channel

A notification channel is a new group channel dedicated to receiving one way marketing and transactional messages. To allow users to view messages sent through Sendbird Message Builder with the correct rendering, you need to implement the notification channel view using <NotificationChannel>

Overview:
* Provide new module `NotificationChannel`
  * NotificationChannel
    `import NotificationChannel from '@sendbird/uikit-react/NotificationChannel'`
  props:
    * channelUrl: string;
    * children?: React.ReactElement;
    // To customize Query
    * messageListParams?: MessageListParams;
    // Sets last seen externally
    * lastSeen?: number;
    // handles Actions sepcified in Message Templates
    * handleWebAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    * handleCustomAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    * handlePredefinedAction?(event: React.SyntheticEvent, action: Action, message: BaseMessage): null;
    // UI overrides
    * isLoading?: boolean;
    * renderPlaceholderLoader?: () => React.ReactElement;
    * renderPlaceholderInvalid?: () => React.ReactElement;
    * renderPlaceholderEmpty?: () => React.ReactElement;
    * renderHeader?: () => React.ReactElement;
    * renderMessageHeader?: ({ message }) => React.ReactElement;
    * renderMessage?: ({ message }) => React.ReactElement;

```
example:
export const NotificationChannelComponenet = () => (
  <Sendbird
    appId={appId}
    userId={userId}
    accessToken={accessToken}
  >
    <div style={{ height: '960px', width: '360px' }}>
      <NotificationChannel
        channelUrl={`SENDBIRD_NOTIFICATION_CHANNEL_NOTIFICATION_${userId}`}
        renderPlaceholderLoader={() => <MyBrandLogo />};
        handleCustomAction={(event, action, message) => {
          ... implement custom action
        }}
      />
    </div>
  </Sendbird>
);
```
* Submodules:
  * Context
    `import { NotficationChannelProvider useNotficationChannelContext } from '@sendbird/uikit-react/NotificationChannel/context'`
    Handles business logic of Notification Channel
  * NotificationChannelUI
    `import NotificationChannelUI from '@sendbird/uikit-react/NotificationChannel/components/NotificationChannelUI'`
    UI wrapper of Notification Channel
  * NotificationMessageWrap
    `import NotificationMessageWrap from '@sendbird/uikit-react/NotificationChannel/components/NotificationMessageWrap'`
  * NotificationList
    `import NotificationList from '@sendbird/uikit-react/NotificationChannel/components/NotificationList'`
* External modules:
  Unlike some of our other releases we decide to release some components into seperate packages to enahnce reusability with other platforms/projects
  * MessageTemplateParser('@sendbird/react-message-template')
    * MessageTemplate
      `import { createMessageTemplate } from '@sendbird/react-message-template'`
    * Parser
      `import { createParser } from '@sendbird/react-message-template'`
    * Renderer
      `import { createRenderer } from '@sendbird/react-message-template'`
  * MessageTemplateParser('@sendbird/react-message-template')
    * Context
      `import { MessageProvider, useMessageContext } from '@sendbird/react-uikit-message-template-view';`
    * MessageTemplateView
      `import { MessageTemplateView } from '@sendbird/react-uikit-message-template-view';`

## [v3.3.5] (Feb 3 2023)
Features:
* Voice Recorder&Player logic(not public yet)
  * Add a voice record logic: VoiceRecorderProvider, useVoiceRecorderContext, useVoiceRecorder
  * Add an audio play logic: VoicePlayerProvider, useVoicePlayerContext, useVoicePlayer
* Create an integrated sample for the group channel

Fix:
* Migrate the outdated ChannelListQuery interface
  * Issue: A customer said the `userIdsFilter` of ChannelListQuery doesn't work when receiving messages
    There's been an internal channel filtering logic with custom channelListQuery, but it's broken because we've used the outdated interface of Chat SDK.
  * Fix: We migrated the outdated interface `_searchFilter` and `_userIdsFilter` to new things `searchFilter` and `userIdsFilter
* Use the same word-splitting logic on the TextMessage and OGMessage
  * TextMessage will also allow opening the URL links
  * Use the same word wrapping style on the TextMessage and OGMessage
* Apply string set into the moderation section
  * Add string set
    * CHANNEL_SETTING__OPERATORS__ADD_BUTTON: 'Add'
    * CHANNEL_SETTING__MODERATION__EMPTY_BAN: 'No banned members yet'
    * CHANNEL_SETTING__MODERATION__ALL_BAN: 'All banned members'
* Edit should not be allowed when input is empty
* New channel interrupts the current conversation
  * Do not set the current channel when getting an invitation
  * Add test for USER_INVITED in the reducer of ChannelList

## [v3.3.4] (Jan 6 2023)
Fix:
* Add the time stamp rendering case for before this year on the ChannelList
* Improve the message input security
  * Possibility of XSS has been discovered
  * Recommend to do a version up, if you are using UIKit version 3.0.0 or higher

## [v3.3.3] (Dec 22 2022)
Fix:
* Change default value of the image compression rate to 70%(0.7)

## [v3.3.2] (Dec 8 2022)
Features:
* Add props `renderTitle` to the <ChannelListHeader /> component
  * `renderHeader` of <ChannelListHeader /> will be deprecated
* Add interface overrideInviteUser

  Add overrideInviteUser to ChannelList, CreateChannel and ChannelSettings

  This interface overrides InviteMember functionality. Customer has to create the channel
  and close the popup manually

  ```javascript
  export type OverrideInviteUserType = {
      users: Array<string>;
      onClose: () => void;
      channelType: 'group' | 'supergroup' | 'broadcast';
  };
  export interface ChannelListProps {
    overrideInviteUser?(params: OverrideInviteUserType): void;
  }
  export interface CreateChannelProps {
    overrideInviteUser?(params: OverrideInviteUserType): void;
  }
  export type OverrideInviteMemberType = {
      users: Array<string>;
      onClose: () => void;
      channel: GroupChannel;
  };
  ChannelSettings.overrideInviteUser?(params: OverrideInviteMemberType): void;
  ```

  example:
  ```javascript
  <ChannelList
    overrideInviteUser={({users, onClose, channelType}) => {
      createMyChannel(users, channelType).then(() => {
        onClose();
      })
    }}
  />
  ```

Fixes:
* Allow to override entire message search query.
  Now message search query supports searching messages in multiple channels.
* Modify type definitions for props `ThreadUIProps.renderMessage`.
* Remove duplication of create channel button when using `renderHeader` of <ChannelList />.
* The online status should work even configureSession is provided.
  This was disabled because of a bug in sessionHandler in SDK now, we can re-enable this.
* Create channel sometimes had empty operatorID.
  Use sendbird state to access currentUserID and use it incase prop value is empty.
  Also, remove legacy HOC pattern.
* Add the props type `isMentionEnabled` of <App />.
* Change the props type `messageSearchQuery` of <MessageSearch /> to **MessageSearchQueryParams**.

## [v3.3.1] (Nov 23 2022)
Fixes:
* Rename properties of `useThreadContext`
  * `channelStatus` to `channelState`
  * `parentMessageInfoStatus` to `parentMessageState`
  * `threadListStatus` to `threadListState`
* Change the state types to enum
  ```typescript
  enum ChannelStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  enum ParentMessageStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  enum ThreadListStateTypes {
    NIL = 'NIL',
    LOADING = 'LOADING',
    INVALID = 'INVALID',
    INITIALIZED = 'INITIALIZED',
  }
  ```

## [v3.3.0] (Nov 23 2022)
Features:
* Provide new module `Thread`. See the specific informations of this module on the [Docs page](https://sendbird.com/docs/uikit)
  * You can use a combined component `Thread`. Import it with
    ```typescript
    import Thread from "@sendbird/uikit-react/Thread"
    ```
  * Also you can use `ThreadProvider` and `useThreadContext` for customization. Import it with
    ```typescript
    import { ThreadProvider, useThreadContext } from "@sendbird/uikit-react/Thread/context"
    ```
  * And the other UI components are provided under the Thread. `ThreadUI`, `ThreadHeader`, `ParentMessageInfo`, `ParentMessageInfoItem`, `ThreadList`, `ThreadListItem`, and `ThreadMessageInput` are it
* Add channel props
  * `threadReplySelectType`: Type of the value should be
    ```typescript
    enum ThreadReplySelectType { PARENT, THREAD }
    ```
    You can see how to use it below
    ```typescript
    import { ThreadReplySelectType } from "@sendbird/uikit-react/Channel/context";

    <Channel
      ...
      threadReplySelectType={ThreadReplySelectType.PARENT}
    />
    ```
  * `animatedMessage`: Type of the value should be number(messageId)
  * `onReplyInThread`: This function is called when user click the button "Reply in thread" on the message context menu
    ```typescript
    type onReplyInThread = ({ message: UserMessage | FileMessage }) => void
    ```
  * `onQuoteMessageClick`: This function is called when user click the quote message on the message of Channel
    ```typescript
    type onQuoteMessageClick = ({ message: UserMessage | FileMessage }) => {}
    ```
  * `onMessageAnimated`: This function is called after that message item is animated
    ```typescript
    type onMessageAnimated = () => void
    ```
  * `onMessageHighlighted`: This function is called after that message item is highlighted
    ```typescript
    type onMessageHighlighted = () => void
    ```
* Add `ui/ThreadReplies` component
  ```typescript
  interface ThreadRepliesProps {
    className?: string;
    threadInfo: ThreadInfo;
    onClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
  }
  ```

Fixes:
* Do not allow operator to unregister itself on the OperatorList of GroupChannel
* Create new group channel when user open 1:1 channel on the UserProfile
* Register the channel creator as an operator in 1:1 channel

## [v3.2.6] (Nov 14 2022)
Fix:
* Use ref instead of querySelector for DOM manipulation
 Fixes the issue where input is not cleared when multiple channels are open at the same time
* Apply pre-line into the OpenChannelUserMessage
 Fixes the issue where OpenChannel UserMessage doesnt have new line

## [v3.2.5] (Nov 7 2022)
Fix:
* Modify the type of parameters in the sendbirdSelectors
  There has been unsyncronous between reality and types
  This fix only affects to TypeScript
  * getLeaveGroupChannel: `channel` to `channelUrl`
  * getEnterOpenChannel: `channel` to `channelUrl`
  * getExitOpenChannel: `channel` to `channelUrl`

## [v3.2.4] (Nov 1 2022)
Features:
* For Channel component, added separate prop isLoading?.boolean
  Usage: `<Channel channelUrl {currentChannelUrl} isLoading={!currentChannelUrl} />`
* For flicker in ChannelList, no extra props

Fixes:
* React UIKit placeholder rendering issue
* Fix scroll issue in ChannelList where user cannot load more channels
* Modify TS interface getLeaveChannel to getLeaveGroupChannel in selectors

## [v3.2.3] (Oct 14 2022)
Feature:
* Add a prop `disableMarkAsRead` into the <Channel />
  This prop disables calling markAsRead in the Channel component

## [v3.2.2] (Oct 13 2022)

Feature:
* Export a type `OutgoingMessageStates`
  * Type: `enum OutgoingMessageStates { NONE, PENDING, SENT, FAILED, DELIVERED, READ }`
* Export a util function `getOutgoingMessageState`
  * Importing path: "@sendbird/uikit-react/utils/message/getOutgoingMessageState"
  * Interface: `function getOutgoingMessageState(channel, message): OutgoingMessageStates`
* Add a prop `disableMarkAsDelivered` into the <App /> and <SendbirdProvider />
  Some of our customers do not use the markAsDelivery feature,
  but we always have called the markAsDelivered on the ChannelList with every channel
  It caused a rate-limit issue, so we add a new prop to disable the markAdDelivered call for that case

## [v3.2.1] (Oct 02 2022)

Fixes:
* Do not bundle chat SDK with uikit compiled code

Compiled UIKit code that is distributed through npm shouldn't
have Chat SDK minified code included in it
Chat SDK should be a dependency of UIKit
Advantages:
  * Chat SDK bug fixes will be added for free
  * Eliminate the need for handlers
What caused the issue:
If you are using rollup for bundling
in config.external you have to be specific
ie>
This works:
```
external: [
  '@sendbird/chat',
  '@sendbird/chat/groupChannel',
  '@sendbird/chat/openChannel',
  '@sendbird/chat/message',
]
```
This doesn't:
```
external: [ '@sendbird/chat', ]
```

* Only react and react-dom should be peerDependencies

For npm >= v7, npm autoinstall peerDependency packages
According to `https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies`
You want to express the compatibility of your package with a host tool
or library while not necessarily doing a require of this host Even though react is required,
its better to show that react is the host tool

## [v3.2.0] (Sep 27 2022)

Features:
* OpenChannelList component
  * Create new smart components (modules)
    * CreateOpenChannel
    * OpenChannelList
  * Add a renderHeader props into the ui/Modal component
  * Add stringSet for OpenChannelLisit and CreateOpenChannel components
    * OPEN_CHANNEL_LIST__TITLE: 'Channels',
    * CREATE_OPEN_CHANNEL_LIST__TITLE: 'New channel profile',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_SECTION: 'Channel image',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__IMG_UPLOAD: 'Upload',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_SECTION: 'Channel name',
    * CREATE_OPEN_CHANNEL_LIST__SUBTITLE__TEXT_PLACE_HOLDER: 'Enter channel name',
    * CREATE_OPEN_CHANNEL_LIST__SUBMIT: 'Create',
* Add prop?.value to MessageWrappers
  * @sendbird/uikit-react/Channel/components/MessageInput
  * @sendbird/uikit-react/OpenChannel/components/OpenChannelInput
  * @sendbird/uikit-react/ui/MessageInput
  * Value is reset when channelURL changes

Fixes:
* Fix issue where ConnectionHandler overwrite SessionHandler
* Use queries from @sendbird/chat
  * Use imported versions of GroupChannelListQueryParams and ApplicationUserListQueryParams
* Fix `o`penChannel casing in type defn
* Add some missing localization variables
* Deprecate ChatHeader and ChannelPreview in @sendbird/uikit-react/ui
* Replace the ButtonTypes and ButtonSizes into the Button/index
* Apply scroll to input and dark theme color to UserProfile
* Disable the create channel button when no user invite
* Use ref from MessageInputWrapper props if present
* Some CSS level polishing fixes~

Dev. Env:
* Remove `enzyme` and `react-test-renderer`
* Upgrade the `react` version to **v18**
* Upgrade the `storybook` version to **v6.5.10**
* Upgrade the `jest` and `babel-jest` to **v29**
* Upgrade the `jsdom` to **v20**
* Install `jest-environment-jsdom`
* Install `global-jsdom`
* Install `testing-library` (`@testing-library/react` and `@testing-library/jest-dom`)
* Migrate every tests with `testing-library` instead of the `enzyme` and `react-test-renderer
* Replace node-sass with sass(Dart Sass)
* Reduce bundle size by treating react-dom/server as external

## [v3.1.3] (Sep 19 2022)

Features:
* Export SessionHandler through `@sendbird/uikit-react/handlers/SessionHandler`
  * This is a workaround to fix an issue where inhertiance chains break custom handler implementation
  * `import SessionHandler from '@sendbird/uikit-react/handlers/SessionHandler'`
* Rem units can be used for typography
  * Pass prop `config.isREMUnitEnabled` -> true on SendbirdProvider
    to use "rem" units
  * We are adding rem as unit for typography/font size

Fixes:
* Fix the position of ContextMenu
* Do not exit the current open channel when the channel state is changed
* Display menu only for operators on the member list
* Hide muted icon when pop-up component is appeared
* Set message context's border roundly by the state using the reaction feature
  * Add props `isReactionEnabled` to the <TextMessageItemBody />
  * Add props `isReactionEnabled` to the <OGMessageItemBody />
  * Add props `isReactionEnabled` to the <FileMessageItemBody />
  * Add props `isReactionEnabled` to the <ThumbnailMessageItemBody />
  * Add props `isReactionEnabled` to the <UnknownMessageItemBody />
* Add the message as a parameter of renderCustomSeparator
  * before: renderCustomSeparator={() => ReactElement}
  * after: renderCustomSeparator={(props: { message }) => ReactElement}
* Fix typo on the type
  * renderCustomSep'e'rator to renderCustomSep'a'rator

## [v3.1.2] (Aug 31 2022)

* Migrate UI components into TypeScript
  This doesnt affect anyone, it a step in task to migrate the project source code into TS

Fixes:
* Type defn: Change type of react elements to `React.ReactElement`
  * Change every `React.ReactNode` and `React.Component` to `React.ReactElement`
  * Use the type of SendbirdError
  * Use the type MessageSearchQueryParams
  * Use enum MessageSearchOrder.TIMESTAMP in the message search query params instead of `'ts' as const`

  **ReactNode** could be `string | number | null | undefined | ReactElement | portal` and this(expecting string or number) causes **warning** when we use it like `<CustomComp />`
  ```typescript
  // in the component
  { renderMessage } = props
  const CustomMessage = useMemo(() => {
    return renderMessage({ ... });
  }, []);
  return (
    <div>
      <CustomMessage />
    </div>
  );
  ```
  so expecting **ReactElement** is better for our case
* Fix message grouping:
  Set isMessageGroupingEnabed to true(was set to false during v2 migration)

## [v3.1.1] (Aug 17 2022)

Features:
* Add channel handlers to the open channel settings
  * Add an open channel handler into the OpenChannelSettings component
  * Use operators property to render operator list on the OpenChannelSetting
  instead of fetching operators
* Export handlers through `@sendbird/uikit-react/handlers`, this is a workaround
  to fix an issue where inhertiance chains break custom handler implementation
  * ConnectionHandler -> `@sendbird/uikit-react/handlers/ConnectionHandler`
  * GroupChannelHandler -> `@sendbird/uikit-react/handlers/GroupChannelHandler`
  * OpenChannelHandler -> `@sendbird/uikit-react/handlers/OpenChannelHandler`
  * UserEventHandler -> `@sendbird/uikit-react/handlers/UserEventHandler`
  * Example: https://codesandbox.io/s/test-3-1-1-rc-5-f94w7i

Fixes:
* Update SendableMessage to UserMessage and FileMessage
* Change the type of MessageHandler.onFailed to FailedMessageHandler
* Add missing type defns into scripts/index_d_ts
* Typo in creating channelHandlerId on the ChannelList

## [v3.1.0] (Aug 03 2022)
Features:
* Support moderation in OpenChannel
  * Provide moderations: mute, unmute, ban, and unban on the <OpenChannelSettings />
  * Provide moderations: register and unregister operator on the <OpenChannelSettings />
  * Add MutedParticipantList and MutedParticipantsModal into the <OpenChannelSettings />
  * Add BannedUserList and BannedUsersModal into the <OpenChannelSettings />
  * Add OperatorList and OperatorsModal into the <OpenChannelSettings />
  * Add AddOperatorsModal into the <OpenChannelSettings />

## [v3.0.2] (Aug 03 2022)
Fixes:
* Explicitly export library as esm-module
  ESM library should have "type": "module" (package.json file that is going to /dist)
  This fixes Cannot use import outside module issue in next.js
* Add optional chaining for createApplicationUserList
* Fix QueryInProgress warning:
  React 18 strict mode glitch that causes useEffect to run twice
* Cannot connect sometimes when customApiHost is empty
  Connection couldnt be established with no error message when customApiHost and customWebSocketHost
  were passed as empty string
* Handle all chances of command not received error
  Handle chances of command not recieved error in markAsRead
  Experimental markasread handling -> longer times, no more call after unmount
* Move typing handler in channellist into local variable

## [v3.0.1] (July 28 2022)

Features:
* Accept customApiHost & customWebSocketHost as props to SendbirdProvider
* Add basic TS project sample

Fixes:
* Improve URL detection in OG message
* Add onCloseClick to MessageSearchProps
* Safe call removeGroupChannelHandler in TypingIndicator
* Apply userListQuery
* Type definition for channellist and setting

## [v3.0.0] (July 12 2022)

Features:
* Support `modules` and `components` in the UIKit
* Upgraded to `@sendbird/chat@4`
* Support react 18
* See the Migration Guide for Converting V2 to V3. [[details](./MIGRATION_v2-to-v3.md)]
* See more details and breaking changes. [[details](./CHANGELOG.md)]

## [3.0.0-beta.6] (June 03 2022)

Feature:
* Show profile on clicking a mention
* Visual highlight when user is mention
* Add session handler interface
```
  // its recommended to memoize configureSession function
  const memoizedConfigureSession = (sb) => {
    const sessionHandler = new sb.SessionHandler();
    sessionHandler.onSessionTokenRequired = (onSuccess, onError) => {
    };
    return sessionHandler;
  };

  // see: https://sendbird.com/docs/chat/v3/javascript/guides/authentication
  <SendbirdProvider
    configureSession={memoizedConfigureSession}
  />
```

Fix:
* Change the front-weight of Subtitle2 from 600 to 500
* Modify mention badge position on the ChannelListItem component
* Change Info Icon size to 20px on the SuggestedMentionListItem component
* Differentiate the message status 'read' and 'delivered' with message grouping
* Modify KeyDown event handler on the message input for sending Korean text edge case
Fix: Mention related stuff
* Modify the onMouseOver event on the SuggestedMentionList component
* Filter 'html' text when pasting text to the MessageInput component
* Hide and apply ellipsis for overflowing text on the SuggestedMentionListItem component
* Deactivate the MessageInput component when the current user is muted or the current channel is frozen
* Reset the mention states of the current channel when changing channel and closing the edit MessageInput component

## [3.0.0-beta.5] (May 24 2022)
Fixes:
* Export useChannelList
* Active disableAutoSelect props
* Remove empty CSS file to fix source map warning

DOC:
* Add info about webpack 5 breaking changes

## [3.0.0-beta.4] (May 24 2022) -> unpublished
## [3.0.0-beta.3] (May 19 2022)
Fixes:
* Rate limit markAsDelivered call
* Do not render date separator when renderCustomSeparator is null
Misc:
* Update Chat SDK minimum version to `3.1.13`

## [3.0.0-beta.2] (April 29 2022)

Feature:
* Mention
  * Add isMentionEnabled props to the <App /> and <SendbirdProvider />
  * Add userMention into the config props of the <App /> andd <SendbirdProvider />
    * <SendbirdProvider config={{ userMention: { maxMentionCount: 10, maxSuggestionCount: 15 } }} />
    * maxMentionCount: A maximum count that you can mention in the message input
    * maxSuggestionCount: A maximum user count that the SuggestedMentionList suggests for user mention
  * Create SuggestedMentionList component under the Channel smart component
    * Create SuggestedUserMentionItem component
  * Create MentionUserLabel ui component
  * Add string set
    * MENTION_NAME__NO_NAME: '(No name)'
    * MENTION_COUNT__OVER_LIMIT: 'You can mention up to %d times per message.'
Fix:
* Type definition file fix for TS project
For typescript projects, add `node_modules/@sendbird/uikit-react/index.d.ts`
to your `include` section in tsconfig file to get type definitions

* Move font import to top of CSS file
Some bundlers such as parcel throw error:
`@import rules must precede all rules aside from @charset and @layer statements`
Resolve this issue by moving the line to the top

## [3.0.0-beta] (Apr 12 2022)

This is the official beta for Sendbird UIKit for React version 3!

TLDR -> We split the old `smart-components` into modules which contian context and UI. Context contain logic and UI Components handle UI

**[Check out the v2 to v3 migration guide for details](MIGRATION_v2-to-v3.md)**

Changelog:
* Package should be installed using `@sendbird/uikit-react`
* Restructure smart-components into modules that contain a context and related UI components
* Export these context and UI components to allow fine-grain customization
* Recommend to use these context elements `useXXXXX()` and react function components to make custom components
* All generic UI components are available as exports
* Restrcuture export paths to allow better tree-shaking
* Example:
```
import { useChannel } from '@sendbird/uikit-react/Channel/context';
import ChannelUI from '@sendbird/uikit-react/Channel/components/ChannelUI';
```
* We keep older export patterns to make migration easier
* Retained modules - ChannelList, Channel, ChannelSettings, OpenChannel, OpenChannelSettings, MessageSearch
* New modules(not including context and ui of above) - CreateChannel, EditUserProfile, ui
