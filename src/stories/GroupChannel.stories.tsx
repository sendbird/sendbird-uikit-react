// Channel.stories.js
import React from 'react';
import SendbirdProvider from '../lib/Sendbird';
import GroupChannel from '../modules/GroupChannel';

export default { 
  title: 'Module/GroupChannel',
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
      control: 'select',
      options: ['NONE', 'QUOTE_REPLY', 'THREAD'],
      description: 'The type of reply to use in the channel.',
    },
    threadReplySelectType: {
      control: 'select',
      options: ['PARENT', 'THREAD'],
      description: 'The type of thread reply selection to use in the channel.',
    },
    // disableUserProfile: { table: { disable: true } },
    // disableMarkAsRead: { table: { disable: true } },
    // scrollBehavior: { table: { disable: true } },
    // startingPoint: { table: { disable: true } },
    // animatedMessageId: { table: { disable: true } },
    // onMessageAnimated: { table: { disable: true } },
    // messageListQueryParams: { table: { disable: true } },
    // onBeforeSendUserMessage: { table: { disable: true } },
    // onBeforeSendFileMessage: { table: { disable: true } },
    // onBeforeSendVoiceMessage: { table: { disable: true } },
    // onBeforeSendMultipleFilesMessage: { table: { disable: true } },
    // onBeforeUpdateUserMessage: { table: { disable: true } },
    // onBackClick: { table: { disable: true } },
    // onChatHeaderActionClick: { table: { disable: true } },
    // onReplyInThreadClick: { table: { disable: true } },
    // onSearchClick: { table: { disable: true } },
    // onQuoteMessageClick: { table: { disable: true } },
    // renderUserProfile: { table: { disable: true } },
    // renderUserMentionItem: { table: { disable: true } },
  },
};

export const Default = (args): React.ReactElement => {
  return (
    <div style={{ height: 500 }}>
      <SendbirdProvider
        appId="FEA2129A-EA73-4EB9-9E0B-EC738E7EB768"
        // appId="2D7B4CDB-932F-4082-9B09-A1153792DC8D"
        userId="hoon20230802"
      >
        <GroupChannel
          {...args}
        />
      </SendbirdProvider>
    </div>
  );
};
Default.args = {
  channelUrl: "sendbird_group_channel_316207824_6a62239b0cb650a6feae8466701ffdd9890989f5",
  isReactionEnabled: true,
  isMessageGroupingEnabled: true,
  showSearchIcon: true,
  replyType: 'THREAD',
  threadReplySelectType: 'THREAD',
};
