import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import { ThreadProvider } from '../context';
import { SendableMessageType } from '../../../utils';
import ThreadUI from '../components/ThreadUI';
import ThreadHeader from '../components/ThreadHeader';
import ParentMessageInfoItem from '../components/ParentMessageInfo/ParentMessageInfoItem';
import ThreadList from '../components/ThreadList';
import ThreadListItem from '../components/ThreadList/ThreadListItem';
import ThreadMessageInput from '../components/ThreadMessageInput';

describe('Thread Unit Tests', () => {
  const defaultProps = {
    channelUrl: 'test-channel',
    message: {
      messageId: 'test-message-id',
    } as unknown as SendableMessageType,
    parentMessage: {
      messageId: 'test-parent-message-id',
    },
  };

  it('renders ThreadUI with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ThreadUI />
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ThreadHeader with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ThreadHeader channelName="mockChannelName" />
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ParentMessageInfo with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ParentMessageInfoItem message={{
              messageId: 42,
            }}/>
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ThreadList with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ThreadList />
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ThreadListItem with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ThreadListItem message={{
              messageId: 42,
            }}/>
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders ThreadMessageInput with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <ThreadProvider {...defaultProps}>
            <ThreadMessageInput />
          </ThreadProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

});
