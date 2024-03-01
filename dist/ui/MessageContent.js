import { _ as __assign, a as __awaiter, b as __generator } from '../chunks/bundle-KMsJXUN2.js';
import React__default, { useRef, useContext, useState } from 'react';
import { f as format } from '../chunks/bundle-vbGNKQpe.js';
import { M as MessageStatus } from '../chunks/bundle-GQ4rK0ER.js';
import { MessageMenu } from './MessageItemMenu.js';
import { MessageEmojiMenu } from './MessageItemReactionMenu.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import EmojiReactions from './EmojiReactions.js';
import AdminMessage from './AdminMessage.js';
import QuoteMessage from './QuoteMessage.js';
import { f as isSendableMessage, n as getUIKitMessageTypes, K as isOGMessage, L as isTextMessage, m as getUIKitMessageType, c as isMultipleFilesMessage, i as isVoiceMessage, p as isThumbnailMessage, h as getSenderName, w as getClassName } from '../chunks/bundle-ZnLsMTHr.js';
import { L as LocalizationContext, u as useLocalization } from '../chunks/bundle-msnuMA4R.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { FeedbackRating, Feedback } from '@sendbird/chat/message';
import { u as useLongPress } from '../chunks/bundle-3iFqiLDd.js';
import { M as MobileMenu } from '../chunks/bundle-m-u0cD67.js';
import { u as useMediaQueryContext } from '../chunks/bundle-ZTmwWu_-.js';
import ThreadReplies from './ThreadReplies.js';
import { T as ThreadReplySelectType } from '../chunks/bundle-hKmRj7Ck.js';
import { n as noop } from '../chunks/bundle-7YRb7CRq.js';
import ContextMenu, { MenuItems } from './ContextMenu.js';
import { A as Avatar } from '../chunks/bundle-OJq071GK.js';
import UserProfile from './UserProfile.js';
import { a as UserProfileContext } from '../chunks/bundle-x78eEPy7.js';
import OGMessageItemBody from './OGMessageItemBody.js';
import TextMessageItemBody from './TextMessageItemBody.js';
import FileMessageItemBody from './FileMessageItemBody.js';
import { u as useThreadMessageKindKeySelector, a as useFileInfoListWithUploaded, M as MultipleFilesMessageItemBody } from '../chunks/bundle-pWK0f3qD.js';
import { VoiceMessageItemBody } from './VoiceMessageItemBody.js';
import ThumbnailMessageItemBody from './ThumbnailMessageItemBody.js';
import UnknownMessageItemBody from './UnknownMessageItemBody.js';
import { K } from '../chunks/bundle-LZemF1A7.js';
import Icon, { IconTypes } from './Icon.js';
import FeedbackIconButton from './FeedbackIconButton.js';
import MobileFeedbackMenu from './MobileFeedbackMenu.js';
import MessageFeedbackModal from '../Channel/components/MessageFeedbackModal.js';
import { M as Modal } from '../chunks/bundle-O8mkJ7az.js';
import Button, { ButtonTypes } from './Button.js';
import { u as useKeyDown } from '../chunks/bundle-HUsfnqzD.js';
import '../chunks/bundle-CsWYoRVd.js';
import './Loader.js';
import '../utils/message/getOutgoingMessageState.js';
import '../chunks/bundle-vWrgNSvP.js';
import '../chunks/bundle-SpfAN5pr.js';
import './IconButton.js';
import '../chunks/bundle-lJ2SrsKF.js';
import 'react-dom';
import './SortByRow.js';
import '../chunks/bundle-4_6x-RiC.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '@sendbird/chat/groupChannel';
import './ImageRenderer.js';
import './ReactionButton.js';
import './ReactionBadge.js';
import './BottomSheet.js';
import '../hooks/useModal.js';
import './UserListItem.js';
import './MutedAvatarOverlay.js';
import './Checkbox.js';
import '../chunks/bundle-DhS-f2ZT.js';
import '../sendbirdSelectors.js';
import '../chunks/bundle-THTV9S18.js';
import '../withSendbird.js';
import './Tooltip.js';
import './TooltipWrapper.js';
import '../Message/context.js';
import '../chunks/bundle--jWawO0i.js';
import '../chunks/bundle-AjBmMBJ5.js';
import '../chunks/bundle-pODFB39J.js';
import './MentionLabel.js';
import './LinkLabel.js';
import '../chunks/bundle-cMznkLt0.js';
import '../chunks/bundle-wf7f-9LT.js';
import './TextButton.js';
import '../chunks/bundle-nGuCRoDK.js';
import '../chunks/bundle-13MqUbIu.js';
import '../chunks/bundle-AFXr5NmI.js';
import './ProgressBar.js';
import '../VoicePlayer/useVoicePlayer.js';
import '../chunks/bundle-8TMXvllw.js';
import '../VoiceRecorder/context.js';
import './PlaybackTime.js';
import './Input.js';
import '@sendbird/uikit-tools';

