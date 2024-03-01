import { _ as __assign, c as __spreadArray } from '../chunks/bundle-KMsJXUN2.js';
import React__default, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { N as NodeTypes, M as MessageInputKeys } from '../chunks/bundle-NOh3ukH6.js';
import { U as USER_MENTION_TEMP_CHAR } from '../chunks/bundle-hKmRj7Ck.js';
import IconButton from './IconButton.js';
import Button, { ButtonTypes, ButtonSizes } from './Button.js';
import { r as renderToString, s as sanitizeString, n as nodeListToArray, u as usePaste, i as isChannelTypeSupportsMultipleFilesMessage, e as extractTextAndMentions } from '../chunks/bundle-1uBgZh_D.js';
import Icon, { IconTypes, IconColors } from './Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../chunks/bundle-kMMCn6GE.js';
import { u as useLocalization } from '../chunks/bundle-msnuMA4R.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { F as arrayEqual, w as getClassName, G as getMimeTypesUIKitAccepts } from '../chunks/bundle-ZnLsMTHr.js';
import { t as tokenizeMessage, T as TOKEN_TYPES, U as USER_MENTION_PREFIX } from '../chunks/bundle-pODFB39J.js';
import { K } from '../chunks/bundle-LZemF1A7.js';
import { i as isMobileIOS } from '../chunks/bundle-7YRb7CRq.js';
import 'dompurify';
import '../chunks/bundle-qauKidkr.js';
import '../chunks/bundle-wf7f-9LT.js';
import '../chunks/bundle-cMznkLt0.js';
import '../chunks/bundle-Tg3CrpQU.js';
import '../chunks/bundle-CsWYoRVd.js';
import '../withSendbird.js';
import '@sendbird/chat/groupChannel';
import '../utils/message/getOutgoingMessageState.js';

/**
 * FIXME:
 * Import this ChannelType enum from @sendbird/chat
 * once MessageInput.spec unit tests can be run \wo jest <-> ESM issue
 */
var ChannelType;
(function (ChannelType) {
    ChannelType["BASE"] = "base";
    ChannelType["GROUP"] = "group";
    ChannelType["OPEN"] = "open";
})(ChannelType || (ChannelType = {}));
/**
 * FIXME: Simplify this in UIKit@v4
 * If customer is using MessageInput inside our modules(ie: Channel, Thread, etc),
 * we should use the config from the module.
 * If customer is using MessageInput outside our modules(ie: custom UI),
 * we expect Channel to be undefined and customer gets control to show/hide file-upload.
 * @param {*} channel GroupChannel | OpenChannel
 * @param {*} config SendBirdStateConfig
 * @returns boolean
 */
var checkIfFileUploadEnabled = function (_a) {
    var channel = _a.channel, config = _a.config;
    var isEnabled = K(channel === null || channel === void 0 ? void 0 : channel.channelType)
        .with(ChannelType.GROUP, function () { var _a; return (_a = config === null || config === void 0 ? void 0 : config.groupChannel) === null || _a === void 0 ? void 0 : _a.enableDocument; })
        .with(ChannelType.OPEN, function () { var _a; return (_a = config === null || config === void 0 ? void 0 : config.openChannel) === null || _a === void 0 ? void 0 : _a.enableDocument; })
        .otherwise(function () { return true; });
    return isEnabled;
};

