import { useCallback, useEffect } from 'react';
import { ReplyType } from '@sendbird/chat/message';
import { s as scrollIntoLast, c as scrollToRenderedMessage } from './bundle-LgR-0X7v.js';
import { R as RESET_MESSAGES, M as MESSAGE_LIST_PARAMS_CHANGED, F as FETCH_INITIAL_MESSAGES_START, a as FETCH_INITIAL_MESSAGES_SUCCESS, b as FETCH_INITIAL_MESSAGES_FAILURE } from './bundle-4isra95J.js';
import './bundle-tIdypo_v.js';
import { d as SCROLL_BOTTOM_DELAY_FOR_FETCH } from './bundle-UKdN0Ihw.js';

// For legacy
// These are not used for collections(GroupChannel)
var PREV_RESULT_SIZE = 30;
var NEXT_RESULT_SIZE = 15;

function useInitialMessagesFetch(_a, _b) {
    var currentGroupChannel = _a.currentGroupChannel, initialTimeStamp = _a.initialTimeStamp, userFilledMessageListQuery = _a.userFilledMessageListQuery, replyType = _a.replyType, setIsScrolled = _a.setIsScrolled;
    var logger = _b.logger, scrollRef = _b.scrollRef, messagesDispatcher = _b.messagesDispatcher;
    var channelUrl = currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.url;
    /**
     * useCallback(() => {}, [currentGroupChannel]) was buggy, that is why we did
     * const channelUrl = currentGroupChannel && currentGroupChannel.url;
     * useCallback(() => {}, [channelUrl])
     * Again, this hook is supposed to execute when currentGroupChannel changes
     * The 'channelUrl' here is not the same memory reference from Conversation.props
     */
    var fetchMessages = useCallback(function () {
        logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
        setIsScrolled(false);
        messagesDispatcher({
            type: RESET_MESSAGES,
            payload: null,
        });
        if (currentGroupChannel && (currentGroupChannel === null || currentGroupChannel === void 0 ? void 0 : currentGroupChannel.getMessagesByTimestamp)) {
            var messageListParams_1 = {
                prevResultSize: PREV_RESULT_SIZE,
                isInclusive: true,
                includeReactions: true,
                includeMetaArray: true,
            };
            if (initialTimeStamp) {
                messageListParams_1.nextResultSize = NEXT_RESULT_SIZE;
            }
            if (replyType === 'QUOTE_REPLY' || replyType === 'THREAD') {
                messageListParams_1.includeThreadInfo = true;
                messageListParams_1.includeParentMessageInfo = true;
                messageListParams_1.replyType = ReplyType.ONLY_REPLY_TO_CHANNEL;
            }
            if (userFilledMessageListQuery) {
                Object.keys(userFilledMessageListQuery).forEach(function (key) {
                    messageListParams_1[key] = userFilledMessageListQuery[key];
                });
            }
            if ((replyType
                && (replyType === 'QUOTE_REPLY' || replyType === 'THREAD'))
                || userFilledMessageListQuery) {
                logger.info('Channel useInitialMessagesFetch: Setup messageListParams', messageListParams_1);
                messagesDispatcher({
                    type: MESSAGE_LIST_PARAMS_CHANGED,
                    payload: messageListParams_1,
                });
            }
            logger.info('Channel: Fetching messages', { currentGroupChannel: currentGroupChannel, userFilledMessageListQuery: userFilledMessageListQuery });
            messagesDispatcher({
                type: FETCH_INITIAL_MESSAGES_START,
                payload: null,
            });
            currentGroupChannel
                .getMessagesByTimestamp(initialTimeStamp || new Date().getTime(), messageListParams_1)
                .then(function (messages) {
                messagesDispatcher({
                    type: FETCH_INITIAL_MESSAGES_SUCCESS,
                    payload: {
                        currentGroupChannel: currentGroupChannel,
                        messages: messages,
                    },
                });
            })
                .catch(function (error) {
                logger.error('Channel: Fetching messages failed', error);
                messagesDispatcher({
                    type: FETCH_INITIAL_MESSAGES_FAILURE,
                    payload: { currentGroupChannel: currentGroupChannel },
                });
            })
                .finally(function () {
                if (!initialTimeStamp) {
                    setTimeout(function () { return scrollIntoLast(0, scrollRef, setIsScrolled); }, SCROLL_BOTTOM_DELAY_FOR_FETCH);
                }
                else {
                    setTimeout(function () {
                        scrollToRenderedMessage(scrollRef, initialTimeStamp, setIsScrolled);
                    }, 500);
                }
            });
        }
    }, [channelUrl, userFilledMessageListQuery, initialTimeStamp]);
    useEffect(function () {
        fetchMessages();
    }, [fetchMessages]);
    return fetchMessages;
}

export { NEXT_RESULT_SIZE as N, PREV_RESULT_SIZE as P, useInitialMessagesFetch as u };
//# sourceMappingURL=bundle-OORCcdCm.js.map
