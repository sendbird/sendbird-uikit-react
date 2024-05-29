import React, { useState } from 'react';
import type { Meta } from '@storybook/react';

import SendbirdProvider from '../../lib/Sendbird';
import MessageSearch from '../../modules/MessageSearch';
import { STORYBOOK_APP_ID, STORYBOOK_USER_ID } from '../common/const';
import { getSampleChannel } from '../common/getSampleChannel';
import { useAsyncEffect } from '@sendbird/uikit-tools';

const meta: Meta<typeof MessageSearch> = {
  title: '1.Module/MessageSearch',
  component: MessageSearch,
  argTypes: {
    channelUrl: {
      control: 'text',
      description: 'The URL of the channel to display.',
      defaultValue: '',
    },
    searchString: {
      control: 'text',
      description: 'The property for inputting the text or file name I want to search.',
      defaultValue: '',
    },
    onResultLoaded: {
      type: 'function',
      description: 'This callback function is triggered when the search result is fetched.',
      control: 'select',
      defaultValue: (messages, error) => console.log(`The messages are fetched ${messages}`),
      options: [
        (messages, error) => console.log(`The messages are fetched ${messages}`),
        (messages, error) => alert(`The messages are fetched ${messages}`),
      ],
    },
    onResultClick: {
      type: 'function',
      description: 'This callback function is triggered when the search result item is clicked.',
      control: 'select',
      defaultValue: (message) => console.log(`The message ${message.id} is clicked.`),
      options: [
        (message) => console.log(`The message ${message.id} is clicked.`),
        (message) => alert(`The message ${message.id} is clicked.`),
      ],
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
    messageSearchQuery: { table: { disable: true } },
    // Optional custom render props
    renderPlaceHolderError: { table: { disable: true } },
    renderPlaceHolderLoading: { table: { disable: true } },
    renderPlaceHolderNoString: { table: { disable: true } },
    renderPlaceHolderEmptyList: { table: { disable: true } },
    renderSearchItem: { table: { disable: true } },
  },
};
export default meta;

export const Default = (): React.ReactElement => {
  const [channelUrl, setChannelUrl] = useState('');
  useAsyncEffect(async () => {
    const channel = await getSampleChannel({ appId: STORYBOOK_APP_ID, userId: STORYBOOK_USER_ID });
    setChannelUrl(channel.url);
  }, []);

  return (
    <div style={{ height: 520 }}>
      <SendbirdProvider
        appId={STORYBOOK_APP_ID}
        userId={STORYBOOK_USER_ID}
        breakpoint={/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)}
      >
        <MessageSearch channelUrl={channelUrl} />
      </SendbirdProvider>
    </div>
  );
};
