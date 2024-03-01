'use strict';

var React = require('react');
var index$1 = require('../../chunks/bundle-iPt3h7ba.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var OpenChannel_context = require('../../chunks/bundle-T5IkV5L8.js');
var OpenChannel_components_OpenChannelMessage = require('./OpenChannelMessage.js');
var Message_context = require('../../Message/context.js');
var useSendbirdStateContext = require('../../useSendbirdStateContext.js');
var index = require('../../chunks/bundle-zlfJ0EDR.js');
var Channel_utils_compareMessagesForGrouping = require('../../Channel/utils/compareMessagesForGrouping.js');
require('../../chunks/bundle-KOig1nUx.js');
require('../../chunks/bundle-HY8cubCp.js');
require('../../chunks/bundle-xbdnJE9-.js');
require('../../chunks/bundle-jCTpndN0.js');
require('../../chunks/bundle-WKa05h0_.js');
require('../../chunks/bundle-Yzhiyr0t.js');
require('../../chunks/bundle-KkCwxjVN.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-uzKywAVp.js');
require('../../chunks/bundle-kLoWlyQs.js');
require('../../chunks/bundle-VqRllkVd.js');
require('@sendbird/chat');
require('@sendbird/chat/openChannel');
require('../../chunks/bundle-SOIkTCep.js');
require('../../chunks/bundle-a5LHhP6m.js');
require('../../chunks/bundle-kftX5Dbs.js');
require('../../hooks/useModal.js');
require('../../chunks/bundle-tNuJSOqI.js');
require('../../chunks/bundle-6hGNMML2.js');
require('react-dom');
require('../../chunks/bundle-4WvE40Un.js');
require('../../ui/IconButton.js');
require('../../ui/Button.js');
require('../../chunks/bundle-Atn5EZwu.js');
require('../../ui/OpenchannelUserMessage.js');
require('../../chunks/bundle--jUKLwRX.js');
require('../../ui/ImageRenderer.js');
require('../../ui/ContextMenu.js');
require('../../ui/SortByRow.js');
require('../../chunks/bundle-Uw6P-cM9.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../ui/UserProfile.js');
require('../../sendbirdSelectors.js');
require('../../chunks/bundle-vDHl9-Jj.js');
require('../../chunks/bundle-70I7qjvf.js');
require('../../chunks/bundle-pOf7PZ4G.js');
require('../../ui/OpenChannelAdminMessage.js');
require('../../ui/OpenchannelOGMessage.js');
require('../../ui/LinkLabel.js');
require('../../chunks/bundle-DqKLlsGU.js');
require('../../chunks/bundle-2_j4r1Cc.js');
require('../../ui/MentionLabel.js');
require('../../ui/OpenchannelThumbnailMessage.js');
require('../../ui/OpenchannelFileMessage.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-0uk8Bfy0.js');
require('../../ui/DateSeparator.js');
require('../../ui/MessageInput.js');
require('../../chunks/bundle-ZK5PhDxY.js');
require('../../chunks/bundle-pi-jk3re.js');
require('../../chunks/bundle-d6SaHkg0.js');
require('dompurify');
require('../../chunks/bundle-h9YDQxpQ.js');
require('../../chunks/bundle-fqNhuMna.js');
require('../../chunks/bundle-yk__vyz_.js');
require('../../chunks/bundle-s5WIvT8N.js');
require('../../chunks/bundle-noP7JXqE.js');
require('@sendbird/uikit-tools');
require('../../chunks/bundle-gOYUXAiI.js');
require('../../withSendbird.js');
require('../../chunks/bundle-Zw2P8RwZ.js');
require('../../chunks/bundle-6xWNZugu.js');
require('@sendbird/chat/message');

function OpenchannelMessageList(props, ref) {
    var _a = OpenChannel_context.useOpenChannelContext(), _b = _a.isMessageGroupingEnabled, isMessageGroupingEnabled = _b === void 0 ? true : _b, allMessages = _a.allMessages, hasMore = _a.hasMore, onScroll = _a.onScroll;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var userId = store.config.userId;
    var scrollRef = ref || React.useRef(null);
    var _c = React.useState(false), showScrollDownButton = _c[0], setShowScrollDownButton = _c[1];
    var scrollToBottom = function () {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
            setShowScrollDownButton(false);
        }
    };
    var handleOnScroll = index.useHandleOnScrollCallback({
        setShowScrollDownButton: setShowScrollDownButton,
        hasMore: hasMore,
        onScroll: onScroll,
        scrollRef: scrollRef,
    });
    var memoizedMessageList = React.useMemo(function () {
        var _a;
        if (allMessages.length > 0) {
            return (allMessages.map(function (message, index) {
                var _a;
                var previousMessage = allMessages[index - 1];
                var nextMessage = allMessages[index - 1];
                var previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
                var currentCreatedAt = message === null || message === void 0 ? void 0 : message.createdAt;
                // https://stackoverflow.com/a/41855608
                var hasSeparator = !(previousMessageCreatedAt && (index$1.isSameDay(currentCreatedAt, previousMessageCreatedAt)));
                var _b = isMessageGroupingEnabled
                    ? Channel_utils_compareMessagesForGrouping.compareMessagesForGrouping(previousMessage, message, nextMessage)
                    : [false, false], chainTop = _b[0], chainBottom = _b[1];
                var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
                var key = (message === null || message === void 0 ? void 0 : message.messageId) || (message === null || message === void 0 ? void 0 : message.reqId);
                return (React.createElement(Message_context.MessageProvider, { message: message, isByMe: isByMe, key: key },
                    React.createElement(OpenChannel_components_OpenChannelMessage, { message: message, chainTop: chainTop, chainBottom: chainBottom, hasSeparator: hasSeparator, renderMessage: props === null || props === void 0 ? void 0 : props.renderMessage })));
            }));
        }
        return (((_a = props === null || props === void 0 ? void 0 : props.renderPlaceHolderEmptyList) === null || _a === void 0 ? void 0 : _a.call(props)) || (React.createElement(ui_PlaceHolder.default, { className: "sendbird-openchannel-conversation-scroll__container__place-holder", type: ui_PlaceHolder.PlaceHolderTypes.NO_MESSAGES })));
    }, [allMessages]);
    return (React.createElement("div", { className: "sendbird-openchannel-conversation-scroll" },
        React.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container" },
            React.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container__padding" }),
            React.createElement("div", { className: [
                    'sendbird-openchannel-conversation-scroll__container__item-container',
                    (allMessages.length > 0) ? '' : 'no-messages',
                ].join(' '), onScroll: handleOnScroll, ref: scrollRef }, memoizedMessageList)),
        showScrollDownButton && (React.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container__scroll-bottom-button", onClick: scrollToBottom, onKeyDown: scrollToBottom, tabIndex: 0, role: "button" },
            React.createElement(ui_Icon.default, { width: "24px", height: "24px", type: ui_Icon.IconTypes.CHEVRON_DOWN, fillColor: ui_Icon.IconColors.CONTENT })))));
}
var OpenChannelMessageList = React.forwardRef(OpenchannelMessageList);

module.exports = OpenChannelMessageList;
//# sourceMappingURL=OpenChannelMessageList.js.map
