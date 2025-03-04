import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MessageList from '../components/MessageList';
import { GroupChannelProvider } from '../context';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';

describe('MessageList Unit Tests', () => {
  const defaultProps = {
    channelUrl: 'test-channel',
  };

  it('renders MessageList with default value', () => {
    render(
      <SendbirdProvider appId="mockAppId" userId="mockUserId">
        <GroupChannelProvider {...defaultProps}>
          <MessageList />
        </GroupChannelProvider>,
      </SendbirdProvider>,
    );
  });
});
