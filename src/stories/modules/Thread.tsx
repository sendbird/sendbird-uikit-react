import React from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../../lib/Sendbird';
import Thread from '../../modules/Thread';

const meta: Meta<typeof Thread> = {
  title: '1.Module/Thread',
  component: Thread,
  argTypes: {
    channelUrl: {
      control: 'text',
      description: 'The URL of the channel to display.',
      defaultValue: '',
    },
  },
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
        <Thread {...args} />
      </SendbirdProvider>
    </div>
  );
};

Default.args = {
  channelUrl: "sendbird_group_channel_316207824_6a62239b0cb650a6feae8466701ffdd9890989f5",
  message: {
    id: 'su-ecf6bb7d-9c71-40bb-8135-67eae30c03f9',
  }
};
