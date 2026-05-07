import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import * as BottomSheetItems from '../BottomSheetMenuItems';
import * as DesktopItems from '../MessageMenuItems';
import * as MobileItems from '../MobileMenuItems';
import { MessageMenuProvider } from '../../MessageMenuProvider';
import { LocalizationContext } from '../../../../lib/LocalizationContext';
import { copyToClipboard } from '../../../../utils';

jest.mock('../../../../utils', () => ({
  ...jest.requireActual('../../../../utils'),
  copyToClipboard: jest.fn(),
}));

const stringSet = {
  MESSAGE_MENU__COPY: 'Copy',
  MESSAGE_MENU__EDIT: 'Edit',
  MESSAGE_MENU__RESEND: 'Resend',
  MESSAGE_MENU__REPLY: 'Reply',
  MESSAGE_MENU__THREAD: 'Thread',
  MESSAGE_MENU__DELETE: 'Delete',
  MESSAGE_MENU__SAVE: 'Save',
  MESSAGE_MENU__MARK_AS_UNREAD: 'Mark as unread',
};

const createContext = (overrides = {}) => ({
  message: {
    message: 'hello',
    url: 'https://example.com/file.png',
    parentMessageId: 0,
    threadInfo: { replyCount: 0 },
    sendingStatus: 'succeeded',
    isUserMessage: () => true,
  },
  hideMenu: jest.fn(),
  setQuoteMessage: jest.fn(),
  onReplyInThread: jest.fn(),
  onMoveToParentMessage: jest.fn(),
  showEdit: jest.fn(),
  showRemove: jest.fn(),
  deleteMessage: jest.fn(),
  resendMessage: jest.fn(),
  markAsUnread: jest.fn(),
  onDownloadClick: jest.fn(),
  isOnline: true,
  disableDeleteMessage: false,
  triggerRef: { current: null },
  containerRef: { current: null },
  ...overrides,
});

const renderWithContext = (ui: React.ReactElement, context = createContext()) => {
  return {
    context,
    ...render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <MessageMenuProvider value={context as any}>
          {ui}
        </MessageMenuProvider>
      </LocalizationContext.Provider>
    ),
  };
};

describe('Mobile MessageMenu items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles copy, reply, thread, resend, edit, delete, download, and mark-as-unread actions', () => {
    const items = [
      MobileItems.CopyMenuItem,
      MobileItems.ReplyMenuItem,
      MobileItems.ThreadMenuItem,
      MobileItems.ResendMenuItem,
      MobileItems.EditMenuItem,
      MobileItems.DeleteMenuItem,
      MobileItems.DownloadMenuItem,
      MobileItems.MarkAsUnreadMenuItem,
    ];
    const context = createContext();

    items.forEach((Item, index) => {
      renderWithContext(<Item testID={`mobile-${index}`} />, context);
      fireEvent.click(screen.getByTestId(`mobile-${index}`));
    });

    expect(copyToClipboard).toHaveBeenCalledWith('hello');
    expect(context.setQuoteMessage).toHaveBeenCalledWith(context.message);
    expect(context.onReplyInThread).toHaveBeenCalledWith({ message: context.message });
    expect(context.resendMessage).toHaveBeenCalledWith(context.message);
    expect(context.showEdit).toHaveBeenCalledWith(true);
    expect(context.showRemove).toHaveBeenCalledWith(true);
    expect(context.markAsUnread).toHaveBeenCalledWith(context.message, 'manual');
    expect(context.hideMenu).toHaveBeenCalled();
  });

  it('does not run online-only mobile actions while offline and deletes failed messages directly', () => {
    const offline = createContext({ isOnline: false });
    renderWithContext(<MobileItems.EditMenuItem testID="offline-edit" />, offline);
    fireEvent.click(screen.getByTestId('offline-edit'));
    expect(offline.showEdit).not.toHaveBeenCalled();
    expect(offline.hideMenu).not.toHaveBeenCalled();

    const failed = createContext({
      message: {
        message: 'failed',
        sendingStatus: 'failed',
        isUserMessage: () => true,
        threadInfo: { replyCount: 0 },
      },
    });
    renderWithContext(<MobileItems.DeleteMenuItem testID="failed-delete" />, failed);
    fireEvent.click(screen.getByTestId('failed-delete'));
    expect(failed.deleteMessage).toHaveBeenCalledWith(failed.message);
  });
});

