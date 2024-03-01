'use strict';

var React = require('react');
var Thread_components_ThreadListItem = require('./ThreadListItem.js');
var Thread_context = require('../context.js');
var Channel_utils_compareMessagesForGrouping = require('../../Channel/utils/compareMessagesForGrouping.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var dateFns = require('date-fns');
var Message_context = require('../../Message/context.js');
require('../../chunks/bundle-2dG9SU7T.js');
require('../../chunks/bundle-Ny3NKw-X.js');
require('../../chunks/bundle-gDA5XZ0C.js');
require('../../chunks/bundle-60kIt9Rq.js');
require('../../chunks/bundle-eH49AisR.js');
require('../../ui/DateSeparator.js');
require('../../chunks/bundle-KNt569rP.js');
require('../../chunks/bundle-26QzFMMl.js');
require('../../chunks/bundle-ulZ-c4e6.js');
require('../../chunks/bundle-CfdtYkhL.js');
require('react-dom');
require('../../chunks/bundle-QStqvuCY.js');
require('../../chunks/bundle-MZHOyRuu.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-_t5Ozfpd.js');
require('../../chunks/bundle-wzulmlgb.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-3fb9w4KI.js');
require('../../chunks/bundle-x2xJziaA.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-OfFu3N1i.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-uGaTvmsl.js');
require('../../chunks/bundle-I79mHo_2.js');
require('../../chunks/bundle-A_ipX_Gf.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-Zp3OkE8e.js');
require('../../chunks/bundle-isZYiJlA.js');
require('../../chunks/bundle-Gzug-R-w.js');
require('../../chunks/bundle-eBZWCIEU.js');
require('../../chunks/bundle-m-c1V2jE.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-jh--qeoy.js');
require('dompurify');
require('../../chunks/bundle-9O_6GMbC.js');
require('../../chunks/bundle-q13fOZ_V.js');
require('../../chunks/bundle-TCEkQl9R.js');
require('../../chunks/bundle-Q2J-7okW.js');
require('../context/types.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-DKcL-93i.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-LutGJd7y.js');
require('../../withSendbird.js');
require('../../ui/MessageItemMenu.js');
require('../../chunks/bundle-a0KHaUDZ.js');
require('../../ui/MessageItemReactionMenu.js');
require('../../ui/ReactionButton.js');
require('../../chunks/bundle-Kz-b8WGm.js');
require('../../chunks/bundle-1dlTcCK5.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-Z1maM5mk.js');
require('../../chunks/bundle-LQQkMjKl.js');
require('../../ui/EmojiReactions.js');
require('../../ui/ReactionBadge.js');
require('../../ui/BottomSheet.js');
require('../../ui/UserListItem.js');
require('../../ui/MutedAvatarOverlay.js');
require('../../ui/Checkbox.js');
require('../../ui/Tooltip.js');
require('../../ui/TooltipWrapper.js');
require('../../ui/TextMessageItemBody.js');
require('../../chunks/bundle-TSHHC3WX.js');
require('../../ui/MentionLabel.js');
require('../../ui/LinkLabel.js');
require('../../ui/OGMessageItemBody.js');
require('../../ui/FileMessageItemBody.js');
require('../../ui/TextButton.js');
require('../../ui/ThumbnailMessageItemBody.js');
require('../../chunks/bundle-38g4arE5.js');
require('../../ui/UnknownMessageItemBody.js');
require('../../ui/VoiceMessageItemBody.js');
require('../../ui/ProgressBar.js');
require('../../VoicePlayer/useVoicePlayer.js');
require('../../chunks/bundle-C8zLDVXs.js');
require('../../VoiceRecorder/context.js');
require('../../ui/PlaybackTime.js');
require('../../chunks/bundle-VLUCx6pj.js');
require('../../chunks/bundle-Oj0T8nIQ.js');
require('@sendbird/chat/message');
require('../../Message/hooks/useDirtyGetMentions.js');
require('../../chunks/bundle-FMwBmvVd.js');
require('../../chunks/bundle-xgiAxHSr.js');
require('../../chunks/bundle-eDrjbSc-.js');
require('@sendbird/chat');
require('../../chunks/bundle-XgxbsHav.js');
require('../../chunks/bundle-ZoEtk6Hz.js');

function ThreadList(_a) {
    var className = _a.className, renderMessage = _a.renderMessage, renderCustomSeparator = _a.renderCustomSeparator, scrollRef = _a.scrollRef, scrollBottom = _a.scrollBottom;
    var config = useSendbirdStateContext.useSendbirdStateContext().config;
    var replyType = config.replyType, userId = config.userId;
    var _b = Thread_context.useThreadContext(), currentChannel = _b.currentChannel, allThreadMessages = _b.allThreadMessages, localThreadMessages = _b.localThreadMessages;
    var MemorizedMessage = React.useMemo(function () { return function (_a) {
        var message = _a.message, chainTop = _a.chainTop, chainBottom = _a.chainBottom, hasSeparator = _a.hasSeparator;
        if (typeof renderMessage === 'function') {
            return renderMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            });
        }
        return null;
    }; }, [renderMessage]);
    return (React.createElement("div", { className: "sendbird-thread-list ".concat(className) },
        allThreadMessages.map(function (message, idx) {
            var _a;
            var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
            var prevMessage = allThreadMessages[idx - 1];
            var nextMessage = allThreadMessages[idx + 1];
            // eslint-disable-next-line no-constant-condition
            var _b = Channel_utils_compareMessagesForGrouping.compareMessagesForGrouping(prevMessage, message, nextMessage, currentChannel, replyType)
                , chainTop = _b[0], chainBottom = _b[1];
            var hasSeparator = !((prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt) > 0 && (dateFns.isSameDay(message === null || message === void 0 ? void 0 : message.createdAt, prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt)));
            var handleScroll = function () {
                var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
                if (current) {
                    var bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
                    if (scrollBottom < bottom) {
                        current.scrollTop += bottom - scrollBottom;
                    }
                }
            };
            return (React.createElement(Message_context.MessageProvider, { message: message, isByMe: isByMe, key: message === null || message === void 0 ? void 0 : message.messageId }, MemorizedMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            }) || (React.createElement(Thread_components_ThreadListItem, { message: message, chainTop: chainTop, chainBottom: chainBottom, hasSeparator: hasSeparator, renderCustomSeparator: renderCustomSeparator, handleScroll: handleScroll }))));
        }),
        localThreadMessages.map(function (message, idx) {
            var _a;
            var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
            var prevMessage = localThreadMessages[idx - 1];
            var nextMessage = localThreadMessages[idx + 1];
            // eslint-disable-next-line no-constant-condition
            var _b = Channel_utils_compareMessagesForGrouping.compareMessagesForGrouping(prevMessage, message, nextMessage, currentChannel, replyType)
                , chainTop = _b[0], chainBottom = _b[1];
            var hasSeparator = !((prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt) > 0 && (dateFns.isSameDay(message === null || message === void 0 ? void 0 : message.createdAt, prevMessage === null || prevMessage === void 0 ? void 0 : prevMessage.createdAt)));
            var handleScroll = function () {
                var current = scrollRef === null || scrollRef === void 0 ? void 0 : scrollRef.current;
                if (current) {
                    var bottom = current.scrollHeight - current.scrollTop - current.offsetHeight;
                    if (scrollBottom < bottom) {
                        current.scrollTop += bottom - scrollBottom;
                    }
                }
            };
            return (React.createElement(Message_context.MessageProvider, { message: message, isByMe: isByMe, key: message === null || message === void 0 ? void 0 : message.messageId }, MemorizedMessage({
                message: message,
                chainTop: chainTop,
                chainBottom: chainBottom,
                hasSeparator: hasSeparator,
            }) || (React.createElement(Thread_components_ThreadListItem, { message: message, hasSeparator: false, renderCustomSeparator: renderCustomSeparator, handleScroll: handleScroll }))));
        })));
}

module.exports = ThreadList;
//# sourceMappingURL=ThreadList.js.map
