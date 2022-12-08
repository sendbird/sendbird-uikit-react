# Changelog - v3

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
