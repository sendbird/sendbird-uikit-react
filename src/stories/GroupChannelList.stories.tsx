import React from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../lib/Sendbird';
import GroupChannelList from '../modules/GroupChannelList';

const meta: Meta<typeof GroupChannelList> = {
  title: '1.Module/GroupChannelList',
  component: GroupChannelList,
  argTypes: {
    onChannelSelect: {
      type: 'function',
      description: 'This callback function is triggered when a channel is selected by the user interaction or automatic selection.',
    },
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
export default meta;

export const Default = (args): React.ReactElement => {
  return (
    <div style={{ height: 520 }}>
      <SendbirdProvider
        appId="FEA2129A-EA73-4EB9-9E0B-EC738E7EB768"
        userId="hoon20230802"
        breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
      >
        <GroupChannelList
          {...args}
          onChannelSelect={(channel) => {
            alert(`The channel ${channel?.name} is selected.`);
            console.log(`The channel ${channel?.name} is selected.`);
          }}
        />
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
