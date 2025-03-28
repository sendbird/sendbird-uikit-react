import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MessageList from '../components/MessageList';
import { GroupChannelProvider } from '../context';
import SendbirdProvider from '../../../lib/Sendbird/context/SendbirdProvider';
import GroupChannelHeader from '../components/GroupChannelHeader';
import GroupChannelUI from '../components/GroupChannelUI';
import FileViewer from '../components/FileViewer';
import { FileMessage } from '@sendbird/chat/message';
import FrozenNotification from '../components/FrozenNotification';
import Message from '../components/Message';
import { EveryMessage } from '../../../types';
import RemoveMessageModal from '../components/RemoveMessageModal';
import TypingIndicator from '../components/TypingIndicator';
import UnreadCount from '../components/UnreadCount';
import SuggestedMentionList from '../components/SuggestedMentionList';
import SuggestedReplies from '../components/SuggestedReplies';

// Mock createPortal function to render content directly without portal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node) => node,
}));

describe('GroupChannel Unit Tests', () => {
  const defaultProps = {
    channelUrl: 'test-channel',
  };

  it('renders GroupChannelUI with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <GroupChannelUI />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders GroupChannelHeader with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <GroupChannelHeader />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders FileViewer with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <FileViewer
              onCancel={() => jest.fn()}
              message={
                {
                  sender: { role: 'none' },
                  messageParams: {
                    message: 'mockTestMessage',
                  },
                } as FileMessage
              }
            />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders FrozenNotification with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <FrozenNotification />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders Message with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <Message
              message={
                {
                  sender: { role: 'none' },
                  messageParams: {
                    message: 'mockTestMessage',
                  },
                } as unknown as EveryMessage
              }
            />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders MessageList with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <MessageList />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders RemoveMessageModal with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <RemoveMessageModal
              onCancel={() => jest.fn()}
              message={
                {
                  sender: { role: 'none' },
                  messageParams: {
                    message: 'mockTestMessage',
                  },
                } as any
              }
            />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders TypingIndicator with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <TypingIndicator channelUrl={'mockChannelUrl'}/>
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders UnreadCount with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <UnreadCount count={0} onClick={() => jest.fn()}/>
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders SuggestedMentionsList with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <SuggestedMentionList
              currentChannel={{
                members: [],
              } as any}
              targetNickname={'mockNickname'}
              ableAddMention={true}
            />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

  it('renders SuggestedMentionsList with default value', () => {
    expect(() => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            <SuggestedReplies
              replyOptions={['testSupplyOption']}
              onSendMessage={() => jest.fn()}
            />
          </GroupChannelProvider>,
        </SendbirdProvider>,
      );
    }).not.toThrow();
  });

});