var TEXT_FIELD_ID = 'sendbird-message-input-text-field';
var LINE_HEIGHT = 76;
var noop = function () {
    return null;
};
var displayCaret = function (element, position) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(element.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    element.focus();
};
var resetInput = function (ref) {
    try {
        ref.current.innerHTML = '';
    }
    catch (_a) {
        //
    }
};
var initialTargetStringInfo = {
    targetString: '',
    startNodeIndex: null,
    startOffsetIndex: null,
    endNodeIndex: null,
    endOffsetIndex: null,
};
var MessageInput = React__default.forwardRef(function (props, externalRef) {
    var _a, _b, _c, _d, _e;
    var channel = props.channel, _f = props.className, className = _f === void 0 ? '' : _f, _g = props.messageFieldId, messageFieldId = _g === void 0 ? '' : _g, _h = props.isEdit, isEdit = _h === void 0 ? false : _h, _j = props.isMobile, isMobile = _j === void 0 ? false : _j, _k = props.isMentionEnabled, isMentionEnabled = _k === void 0 ? false : _k, _l = props.isVoiceMessageEnabled, isVoiceMessageEnabled = _l === void 0 ? true : _l, _m = props.isSelectingMultipleFilesEnabled, isSelectingMultipleFilesEnabled = _m === void 0 ? false : _m, _o = props.disabled, disabled = _o === void 0 ? false : _o, _p = props.message, message = _p === void 0 ? null : _p, _q = props.placeholder, placeholder = _q === void 0 ? '' : _q, _r = props.maxLength, maxLength = _r === void 0 ? 5000 : _r, _s = props.onFileUpload, onFileUpload = _s === void 0 ? noop : _s, _t = props.onSendMessage, onSendMessage = _t === void 0 ? noop : _t, _u = props.onUpdateMessage, onUpdateMessage = _u === void 0 ? noop : _u, _v = props.onCancelEdit, onCancelEdit = _v === void 0 ? noop : _v, _w = props.onStartTyping, onStartTyping = _w === void 0 ? noop : _w, _x = props.channelUrl, channelUrl = _x === void 0 ? '' : _x, _y = props.mentionSelectedUser, mentionSelectedUser = _y === void 0 ? null : _y, _z = props.onUserMentioned, onUserMentioned = _z === void 0 ? noop : _z, _0 = props.onMentionStringChange, onMentionStringChange = _0 === void 0 ? noop : _0, _1 = props.onMentionedUserIdsUpdated, onMentionedUserIdsUpdated = _1 === void 0 ? noop : _1, _2 = props.onVoiceMessageIconClick, onVoiceMessageIconClick = _2 === void 0 ? noop : _2, _3 = props.onKeyUp, onKeyUp = _3 === void 0 ? noop : _3, _4 = props.onKeyDown, onKeyDown = _4 === void 0 ? noop : _4, _5 = props.renderFileUploadIcon, renderFileUploadIcon = _5 === void 0 ? noop : _5, _6 = props.renderVoiceMessageIcon, renderVoiceMessageIcon = _6 === void 0 ? noop : _6, _7 = props.renderSendMessageIcon, renderSendMessageIcon = _7 === void 0 ? noop : _7, _8 = props.setMentionedUsers, setMentionedUsers = _8 === void 0 ? noop : _8, acceptableMimeTypes = props.acceptableMimeTypes;
    var internalRef = (externalRef && 'current' in externalRef) ? externalRef : null;
    var textFieldId = messageFieldId || TEXT_FIELD_ID;
    var stringSet = useLocalization().stringSet;
    var config = useSendbirdStateContext().config;
    var isFileUploadEnabled = checkIfFileUploadEnabled({
        channel: channel,
        config: config,
    });
    var fileInputRef = useRef(null);
    var _9 = useState(false), isInput = _9[0], setIsInput = _9[1];
    var _10 = useState([]), mentionedUserIds = _10[0], setMentionedUserIds = _10[1];
    var _11 = useState(__assign({}, initialTargetStringInfo)), targetStringInfo = _11[0], setTargetStringInfo = _11[1];
    var setHeight = useMemo(function () { return function () {
        try {
            var elem = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
            var MAX_HEIGHT = window.document.body.offsetHeight * 0.6;
            if (elem && elem.scrollHeight >= LINE_HEIGHT) {
                if (MAX_HEIGHT < elem.scrollHeight) {
                    elem.style.height = 'auto';
                    elem.style.height = "".concat(MAX_HEIGHT, "px");
                }
                else {
                    elem.style.height = 'auto';
                    elem.style.height = "".concat(elem.scrollHeight, "px");
                }
            }
            else {
                elem.style.height = '';
            }
        }
        catch (error) {
            // error
        }
    }; }, []);
    // #Edit mode
    // for easilly initialize input value from outside, but
    // useEffect(_, [channelUrl]) erase it
    var initialValue = props === null || props === void 0 ? void 0 : props.value;
    useEffect(function () {
        var _a;
        var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
        try {
            textField.innerHTML = initialValue;
            displayCaret(textField, initialValue === null || initialValue === void 0 ? void 0 : initialValue.length);
        }
        catch (_b) {
            //
        }
        setMentionedUserIds([]);
        setIsInput(((_a = textField === null || textField === void 0 ? void 0 : textField.textContent) === null || _a === void 0 ? void 0 : _a.trim().length) > 0);
        setHeight();
    }, [initialValue]);
    // #Mention | Clear input value when channel changes
    useEffect(function () {
        if (!isEdit) {
            setIsInput(false);
            resetInput(internalRef);
        }
    }, [channelUrl]);
    // #Mention & #Edit | Fill message input values
    useEffect(function () {
        var _a, _b, _c;
        if (isEdit && (message === null || message === void 0 ? void 0 : message.messageId)) {
            // const textField = document.getElementById(textFieldId);
            var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
            if (isMentionEnabled && ((_a = message === null || message === void 0 ? void 0 : message.mentionedUsers) === null || _a === void 0 ? void 0 : _a.length) > 0 && ((_b = message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                /* mention enabled */
                var _d = message.mentionedUsers, mentionedUsers_1 = _d === void 0 ? [] : _d;
                var tokens = tokenizeMessage({
                    messageText: message === null || message === void 0 ? void 0 : message.mentionedMessageTemplate,
                    mentionedUsers: mentionedUsers_1,
                });
                textField.innerHTML = tokens
                    .map(function (token) {
                    if (token.type === TOKEN_TYPES.mention) {
                        var mentionedUser = mentionedUsers_1.find(function (user) { return user.userId === token.userId; });
                        var nickname = "".concat(USER_MENTION_PREFIX).concat((mentionedUser === null || mentionedUser === void 0 ? void 0 : mentionedUser.nickname) || token.value || stringSet.MENTION_NAME__NO_NAME);
                        return renderToString({
                            userId: token.userId,
                            nickname: nickname,
                        });
                    }
                    return sanitizeString(token.value);
                })
                    .join(' ');
            }
            else {
                /* mention disabled */
                try {
                    textField.innerHTML = sanitizeString(message === null || message === void 0 ? void 0 : message.message);
                }
                catch (_e) {
                    //
                }
                setMentionedUserIds([]);
            }
            setIsInput(((_c = textField === null || textField === void 0 ? void 0 : textField.textContent) === null || _c === void 0 ? void 0 : _c.trim().length) > 0);
            setHeight();
        }
    }, [isEdit, message]);
    // #Mention | Detect MentionedLabel modified
    var useMentionedLabelDetection = useCallback(function () {
        var _a;
        var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
        if (isMentionEnabled) {
            var newMentionedUserIds = Array.from(textField.getElementsByClassName('sendbird-mention-user-label')).map(
            // @ts-ignore
            function (node) { var _a; return (_a = node === null || node === void 0 ? void 0 : node.dataset) === null || _a === void 0 ? void 0 : _a.userid; });
            if (!arrayEqual(mentionedUserIds, newMentionedUserIds) || newMentionedUserIds.length === 0) {
                onMentionedUserIdsUpdated(newMentionedUserIds);
                setMentionedUserIds(newMentionedUserIds);
            }
        }
        setIsInput(((_a = textField.textContent) === null || _a === void 0 ? void 0 : _a.trim().length) > 0);
    }, [targetStringInfo, isMentionEnabled]);
    // #Mention | Replace selected user nickname to the MentionedUserLabel
    useEffect(function () {
        var _a, _b;
        if (isMentionEnabled && mentionSelectedUser) {
            var targetString = targetStringInfo.targetString, startNodeIndex = targetStringInfo.startNodeIndex, startOffsetIndex = targetStringInfo.startOffsetIndex, endNodeIndex = targetStringInfo.endNodeIndex, endOffsetIndex = targetStringInfo.endOffsetIndex;
            if (targetString && startNodeIndex !== null && startOffsetIndex !== null) {
                // const textField = document.getElementById(textFieldId);
                var textField_1 = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
                var childNodes = nodeListToArray(textField_1 === null || textField_1 === void 0 ? void 0 : textField_1.childNodes);
                var frontTextNode = document === null || document === void 0 ? void 0 : document.createTextNode((_a = childNodes[startNodeIndex]) === null || _a === void 0 ? void 0 : _a.textContent.slice(0, startOffsetIndex));
                var backTextNode = document === null || document === void 0 ? void 0 : document.createTextNode("\u00A0".concat((_b = childNodes[endNodeIndex]) === null || _b === void 0 ? void 0 : _b.textContent.slice(endOffsetIndex)));
                var mentionLabel = renderToString({
                    userId: mentionSelectedUser === null || mentionSelectedUser === void 0 ? void 0 : mentionSelectedUser.userId,
                    nickname: "".concat(USER_MENTION_TEMP_CHAR).concat((mentionSelectedUser === null || mentionSelectedUser === void 0 ? void 0 : mentionSelectedUser.nickname) || stringSet.MENTION_NAME__NO_NAME),
                });
                var div = document.createElement('div');
                div.innerHTML = mentionLabel;
                var newNodes = __spreadArray(__spreadArray(__spreadArray([], childNodes.slice(0, startNodeIndex), true), [
                    frontTextNode,
                    div.childNodes[0],
                    backTextNode
                ], false), childNodes.slice(endNodeIndex + 1), true);
                textField_1.innerHTML = '';
                newNodes.forEach(function (newNode) {
                    textField_1.appendChild(newNode);
                });
                onUserMentioned(mentionSelectedUser);
                if (window.getSelection || document.getSelection) {
                    // set caret postion
                    var selection = window.getSelection() || document.getSelection();
                    selection.removeAllRanges();
                    var range = new Range();
                    range.selectNodeContents(textField_1);
                    range.setStart(textField_1.childNodes[startNodeIndex + 2], 1);
                    range.setEnd(textField_1.childNodes[startNodeIndex + 2], 1);
                    range.collapse(false);
                    selection.addRange(range);
                    textField_1.focus();
                }
                setTargetStringInfo(__assign({}, initialTargetStringInfo));
                setHeight();
                useMentionedLabelDetection();
            }
        }
    }, [mentionSelectedUser, isMentionEnabled]);
    // #Mention | Detect mentioning user nickname
    var useMentionInputDetection = useCallback(function () {
        var _a, _b;
        var selection = ((_a = window === null || window === void 0 ? void 0 : window.getSelection) === null || _a === void 0 ? void 0 : _a.call(window)) || ((_b = document === null || document === void 0 ? void 0 : document.getSelection) === null || _b === void 0 ? void 0 : _b.call(document));
        var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
        if (selection.anchorNode === textField) {
            onMentionStringChange('');
        }
        if (isMentionEnabled
            && selection
            && selection.anchorNode === selection.focusNode
            && selection.anchorOffset === selection.focusOffset) {
            var textStack = '';
            var startNodeIndex = null;
            var startOffsetIndex = null;
            for (var index = 0; index < textField.childNodes.length; index += 1) {
                var currentNode = textField.childNodes[index];
                if (currentNode.nodeType === NodeTypes.TextNode) {
                    /* text node */
                    var textContent = currentNode === selection.anchorNode
                        ? (currentNode === null || currentNode === void 0 ? void 0 : currentNode.textContent.slice(0, selection.anchorOffset)) || ''
                        : (currentNode === null || currentNode === void 0 ? void 0 : currentNode.textContent) || '';
                    if (textStack.length > 0) {
                        textStack += textContent;
                    }
                    else {
                        var charLastIndex = textContent.lastIndexOf(USER_MENTION_TEMP_CHAR);
                        for (var i = charLastIndex - 1; i > -1; i -= 1) {
                            if (textContent[i] === USER_MENTION_TEMP_CHAR) {
                                charLastIndex = i;
                            }
                            else {
                                break;
                            }
                        }
                        if (charLastIndex > -1) {
                            textStack = textContent;
                            startNodeIndex = index;
                            startOffsetIndex = charLastIndex;
                        }
                    }
                }
                else {
                    /* other nodes */
                    textStack = '';
                    startNodeIndex = null;
                    startOffsetIndex = null;
                }
                if (currentNode === selection.anchorNode) {
                    /**
                     * targetString could be ''
                     * startNodeIndex and startOffsetIndex could be null
                     */
                    var targetString = textStack ? textStack.slice(startOffsetIndex) : ''; // include template character
                    setTargetStringInfo({
                        targetString: targetString,
                        startNodeIndex: startNodeIndex,
                        startOffsetIndex: startOffsetIndex,
                        endNodeIndex: index,
                        endOffsetIndex: selection.anchorOffset,
                    });
                    onMentionStringChange(targetString);
                    return;
                }
            }
        }
    }, [isMentionEnabled]);
    var sendMessage = function () {
        var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
        if (!isEdit && (textField === null || textField === void 0 ? void 0 : textField.textContent)) {
            var _a = extractTextAndMentions(textField.childNodes), messageText = _a.messageText, mentionTemplate = _a.mentionTemplate;
            var params = { message: messageText, mentionTemplate: mentionTemplate };
            onSendMessage(params);
            resetInput(internalRef);
            // important: keeps the keyboard open -> must add test on refactor
            textField.focus();
            setIsInput(false);
            setHeight();
        }
    };
    var isEditDisabled = !((_b = (_a = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim());
    var editMessage = function () {
        var textField = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current;
        var messageId = message === null || message === void 0 ? void 0 : message.messageId;
        if (isEdit && messageId) {
            var _a = extractTextAndMentions(textField.childNodes), messageText = _a.messageText, mentionTemplate = _a.mentionTemplate;
            var params = { messageId: messageId, message: messageText, mentionTemplate: mentionTemplate };
            onUpdateMessage(params);
            resetInput(internalRef);
        }
    };
    var onPaste = usePaste({
        ref: internalRef,
        setMentionedUsers: setMentionedUsers,
        channel: channel,
        setIsInput: setIsInput,
        setHeight: setHeight,
    });
    return (React__default.createElement("form", { className: getClassName([
            className,
            isEdit ? 'sendbird-message-input__edit' : '',
            disabled ? 'sendbird-message-input-form__disabled' : '',
        ]) },
        React__default.createElement("div", { className: getClassName(['sendbird-message-input', disabled ? 'sendbird-message-input__disabled' : '']) },
            React__default.createElement("div", { id: "".concat(textFieldId).concat(isEdit ? message === null || message === void 0 ? void 0 : message.messageId : ''), className: "sendbird-message-input--textarea ".concat(textFieldId), contentEditable: !disabled, role: "textbox", "aria-label": "Text Input", ref: externalRef, 
                // @ts-ignore
                disabled: disabled, maxLength: maxLength, onKeyDown: function (e) {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    var preventEvent = onKeyDown(e);
                    if (preventEvent) {
                        e.preventDefault();
                    }
                    else {
                        if (!e.shiftKey
                            && e.key === MessageInputKeys.Enter
                            && !isMobile
                            && ((_b = (_a = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().length) > 0
                            && ((_c = e === null || e === void 0 ? void 0 : e.nativeEvent) === null || _c === void 0 ? void 0 : _c.isComposing) !== true
                        /**
                         * NOTE: What isComposing does?
                         * Check if the user has finished composing characters
                         * (e.g., for languages like Korean, Japanese, where characters are composed from multiple keystrokes)
                         * Prevents executing the code while the user is still composing characters.
                         */
                        ) {
                            /**
                             * NOTE: contentEditable does not work as expected in mobile WebKit(Safari).
                             * Events and properties related to composing, necessary for combining characters like Hangul, also seem to be not handled properly.
                             * When calling e.preventDefault(), it appears that string composition-related behaviors, in addition to the default actions, are also prevented. (maybe)
                             *
                             * Due to this issue, even though reset the input with innerHTML, incomplete text compositions from the previous input are displayed in the next input.
                             * */
                            if (!isMobileIOS(navigator.userAgent)) {
                                e.preventDefault();
                            }
                            sendMessage();
                        }
                        if (e.key === MessageInputKeys.Backspace
                            && ((_e = (_d = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _d === void 0 ? void 0 : _d.childNodes) === null || _e === void 0 ? void 0 : _e.length) === 2
                            && !((_h = (_g = (_f = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _f === void 0 ? void 0 : _f.childNodes) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.textContent)
                            && ((_k = (_j = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current.childNodes) === null || _j === void 0 ? void 0 : _j[1]) === null || _k === void 0 ? void 0 : _k.nodeType) === NodeTypes.ElementNode) {
                            internalRef === null || internalRef === void 0 ? void 0 : internalRef.current.removeChild(internalRef === null || internalRef === void 0 ? void 0 : internalRef.current.childNodes[1]);
                        }
                    }
                }, onKeyUp: function (e) {
                    var preventEvent = onKeyUp(e);
                    if (preventEvent) {
                        e.preventDefault();
                    }
                    else {
                        useMentionInputDetection();
                    }
                }, onClick: function () {
                    useMentionInputDetection();
                }, onInput: function () {
                    var _a, _b;
                    setHeight();
                    onStartTyping();
                    setIsInput(((_b = (_a = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim().length) > 0);
                    useMentionedLabelDetection();
                }, onPaste: onPaste }),
            ((_e = (_d = (_c = internalRef === null || internalRef === void 0 ? void 0 : internalRef.current) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 0) === 0 && (React__default.createElement(Label, { className: "sendbird-message-input--placeholder", type: LabelTypography.BODY_1, color: disabled ? LabelColors.ONBACKGROUND_4 : LabelColors.ONBACKGROUND_3 }, placeholder || stringSet.MESSAGE_INPUT__PLACE_HOLDER)),
            !isEdit && isInput && (React__default.createElement(IconButton, { className: "sendbird-message-input--send", height: "32px", width: "32px", onClick: function () { return sendMessage(); } }, (renderSendMessageIcon === null || renderSendMessageIcon === void 0 ? void 0 : renderSendMessageIcon()) || (React__default.createElement(Icon, { type: IconTypes.SEND, fillColor: disabled ? IconColors.ON_BACKGROUND_4 : IconColors.PRIMARY, width: "20px", height: "20px" })))),
            !isEdit
                && !isInput
                && ((renderFileUploadIcon === null || renderFileUploadIcon === void 0 ? void 0 : renderFileUploadIcon())
                    // UIKit Dashboard configuration should have lower priority than
                    // renderFileUploadIcon which is set in code level
                    || (isFileUploadEnabled && (React__default.createElement(IconButton, { className: "sendbird-message-input--attach ".concat(isVoiceMessageEnabled ? 'is-voice-message-enabled' : ''), height: "32px", width: "32px", onClick: function () {
                            var _a, _b;
                            // todo: clear previous input
                            (_b = (_a = fileInputRef === null || fileInputRef === void 0 ? void 0 : fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click) === null || _b === void 0 ? void 0 : _b.call(_a);
                        } },
                        React__default.createElement(Icon, { type: IconTypes.ATTACH, fillColor: disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE, width: "20px", height: "20px" }),
                        React__default.createElement("input", { className: "sendbird-message-input--attach-input", type: "file", ref: fileInputRef, 
                            // It will affect to <Channel /> and <Thread />
                            onChange: function (event) {
                                var files = event.currentTarget.files;
                                onFileUpload(files && files.length === 1 ? [files[0]] : Array.from(files));
                                event.target.value = '';
                            }, accept: getMimeTypesUIKitAccepts(acceptableMimeTypes), multiple: isSelectingMultipleFilesEnabled && isChannelTypeSupportsMultipleFilesMessage(channel) }))))),
            isVoiceMessageEnabled && !isEdit && !isInput && (React__default.createElement(IconButton, { className: "sendbird-message-input--voice-message", width: "32px", height: "32px", onClick: onVoiceMessageIconClick }, (renderVoiceMessageIcon === null || renderVoiceMessageIcon === void 0 ? void 0 : renderVoiceMessageIcon()) || (React__default.createElement(Icon, { type: IconTypes.AUDIO_ON_LINED, fillColor: disabled ? IconColors.ON_BACKGROUND_4 : IconColors.CONTENT_INVERSE, width: "20px", height: "20px" }))))),
        isEdit && (React__default.createElement("div", { className: "sendbird-message-input--edit-action" },
            React__default.createElement(Button, { className: "sendbird-message-input--edit-action__cancel", type: ButtonTypes.SECONDARY, size: ButtonSizes.SMALL, onClick: onCancelEdit }, stringSet.BUTTON__CANCEL),
            React__default.createElement(Button, { className: "sendbird-message-input--edit-action__save", type: ButtonTypes.PRIMARY, size: ButtonSizes.SMALL, disabled: isEditDisabled, onClick: function () { return editMessage(); } }, stringSet.BUTTON__SAVE)))));
});

export { MessageInput as default };
//# sourceMappingURL=MessageInput.js.map
