import React, { ReactElement } from "react";
import type { Meta } from "@storybook/react"

import App from '../../modules/App';

const meta: Meta<typeof App> = {
  title: '0.Get Started/Group Channel App',
  component: App,
  argTypes: {
    appId: {
      type: 'string',
      control: 'text',
      description: 'Enter the app ID for which app you want to use.',
    },
    userId: {
      type: 'string',
      control: 'text',
      description: 'Enter the user ID to use.',
    },
    breakpoint: {
      type: 'boolean',
      description: 'A property that determines whether to show it with a layout that fits the mobile screen. Or you can put the width size with `px`.',
      control: 'select',
      options: [
        true,
        false,
        '500px',
        '1000px',
        'Use user agent',
      ],
    },
    theme: {
      type: 'string',
      description: 'A property that sets the overall color theme. We have `light` and `dark` as a default.',
      control: 'radio',
      options: [
        'light',
        'dark',
      ],
    },
    nickname: {
      type: 'string',
      description: 'A property to set the username for use. If not set, it automatically uses the most recently used username.',
      control: 'text',
    },
    profileUrl: {
      type: 'string',
      description: 'A property to set the user\'s profile image. If not set, it automatically uses the most recently used profile image.',
      control: 'text',
    },
    isReactionEnabled: {
      type: 'boolean',
      description: 'A property determining whether to enable emoji reactions. Users cannot view existing reactions on messages and add new reactions if this property is disabled.',
      control: 'boolean',
    },
    isMentionEnabled: {
      type: 'boolean',
      description: 'A property determining whether to enable mentioning of members currently joined in the channel when sending a text message. When activated, a member list that can be mentioned will appear when typing \'@\' in the message input.',
      control: 'boolean',
    },
    isVoiceMessageEnabled: {
      type: 'boolean',
      description: 'A property determining whether to allow sending voice messages. Even when disabled, previously sent voice messages remain visible in the channel; only sending from the message input is prohibited.',
      control: 'boolean',
    },
    replyType: {
      type: 'string',
      description: `A property determining which message reply mode to use. Selecting 'NONE' disables the reply feature, and previously sent replies cannot be viewed. In 'QUOTE_REPLY' mode, only one reply per message is allowed. Choosing 'THREAD' displays a Thread pane on the right side where multiple replies can be attached to a single message.`,
      control: 'radio',
      options: [
        'NONE',
        'QUOTE_REPLY',
        'THREAD',
      ],
    },
    isMultipleFilesMessageEnabled: {
      type: 'boolean',
      description: 'A property determines whether to enable the multi-files messaging feature, allowing users to select and send multiple image files in one message. If disabled, users can still view previously sent multi-files messages but cannot send new ones.',
      control: 'boolean',
    },
    allowProfileEdit: {
      type: 'boolean',
      description: 'A property enables users to edit their profiles by clicking on their user profiles in the channel list header.',
      control: 'boolean',
    },
    disableUserProfile: {
      type: 'boolean',
      description: 'A property determines whether to display the profile of the user when clicked on their user profile.',
      control: 'boolean',
    },
    showSearchIcon: {
      type: 'boolean',
      description: 'A property determines whether to display the magnifying glass icon in the channel header, which is used to enable the message search functionality. It can be used when disabling the message search feature.',
      control: 'boolean',
    },
    isTypingIndicatorEnabledOnChannelList: {
      type: 'boolean',
      description: 'A property determines whether to display the typing indicator, typically shown at the bottom of the message input in a channel, also in the channel list.',
      control: 'boolean',
    },
    isMessageReceiptStatusEnabledOnChannelList: {
      type: 'boolean',
      description: 'A property that determines whether to display message status in the channel list. Message status can only be checked if the last message in the channel is sent by the user.',
      control: 'boolean',
    },
    isMessageGroupingEnabled: {
      type: 'boolean',
      description: 'A property that determines whether to enable message grouping in the channel. Messages sent by the same sender within a one-minute interval are grouped together. Grouped messages have only one message status.',
      control: 'boolean',
    },
    disableAutoSelect: {
      type: 'boolean',
      description: 'A property that determines whether to automatically select another channel when the currently selected channel is deleted, or the user exits the channel, causing it to be deselected in the channel list.',
      control: 'boolean',
    },

    disableMarkAsDelivered: { table: { disable: true } },
    accessToken: { table: { disable: true } },
    customApiHost: { table: { disable: true } },
    customWebSocketHost: { table: { disable: true } },
    userListQuery: { table: { disable: true } },
    dateLocale: { table: { disable: true } },
    config: { table: { disable: true } },
    voiceRecord: { table: { disable: true } },
    colorSet: { table: { disable: true } },
    stringSet: { table: { disable: true } },
    renderUserProfile: { table: { disable: true } },
    imageCompression: { table: { disable: true } },
    uikitOptions: { table: { disable: true } },
    isUserIdUsedForNickname: { table: { disable: true } },
    sdkInitParams: { table: { disable: true } },
    customExtensionParams: { table: { disable: true } },
    eventHandlers: { table: { disable: true } },
    onProfileEditSuccess: { table: { disable: true } },
    enableLegacyChannelModules: { table: { disable: true } },
  },
};
export default meta;

export const Default = (args): ReactElement => {
  return (
    <div style={{ height: '100vh' }}>
      <App
        {...args}
        breakpoint={args.breakpoint === 'Use user agent' ? /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) : args.breakpoint}
      />
    </div>
  );
};
Default.args = {
  appId: 'FEA2129A-EA73-4EB9-9E0B-EC738E7EB768',
  userId: 'hoon20230802',
  nickname: 'hoon hi',
  breakpoint: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  theme: 'light',
  isReactionEnabled: true,
  isMentionEnabled: true,
  isVoiceMessageEnabled: true,
  replyType: 'THREAD',
  isMultipleFilesMessageEnabled: true,
  allowProfileEdit: true,
  disableUserProfile: false,
  showSearchIcon: true,
  isTypingIndicatorEnabledOnChannelList: true,
  isMessageReceiptStatusEnabledOnChannelList: true,
  isMessageGroupingEnabled: true,
  disableAutoSelect: false,
};
