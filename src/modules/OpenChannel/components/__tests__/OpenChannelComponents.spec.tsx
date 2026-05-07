import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import OpenChannelMessage from '../OpenChannelMessage';
import OpenChannelMessageList from '../OpenChannelMessageList';
import OpenChannelHeader from '../OpenChannelHeader';
import OpenChannelInput from '../OpenChannelInput';
import OpenChannelUI from '../OpenChannelUI';
import { useOpenChannelContext } from '../../context/OpenChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization, LocalizationContext } from '../../../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../../../lib/MediaQueryContext';
import { useHandleOnScrollCallback } from '../../../../hooks/useHandleOnScrollCallback';

jest.mock('date-fns/format', () => () => 'open-date');
jest.mock('../../context/OpenChannelProvider', () => ({
  useOpenChannelContext: jest.fn(),
}));
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../lib/LocalizationContext', () => {
  const React = require('react');
  return {
    LocalizationContext: React.createContext({ stringSet: {} }),
    useLocalization: jest.fn(),
  };
});
jest.mock('../../../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: jest.fn(),
}));
jest.mock('../../../../hooks/useHandleOnScrollCallback', () => ({
  useHandleOnScrollCallback: jest.fn(),
}));
jest.mock('../../../../ui/MessageInput', () => {
  const React = require('react');
  return React.forwardRef((props: any, _ref: any) => React.createElement(
    'div',
    { 'data-testid': 'message-input' },
    React.createElement('div', { 'data-testid': 'placeholder' }, props.placeholder),
    React.createElement('button', { type: 'button', 'data-testid': 'send', onClick: () => props.onSendMessage({ message: 'hi' }) }, 'send'),
    React.createElement('button', { type: 'button', 'data-testid': 'file-upload', onClick: () => props.onFileUpload?.([new globalThis.File(['a'], 'a.txt')]) }, 'file'),
    React.createElement('button', { type: 'button', 'data-testid': 'update', onClick: () => props.onUpdateMessage?.({ messageId: props.message?.messageId, message: 'edited' }) }, 'update'),
    React.createElement('button', { type: 'button', 'data-testid': 'cancel-edit', onClick: props.onCancelEdit }, 'cancel'),
  ));
});
jest.mock('../../../../ui/DateSeparator', () => (props: any) => <div data-testid="date-separator">{props.children}</div>);
jest.mock('../../../../ui/OpenChannelAdminMessage', () => (props: any) => <div data-testid="admin-message">{props.message.message}</div>);
jest.mock('../../../../ui/OpenchannelUserMessage', () => (props: any) => (
  <div data-testid="user-message">
    <button type="button" data-testid="edit-user" onClick={() => props.showEdit(true)}>edit</button>
    <button type="button" data-testid="remove-user" onClick={() => props.showRemove(true)}>remove</button>
    {props.message.message}
  </div>
));
jest.mock('../../../../ui/OpenchannelOGMessage', () => (props: any) => (
  <button type="button" data-testid="og-message" onClick={() => props.showEdit(true)}>{props.message.message}</button>
));
jest.mock('../../../../ui/OpenchannelFileMessage', () => (props: any) => (
  <button type="button" data-testid="file-message" onClick={() => props.showRemove(true)}>{props.message.name}</button>
));
jest.mock('../../../../ui/OpenchannelThumbnailMessage', () => (props: any) => (
  <button type="button" data-testid="thumbnail-message" onClick={() => props.onClick(true)}>{props.message.name}</button>
));
jest.mock('../OpenChannelMessage/RemoveMessageModal', () => (props: any) => (
  <div data-testid="remove-modal">
    <button type="button" data-testid="delete-message" onClick={props.onDeleteMessage}>delete</button>
    <button type="button" data-testid="close-remove" onClick={props.onCloseModal}>close</button>
  </div>
));
jest.mock('../../../../ui/FileViewer', () => (props: any) => (
  <div data-testid="file-viewer">
    <button type="button" data-testid="delete-file" onClick={props.onDelete}>delete</button>
    <button type="button" data-testid="close-file" onClick={props.onClose}>close</button>
  </div>
));
jest.mock('../../../Message/context/MessageProvider', () => ({
  MessageProvider: (props: any) => <div data-testid="message-provider">{props.children}</div>,
}));
jest.mock('../OpenChannelMessage', () => jest.requireActual('../OpenChannelMessage').default);
jest.mock('../FrozenChannelNotification', () => () => <div data-testid="frozen">frozen</div>);
jest.mock('../OpenChannelHeader', () => jest.requireActual('../OpenChannelHeader').default);
jest.mock('../OpenChannelInput', () => jest.requireActual('../OpenChannelInput').default);

