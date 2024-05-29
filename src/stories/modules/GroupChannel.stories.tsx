import React from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../../lib/Sendbird';
import GroupChannel from '../../modules/GroupChannel';
import { STORYBOOK_APP_ID, STORYBOOK_USER_ID, STORYBOOK_NICKNAME } from '../common/const';
import { getSampleChannel } from '../common/getSampleChannel';

const meta: Meta<typeof GroupChannel> = { 
  title: '1.Module/GroupChannel',
  component: GroupChannel,
  argTypes: {
    channelUrl: {
      control: 'text',
      description: 'The URL of the channel to display.',
      defaultValue: '',
    },
    isReactionEnabled: {
      control: 'boolean',
      description: 'Flag to enable or disable reactions.',
    },
    isMessageGroupingEnabled: {
      control: 'boolean',
      description: 'Flag to enable or disable message grouping.',
    },
    isMultipleFilesMessageEnabled: {
      control: 'boolean',
      description: 'Flag to enable or disable the feature of sending multiple files in one message.',
    },
    showSearchIcon: {
      control: 'boolean',
      description: 'Flag to show or hide the search icon.',
    },
    replyType: {
      control: 'radio',
      options: ['NONE', 'QUOTE_REPLY', 'THREAD'],
      description: 'The type of reply to use in the channel.',
    },
    threadReplySelectType: {
      control: 'radio',
      options: ['PARENT', 'THREAD'],
      description: 'The type of thread reply selection to use in the channel.',
    },
    disableUserProfile: {
      control: 'boolean',
      description: '',
    },
    // Disabled props
    disableMarkAsRead: { table: { disable: true } },
    scrollBehavior: { table: { disable: true } },
    startingPoint: { table: { disable: true } },

    // # User Profile
    onUserProfileMessage: { table: { disable: true } },

    // # Animations
    animatedMessageId: { table: { disable: true } },
    onMessageAnimated: { table: { disable: true } },

    // # Message Events
    onBeforeSendUserMessage: { table: { disable: true } },
    onBeforeSendFileMessage: { table: { disable: true } },
    onBeforeSendVoiceMessage: { table: { disable: true } },
    onBeforeSendMultipleFilesMessage: { table: { disable: true } },
    onBeforeUpdateUserMessage: { table: { disable: true } },
    onBeforeDownloadFileMessage: { table: { disable: true } },

    // # Message List
    messageListQueryParams: { table: { disable: true } },

    // # Click Events
    onBackClick: { table: { disable: true } },
    onSearchClick: { table: { disable: true } },
    onReplyInThreadClick: { table: { disable: true } },
    onChatHeaderActionClick: { table: { disable: true } },
    onQuoteMessageClick: { table: { disable: true } },

    // # Custom Render
    // ## User Profile
    renderUserProfile: { table: { disable: true } },
    // ## Mention
    renderUserMentionItem: { table: { disable: true } },
    // ## Message
    renderMessage: { table: { disable: true } },
    renderMessageContent: { table: { disable: true } },
    // ## Basics
    renderChannelHeader: { table: { disable: true } },
    renderCustomSeparator: { table: { disable: true } },
    renderTypingIndicator: { table: { disable: true } },
    renderFrozenNotification: { table: { disable: true } },
    renderSuggestedReplies: { table: { disable: true } },
    renderMessageList: { table: { disable: true } },
    // ## Message Input
    renderMessageInput: { table: { disable: true } },
    renderFileUploadIcon: { table: { disable: true } },
    renderSendMessageIcon: { table: { disable: true } },
    renderVoiceMessageIcon: { table: { disable: true } },
    // ## Place holder
    renderPlaceholderEmpty: { table: { disable: true } },
    renderPlaceholderInvalid: { table: { disable: true } },
    renderPlaceholderLoader: { table: { disable: true } },
  },
};
export default meta;

export const Default = (): React.ReactElement => {
  const channel = getSampleChannel({ appId: STORYBOOK_APP_ID, userId: STORYBOOK_USER_ID });

  return (
    <div style={{ height: 500 }}>
      <SendbirdProvider
        appId={STORYBOOK_APP_ID}
        userId={STORYBOOK_USER_ID}
        nickname={STORYBOOK_NICKNAME}
        breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
      >
        <GroupChannel
          {...{
            channelUrl: channel?.url ?? '',
            isReactionEnabled: true,
            isMessageGroupingEnabled: true,
            showSearchIcon: true,
            replyType: 'THREAD',
            isMultipleFilesMessageEnabled: true,
            disableUserProfile: false,
          }}
        />
      </SendbirdProvider>
    </div>
  );
};
