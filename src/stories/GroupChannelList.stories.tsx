import React from 'react';
import SendbirdProvider from '../lib/Sendbird';
import GroupChannelList from '../modules/GroupChannelList';

export default {
  title: 'Module/GroupChannelList',
  component: GroupChannelList,
  argTypes: {
    className: {
      control: 'text',
      description: 'CSS class name(s) for custom styling.',
    },
    selectedChannelUrl: {
      control: 'text',
      description: 'The URL of the initially selected channel.',
    },
    allowProfileEdit: {
      control: 'boolean',
      description: 'Allows editing of the user profile.',
      defaultValue: false,
    },
    disableAutoSelect: {
      control: 'boolean',
      description: 'Disables automatic selection of the first channel in the list.',
      defaultValue: false,
    },
    isTypingIndicatorEnabled: {
      control: 'boolean',
      description: 'Enables or disables the typing indicator.',
      defaultValue: true,
    },
    isMessageReceiptStatusEnabled: {
      control: 'boolean',
      description: 'Enables or disables message receipt status display.',
      defaultValue: true,
    },
    // Optional custom props
    channelListQueryParams: { table: { disable: true } },
    onThemeChange: { table: { disable: true } },
    onCreateChannelClick: { table: { disable: true } },
    onBeforeCreateChannel: { table: { disable: true } },
    onUserProfileUpdated: { table: { disable: true } },
  }
};

export const Default = (args): React.ReactElement => {
  return (
    <div style={{ height: 500 }}>
      <SendbirdProvider
        appId="FEA2129A-EA73-4EB9-9E0B-EC738E7EB768"
        userId="hoon20230802"
      >
        <GroupChannelList {...args} />
      </SendbirdProvider>
    </div>
  );
};

Default.args = {
  className: '',
  selectedChannelUrl: '',
  allowProfileEdit: false,
  disableAutoSelect: false,
  isTypingIndicatorEnabled: true,
  isMessageReceiptStatusEnabled: true,
};
