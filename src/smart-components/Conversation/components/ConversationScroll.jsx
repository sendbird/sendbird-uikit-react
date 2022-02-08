import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isSameDay from 'date-fns/isSameDay';

import './conversation-scroll.scss';
import * as messageActionTypes from '../dux/actionTypes';

import MessageHOC from './MessageHOC';
import { compareMessagesForGrouping } from '../utils';
import PlaceHolder, { PlaceHolderTypes } from '../../../ui/PlaceHolder';
import Icon, { IconTypes, IconColors } from '../../../ui/Icon';

const SCROLL_REF_CLASS_NAME = '.sendbird-msg--scroll-ref';

export default class ConversationScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleScroll = () => {
    const { scrollRef } = this?.props;
    const current = scrollRef?.current;
    if (current) {
      const bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
      const { scrollBottom = 0 } = this.state;
      if (scrollBottom < bottom) {
        current.scrollTop += bottom - scrollBottom;
      }
    }
  }

  onScroll = (e) => {
    const {
      scrollRef,
      hasMore,
      messagesDispatcher,
      onScroll,
      onScrollDown,
      currentGroupChannel,
    } = this.props;

    const element = e.target;
    const {
      scrollTop,
      clientHeight,
      scrollHeight,
    } = element;
    if (scrollTop === 0) {
      if (!hasMore) {
        return;
      }
      const nodes = scrollRef.current.querySelectorAll(SCROLL_REF_CLASS_NAME);
      const first = nodes && nodes[0];
      onScroll(([messages]) => {
        if (messages) {
          // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
          // Set block to nearest to prevent unexpected scrolling from outer components
          try {
            first.scrollIntoView({ block: 'nearest' });
          } catch (error) {
            //
          }
        }
      });
    }

    if (clientHeight + scrollTop === scrollHeight) {
      const nodes = scrollRef.current.querySelectorAll(SCROLL_REF_CLASS_NAME);
      const last = nodes && nodes[nodes.length - 1];
      onScrollDown(([messages]) => {
        if (messages) {
          // https://github.com/scabbiaza/react-scroll-position-on-updating-dom
          try {
            last.scrollIntoView({ block: 'nearest' });
          } catch (error) {
            //
          }
        }
      });
    }

    // do this later
    setTimeout(() => {
      // mark as read if scroll is at end
      if (clientHeight + scrollTop === scrollHeight) {
        messagesDispatcher({
          type: messageActionTypes.MARK_AS_READ,
        });
        currentGroupChannel.markAsRead();
      }

      // save the lastest scroll bottom value
      if (scrollRef?.current) {
        const current = scrollRef?.current;
        this.setState((state) => ({
          ...state,
          scrollBottom: current.scrollHeight - current.scrollTop - current.offsetHeight,
        }), () => { });
      }
    }, 500);
  }

  render() {
    const {
      userId,
      disabled,
      scrollRef,
      membersMap,
      allMessages,
      scrollToMessage,
      useReaction,
      replyType,
      emojiAllMap,
      editDisabled,
      deleteMessage,
      updateMessage,
      resendMessage,
      renderCustomMessage,
      renderChatItem,
      animatedMessageId,
      highLightedMessageId,
      emojiContainer,
      toggleReaction,
      useMessageGrouping,
      currentGroupChannel,
      memoizedEmojiListItems,
      showScrollBot,
      onClickScrollBot,
      quoteMessage,
      setQuoteMessage,
    } = this.props;

    if (allMessages.length < 1) {
      return (
        <PlaceHolder
          className="sendbird-conversation__no-messages"
          type={PlaceHolderTypes.NO_MESSAGES}
        />
      );
    }

    return (
      <div className="sendbird-conversation__messages">
        <div className="sendbird-conversation__scroll-container">
          <div className="sendbird-conversation__padding" />
          {/*
            To do: Implement windowing
            Implement windowing if you are dealing with large number of messages/channels
            https://github.com/bvaughn/react-window -> recommendation
            We hesitate to bring one more dependency to our library,
            we are planning to implement it inside the library
          */}
          <div
            className="sendbird-conversation__messages-padding"
            ref={scrollRef}
            onScroll={this.onScroll}
          >
            {
              allMessages.map(
                (m, idx) => {
                  const previousMessage = allMessages[idx - 1];
                  const nextMessage = allMessages[idx + 1];
                  const [chainTop, chainBottom] = useMessageGrouping
                    ? compareMessagesForGrouping(previousMessage, m, nextMessage)
                    : [false, false];
                  const previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
                  const currentCreatedAt = m.createdAt;
                  // https://stackoverflow.com/a/41855608
                  const hasSeparator = !(previousMessageCreatedAt && (
                    isSameDay(currentCreatedAt, previousMessageCreatedAt)
                  ));
                  if (renderChatItem) {
                    return (
                      <div
                        key={m.messageId || m.reqId}
                        className="sendbird-msg--scroll-ref"
                      >
                        {
                          renderChatItem({
                            message: m,
                            animatedMessageId,
                            highLightedMessageId,
                            channel: currentGroupChannel,
                            onDeleteMessage: deleteMessage,
                            onUpdateMessage: updateMessage,
                            onResendMessage: resendMessage,
                            onScrollToMessage: scrollToMessage,
                            onReplyMessage: setQuoteMessage,
                            emojiContainer,
                            chainTop,
                            chainBottom,
                            hasSeparator,
                            menuDisabled: disabled,
                          })
                        }
                      </div>
                    );
                  }

                  return (
                    <MessageHOC
                      animatedMessageId={animatedMessageId}
                      highLightedMessageId={highLightedMessageId}
                      renderCustomMessage={renderCustomMessage}
                      key={m.messageId || m.reqId}
                      userId={userId}
                      handleScroll={this.handleScroll}
                      message={m}
                      quoteMessage={quoteMessage}
                      scrollToMessage={scrollToMessage}
                      currentGroupChannel={currentGroupChannel}
                      disabled={disabled}
                      membersMap={membersMap}
                      chainTop={chainTop}
                      useReaction={useReaction}
                      replyType={replyType}
                      emojiAllMap={emojiAllMap}
                      emojiContainer={emojiContainer}
                      editDisabled={editDisabled}
                      hasSeparator={hasSeparator}
                      chainBottom={chainBottom}
                      updateMessage={updateMessage}
                      deleteMessage={deleteMessage}
                      resendMessage={resendMessage}
                      toggleReaction={toggleReaction}
                      setQuoteMessage={setQuoteMessage}
                      memoizedEmojiListItems={memoizedEmojiListItems}
                    />
                  );
                },
              )
            }
          </div>
        </div>
        {
          showScrollBot && (
            <div
              className="sendbird-conversation__scroll-bottom-button"
              onClick={onClickScrollBot}
              onKeyDown={onClickScrollBot}
              tabIndex={0}
              role="button"
            >
              <Icon
                width="24px"
                height="24px"
                type={IconTypes.CHEVRON_DOWN}
                fillColor={IconColors.PRIMARY}
              />
            </div>
          )
        }
      </div>
    );
  }
}