const stringSet = {
  DATE_FORMAT__MESSAGE_LIST__DATE_SEPARATOR: 'PP',
  OPEN_CHANNEL_CONVERSATION__TITLE_PARTICIPANTS: 'participants',
  NO_TITLE: 'No title',
  CHANNEL_FROZEN: 'Frozen',
  MESSAGE_INPUT__PLACE_HOLDER__MUTED: 'Muted',
  MESSAGE_INPUT__PLACE_HOLDER__DISABLED: 'Disabled',
};

const currentOpenChannel = {
  url: 'open-url',
  name: 'Open channel',
  coverUrl: 'cover.png',
  participantCount: 1200,
  isFrozen: false,
  isEphemeral: false,
  isOperator: jest.fn(() => true),
};
const context = {
  currentOpenChannel,
  deleteMessage: jest.fn(),
  updateMessage: jest.fn(),
  resendMessage: jest.fn(),
  handleSendMessage: jest.fn(),
  handleFileUpload: jest.fn(),
  disabled: false,
  amIMuted: false,
  amIBanned: false,
  loading: false,
  isInvalid: false,
  allMessages: [],
  hasMore: false,
  onScroll: jest.fn(),
  isMessageGroupingEnabled: true,
  messageInputRef: { current: null },
  conversationScrollRef: { current: null },
  amIOperator: true,
  onChatHeaderActionClick: jest.fn(),
  onBackClick: jest.fn(),
};

const setup = (overrides = {}) => {
  jest.clearAllMocks();
  (useOpenChannelContext as jest.Mock).mockReturnValue({ ...context, ...overrides });
  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        userId: 'me',
        openChannel: { enableOgtag: true },
      },
    },
  });
  (useLocalization as jest.Mock).mockReturnValue({ stringSet });
  (useMediaQueryContext as jest.Mock).mockReturnValue({ isMobile: false });
  (useHandleOnScrollCallback as jest.Mock).mockImplementation(({ setShowScrollDownButton }) => () => setShowScrollDownButton(true));
};

