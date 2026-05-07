import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import NewMessageIndicator from '../NewMessageSeparator';
import ThreadReplies from '../ThreadReplies';
import MobileFeedbackMenu from '../MobileFeedbackMenu';
import MessageFeedbackModal from '../MessageFeedbackModal';
import MessageFeedbackFailedModal from '../MessageFeedbackFailedModal';
import { LocalizationContext, useLocalization } from '../../lib/LocalizationContext';
import { useMediaQueryContext } from '../../lib/MediaQueryContext';
import { FeedbackRating } from '@sendbird/chat/message';

jest.mock('../../lib/LocalizationContext', () => {
  const React = require('react');
  return {
    LocalizationContext: React.createContext({ stringSet: {} }),
    useLocalization: jest.fn(),
  };
});
jest.mock('../../lib/MediaQueryContext', () => ({
  useMediaQueryContext: jest.fn(),
}));
jest.mock('../BottomSheet', () => (props: any) => (
  <div>
    <button type="button" data-testid="backdrop" onClick={props.onBackdropClick}>backdrop</button>
    {props.children}
  </div>
));
jest.mock('../Modal', () => (props: any) => (
  <div data-testid="modal" onKeyDown={props.onKeyDown}>
    {props.renderHeader?.()}
    <button type="button" data-testid="modal-submit" onClick={props.onSubmit}>{props.submitText}</button>
    <button type="button" data-testid="modal-close" onClick={props.onClose ?? props.onCancel}>close</button>
    {props.children}
    {props.customFooter}
  </div>
));
jest.mock('../Avatar', () => (props: any) => <img alt={props.alt} src={props.src} />);

const stringSet = {
  CHANNEL__THREAD_REPLY: 'reply',
  CHANNEL__THREAD_REPLIES: 'replies',
  CHANNEL__THREAD_OVER_MAX: '99+',
  EDIT_COMMENT: 'Edit comment',
  REMOVE_FEEDBACK: 'Remove feedback',
  BUTTON__SUBMIT: 'Submit',
  BUTTON__SAVE: 'Save',
  BUTTON__CANCEL: 'Cancel',
  BUTTON__REMOVE_FEEDBACK: 'Remove feedback',
  BUTTON__OK: 'OK',
  FEEDBACK_MODAL_TITLE: 'Feedback',
  FEEDBACK_CONTENT_PLACEHOLDER: 'Comment',
};

describe('small feedback and thread UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useLocalization as jest.Mock).mockReturnValue({ stringSet });
    (useMediaQueryContext as jest.Mock).mockReturnValue({ isMobile: false });
  });

  it('notifies when a new message indicator becomes visible', () => {
    const onVisibilityChange = jest.fn();
    const observe = jest.fn();
    const disconnect = jest.fn();
    let observerCallback: IntersectionObserverCallback;
    global.IntersectionObserver = jest.fn((callback) => {
      observerCallback = callback;
      return { observe, disconnect } as any;
    }) as any;

    const { unmount } = render(<NewMessageIndicator className={['custom']} onVisibilityChange={onVisibilityChange} />);
    expect(observe).toHaveBeenCalled();
    observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(onVisibilityChange).toHaveBeenCalledWith(true);
    expect(screen.getByText('New Messages')).toBeInTheDocument();
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('renders thread replies with user overflow and click handlers', () => {
    const onClick = jest.fn();
    const { container } = render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <ThreadReplies
          className="custom-thread"
          onClick={onClick}
          threadInfo={{
            replyCount: 120,
            mostRepliedUsers: [0, 1, 2, 3, 4].map((index) => ({
              userId: `user-${index}`,
              profileUrl: `${index}.png`,
            })),
          } as any}
        />
      </LocalizationContext.Provider>,
    );

    expect(screen.getByText('99+ replies')).toBeInTheDocument();
    const threadReplies = container.querySelector('.sendbird-ui-thread-replies') as Element;
    fireEvent.click(threadReplies);
    expect(onClick).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(threadReplies);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('handles mobile feedback menu actions', () => {
    const hideMenu = jest.fn();
    const onEditFeedback = jest.fn();
    const onRemoveFeedback = jest.fn();
    render(<MobileFeedbackMenu hideMenu={hideMenu} onEditFeedback={onEditFeedback} onRemoveFeedback={onRemoveFeedback} />);

    fireEvent.click(screen.getByText('Edit comment'));
    expect(hideMenu).toHaveBeenCalledTimes(1);
    expect(onEditFeedback).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Remove feedback'));
    expect(hideMenu).toHaveBeenCalledTimes(2);
    expect(onRemoveFeedback).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByTestId('backdrop'));
    expect(hideMenu).toHaveBeenCalledTimes(3);
  });

  it('submits, updates, closes, and removes feedback modal content', () => {
    const onSubmit = jest.fn();
    const onUpdate = jest.fn();
    const onClose = jest.fn();
    const onRemove = jest.fn();
    const { container, rerender } = render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <MessageFeedbackModal
          selectedFeedback={FeedbackRating.GOOD}
          message={{ myFeedback: null } as any}
          onSubmit={onSubmit}
          onClose={onClose}
        />
      </LocalizationContext.Provider>,
    );
    const input = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'great' } });
    fireEvent.click(screen.getAllByText('Submit').at(-1)!);
    expect(onSubmit).toHaveBeenCalledWith(FeedbackRating.GOOD, 'great');

    rerender(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <MessageFeedbackModal
          selectedFeedback={FeedbackRating.GOOD}
          message={{ myFeedback: { rating: FeedbackRating.GOOD, comment: 'old' } } as any}
          onUpdate={onUpdate}
          onClose={onClose}
          onRemove={onRemove}
        />
      </LocalizationContext.Provider>,
    );
    const editInput = container.querySelector('input') as HTMLInputElement;
    fireEvent.change(editInput, { target: { value: 'new' } });
    fireEvent.click(screen.getByText('Save'));
    expect(onUpdate).toHaveBeenCalledWith(FeedbackRating.GOOD, 'new');
    fireEvent.click(screen.getByText('Remove feedback'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders failed feedback modal and closes it', () => {
    const onCancel = jest.fn();
    render(
      <LocalizationContext.Provider value={{ stringSet } as any}>
        <MessageFeedbackFailedModal text="Failed" onCancel={onCancel} />
      </LocalizationContext.Provider>,
    );

    expect(screen.getByText('Failed')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText('OK').at(-1)!);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
