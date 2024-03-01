'use strict';

var React = require('react');
var message = require('@sendbird/chat/message');
var utils = require('./bundle-eDrjbSc-.js');
var actionTypes = require('./bundle-XgxbsHav.js');
require('./bundle-eBZWCIEU.js');
var consts = require('./bundle-I79mHo_2.js');

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
    var fetchMessages = React.useCallback(function () {
        logger.info('Channel useInitialMessagesFetch: Setup started', currentGroupChannel);
        setIsScrolled(false);
        messagesDispatcher({
            type: actionTypes.RESET_MESSAGES,
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
                messageListParams_1.replyType = message.ReplyType.ONLY_REPLY_TO_CHANNEL;
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
                    type: actionTypes.MESSAGE_LIST_PARAMS_CHANGED,
                    payload: messageListParams_1,
                });
            }
            logger.info('Channel: Fetching messages', { currentGroupChannel: currentGroupChannel, userFilledMessageListQuery: userFilledMessageListQuery });
            messagesDispatcher({
                type: actionTypes.FETCH_INITIAL_MESSAGES_START,
                payload: null,
            });
            currentGroupChannel
                .getMessagesByTimestamp(initialTimeStamp || new Date().getTime(), messageListParams_1)
                .then(function (messages) {
                messagesDispatcher({
                    type: actionTypes.FETCH_INITIAL_MESSAGES_SUCCESS,
                    payload: {
                        currentGroupChannel: currentGroupChannel,
                        messages: messages,
                    },
                });
            })
                .catch(function (error) {
                logger.error('Channel: Fetching messages failed', error);
                messagesDispatcher({
                    type: actionTypes.FETCH_INITIAL_MESSAGES_FAILURE,
                    payload: { currentGroupChannel: currentGroupChannel },
                });
            })
                .finally(function () {
                if (!initialTimeStamp) {
                    setTimeout(function () { return utils.scrollIntoLast(0, scrollRef, setIsScrolled); }, consts.SCROLL_BOTTOM_DELAY_FOR_FETCH);
                }
                else {
                    setTimeout(function () {
                        utils.scrollToRenderedMessage(scrollRef, initialTimeStamp, setIsScrolled);
                    }, 500);
                }
            });
        }
    }, [channelUrl, userFilledMessageListQuery, initialTimeStamp]);
    React.useEffect(function () {
        fetchMessages();
    }, [fetchMessages]);
    return fetchMessages;
}

exports.NEXT_RESULT_SIZE = NEXT_RESULT_SIZE;
exports.PREV_RESULT_SIZE = PREV_RESULT_SIZE;
exports.useInitialMessagesFetch = useInitialMessagesFetch;
//# sourceMappingURL=bundle-Tcz7Ubz9.js.map