function MessageProfile(props) {
    var message = props.message, channel = props.channel, userId = props.userId, _a = props.chainBottom, chainBottom = _a === void 0 ? false : _a, isByMe = props.isByMe, displayThreadReplies = props.displayThreadReplies;
    var avatarRef = useRef(null);
    var _b = useContext(UserProfileContext), disableUserProfile = _b.disableUserProfile, renderUserProfile = _b.renderUserProfile;
    if (isByMe || chainBottom || !isSendableMessage(message)) {
        return null;
    }
    return (React__default.createElement(ContextMenu, { menuTrigger: function (toggleDropdown) {
            var _a, _b;
            return (React__default.createElement(Avatar, { className: "sendbird-message-content__left__avatar ".concat(displayThreadReplies ? 'use-thread-replies' : ''), src: ((_b = (_a = channel === null || channel === void 0 ? void 0 : channel.members) === null || _a === void 0 ? void 0 : _a.find(function (member) { return (member === null || member === void 0 ? void 0 : member.userId) === message.sender.userId; })) === null || _b === void 0 ? void 0 : _b.profileUrl)
                    || message.sender.profileUrl
                    || '', 
                // TODO: Divide getting profileUrl logic to utils
                ref: avatarRef, width: "28px", height: "28px", onClick: function () {
                    if (!disableUserProfile)
                        toggleDropdown();
                } }));
        }, menuItems: function (closeDropdown) { return (renderUserProfile ? (renderUserProfile({
            user: message.sender,
            close: closeDropdown,
            currentUserId: userId,
            avatarRef: avatarRef,
        })) : (React__default.createElement(MenuItems
        /**
         * parentRef: For catching location(x, y) of MenuItems
         * parentContainRef: For toggling more options(menus & reactions)
        */
        , { 
            /**
             * parentRef: For catching location(x, y) of MenuItems
             * parentContainRef: For toggling more options(menus & reactions)
            */
            parentRef: avatarRef, parentContainRef: avatarRef, closeDropdown: closeDropdown, style: { paddingTop: '0px', paddingBottom: '0px' } },
            React__default.createElement(UserProfile, { user: message.sender, onSuccess: closeDropdown })))); } }));
}