describe('Desktop MessageMenu items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles trigger rendering and desktop menu actions', () => {
    const onTriggerClick = jest.fn();
    const onTriggerBlur = jest.fn();
    render(
      <DesktopItems.TriggerIcon
        ref={{ current: null }}
        onClick={onTriggerClick}
        onBlur={onTriggerBlur}
        renderIcon={(props) => <span data-testid="trigger-icon">{props.type}</span>}
      />,
    );
    fireEvent.click(screen.getByRole('button'));
    fireEvent.blur(screen.getByRole('button'));
    expect(screen.getByTestId('trigger-icon')).toHaveTextContent('MORE');
    expect(onTriggerClick).toHaveBeenCalled();
    expect(onTriggerBlur).toHaveBeenCalled();

    const context = createContext();
    const items = [
      DesktopItems.CopyMenuItem,
      DesktopItems.ReplyMenuItem,
      DesktopItems.ThreadMenuItem,
      DesktopItems.OpenInChannelMenuItem,
      DesktopItems.EditMenuItem,
      DesktopItems.ResendMenuItem,
      DesktopItems.DeleteMenuItem,
      DesktopItems.MarkAsUnreadMenuItem,
    ];

    items.forEach((Item, index) => {
      renderWithContext(<Item testID={`desktop-${index}`} />, context);
      fireEvent.click(screen.getByTestId(`desktop-${index}`));
    });

    expect(copyToClipboard).toHaveBeenCalledWith('hello');
    expect(context.setQuoteMessage).toHaveBeenCalledWith(context.message);
    expect(context.onReplyInThread).toHaveBeenCalledWith({ message: context.message });
    expect(context.onMoveToParentMessage).toHaveBeenCalled();
    expect(context.showEdit).toHaveBeenCalledWith(true);
    expect(context.resendMessage).toHaveBeenCalledWith(context.message);
    expect(context.showRemove).toHaveBeenCalledWith(true);
    expect(context.markAsUnread).toHaveBeenCalledWith(context.message, 'manual');
  });

  it('guards offline edit/resend/delete and deletes failed messages directly', () => {
    const offline = createContext({ isOnline: false });
    renderWithContext(<DesktopItems.EditMenuItem testID="desktop-offline-edit" />, offline);
    fireEvent.click(screen.getByTestId('desktop-offline-edit'));
    renderWithContext(<DesktopItems.ResendMenuItem testID="desktop-offline-resend" />, offline);
    fireEvent.click(screen.getByTestId('desktop-offline-resend'));
    renderWithContext(<DesktopItems.DeleteMenuItem testID="desktop-offline-delete" />, offline);
    fireEvent.click(screen.getByTestId('desktop-offline-delete'));

    expect(offline.showEdit).not.toHaveBeenCalled();
    expect(offline.resendMessage).not.toHaveBeenCalled();
    expect(offline.showRemove).not.toHaveBeenCalled();

    const failed = createContext({
      message: {
        message: 'failed',
        sendingStatus: 'failed',
        isUserMessage: () => true,
        threadInfo: { replyCount: 0 },
      },
    });
    renderWithContext(<DesktopItems.DeleteMenuItem testID="desktop-failed-delete" />, failed);
    fireEvent.click(screen.getByTestId('desktop-failed-delete'));
    expect(failed.deleteMessage).toHaveBeenCalledWith(failed.message);
  });
});

describe('BottomSheet MessageMenu items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles bottom-sheet actions and custom children', () => {
    const context = createContext();
    renderWithContext(<BottomSheetItems.CopyMenuItem testID="copy">Copy custom</BottomSheetItems.CopyMenuItem>, context);
    fireEvent.click(screen.getByTestId('copy'));

    renderWithContext(<BottomSheetItems.EditMenuItem testID="edit" />, context);
    fireEvent.click(screen.getByTestId('edit'));

    renderWithContext(<BottomSheetItems.ResendMenuItem testID="resend" />, context);
    fireEvent.click(screen.getByTestId('resend'));

    renderWithContext(<BottomSheetItems.ReplyMenuItem testID="reply" />, context);
    fireEvent.click(screen.getByTestId('reply'));

    renderWithContext(<BottomSheetItems.ThreadMenuItem testID="thread" />, context);
    fireEvent.click(screen.getByTestId('thread'));

    renderWithContext(<BottomSheetItems.DeleteMenuItem testID="delete" />, context);
    fireEvent.click(screen.getByTestId('delete'));

    renderWithContext(<BottomSheetItems.MarkAsUnreadMenuItem testID="unread" />, context);
    fireEvent.click(screen.getByTestId('unread'));

    expect(screen.getByText('Copy custom')).toBeInTheDocument();
    expect(copyToClipboard).toHaveBeenCalledWith('hello');
    expect(context.showEdit).toHaveBeenCalledWith(true);
    expect(context.resendMessage).toHaveBeenCalledWith(context.message);
    expect(context.setQuoteMessage).toHaveBeenCalledWith(context.message);
    expect(context.onReplyInThread).toHaveBeenCalledWith({ message: context.message });
    expect(context.showRemove).toHaveBeenCalledWith(true);
    expect(context.markAsUnread).toHaveBeenCalledWith(context.message, 'manual');
  });

  it('renders bottom-sheet download link and calls download callback', () => {
    const context = createContext();
    renderWithContext(<BottomSheetItems.DownloadMenuItem />, context);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com/file.png');

    fireEvent.click(link);
    expect(context.onDownloadClick).toHaveBeenCalled();
  });
});
