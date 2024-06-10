import React from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../../lib/Sendbird';
import ChannelSettings from '../../modules/ChannelSettings';
import { STORYBOOK_APP_ID, STORYBOOK_USER_ID, STORYBOOK_NICKNAME } from '../common/const';
import { useSampleChannel } from '../common/useSampleChannel';

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

export const Default = (): React.ReactElement => {
  const channel = useSampleChannel();

  return (
    <div style={{ height: 500 }}>
      <SendbirdProvider
        appId={STORYBOOK_APP_ID}
        userId={STORYBOOK_USER_ID}
        nickname={STORYBOOK_NICKNAME}
        breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
      >
        <ChannelSettings
          channelUrl={channel?.url ?? ''}
          disableUserProfile={false}
        />
      </SendbirdProvider>
    </div>
  );
};