var MESSAGE_ITEM_BODY_CLASSNAME = 'sendbird-message-content__middle__message-item-body';
function MessageBody(props) {
    var message = props.message, channel = props.channel, showFileViewer = props.showFileViewer, onMessageHeightChange = props.onMessageHeightChange, mouseHover = props.mouseHover, isMobile = props.isMobile, config = props.config, isReactionEnabledInChannel = props.isReactionEnabledInChannel, isByMe = props.isByMe;
    var threadMessageKindKey = useThreadMessageKindKeySelector({
        isMobile: isMobile,
    });
    var statefulFileInfoList = useFileInfoListWithUploaded(message); // For MultipleFilesMessage.
    var messageTypes = getUIKitMessageTypes();
    var isOgMessageEnabledInGroupChannel = (channel === null || channel === void 0 ? void 0 : channel.isGroupChannel()) && config.groupChannel.enableOgtag;
    return K(message)
        .when(function (message) { return isOgMessageEnabledInGroupChannel
        && isSendableMessage(message)
        && isOGMessage(message); }, function () { return (React__default.createElement(OGMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isMentionEnabled: (config === null || config === void 0 ? void 0 : config.isMentionEnabled) || false, isReactionEnabled: isReactionEnabledInChannel, onMessageHeightChange: onMessageHeightChange })); })
        .when(isTextMessage, function () { return (React__default.createElement(TextMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isMentionEnabled: (config === null || config === void 0 ? void 0 : config.isMentionEnabled) || false, isReactionEnabled: isReactionEnabledInChannel })); })
        .when(function (message) { return getUIKitMessageType(message) === messageTypes.FILE; }, function () { return (React__default.createElement(FileMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isReactionEnabled: isReactionEnabledInChannel })); })
        .when(isMultipleFilesMessage, function () { return (React__default.createElement(MultipleFilesMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isReactionEnabled: isReactionEnabledInChannel, threadMessageKindKey: threadMessageKindKey, statefulFileInfoList: statefulFileInfoList })); })
        .when(isVoiceMessage, function () {
        var _a;
        return (React__default.createElement(VoiceMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, channelUrl: (_a = channel === null || channel === void 0 ? void 0 : channel.url) !== null && _a !== void 0 ? _a : '', isByMe: isByMe, isReactionEnabled: isReactionEnabledInChannel }));
    })
        .when(isThumbnailMessage, function () { return (React__default.createElement(ThumbnailMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isReactionEnabled: isReactionEnabledInChannel, showFileViewer: showFileViewer, style: isMobile ? { width: '100%' } : {} })); })
        .otherwise(function (message) { return (React__default.createElement(UnknownMessageItemBody, { className: MESSAGE_ITEM_BODY_CLASSNAME, message: message, isByMe: isByMe, mouseHover: mouseHover, isReactionEnabled: isReactionEnabledInChannel })); });
}

function MessageHeader(props) {
    var _a, _b;
    var channel = props.channel, message = props.message;
    return (React__default.createElement(Label, { className: "sendbird-message-content__middle__sender-name", type: LabelTypography.CAPTION_2, color: LabelColors.ONBACKGROUND_2 }, 
    /**
     * To use the latest member profile information, message.sender might be outdated
     */
    ((_b = (_a = channel === null || channel === void 0 ? void 0 : channel.members) === null || _a === void 0 ? void 0 : _a.find(function (member) {
        var _a;
        // @ts-ignore
        return (member === null || member === void 0 ? void 0 : member.userId) === ((_a = message === null || message === void 0 ? void 0 : message.sender) === null || _a === void 0 ? void 0 : _a.userId);
    })) === null || _b === void 0 ? void 0 : _b.nickname) || getSenderName(message)
    // TODO: Divide getting profileUrl logic to utils
    ));
}

var SbFeedbackStatus;
(function (SbFeedbackStatus) {
    /** Feedback is unavailable for this message. This is the default value for base message. */
    SbFeedbackStatus["NOT_APPLICABLE"] = "NOT_APPLICABLE";
    /** Feedback can be set for this message, but nothing has been submitted yet. */
    SbFeedbackStatus["NO_FEEDBACK"] = "NO_FEEDBACK";
    /** Feedback can be set for this message, and something has been submitted. */
    SbFeedbackStatus["SUBMITTED"] = "SUBMITTED";
})(SbFeedbackStatus || (SbFeedbackStatus = {}));

function MessageFeedbackFailedModal(props) {
    var text = props.text, onCancel = props.onCancel;
    var stringSet = useContext(LocalizationContext).stringSet;
    var modalRef = useRef(null);
    var onKeyDown = useKeyDown(modalRef, {
        Enter: function () { return onCancel === null || onCancel === void 0 ? void 0 : onCancel(); },
        Escape: function () { return onCancel === null || onCancel === void 0 ? void 0 : onCancel(); },
    });
    return (React__default.createElement("div", { onKeyDown: onKeyDown },
        React__default.createElement(Modal, { contentClassName: 'sendbird-message-feedback-modal-content__mobile', type: ButtonTypes.PRIMARY, onSubmit: onCancel, onClose: onCancel, submitText: stringSet.BUTTON__OK, renderHeader: function () { return (React__default.createElement("div", { className: 'sendbird-modal__header' },
                React__default.createElement(Label, { type: LabelTypography.H_1, color: LabelColors.ONBACKGROUND_1, className: 'sendbird-message-feedback-modal-header' }, text))); }, customFooter: React__default.createElement("div", { className: 'sendbird-message-feedback-modal-footer__root_failed' },
                React__default.createElement(Button, { onClick: onCancel },
                    React__default.createElement(Label, { type: LabelTypography.BUTTON_3, color: LabelColors.ONCONTENT_1 }, stringSet.BUTTON__OK))) })));
}

