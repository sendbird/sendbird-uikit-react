import React from 'react';
import { act, render } from '@testing-library/react';
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

jest.mock('../../../lib/Sendbird/context/SendbirdProvider', () => jest.requireActual('../../../../__mocks__/mockSendbirdProvider'));

describe('GroupChannel Unit Tests', () => {
  const defaultProps = {
    channelUrl: 'test-channel',
  };

  const renderWithGroupChannelProvider = async (children: React.ReactElement) => {
    await act(async () => {
      render(
        <SendbirdProvider appId="mockAppId" userId="mockUserId">
          <GroupChannelProvider {...defaultProps}>
            {children}
          </GroupChannelProvider>
        </SendbirdProvider>,
      );
      await Promise.resolve();
    });
  };

  it('renders GroupChannelUI with default value', async () => {
    await renderWithGroupChannelProvider(<GroupChannelUI />);
  });

  it('renders GroupChannelHeader with default value', async () => {
    await renderWithGroupChannelProvider(<GroupChannelHeader />);
  });

  it('renders FileViewer with default value', async () => {
    await renderWithGroupChannelProvider(
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
      />,
    );
  });

  it('renders FrozenNotification with default value', async () => {
    await renderWithGroupChannelProvider(<FrozenNotification />);
  });

  it('renders Message with default value', async () => {
    await renderWithGroupChannelProvider(
      <Message
        message={
          {
            sender: { role: 'none' },
            messageParams: {
              message: 'mockTestMessage',
            },
          } as unknown as EveryMessage
        }
      />,
    );
  });

  it('renders MessageList with default value', async () => {
    await renderWithGroupChannelProvider(<MessageList />);
  });

  it('renders RemoveMessageModal with default value', async () => {
    await renderWithGroupChannelProvider(
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
      />,
    );
  });

  it('renders TypingIndicator with default value', async () => {
    await renderWithGroupChannelProvider(<TypingIndicator channelUrl={'mockChannelUrl'}/>);
  });

  it('renders UnreadCount with default value', async () => {
    await renderWithGroupChannelProvider(<UnreadCount count={0} onClick={() => jest.fn()}/>);
  });

  it('renders SuggestedMentionsList with default value', async () => {
    await renderWithGroupChannelProvider(
      <SuggestedMentionList
        currentChannel={{
          members: [],
        } as any}
        targetNickname={'mockNickname'}
        ableAddMention={true}
      />,
    );
  });

  it('renders SuggestedReplies with default value', async () => {
    await renderWithGroupChannelProvider(
      <SuggestedReplies
        replyOptions={['testSupplyOption']}
        onSendMessage={() => jest.fn()}
      />,
    );
  });

});