describe('OpenChannel legacy components', () => {
  beforeEach(() => {
    setup();
  });

  it('renders custom message, admin, user edit/remove, og edit, and file viewer branches', () => {
    const { rerender } = render(
      <OpenChannelMessage
        message={{ messageId: 1, messageType: 'user', message: 'custom' } as any}
        renderMessage={({ message }) => <div data-testid="custom-message">{message.messageId}</div>}
      />,
    );
    expect(screen.getByTestId('custom-message')).toHaveTextContent('1');

    rerender(<OpenChannelMessage message={{ messageId: 2, messageType: 'admin', message: 'admin', createdAt: 2, isAdminMessage: () => true } as any} hasSeparator />);
    expect(screen.getByTestId('date-separator')).toHaveTextContent('open-date');
    expect(screen.getByTestId('admin-message')).toHaveTextContent('admin');

    rerender(<OpenChannelMessage message={{ messageId: 3, messageType: 'user', message: 'plain', sender: { userId: 'me' }, ogMetaData: { url: 'https://sendbird.com' } } as any} />);
    fireEvent.click(screen.getByTestId('og-message'));
    fireEvent.click(screen.getByTestId('update'));
    expect(context.updateMessage).toHaveBeenCalledWith(3, 'edited');

    rerender(<OpenChannelMessage message={{ messageId: 4, messageType: 'user', message: 'plain', sender: { userId: 'other' }, ogMetaData: null } as any} />);
    fireEvent.click(screen.getByTestId('user-message').querySelector('[data-testid="remove-user"]') as Element);
    fireEvent.click(screen.getByTestId('delete-message'));
    expect(context.deleteMessage).toHaveBeenCalledWith(expect.objectContaining({ messageId: 4 }));
    fireEvent.click(screen.getByTestId('close-remove'));

    rerender(<OpenChannelMessage message={{ messageId: 5, messageType: 'file', name: 'image.png', type: 'image/png', sender: { userId: 'me' } } as any} />);
    fireEvent.click(screen.getByTestId('thumbnail-message'));
    fireEvent.click(screen.getByTestId('delete-file'));
    expect(context.deleteMessage).toHaveBeenCalledWith(expect.objectContaining({ messageId: 5 }));
  });

  it('renders message list empty and populated states plus scroll button', () => {
    const { rerender, container } = render(<OpenChannelMessageList renderPlaceHolderEmptyList={() => <div>empty</div>} />);
    expect(screen.getByText('empty')).toBeInTheDocument();

    const scrollTo = jest.fn();
    setup({
      allMessages: [
        { messageId: 1, createdAt: 1, messageType: 'admin', message: 'admin' },
        { messageId: 2, createdAt: 2, messageType: 'user', message: 'hi', sender: { userId: 'me' } },
      ],
    });
    rerender(<OpenChannelMessageList />);
    const scrollContainer = container.querySelector('.sendbird-openchannel-conversation-scroll__container__item-container') as HTMLDivElement;
    scrollContainer.scrollTo = scrollTo;
    Object.defineProperty(scrollContainer, 'scrollHeight', { configurable: true, value: 300 });
    fireEvent.scroll(scrollContainer);
    fireEvent.click(container.querySelector('.sendbird-openchannel-conversation-scroll__container__scroll-bottom-button') as Element);
    expect(scrollTo).toHaveBeenCalledWith(0, 300);
  });

  it('renders header, input placeholders, and OpenChannelUI states', () => {
    render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelHeader />
      </LocalizationContext.Provider>,
    );
    expect(screen.getByText('Open channel')).toBeInTheDocument();
    expect(screen.getByText('1.2K participants')).toBeInTheDocument();
    fireEvent.click(document.querySelector('.sendbird-openchannel-conversation-header__right__trigger') as Element);
    expect(context.onChatHeaderActionClick).toHaveBeenCalled();

    const { rerender } = render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelInput />
      </LocalizationContext.Provider>,
    );
    fireEvent.click(screen.getByTestId('send'));
    fireEvent.click(screen.getByTestId('file-upload'));
    expect(context.handleSendMessage).toHaveBeenCalledWith({ message: 'hi' });
    expect(context.handleFileUpload).toHaveBeenCalled();

    setup({ amIMuted: true });
    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelInput />
      </LocalizationContext.Provider>,
    );
    expect(screen.getByTestId('placeholder')).toHaveTextContent('Muted');

    setup({ currentOpenChannel: null });
    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <OpenChannelInput />
      </LocalizationContext.Provider>,
    );
    expect(screen.queryByTestId('message-input')).toBeNull();

    setup({ currentOpenChannel: { ...currentOpenChannel, isFrozen: true } });
    rerender(<OpenChannelUI renderHeader={() => <div>header</div>} renderMessageInput={() => <div>input</div>} />);
    expect(screen.getByText('header')).toBeInTheDocument();
    expect(screen.getByTestId('frozen')).toBeInTheDocument();
    expect(screen.getByText('input')).toBeInTheDocument();

    setup({ currentOpenChannel: null });
    rerender(<OpenChannelUI renderPlaceHolderError={() => <div>error</div>} />);
    expect(screen.getByText('error')).toBeInTheDocument();
    setup({ loading: true });
    rerender(<OpenChannelUI renderPlaceHolderLoading={() => <div>loading</div>} />);
    expect(screen.getByText('loading')).toBeInTheDocument();
    setup({ isInvalid: true });
    rerender(<OpenChannelUI renderPlaceHolderError={() => <div>invalid</div>} />);
    expect(screen.getByText('invalid')).toBeInTheDocument();
  });
});