function MessageContent(props) {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var 
    // Internal props
    className = props.className, userId = props.userId, channel = props.channel, message = props.message, _s = props.disabled, disabled = _s === void 0 ? false : _s, _t = props.chainTop, chainTop = _t === void 0 ? false : _t, _u = props.chainBottom, chainBottom = _u === void 0 ? false : _u, _v = props.isReactionEnabled, isReactionEnabled = _v === void 0 ? false : _v, _w = props.disableQuoteMessage, disableQuoteMessage = _w === void 0 ? false : _w, replyType = props.replyType, threadReplySelectType = props.threadReplySelectType, nicknamesMap = props.nicknamesMap, emojiContainer = props.emojiContainer, scrollToMessage = props.scrollToMessage, showEdit = props.showEdit, showRemove = props.showRemove, showFileViewer = props.showFileViewer, resendMessage = props.resendMessage, deleteMessage = props.deleteMessage, toggleReaction = props.toggleReaction, setQuoteMessage = props.setQuoteMessage, onReplyInThread = props.onReplyInThread, onQuoteMessageClick = props.onQuoteMessageClick, onMessageHeightChange = props.onMessageHeightChange, 
    // Public props for customization
    _x = props.renderSenderProfile, 
    // Public props for customization
    renderSenderProfile = _x === void 0 ? function (props) { return (React__default.createElement(MessageProfile, __assign({}, props))); } : _x, _y = props.renderMessageBody, renderMessageBody = _y === void 0 ? function (props) { return (React__default.createElement(MessageBody, __assign({}, props))); } : _y, _z = props.renderMessageHeader, renderMessageHeader = _z === void 0 ? function (props) { return (React__default.createElement(MessageHeader, __assign({}, props))); } : _z, _0 = props.renderMessageMenu, renderMessageMenu = _0 === void 0 ? function (props) { return (React__default.createElement(MessageMenu, __assign({}, props))); } : _0, _1 = props.renderEmojiMenu, renderEmojiMenu = _1 === void 0 ? function (props) { return (React__default.createElement(MessageEmojiMenu, __assign({}, props))); } : _1, _2 = props.renderEmojiReactions, renderEmojiReactions = _2 === void 0 ? function (props) { return (React__default.createElement(EmojiReactions, __assign({}, props))); } : _2;
    var dateLocale = useLocalization().dateLocale;
    var _3 = (useSendbirdStateContext === null || useSendbirdStateContext === void 0 ? void 0 : useSendbirdStateContext()) || {}, config = _3.config, eventHandlers = _3.eventHandlers;
    var onPressUserProfileHandler = (_a = eventHandlers === null || eventHandlers === void 0 ? void 0 : eventHandlers.reaction) === null || _a === void 0 ? void 0 : _a.onPressUserProfile;
    var contentRef = useRef(null);
    var isMobile = useMediaQueryContext().isMobile;
    var _4 = useState(false), showMenu = _4[0], setShowMenu = _4[1];
    var _5 = useState(false), mouseHover = _5[0], setMouseHover = _5[1];
    var _6 = useState(false), supposedHover = _6[0], setSupposedHover = _6[1];
    // Feedback states
    var _7 = useState(false), showFeedbackOptionsMenu = _7[0], setShowFeedbackOptionsMenu = _7[1];
    var _8 = useState(false), showFeedbackModal = _8[0], setShowFeedbackModal = _8[1];
    var _9 = useState(''), feedbackFailedText = _9[0], setFeedbackFailedText = _9[1];
    var stringSet = useContext(LocalizationContext).stringSet;
    var isByMe = (userId === ((_b = message === null || message === void 0 ? void 0 : message.sender) === null || _b === void 0 ? void 0 : _b.userId))
        || ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'pending')
        || ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'failed');
    var isByMeClassName = isByMe ? 'outgoing' : 'incoming';
    var chainTopClassName = chainTop ? 'chain-top' : '';
    var isReactionEnabledInChannel = isReactionEnabled && !(channel === null || channel === void 0 ? void 0 : channel.isEphemeral);
    var isReactionEnabledClassName = isReactionEnabledInChannel ? 'use-reactions' : '';
    var supposedHoverClassName = supposedHover ? 'sendbird-mouse-hover' : '';
    var useReplying = !!((replyType === 'QUOTE_REPLY' || replyType === 'THREAD')
        && (message === null || message === void 0 ? void 0 : message.parentMessageId) && (message === null || message === void 0 ? void 0 : message.parentMessage)
        && !disableQuoteMessage);
    var useReplyingClassName = useReplying ? 'use-quote' : '';
    // Thread replies
    var displayThreadReplies = ((_c = message === null || message === void 0 ? void 0 : message.threadInfo) === null || _c === void 0 ? void 0 : _c.replyCount) > 0 && replyType === 'THREAD';
    // Feedback buttons
    var isFeedbackMessage = !isByMe
        && (message === null || message === void 0 ? void 0 : message.myFeedbackStatus)
        && message.myFeedbackStatus !== SbFeedbackStatus.NOT_APPLICABLE;
    var isFeedbackEnabled = ((_d = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _d === void 0 ? void 0 : _d.enableFeedback) && isFeedbackMessage;
    var feedbackMessageClassName = isFeedbackEnabled ? 'sendbird-message-content__feedback' : '';
    var onCloseFeedbackForm = function () {
        setShowFeedbackModal(false);
    };
    var openFeedbackFormOrMenu = function () {
        if (isMobile) {
            setShowFeedbackOptionsMenu(true);
        }
        else {
            setShowFeedbackModal(true);
        }
    };
    // onMouseDown: (e: React.MouseEvent<T>) => void;
    // onTouchStart: (e: React.TouchEvent<T>) => void;
    // onMouseUp: (e: React.MouseEvent<T>) => void;
    // onMouseLeave: (e: React.MouseEvent<T>) => void;
    // onTouchEnd: (e: React.TouchEvent<T>) => void;
    var longPress = useLongPress({
        onLongPress: function () {
            if (isMobile) {
                setShowMenu(true);
            }
        },
        onClick: noop,
    }, {
        delay: 300,
        shouldPreventDefault: false,
    });
    if (((_e = message === null || message === void 0 ? void 0 : message.isAdminMessage) === null || _e === void 0 ? void 0 : _e.call(message)) || (message === null || message === void 0 ? void 0 : message.messageType) === 'admin') {
        return (React__default.createElement(AdminMessage, { message: message }));
    }
    return (React__default.createElement("div", { className: getClassName([className, 'sendbird-message-content', isByMeClassName, feedbackMessageClassName]), onMouseOver: function () { return setMouseHover(true); }, onMouseLeave: function () { return setMouseHover(false); } },
        React__default.createElement("div", { className: getClassName(['sendbird-message-content__left', isReactionEnabledClassName, isByMeClassName, useReplyingClassName]) },
            renderSenderProfile(__assign(__assign({}, props), { isByMe: isByMe, displayThreadReplies: displayThreadReplies })),
            isByMe && !isMobile && (React__default.createElement("div", { className: getClassName(['sendbird-message-content-menu', isReactionEnabledClassName, supposedHoverClassName, isByMeClassName]) },
                renderMessageMenu({
                    channel: channel,
                    message: message,
                    isByMe: isByMe,
                    replyType: replyType,
                    disabled: disabled,
                    showEdit: showEdit,
                    showRemove: showRemove,
                    resendMessage: resendMessage,
                    setQuoteMessage: setQuoteMessage,
                    setSupposedHover: setSupposedHover,
                    onReplyInThread: function (_a) {
                        var _b;
                        var message = _a.message;
                        if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                            onReplyInThread({ message: message });
                        }
                        else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                            scrollToMessage((_b = message.parentMessage) === null || _b === void 0 ? void 0 : _b.createdAt, message.parentMessageId);
                        }
                    },
                    deleteMessage: deleteMessage,
                }),
                isReactionEnabledInChannel && (renderEmojiMenu({
                    message: message,
                    userId: userId,
                    emojiContainer: emojiContainer,
                    toggleReaction: toggleReaction,
                    setSupposedHover: setSupposedHover,
                }))))),
        React__default.createElement("div", __assign({ className: 'sendbird-message-content__middle' }, (isMobile ? __assign({}, longPress) : {}), { ref: contentRef }),
            !isByMe && !chainTop && !useReplying && renderMessageHeader(props),
            (useReplying) ? (React__default.createElement("div", { className: getClassName(['sendbird-message-content__middle__quote-message', isByMe ? 'outgoing' : 'incoming', useReplyingClassName]) },
                React__default.createElement(QuoteMessage, { className: "sendbird-message-content__middle__quote-message__quote", message: message, userId: userId, isByMe: isByMe, isUnavailable: ((_f = channel === null || channel === void 0 ? void 0 : channel.messageOffsetTimestamp) !== null && _f !== void 0 ? _f : 0) > ((_h = (_g = message.parentMessage) === null || _g === void 0 ? void 0 : _g.createdAt) !== null && _h !== void 0 ? _h : 0), onClick: function () {
                        var _a;
                        if (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.THREAD) {
                            onQuoteMessageClick === null || onQuoteMessageClick === void 0 ? void 0 : onQuoteMessageClick({ message: message });
                        }
                        if ((replyType === 'QUOTE_REPLY' || (replyType === 'THREAD' && threadReplySelectType === ThreadReplySelectType.PARENT))
                            && ((_a = message === null || message === void 0 ? void 0 : message.parentMessage) === null || _a === void 0 ? void 0 : _a.createdAt) && (message === null || message === void 0 ? void 0 : message.parentMessageId)) {
                            scrollToMessage(message.parentMessage.createdAt, message.parentMessageId);
                        }
                    } }))) : null,
            React__default.createElement("div", { className: getClassName(['sendbird-message-content__middle__body-container']) },
                (isByMe && !chainBottom) && (React__default.createElement("div", { className: getClassName(['sendbird-message-content__middle__body-container__created-at', 'left', supposedHoverClassName]) },
                    React__default.createElement("div", { className: "sendbird-message-content__middle__body-container__created-at__component-container" },
                        React__default.createElement(MessageStatus, { message: message, channel: channel })))),
                renderMessageBody({
                    message: message,
                    channel: channel,
                    showFileViewer: showFileViewer,
                    onMessageHeightChange: onMessageHeightChange,
                    mouseHover: mouseHover,
                    isMobile: isMobile,
                    config: config,
                    isReactionEnabledInChannel: isReactionEnabledInChannel,
                    isByMe: isByMe,
                }),
                (isReactionEnabledInChannel && ((_j = message === null || message === void 0 ? void 0 : message.reactions) === null || _j === void 0 ? void 0 : _j.length) > 0) && (React__default.createElement("div", { className: getClassName([
                        'sendbird-message-content-reactions',
                        isMultipleFilesMessage(message)
                            ? 'image-grid'
                            : (!isByMe || isThumbnailMessage(message) || isOGMessage(message))
                                ? '' : 'primary',
                        mouseHover ? 'mouse-hover' : '',
                    ]) }, renderEmojiReactions({
                    userId: userId,
                    message: message,
                    channel: channel,
                    isByMe: isByMe,
                    emojiContainer: emojiContainer,
                    memberNicknamesMap: nicknamesMap,
                    toggleReaction: toggleReaction,
                    onPressUserProfile: onPressUserProfileHandler,
                }))),
                isFeedbackEnabled && React__default.createElement("div", { className: getClassName([
                        'sendbird-message-content__middle__body-container__feedback-buttons-container',
                        displayThreadReplies
                            ? 'sendbird-message-content__middle__body-container__feedback-buttons-container_with-thread-replies'
                            : '',
                    ]) },
                    React__default.createElement(FeedbackIconButton, { isSelected: ((_k = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _k === void 0 ? void 0 : _k.rating) === FeedbackRating.GOOD, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            var error_1;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!!((_a = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _a === void 0 ? void 0 : _a.rating)) return [3 /*break*/, 5];
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, message.submitFeedback({
                                                rating: FeedbackRating.GOOD,
                                            })];
                                    case 2:
                                        _d.sent();
                                        openFeedbackFormOrMenu();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_1 = _d.sent();
                                        (_c = (_b = config === null || config === void 0 ? void 0 : config.logger) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, 'Channel: Submit feedback failed.', error_1);
                                        setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SUBMIT);
                                        return [3 /*break*/, 4];
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        openFeedbackFormOrMenu();
                                        _d.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }, disabled: (message === null || message === void 0 ? void 0 : message.myFeedback) && message.myFeedback.rating !== FeedbackRating.GOOD },
                        React__default.createElement(Icon, { type: IconTypes.FEEDBACK_LIKE, width: '24px', height: '24px' })),
                    React__default.createElement(FeedbackIconButton, { isSelected: ((_l = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _l === void 0 ? void 0 : _l.rating) === FeedbackRating.BAD, onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                            var error_2;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0:
                                        if (!!((_a = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _a === void 0 ? void 0 : _a.rating)) return [3 /*break*/, 5];
                                        _d.label = 1;
                                    case 1:
                                        _d.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, message.submitFeedback({
                                                rating: FeedbackRating.BAD,
                                            })];
                                    case 2:
                                        _d.sent();
                                        openFeedbackFormOrMenu();
                                        return [3 /*break*/, 4];
                                    case 3:
                                        error_2 = _d.sent();
                                        (_c = (_b = config === null || config === void 0 ? void 0 : config.logger) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.call(_b, 'Channel: Submit feedback failed.', error_2);
                                        setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SUBMIT);
                                        return [3 /*break*/, 4];
                                    case 4: return [3 /*break*/, 6];
                                    case 5:
                                        openFeedbackFormOrMenu();
                                        _d.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); }, disabled: (message === null || message === void 0 ? void 0 : message.myFeedback) && message.myFeedback.rating !== FeedbackRating.BAD },
                        React__default.createElement(Icon, { type: IconTypes.FEEDBACK_DISLIKE, width: '24px', height: '24px' }))),
                (!isByMe && !chainBottom) && (React__default.createElement(Label, { className: getClassName(['sendbird-message-content__middle__body-container__created-at', 'right', supposedHoverClassName]), type: LabelTypography.CAPTION_3, color: LabelColors.ONBACKGROUND_2 }, format((message === null || message === void 0 ? void 0 : message.createdAt) || 0, 'p', {
                    locale: dateLocale,
                })))),
            displayThreadReplies && (React__default.createElement(ThreadReplies, { className: "sendbird-message-content__middle__thread-replies", threadInfo: message === null || message === void 0 ? void 0 : message.threadInfo, onClick: function () { return onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message }); } }))),
        React__default.createElement("div", { className: getClassName(['sendbird-message-content__right', chainTopClassName, isReactionEnabledClassName, useReplyingClassName]) }, !isByMe && !isMobile && (React__default.createElement("div", { className: getClassName(['sendbird-message-content-menu', chainTopClassName, supposedHoverClassName, isByMeClassName]) },
            isReactionEnabledInChannel && (renderEmojiMenu({
                className: 'sendbird-message-content-menu__reaction-menu',
                message: message,
                userId: userId,
                emojiContainer: emojiContainer,
                toggleReaction: toggleReaction,
                setSupposedHover: setSupposedHover,
            })),
            renderMessageMenu({
                className: 'sendbird-message-content-menu__normal-menu',
                channel: channel,
                message: message,
                isByMe: isByMe,
                replyType: replyType,
                disabled: disabled,
                showRemove: showRemove,
                resendMessage: resendMessage,
                setQuoteMessage: setQuoteMessage,
                setSupposedHover: setSupposedHover,
                onReplyInThread: function (_a) {
                    var _b;
                    var message = _a.message;
                    if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                        onReplyInThread({ message: message });
                    }
                    else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                        scrollToMessage((_b = message.parentMessage) === null || _b === void 0 ? void 0 : _b.createdAt, message.parentMessageId);
                    }
                },
                deleteMessage: deleteMessage,
            })))),
        showMenu && (((_m = message === null || message === void 0 ? void 0 : message.isUserMessage) === null || _m === void 0 ? void 0 : _m.call(message)) || ((_o = message === null || message === void 0 ? void 0 : message.isFileMessage) === null || _o === void 0 ? void 0 : _o.call(message)) || ((_p = message === null || message === void 0 ? void 0 : message.isMultipleFilesMessage) === null || _p === void 0 ? void 0 : _p.call(message))) && (React__default.createElement(MobileMenu, { parentRef: contentRef, channel: channel, hideMenu: function () { setShowMenu(false); }, message: message, isReactionEnabled: isReactionEnabledInChannel, isByMe: isByMe, userId: userId, replyType: replyType, disabled: disabled, showRemove: showRemove, emojiContainer: emojiContainer, resendMessage: resendMessage, deleteMessage: deleteMessage, setQuoteMessage: setQuoteMessage, toggleReaction: toggleReaction, showEdit: showEdit, onReplyInThread: function (_a) {
                var _b;
                var message = _a.message;
                if (threadReplySelectType === ThreadReplySelectType.THREAD) {
                    onReplyInThread === null || onReplyInThread === void 0 ? void 0 : onReplyInThread({ message: message });
                }
                else if (threadReplySelectType === ThreadReplySelectType.PARENT) {
                    scrollToMessage === null || scrollToMessage === void 0 ? void 0 : scrollToMessage(((_b = message === null || message === void 0 ? void 0 : message.parentMessage) === null || _b === void 0 ? void 0 : _b.createdAt) || 0, (message === null || message === void 0 ? void 0 : message.parentMessageId) || 0);
                }
            } })),
        ((_q = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _q === void 0 ? void 0 : _q.rating) && showFeedbackOptionsMenu && (React__default.createElement(MobileFeedbackMenu, { hideMenu: function () {
                setShowFeedbackOptionsMenu(false);
            }, onEditFeedback: function () {
                setShowFeedbackOptionsMenu(false);
                setShowFeedbackModal(true);
            }, onRemoveFeedback: function () { return __awaiter(_this, void 0, void 0, function () {
                var error_3;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, message.deleteFeedback(message.myFeedback.id)];
                        case 1:
                            _c.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _c.sent();
                            (_b = (_a = config === null || config === void 0 ? void 0 : config.logger) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, 'Channel: Delete feedback failed.', error_3);
                            setFeedbackFailedText(stringSet.FEEDBACK_FAILED_DELETE);
                            return [3 /*break*/, 3];
                        case 3:
                            setShowFeedbackOptionsMenu(false);
                            return [2 /*return*/];
                    }
                });
            }); } })),
        ((_r = message === null || message === void 0 ? void 0 : message.myFeedback) === null || _r === void 0 ? void 0 : _r.rating) && showFeedbackModal && (React__default.createElement(MessageFeedbackModal, { selectedFeedback: message.myFeedback.rating, message: message, onUpdate: function (selectedFeedback, comment) { return __awaiter(_this, void 0, void 0, function () {
                var newFeedback, error_4;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            newFeedback = new Feedback({
                                id: message.myFeedback.id,
                                rating: selectedFeedback,
                                comment: comment,
                            });
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, message.updateFeedback(newFeedback)];
                        case 2:
                            _c.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_4 = _c.sent();
                            (_b = (_a = config === null || config === void 0 ? void 0 : config.logger) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, 'Channel: Update feedback failed.', error_4);
                            setFeedbackFailedText(stringSet.FEEDBACK_FAILED_SAVE);
                            return [3 /*break*/, 4];
                        case 4:
                            onCloseFeedbackForm();
                            return [2 /*return*/];
                    }
                });
            }); }, onClose: onCloseFeedbackForm, onRemove: function () { return __awaiter(_this, void 0, void 0, function () {
                var error_5;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, message.deleteFeedback(message.myFeedback.id)];
                        case 1:
                            _c.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_5 = _c.sent();
                            (_b = (_a = config === null || config === void 0 ? void 0 : config.logger) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, 'Channel: Delete feedback failed.', error_5);
                            setFeedbackFailedText(stringSet.FEEDBACK_FAILED_DELETE);
                            return [3 /*break*/, 3];
                        case 3:
                            onCloseFeedbackForm();
                            return [2 /*return*/];
                    }
                });
            }); } })),
        feedbackFailedText && (React__default.createElement(MessageFeedbackFailedModal, { text: feedbackFailedText, onCancel: function () {
                setFeedbackFailedText('');
            } }))));
}

export { MessageContent as default };
//# sourceMappingURL=MessageContent.js.map
