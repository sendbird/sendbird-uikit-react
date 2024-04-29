import React from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../../lib/Sendbird';
import ChannelSettings from '../../modules/ChannelSettings';

const meta: Meta<typeof ChannelSettings> = {
  title: '1.Module/ChannelSettings',
  component: ChannelSettings,
  argTypes: {
    channelUrl: {
      control: 'text',
      description: 'The URL of the channel to display.',
      defaultValue: '',
    },
    className: {
      control: 'text',
      description: 'An additional property that allows you to set a custom class name if desired.',
      defaultValue: '',
    },
    onCloseClick: {
      type: 'function',
      description: 'This callback function is triggered when user clicks the close button.',
      control: 'select',
      defaultValue: () => console.log(`The close button is clicked.`),
      options: [
        () => console.log(`The close button is clicked.`),
        () => alert(`The close button is clicked.`),
      ],
    },
    onLeaveChannel: {
      type: 'function',
      description: 'This callback function is triggered when user leaves the current channel.',
      control: 'select',
      defaultValue: () => console.log(`The user left the channel.`),
      options: [
        () => console.log(`The user left the channel.`),
        () => alert(`The user left the channel.`),
      ],
    },
    onChannelModified: {
      type: 'function',
      description: 'This callback function is triggered when user update the channel information.',
      control: 'select',
      defaultValue: (channel) => console.log(`The channel has been updated: ${channel}`),
      options: [
        (channel) => console.log(`The channel has been updated: ${channel}`),
        (channel) => alert(`The channel has been updated: ${channel}`),
      ],
    },
    onBeforeUpdateChannel: {
      type: 'function',
      description: 'This callback function can receive information such as `currentTitle`, `currentImg`, and `data`, before updating the channel. After performing any arbitrary preprocessing, it should return `GroupChannelUpdateParams`.',
    },
    disableUserProfile: {
      type: 'boolean',
      control: 'boolean',
      description: 'Prevent displaying user profiles that have appeared from avatars.',
      defaultValue: false,
    },
    queries: { table: { disable: true } },
    overrideInviteUser: { table: { disable: true } },
    // Custom render props
    renderUserProfile: { table: { disable: true } },
    renderHeader: { table: { disable: true } },
    renderChannelProfile: { table: { disable: true } },
    renderModerationPanel: { table: { disable: true } },
    renderLeaveChannel: { table: { disable: true } },
    renderPlaceholderError: { table: { disable: true } },
    renderPlaceholderLoading: { table: { disable: true } },
  },
};
export default meta;

export const Default = (args): React.ReactElement => {
  return (
    <div style={{ height: 500 }}>
      <SendbirdProvider
        appId="FEA2129A-EA73-4EB9-9E0B-EC738E7EB768"
        userId="hoon20230802"
        breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
      >
        <ChannelSettings
          {...args}
        />
      </SendbirdProvider>
    </div>
  );
};
Default.args = {
  channelUrl: "sendbird_group_channel_316207824_6a62239b0cb650a6feae8466701ffdd9890989f5",
  disableUserProfile: false,
};