ConversationScroll.propTypes = {
  // https://stackoverflow.com/a/52646941
  scrollRef: PropTypes.shape({
    current: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.shape({}),
    ]),
  }).isRequired,
  hasMore: PropTypes.bool,
  messagesDispatcher: PropTypes.func.isRequired,
  onScroll: PropTypes.func,
  onScrollDown: PropTypes.func,
  editDisabled: PropTypes.bool,
  disabled: PropTypes.bool,
  userId: PropTypes.string,
  allMessages: PropTypes.arrayOf(PropTypes.shape({
    createdAt: PropTypes.number,
  })).isRequired,
  deleteMessage: PropTypes.func.isRequired,
  resendMessage: PropTypes.func.isRequired,
  updateMessage: PropTypes.func.isRequired,
  currentGroupChannel: PropTypes.shape({
    markAsRead: PropTypes.func,
    members: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  animatedMessageId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  highLightedMessageId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  renderChatItem: PropTypes.func,
  renderCustomMessage: PropTypes.func,
  scrollToMessage: PropTypes.func,
  useReaction: PropTypes.bool,
  replyType: PropTypes.oneOf(['NONE', 'QUOTE_REPLY', 'THREAD']),
  showScrollBot: PropTypes.bool,
  onClickScrollBot: PropTypes.func,
  emojiContainer: PropTypes.shape({}),
  emojiAllMap: PropTypes.instanceOf(Map),
  membersMap: PropTypes.instanceOf(Map),
  useMessageGrouping: PropTypes.bool,
  toggleReaction: PropTypes.func,
  memoizedEmojiListItems: PropTypes.func,
  quoteMessage: PropTypes.shape({}),
  setQuoteMessage: PropTypes.func.isRequired,
};

ConversationScroll.defaultProps = {
  hasMore: false,
  editDisabled: false,
  disabled: false,
  userId: '',
  renderCustomMessage: null,
  renderChatItem: null,
  animatedMessageId: null,
  highLightedMessageId: null,
  onScroll: null,
  onScrollDown: null,
  useReaction: true,
  replyType: 'NONE',
  emojiContainer: {},
  showScrollBot: false,
  onClickScrollBot: () => { },
  scrollToMessage: () => { },
  emojiAllMap: new Map(),
  membersMap: new Map(),
  useMessageGrouping: true,
  toggleReaction: () => { },
  memoizedEmojiListItems: () => '',
  quoteMessage: null,
};
