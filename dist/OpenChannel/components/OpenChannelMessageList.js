import React__default, { useRef, useState, useMemo } from 'react';
import { i as isSameDay } from '../../chunks/bundle-RfBkMeJ1.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import { u as useOpenChannelContext } from '../../chunks/bundle-QqSGl9UA.js';
import MessagOpenChannelMessageeHoc from './OpenChannelMessage.js';
import { MessageProvider } from '../../Message/context.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { u as useHandleOnScrollCallback } from '../../chunks/bundle-17qkheiM.js';
import { compareMessagesForGrouping } from '../../Channel/utils/compareMessagesForGrouping.js';
import '../../chunks/bundle-o-FVZr_e.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-1inZXcUV.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-sR62lMVk.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-9GBao6H-.js';
import '../../chunks/bundle-qPq2iACJ.js';
import '../../chunks/bundle-yarrTY_z.js';
import '@sendbird/chat';
import '@sendbird/chat/openChannel';
import '../../chunks/bundle-BZ3hPsJ8.js';
import '../../chunks/bundle-FmRroF-I.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../hooks/useModal.js';
import '../../chunks/bundle-AN6QCsUL.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../chunks/bundle-UKdN0Ihw.js';
import '../../ui/OpenchannelUserMessage.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../ui/ImageRenderer.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-Jwc7mleJ.js';
import '@sendbird/chat/groupChannel';
import '../../utils/message/getOutgoingMessageState.js';
import '../../ui/UserProfile.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-IzjvDxft.js';
import '../../chunks/bundle--hvOY2k-.js';
import '../../chunks/bundle-FgXHPuhY.js';
import '../../ui/OpenChannelAdminMessage.js';
import '../../ui/OpenchannelOGMessage.js';
import '../../ui/LinkLabel.js';
import '../../chunks/bundle-wKuesro0.js';
import '../../chunks/bundle-IqjS0ok_.js';
import '../../ui/MentionLabel.js';
import '../../ui/OpenchannelThumbnailMessage.js';
import '../../ui/OpenchannelFileMessage.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../ui/DateSeparator.js';
import '../../ui/MessageInput.js';
import '../../chunks/bundle-8RTviqdm.js';
import '../../chunks/bundle-tIdypo_v.js';
import '../../chunks/bundle-p0_Jj2xm.js';
import 'dompurify';
import '../../chunks/bundle-zp72gyE3.js';
import '../../chunks/bundle-kgn8HcWj.js';
import '../../chunks/bundle-_MABCkOp.js';
import '../../chunks/bundle-mMigBvPD.js';
import '../../chunks/bundle-2hneibdl.js';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-9qb1BPMn.js';
import '../../withSendbird.js';
import '../../chunks/bundle-p0z4OS-3.js';
import '../../chunks/bundle-LgR-0X7v.js';
import '@sendbird/chat/message';

function OpenchannelMessageList(props, ref) {
    var _a = useOpenChannelContext(), _b = _a.isMessageGroupingEnabled, isMessageGroupingEnabled = _b === void 0 ? true : _b, allMessages = _a.allMessages, hasMore = _a.hasMore, onScroll = _a.onScroll;
    var store = useSendbirdStateContext();
    var userId = store.config.userId;
    var scrollRef = ref || useRef(null);
    var _c = useState(false), showScrollDownButton = _c[0], setShowScrollDownButton = _c[1];
    var scrollToBottom = function () {
        if (scrollRef && scrollRef.current) {
            scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
            setShowScrollDownButton(false);
        }
    };
    var handleOnScroll = useHandleOnScrollCallback({
        setShowScrollDownButton: setShowScrollDownButton,
        hasMore: hasMore,
        onScroll: onScroll,
        scrollRef: scrollRef,
    });
    var memoizedMessageList = useMemo(function () {
        var _a;
        if (allMessages.length > 0) {
            return (allMessages.map(function (message, index) {
                var _a;
                var previousMessage = allMessages[index - 1];
                var nextMessage = allMessages[index - 1];
                var previousMessageCreatedAt = previousMessage && previousMessage.createdAt;
                var currentCreatedAt = message === null || message === void 0 ? void 0 : message.createdAt;
                // https://stackoverflow.com/a/41855608
                var hasSeparator = !(previousMessageCreatedAt && (isSameDay(currentCreatedAt, previousMessageCreatedAt)));
                var _b = isMessageGroupingEnabled
                    ? compareMessagesForGrouping(previousMessage, message, nextMessage)
                    : [false, false], chainTop = _b[0], chainBottom = _b[1];
                var isByMe = ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId) === userId;
                var key = (message === null || message === void 0 ? void 0 : message.messageId) || (message === null || message === void 0 ? void 0 : message.reqId);
                return (React__default.createElement(MessageProvider, { message: message, isByMe: isByMe, key: key },
                    React__default.createElement(MessagOpenChannelMessageeHoc, { message: message, chainTop: chainTop, chainBottom: chainBottom, hasSeparator: hasSeparator, renderMessage: props === null || props === void 0 ? void 0 : props.renderMessage })));
            }));
        }
        return (((_a = props === null || props === void 0 ? void 0 : props.renderPlaceHolderEmptyList) === null || _a === void 0 ? void 0 : _a.call(props)) || (React__default.createElement(PlaceHolder, { className: "sendbird-openchannel-conversation-scroll__container__place-holder", type: PlaceHolderTypes.NO_MESSAGES })));
    }, [allMessages]);
    return (React__default.createElement("div", { className: "sendbird-openchannel-conversation-scroll" },
        React__default.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container" },
            React__default.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container__padding" }),
            React__default.createElement("div", { className: [
                    'sendbird-openchannel-conversation-scroll__container__item-container',
                    (allMessages.length > 0) ? '' : 'no-messages',
                ].join(' '), onScroll: handleOnScroll, ref: scrollRef }, memoizedMessageList)),
        showScrollDownButton && (React__default.createElement("div", { className: "sendbird-openchannel-conversation-scroll__container__scroll-bottom-button", onClick: scrollToBottom, onKeyDown: scrollToBottom, tabIndex: 0, role: "button" },
            React__default.createElement(Icon, { width: "24px", height: "24px", type: IconTypes.CHEVRON_DOWN, fillColor: IconColors.CONTENT })))));
}
var OpenChannelMessageList = React__default.forwardRef(OpenchannelMessageList);

export { OpenChannelMessageList as default };
//# sourceMappingURL=OpenChannelMessageList.js.map
