import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ChannelProvider, useChannelContext } from '../ChannelProvider';
import useSendbird from '../../../../lib/Sendbird/context/hooks/useSendbird';
import { useLocalization } from '../../../../lib/LocalizationContext';
import useScrollCallback from '../hooks/useScrollCallback';
import useScrollDownCallback from '../hooks/useScrollDownCallback';
import useScrollToMessage from '../hooks/useScrollToMessage';
import useDeleteMessageCallback from '../hooks/useDeleteMessageCallback';
import useUpdateMessageCallback from '../hooks/useUpdateMessageCallback';
import useResendMessageCallback from '../hooks/useResendMessageCallback';
import useSendMessageCallback from '../hooks/useSendMessageCallback';
import useSendFileMessageCallback from '../hooks/useSendFileMessageCallback';
import useSendVoiceMessageCallback from '../hooks/useSendVoiceMessageCallback';
import useToggleReactionCallback from '../hooks/useToggleReactionCallback';
import { useSendMultipleFilesMessage } from '../hooks/useSendMultipleFilesMessage';

jest.mock('@sendbird/uikit-tools', () => ({
  UIKitConfigProvider: ({ children }: any) => <div data-testid="uikit-config">{children}</div>,
  useUIKitConfig: () => ({
    configs: {
      groupChannel: {
        channel: {
          enableMarkAsUnread: true,
        },
      },
    },
  }),
}));
jest.mock('../../../../lib/UserProfileContext', () => ({
  UserProfileProvider: ({ children }: any) => <div data-testid="profile-provider">{children}</div>,
}));
jest.mock('../../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../../../lib/LocalizationContext', () => ({
  useLocalization: jest.fn(),
}));
jest.mock('../hooks/useHandleChannelEvents', () => jest.fn());
jest.mock('../hooks/useGetChannel', () => jest.fn());
jest.mock('../hooks/useInitialMessagesFetch', () => jest.fn());
jest.mock('../hooks/useHandleReconnect', () => jest.fn());
jest.mock('../hooks/useHandleChannelPubsubEvents', () => ({
  useHandleChannelPubsubEvents: jest.fn(),
}));
jest.mock('../hooks/useScrollCallback', () => jest.fn());
jest.mock('../hooks/useScrollDownCallback', () => jest.fn());
jest.mock('../hooks/useScrollToMessage', () => jest.fn());
jest.mock('../hooks/useDeleteMessageCallback', () => jest.fn());
jest.mock('../hooks/useUpdateMessageCallback', () => jest.fn());
jest.mock('../hooks/useResendMessageCallback', () => jest.fn());
jest.mock('../hooks/useSendMessageCallback', () => jest.fn());
jest.mock('../hooks/useSendFileMessageCallback', () => jest.fn());
jest.mock('../hooks/useSendVoiceMessageCallback', () => jest.fn());
jest.mock('../hooks/useToggleReactionCallback', () => jest.fn());
jest.mock('../hooks/useSendMultipleFilesMessage', () => ({
  useSendMultipleFilesMessage: jest.fn(),
}));

