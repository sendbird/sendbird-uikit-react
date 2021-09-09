# Changelog

## [2.4.1](Sep 9 2021)

- Bugfix:
 * Fix issues of the event filter and add tests
 * Add checking current channel condition before get channel
 * Add hasSeparator and menuDisabled props to renderChatItem
 * Fix alignment of pending message

## [2.4.0]

Move source code to new repo

## [2.3.2] (Aug 19 2021)

- Bugfix:
 * Add filtering logics for channel events by custom message list params
 * Add filtering logics for channel list events by custom channel list query

## [2.3.0](Jul 27 2021)

- Bugfix:
  * Thumbnail image url fix

## [2.3.0.alpha](Jul 27 2021)

- Internal tooling changes:
  * npm v7 peer dependency fix
  * storybook 6
  * jest 27
  * typescript 4
  * React 17
  * rollup 2


## [2.2.1](Mar 19 2021)

- Features:
  * <MessageSearch /> - standalone message search component with props:
    channelUrl: string;
    searchString?: string;
    messageSearchQuery?: SendbirdUIKit.MessageSearchQueryType;
    renderSearchItem?({ message, onResultClick }: {
      message: ClientSentMessages,
      onResultClick?: (message: ClientSentMessages) => void,
    }): JSX.Element;
    onResultLoaded?(messages?: Array<ClientSentMessages>, error?: SendbirdError): void;
    onResultClick?(message: ClientSentMessages): void;
  * <App /> can enable or disable search using prop: `showSearchIcon`
  * <Channel /> Add prop to highlight and navigate betweeen messages
    highlightedMessage?: string | number;
    startingPoint: number;

- Bugfixes:
  * Stability fixes

## [2.2.0](Mar 19 2021) Deprecated

## [2.1.0](Mar 04 2021)

- Features:
  * Change font-family to Roboto
  * Update color set
  * Add conditional search icon to Channel component
  ```
    <Channel
      showSearchIcon: boolean
      onSearchClick: function
    />
  ```
  * Implement hook `useSendbirdStateContext` to
    access UIKit global state
  ```
    const state = useSendbirdStateContext();
    const sdk = sendbirdSelectors.getSdk(state);
  ```

- Bugfixes:
  * Handle SVG file as thumbnail image
  * Loader shouldnt show warning message
  * Change type definition for array 'type[]' to Array<type>
  * Add chainTop and chainBottom for custom message items
  * Separate Open and GroupChannel renderMessageInput definition
  * Cleanup SVG icons
  * Various other style and stability fixes

## [2.0.2](Jan 28 2021)

- Bugfixes:
  * When message arrive, autoscroll if user is at end of Channel

## [2.0.1](Jan 27 2021)

- Features:
  * ImageCompression for sending jpg, jpeg & png files

- Bugfixes:
  * Add Pending and Failed Icon in OpenChannel Messages
  * Scrolling of Channel component
  * Add get-prefix to selectors(getExitOpenChannel, getEnterOpenChannel)
  * Cosmetic fixes

## [2.0.0] Open Channel

* OpenChannel
<OpenChannel /> is the component where conversation between the users
happen.
It is similar to <Channel /> component among group channel components.

* OpenChannelSettings
<OpenChannelSettings /> works as the configuration component for open
channel OpenChannelSettings

* A set of selectors for OpenChannel operations

## [1.3.0](Nov 9, 2020)

- Features:
  * String set customization
  * Use date-fns instead of momentjs
  * Add type definition files for typescript support
  * Theme customization using CSS-Variables

- Bugfixes:
  * Yarn support
  * Cosmetic fixes

## [1.3.0-rc.4](Oct 27, 2020)

- Bugfixes:
  * Yarn support
  * Cosmetic fixes

## [1.3.0-rc.1 - 1.3.0-rc.3]

- Bugfixes:
  * Type defintion fixes

## 1.3.0-rc.0(Oct 20, 2020)

- Features:
  * String set customization
  * Use date-fns instead of momentjs
  * Add type definition files for typescript support
  * Theme customization using CSS-Variables

## 1.2.8(Oct 19, 2020)

- Features/Bugs:
  * sortChannelList prop for ChannelListComponent
  ```
    sortChannelList={(channels: BaseChannel) => {
      ...
      return sortedChannels: BaseChannel
    }}
  ```
- Bugfixes:
  * CSS Flex: Rename all start to flex-start

