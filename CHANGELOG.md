# Changelog - v3

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