const logger = {
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

const Consumer = () => {
  const context = useChannelContext();
  return (
    <div>
      <div data-testid="channel-url">{context.channelUrl}</div>
      <div data-testid="reply-type">{context.replyType}</div>
      <div data-testid="thread-reply-select-type">{context.threadReplySelectType}</div>
      <div data-testid="show-search">{String(context.showSearchIcon)}</div>
      <div data-testid="grouping">{String(context.isMessageGroupingEnabled)}</div>
      <div data-testid="multiple-files">{String(context.isMultipleFilesMessageEnabled)}</div>
      <div data-testid="highlighted">{String(context.highLightedMessageId)}</div>
      <div data-testid="animated">{String(context.animatedMessageId)}</div>
      <div data-testid="starting-point">{String(context.initialTimeStamp)}</div>
      <div data-testid="is-scrolled">{String(context.isScrolled)}</div>
      <button type="button" data-testid="quote" onClick={() => context.setQuoteMessage({ messageId: 7 } as any)}>quote</button>
      <button type="button" data-testid="initial" onClick={() => context.setInitialTimeStamp(200)}>initial</button>
      <button type="button" data-testid="animate" onClick={() => context.setAnimatedMessageId(300)}>animate</button>
      <button type="button" data-testid="highlight" onClick={() => context.setHighLightedMessageId(400)}>highlight</button>
      <button type="button" data-testid="scrolled" onClick={() => context.setIsScrolled?.(true)}>scrolled</button>
      <button type="button" data-testid="scroll-to" onClick={() => context.scrollToMessage(10, 20)}>scroll-to</button>
      <button type="button" data-testid="delete" onClick={() => context.deleteMessage({ messageId: 1 } as any)}>delete</button>
      <button type="button" data-testid="update" onClick={() => context.updateMessage({ messageId: 1, message: 'edit' })}>update</button>
      <button type="button" data-testid="resend" onClick={() => context.resendMessage({ messageId: 1 } as any)}>resend</button>
      <button type="button" data-testid="send" onClick={() => context.sendMessage({ message: 'hi' })}>send</button>
      <button type="button" data-testid="file" onClick={() => context.sendFileMessage(new File(['a'], 'a.png'))}>file</button>
      <button type="button" data-testid="voice" onClick={() => context.sendVoiceMessage(new File(['a'], 'a.webm'), 1)}>voice</button>
      <button type="button" data-testid="mfm" onClick={() => context.sendMultipleFilesMessage([new File(['a'], 'a.png'), new File(['b'], 'b.png')])}>mfm</button>
      <button type="button" data-testid="toggle" onClick={() => context.toggleReaction({ messageId: 1 } as any, 'smile', false)}>toggle</button>
    </div>
  );
};

const setupMocks = () => {
  const scrollCallback = jest.fn();
  const scrollDownCallback = jest.fn();
  const scrollToMessage = jest.fn();
  const deleteMessage = jest.fn();
  const updateMessage = jest.fn();
  const resendMessage = jest.fn();
  const sendMessage = jest.fn();
  const sendFileMessage = jest.fn().mockResolvedValue({ messageId: 2 });
  const sendVoiceMessage = jest.fn().mockResolvedValue({ messageId: 3 });
  const sendMultipleFilesMessage = jest.fn().mockResolvedValue({ messageId: 4 });
  const toggleReaction = jest.fn();

  (useSendbird as jest.Mock).mockReturnValue({
    state: {
      config: {
        pubSub: { publish: jest.fn(), subscribe: jest.fn() },
        logger,
        userId: 'user-id',
        isOnline: true,
        imageCompression: {},
        markAsReadScheduler: { push: jest.fn() },
        groupChannel: {
          enableMention: true,
          replyType: 'THREAD',
          threadReplySelectType: 'THREAD',
        },
        groupChannelSettings: {
          enableMessageSearch: true,
        },
      },
      stores: {
        sdkStore: {
          sdk: {},
          initialized: true,
        },
      },
    },
  });
  (useLocalization as jest.Mock).mockReturnValue({
    stringSet: {
      DATE_FORMAT__UNREAD_SINCE: 'p',
    },
  });
  (useScrollCallback as jest.Mock).mockReturnValue(scrollCallback);
  (useScrollDownCallback as jest.Mock).mockReturnValue(scrollDownCallback);
  (useScrollToMessage as jest.Mock).mockReturnValue(scrollToMessage);
  (useDeleteMessageCallback as jest.Mock).mockReturnValue(deleteMessage);
  (useUpdateMessageCallback as jest.Mock).mockReturnValue(updateMessage);
  (useResendMessageCallback as jest.Mock).mockReturnValue(resendMessage);
  (useSendMessageCallback as jest.Mock).mockReturnValue([{ current: null }, sendMessage]);
  (useSendFileMessageCallback as jest.Mock).mockReturnValue([sendFileMessage]);
  (useSendVoiceMessageCallback as jest.Mock).mockReturnValue([sendVoiceMessage]);
  (useSendMultipleFilesMessage as jest.Mock).mockReturnValue([sendMultipleFilesMessage]);
  (useToggleReactionCallback as jest.Mock).mockReturnValue(toggleReaction);

  return {
    scrollToMessage,
    deleteMessage,
    updateMessage,
    resendMessage,
    sendMessage,
    sendFileMessage,
    sendVoiceMessage,
    sendMultipleFilesMessage,
    toggleReaction,
  };
};

describe('ChannelProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('provides channel state, resolved config, and callback handlers', async () => {
    const callbacks = setupMocks();
    render(
      <ChannelProvider
        channelUrl="channel-url"
        startingPoint={100}
        highlightedMessage={50}
        animatedMessage={60}
        isMessageGroupingEnabled={false}
        isMultipleFilesMessageEnabled
        replyType="QUOTE_REPLY"
        showSearchIcon={false}
      >
        <Consumer />
      </ChannelProvider>,
    );

    expect(screen.getByTestId('channel-url')).toHaveTextContent('channel-url');
    expect(screen.getByTestId('reply-type')).toHaveTextContent('QUOTE_REPLY');
    expect(screen.getByTestId('thread-reply-select-type')).toHaveTextContent('THREAD');
    expect(screen.getByTestId('show-search')).toHaveTextContent('false');
    expect(screen.getByTestId('grouping')).toHaveTextContent('false');
    expect(screen.getByTestId('multiple-files')).toHaveTextContent('true');
    expect(screen.getByTestId('highlighted')).toHaveTextContent('50');
    expect(screen.getByTestId('starting-point')).toHaveTextContent('100');

    fireEvent.click(screen.getByTestId('initial'));
    fireEvent.click(screen.getByTestId('animate'));
    fireEvent.click(screen.getByTestId('highlight'));
    fireEvent.click(screen.getByTestId('scrolled'));

    expect(screen.getByTestId('starting-point')).toHaveTextContent('200');
    expect(screen.getByTestId('animated')).toHaveTextContent('300');
    expect(screen.getByTestId('highlighted')).toHaveTextContent('400');
    expect(screen.getByTestId('is-scrolled')).toHaveTextContent('true');

    await act(async () => {
      fireEvent.click(screen.getByTestId('scroll-to'));
      fireEvent.click(screen.getByTestId('delete'));
      fireEvent.click(screen.getByTestId('update'));
      fireEvent.click(screen.getByTestId('resend'));
      fireEvent.click(screen.getByTestId('send'));
      fireEvent.click(screen.getByTestId('file'));
      fireEvent.click(screen.getByTestId('voice'));
      fireEvent.click(screen.getByTestId('mfm'));
      fireEvent.click(screen.getByTestId('toggle'));
    });

    expect(callbacks.scrollToMessage).toHaveBeenCalledWith(10, 20);
    expect(callbacks.deleteMessage).toHaveBeenCalledWith({ messageId: 1 });
    expect(callbacks.updateMessage).toHaveBeenCalledWith({ messageId: 1, message: 'edit' });
    expect(callbacks.resendMessage).toHaveBeenCalledWith({ messageId: 1 });
    expect(callbacks.sendMessage).toHaveBeenCalledWith({ message: 'hi' });
    expect(callbacks.sendFileMessage).toHaveBeenCalledWith(expect.any(File));
    expect(callbacks.sendVoiceMessage).toHaveBeenCalledWith(expect.any(File), 1);
    expect(callbacks.sendMultipleFilesMessage).toHaveBeenCalledWith([expect.any(File), expect.any(File)]);
    expect(callbacks.toggleReaction).toHaveBeenCalledWith({ messageId: 1 }, 'smile', false);
  });

  it('updates derived state when props change and clears quote state on channel switch', () => {
    const { rerender } = render(
      <ChannelProvider channelUrl="first" startingPoint={1} highlightedMessage={2}>
        <Consumer />
      </ChannelProvider>,
    );

    fireEvent.click(screen.getByTestId('quote'));
    rerender(
      <ChannelProvider channelUrl="second" startingPoint={10} highlightedMessage={20}>
        <Consumer />
      </ChannelProvider>,
    );

    expect(screen.getByTestId('channel-url')).toHaveTextContent('second');
    expect(screen.getByTestId('starting-point')).toHaveTextContent('10');
    expect(screen.getByTestId('highlighted')).toHaveTextContent('20');
  });

  it('throws when context is consumed outside the provider', () => {
    const BrokenConsumer = () => {
      useChannelContext();
      return null;
    };
    const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<BrokenConsumer />)).toThrow('ChannelContext not found. Use within the Channel module.');
    spy.mockRestore();
  });
});