## 1.2.7(Sept 29, 2020)

- Bugfixes:
  * Fix ChannelList scroll by adding correct classname

## 1.2.6(Sept 28, 2020)

- Bugfixes:
  * sendBirdSelectors.getSendFileMessage supports attaching
    files that are uploaded to a remote server
  * renderChatItem includes channel as a prop:
    * The available props are:
      {
        message: BaseMessage,
        onDeleteMessage: Fn,
        onUpdateMessage: Fn,
        channel: GroupChannel
      }
  * Place unsuccessful messages to the last on the allMessages

## 1.2.5(Sept 21, 2020)

- Features/Bugs:
  * ChannelList
    * disableUserProfile: boolean
    * renderUserProfile: React.Component

## 1.2.4(Sept 17, 2020) Deprecated

- Features:
  User profile viewer on Channel and ChannelSettings
  Edit user profile on ChannelList(disabled by default)

  * SendBirdProvider
    * disableUserProfile: boolean
    * renderUserProfile: React.Component
    * allowProfileEdit: boolean
  * Channel
    * disableUserProfile: boolean
    * renderUserProfile: React.Component
  * ChannelSettings
    * disableUserProfile: boolean
    * renderUserProfile: React.Component
  * ChannelList
    * renderHeader(): React.Component
    * allowProfileEdit: boolean
    * onThemeChange(theme: string): void
    * onProfileEditSuccess(user: User): void

## 1.2.3(Sept 10, 2020)

- Features:
  * Message grouping

- Bugfixes:
  * Fix file upload issue with sendBirdSelectors.getSendFileMessage

- Dependency updates:
  * SDK version - 3.0.133

## 1.2.2(Sept 10, 2020) Deprecated

- Features:
  * Message grouping

- Bugfixes:
  * Fix file upload issue with sendBirdSelectors.getSendFileMessage

- Dependency updates:
  * SDK version - 3.0.133

## 1.2.1(Sept 01, 2020)

- Bugfixes:
  * Unordered message history
  * Message text break on middle of word

## 1.2.0(Aug 27, 2020)

- Features:
  * Add GroupChannel type selector UI to create channel
  * Ability to create supergroup(to be enabled from dashboard)
  * Channel creator will become operator user
  * Channel moderation for operator user
    * Mute user
    * Ban user
    * Promote/Demote other users to operator
    * Freeze/Unfreeze Channels
  * Visual indicators for different channel states in ChannelList
  * Visual indicators for MessageInput based on channel state

- Bugfixes:
  * Remove multiple imports of font family
  * Visual glitches

- Dependency updates:
  * SDK version - 3.0.132

## 1.1.5(Aug 25, 2020)

- Features:
  * Edit sign on updated messages

- Bugfixes:
  * Race condition on Channel switch
  * Visual glitches

## 1.1.4(Aug 12, 2020)

- Features:
  * Implement OG tag messages
  * Apply broadcast/Freeze indicators in Conversation

- Bugfixes:
  * Reload conversation and ChannelList on query change
  * Change channel placeholder to match design
  * Fix typing indicator bug

- Dependency updates:
  * SDK version - 3.0.129

## 1.1.3(July 29, 2020)

- Features:
  * Visual indicator for frozen, broadcast channels

- Bugfixes:
  * Sort Channels in ChannelList by send message
  * Update ChannelPreview on edit message
  * Hide channel on onChannelHidden
  * Other stability fixes

## 1.1.2(July 14, 2020)

- Features:
  * Implement render messsage input and render chat header
    * Channel.renderChatHeader({channel, user})
    * Channel.renderMessageInput({channel, user, disabled})
  * Rename messageListQuery to messageListParams

- Bugfixes:
  * Avatar size issue in ChannelList
  * Various PropType warnings
  * Other stability fixes

## 1.1.1(July 10, 2020)

- Features:
  * Reactions
    * Reactions are available for users who have it enabled
    * getEmojiCategoriesFromEmojiContainer
    * getAllEmojisFromEmojiContainer
    * getEmojisFromEmojiContainer
- Bugfixes:
  * Avatar flickering issue
  * SDK version mismatch issue
  * Various stability fixes

- Dependency updates:
  * SDK version - 3.0.128

## 1.1.0(July 10, 2020)(deprecated)

## 1.0.7(June 26, 2020)

- Features:
  * Implement query customization - users can now customize internal queries that we use inside the app
  to customize - ChannelList, MessageList and UserList rendering

    * ChannelList.queries.channelListQuery (MyGroupChannelListQuery)
    * ChannelList.queries.applicationUserListQuery (ApplicationUserListQuery), ChannelSettings.queries.applicationUserListQuery (ApplicationUserListQuery)
    * Channel.queries.messageListQuery (MessageListQuery)

  * UI for unknown message type


 - Example

  ```
  <ChannelList
    queries={{
      channelListQuery: { includeEmpty: true },
      applicationUserListQuery: { limit: 30, userIdsFilter: ['yourId'] },
    }}
  />

  <Channel
    channelUrl={channelUrl}
    queries={{
      messageListQuery: { prevResultSize: 10, includeParentMessageText: true, includeReaction: false },
    }}
  />

  <ChannelSetting
    channelUrl={channelUrl}
    queries={{
      applicationUserListQuery: { limit: 30, userIdsFilter: ['yourId'] },
    }}
  />
  ```

- Bug fixes:
  * Various stability fixes

## 1.0.6(June 18, 2020)

- Bug fixes:
  * Improve disconnect/reconnect UX
  * Various stability fixes

## 1.0.5(June 9, 2020)

- Summary:
Includes all of 1.0.4 and disable useReaction feature flag

- Features:
  * Implement frozen channel:
    * Disable edit/send message
    * Real time status change
  * Allow configuring params before operations through props:
    * ChannelList.onBeforeCreateChannel
    * ChannelSettings.onBeforeUpdateChannel
    * Channel.onBeforeSendUserMessage
    * Channel.onBeforeSendFileMessage
    * Channel.onBeforeUpdateUserMessage
  * Expose internal methods through sendBirdSelectors:
    * sendBirdSelectors.getSdk
    * sendBirdSelectors.getSendUserMessage
    * sendBirdSelectors.getSendFileMessage
    * sendBirdSelectors.getUpdateUserMessage
    * sendBirdSelectors.getDeleteMessage
    * sendBirdSelectors.getResendUserMessage
    * sendBirdSelectors.getResendFileMessage
    * sendBirdSelectors.getCreateChannel
    * sendBirdSelectors.getLeaveChannel

- Bug fixes:
  * Various stability fixes

- Dependency updates:
  * SDK version - 3.0.123

## 1.0.4(June 9, 2020)

- Features:
  * Implement frozen channel:
    * Disable edit/send message
    * Real time status change
  * Allow configuring params before operations through props:
    * ChannelList.onBeforeCreateChannel
    * ChannelSettings.onBeforeUpdateChannel
    * Channel.onBeforeSendUserMessage
    * Channel.onBeforeSendFileMessage
    * Channel.onBeforeUpdateUserMessage
  * Expose internal methods through sendBirdSelectors:
    * sendBirdSelectors.getSdk
    * sendBirdSelectors.getSendUserMessage
    * sendBirdSelectors.getSendFileMessage
    * sendBirdSelectors.getUpdateUserMessage
    * sendBirdSelectors.getDeleteMessage
    * sendBirdSelectors.getResendUserMessage
    * sendBirdSelectors.getResendFileMessage
    * sendBirdSelectors.getCreateChannel
    * sendBirdSelectors.getLeaveChannel

- Bug fixes:
  * Various stability fixes

- Dependency updates:
  * SDK version - 3.0.123

## 1.0.3(May 27, 2020)

- Bug fixes:
  * Option to delete messages that failed because of image moderation
  * Stability fix for resending failed messages
  * Minor visual fixes

## 1.0.2(May 12, 2020)

- Features:
  * Loglevels
  * Add user-agent to identify ui kit version
- Bug fixes:
  * Webpack break due to MomentJS update 2.24.xx
  * Duplicate messages are filtered on fetch
  * Fix double invocation of onChannelSelect
  * Various stability fixes
- Dependency updates:
  * SDK version - 3.0.122
  * MomentJS - 2.25.3

## 1.0.1(APR 16, 2020)

- Show default icon if avatar link is broken
- Show parent icon button when context menu is opened
- Show `(No Name)` when user has no nickname
- Do not update notification bar on admin messages
- Message will be send on `Enter` key, use `Shft + Enter` for newline
- Various internal stability improvements

## 1.0.0(APR 1, 2020)

- Official release of v1

## beta.3(APR 1, 2020)

- Branding fix - sendbird b -> B
