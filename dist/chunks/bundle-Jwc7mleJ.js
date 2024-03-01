import { _ as __assign, c as __spreadArray } from './bundle-xhjHZ041.js';
import { GroupChannelListOrder } from '@sendbird/chat/groupChannel';
import { OutgoingMessageStates, getOutgoingMessageState } from '../utils/message/getOutgoingMessageState.js';
import { K } from './bundle-AN6QCsUL.js';

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
var SUPPORTED_MIMES = {
    IMAGE: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/svg+xml',
        'image/webp', // not supported in IE
    ],
    VIDEO: [
        'video/mpeg',
        'video/ogg',
        'video/webm',
        'video/mp4',
        'video/quicktime', // .mov
    ],
    AUDIO: [
        'audio/aac',
        'audio/midi',
        'audio/x-midi',
        'audio/mpeg',
        'audio/ogg',
        'audio/opus',
        'audio/wav',
        'audio/webm',
        'audio/3gpp',
        'audio/3gpp2',
        'audio/mp3',
    ],
    DOCUMENT: [
        'text/plain',
        'text/css',
        'text/csv',
        'text/html',
        'text/calendar',
        'text/javascript',
        'text/xml',
    ],
    APPLICATION: [
        'application/x-abiword',
        'application/x-freearc',
        'application/vnd.amazon.ebook',
        'application/octet-stream',
        'application/x-bzip',
        'application/x-bzip2',
        'application/x-cdf',
        'application/x-csh',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-fontobject',
        'application/epub+zip',
        'application/gzip',
        'application/java-archive',
        'application/json',
        'application/ld+json',
        'application/vnd.apple.installer+xml',
        'application/vnd.oasis.opendocument.presentation',
        'application/vnd.oasis.opendocument.spreadsheet',
        'application/vnd.oasis.opendocument.text',
        'application/ogg',
        'application/pdf',
        'application/x-httpd-php',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.rar',
        'application/rtf',
        'application/x-sh',
        'application/x-tar',
        'application/vnd.visio',
        'application/xhtml+xml',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/xml',
        'application/vnd.mozilla.xul+xml',
        'application/zip',
        'application/x-7z-compressed',
    ],
};
var getMimeTypesUIKitAccepts = function (acceptableMimeTypes) {
    if (Array.isArray(acceptableMimeTypes) && acceptableMimeTypes.length > 0) {
        return acceptableMimeTypes
            .reduce(function (prev, curr) {
            switch (curr) {
                case 'image': {
                    prev.push.apply(prev, SUPPORTED_MIMES.IMAGE);
                    break;
                }
                case 'video': {
                    prev.push.apply(prev, SUPPORTED_MIMES.VIDEO);
                    break;
                }
                case 'audio': {
                    prev.push.apply(prev, SUPPORTED_MIMES.AUDIO);
                    break;
                }
                default: {
                    prev.push(curr);
                    break;
                }
            }
            return prev;
        }, [])
            .join();
    }
    return Object.values(SUPPORTED_MIMES).reduce(function (prev, curr) { return (prev.concat(curr)); }, []).join();
};
var UIKitMessageTypes = {
    ADMIN: 'ADMIN',
    TEXT: 'TEXT',
    FILE: 'FILE',
    MULTIPLE_FILES: 'MULTIPLE_FILES',
    THUMBNAIL: 'THUMBNAIL',
    OG: 'OG',
    UNKNOWN: 'UNKNOWN',
};
var UIKitFileTypes = {
    IMAGE: 'IMAGE',
    AUDIO: 'AUDIO',
    VIDEO: 'VIDEO',
    GIF: 'GIF',
    VOICE: 'VOICE',
    OTHERS: 'OTHERS',
};
var isTextuallyNull = function (text) {
    if (text === '' || text === null) {
        return true;
    }
    return false;
};
var isImage = function (type) { return SUPPORTED_MIMES.IMAGE.indexOf(type) >= 0; };
var isVideo = function (type) { return SUPPORTED_MIMES.VIDEO.indexOf(type) >= 0; };
var isGif = function (type) { return type === 'image/gif'; };
var isSupportedFileView = function (type) { return isImage(type) || isVideo(type); };
var isAudio = function (type) { return SUPPORTED_MIMES.AUDIO.indexOf(type) >= 0; };
var getUIKitFileTypes = function () { return (__assign({}, UIKitFileTypes)); };
var getUIKitFileType = function (type) {
    if (isGif(type))
        return UIKitFileTypes.GIF;
    if (isImage(type))
        return UIKitFileTypes.IMAGE;
    if (isVideo(type))
        return UIKitFileTypes.VIDEO;
    if (isAudio(type))
        return UIKitFileTypes.AUDIO;
    return UIKitFileTypes.OTHERS;
};
var isSentMessage = function (message) { return (message.sendingStatus === 'succeeded'); };
var isReadMessage = function (channel, message) { return (getOutgoingMessageState(channel, message) === OutgoingMessageStates.READ); };
// TODO: Remove channel from the params, it seems unnecessary
var isFailedMessage = function (message) { return ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'failed'); };
var isPendingMessage = function (message) { return ((message === null || message === void 0 ? void 0 : message.sendingStatus) === 'pending'); };
var isSentStatus = function (state) { return (state === OutgoingMessageStates.SENT
    || state === OutgoingMessageStates.DELIVERED
    || state === OutgoingMessageStates.READ); };
var isAdminMessage = function (message) { return (message && (message['isAdminMessage'] && typeof message.isAdminMessage === 'function'
    ? message.isAdminMessage()
    : (message === null || message === void 0 ? void 0 : message.messageType) === 'admin')); };
var isUserMessage = function (message) { return (message && (message['isUserMessage'] && typeof message.isUserMessage === 'function'
    ? message.isUserMessage()
    : (message === null || message === void 0 ? void 0 : message.messageType) === 'user')); };
var isFileMessage = function (message) { return (message && (message['isFileMessage'] && typeof message.isFileMessage === 'function'
    ? message.isFileMessage()
    : (message === null || message === void 0 ? void 0 : message.messageType) === 'file')); };
var isMultipleFilesMessage = function (message) { return (message && (message['isMultipleFilesMessage'] && typeof message.isMultipleFilesMessage === 'function'
    ? message.isMultipleFilesMessage()
    : (message.messageType === 'file'
        && Object.prototype.hasOwnProperty.call(message, 'fileInfoList')))); };
var isThreadMessage = function (message) { return (!!message.parentMessageId && !!message.parentMessage); };
var isOGMessage = function (message) {
    var _a, _b, _c, _d;
    return !!(message && isUserMessage(message) && (message === null || message === void 0 ? void 0 : message.ogMetaData) && (((_a = message.ogMetaData) === null || _a === void 0 ? void 0 : _a.url)
        || ((_b = message.ogMetaData) === null || _b === void 0 ? void 0 : _b.title)
        || ((_c = message.ogMetaData) === null || _c === void 0 ? void 0 : _c.description)
        || ((_d = message.ogMetaData) === null || _d === void 0 ? void 0 : _d.defaultImage)));
};
var isTextMessage = function (message) { return (isUserMessage(message)); };
var isThumbnailMessage = function (message) { return (message && isFileMessage(message) && isSupportedFileView(message.type)); };
var isImageMessage = function (message) { return message && message.isFileMessage() && isThumbnailMessage(message) && isImage(message.type); };
var isImageFileInfo = function (fileInfo) { return fileInfo
    && (isImage(fileInfo.mimeType) || isGif(fileInfo.mimeType)); };
var isVideoMessage = function (message) { return (message && isThumbnailMessage(message) && isVideo(message.type)); };
var isGifMessage = function (message) { return (message && isThumbnailMessage(message) && isGif(message.type)); };
var isAudioMessage = function (message) { return message && isFileMessage(message) && isAudio(message.type); };
var isAudioMessageMimeType = function (type) { return (/^audio\//.test(type)); };
var isVoiceMessageMimeType = function (type) { return (/^voice\//.test(type)); };
var isVoiceMessage = function (message) {
    var _a, _b, _c, _d;
    // ex) audio/m4a OR audio/m4a;sbu_type=voice
    if (!(message && isFileMessage(message)) || !message.type) {
        return false;
    }
    var _e = message.type.split(';'), mimeType = _e[0], typeParameter = _e[1];
    if (!isAudioMessageMimeType(mimeType)) {
        return false;
    }
    if (typeParameter) {
        var _f = typeParameter.split('='), key = _f[0], value = _f[1];
        return key === 'sbu_type' && value === 'voice';
    }
    // ex) message.metaArrays = [{ key: 'KEY_INTERNAL_MESSAGE_TYPE', value: ['voice/m4a'] }]
    return isVoiceMessageMimeType((_d = (_c = (_b = (_a = message === null || message === void 0 ? void 0 : message.metaArrays) === null || _a === void 0 ? void 0 : _a.find(function (metaArray) { return metaArray.key === 'KEY_INTERNAL_MESSAGE_TYPE'; })) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c[0]) !== null && _d !== void 0 ? _d : '');
};
var isEditedMessage = function (message) { return isUserMessage(message) && ((message === null || message === void 0 ? void 0 : message.updatedAt) > 0); };
var getUIKitMessageTypes = function () { return (__assign({}, UIKitMessageTypes)); };
/**
 * Do not use this for MultipleFilesMessage. Use isMultipleFilesMessage() instead.
 */
var getUIKitMessageType = function (message) {
    if (isAdminMessage(message))
        return UIKitMessageTypes.ADMIN;
    if (isUserMessage(message)) {
        return isOGMessage(message) ? UIKitMessageTypes.OG : UIKitMessageTypes.TEXT;
    }
    // This is only a safeguard to not return UNKNOWN for MFM.
    if (isMultipleFilesMessage(message)) {
        return UIKitMessageTypes.MULTIPLE_FILES;
    }
    if (isFileMessage(message)) {
        if (isThumbnailMessage(message)) {
            return UIKitMessageTypes.THUMBNAIL;
        }
        if (isVoiceMessage(message)) {
            return UIKitFileTypes.VOICE;
        }
        return UIKitMessageTypes.FILE;
    }
    return UIKitMessageTypes.UNKNOWN;
};
var reducer = function (accumulator, currentValue) {
    if (Array.isArray(currentValue)) {
        return __spreadArray(__spreadArray([], accumulator, true), currentValue, true);
    }
    else {
        accumulator.push(currentValue);
        return accumulator;
    }
};
var getClassName = function (classNames) { return (Array.isArray(classNames)
    ? classNames.reduce(reducer, []).join(' ')
    : classNames); };
var isReactedBy = function (userId, reaction) { return (reaction.userIds.some(function (reactorUserId) { return reactorUserId === userId; })); };
var getEmojiTooltipString = function (reaction, userId, memberNicknamesMap, stringSet) {
    var you = '';
    if (isReactedBy(userId, reaction)) {
        you = reaction.userIds.length === 1 ? stringSet.TOOLTIP__YOU : stringSet.TOOLTIP__AND_YOU;
    }
    return ("".concat(reaction.userIds
        .filter(function (reactorUserId) { return reactorUserId !== userId; })
        .map(function (reactorUserId) { return (memberNicknamesMap.get(reactorUserId) || stringSet.TOOLTIP__UNKNOWN_USER); })
        .join(', ')).concat(you));
};
function getSuggestedReplies(message) {
    var _a;
    if (Array.isArray((_a = message === null || message === void 0 ? void 0 : message.extendedMessagePayload) === null || _a === void 0 ? void 0 : _a.suggested_replies)) {
        return message.extendedMessagePayload.suggested_replies;
    }
    else {
        return [];
    }
}
var URL_REG = /^((http|https):\/\/)?([a-z\d-]+\.)+[a-z]{2,}(\:[0-9]{1,5})?(\/[-a-zA-Z\d%_.~+&=]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(#\S*)?$/;
/** @deprecated
 * URL detection in a message text will be handled in utils/tokens/tokenize.ts
 */
var isUrl = function (text) { return URL_REG.test(text); };
var truncateString = function (fullStr, strLen) {
    if (!strLen)
        strLen = 40;
    if (fullStr === null || fullStr === undefined)
        return '';
    if (fullStr.length <= strLen)
        return fullStr;
    var separator = '...';
    var sepLen = separator.length;
    var charsToShow = strLen - sepLen;
    var frontChars = Math.ceil(charsToShow / 2);
    var backChars = Math.floor(charsToShow / 2);
    return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
};
var copyToClipboard = function (text) {
    // @ts-ignore: Unreachable code error
    if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        // @ts-ignore: Unreachable code error
        return window.clipboardData.setData('Text', text);
    }
    if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea');
        textarea.textContent = text;
        textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand('copy'); // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
    return false;
};
var getEmojiListAll = function (emojiContainer) {
    var _a;
    return ((_a = emojiContainer === null || emojiContainer === void 0 ? void 0 : emojiContainer.emojiCategories) === null || _a === void 0 ? void 0 : _a.map(function (emojiCategory) { return emojiCategory.emojis; }).reduce(function (prevArr, currArr) { return prevArr.concat(currArr); }, []));
};
var getEmojiMapAll = function (emojiContainer) {
    var _a;
    var emojiMap = new Map();
    (_a = emojiContainer === null || emojiContainer === void 0 ? void 0 : emojiContainer.emojiCategories) === null || _a === void 0 ? void 0 : _a.forEach(function (category) {
        var _a;
        (_a = category === null || category === void 0 ? void 0 : category.emojis) === null || _a === void 0 ? void 0 : _a.forEach(function (emoji) {
            if (emoji && emoji.key) {
                emojiMap.set(emoji.key, emoji);
            }
        });
    });
    return emojiMap;
};
var findEmojiUrl = function (targetKey) { return function (_a) {
    var key = _a.key;
    return key === targetKey;
}; };
var getEmojiUrl = function (emojiContainer, emojiKey) {
    var _a, _b;
    var isFindingKey = findEmojiUrl(emojiKey !== null && emojiKey !== void 0 ? emojiKey : '');
    return ((_b = (_a = emojiContainer === null || emojiContainer === void 0 ? void 0 : emojiContainer.emojiCategories.find(function (category) { return category.emojis.some(isFindingKey); })) === null || _a === void 0 ? void 0 : _a.emojis.find(isFindingKey)) === null || _b === void 0 ? void 0 : _b.url) || '';
};
var getUserName = function (user) { return ((user === null || user === void 0 ? void 0 : user.friendName) || (user === null || user === void 0 ? void 0 : user.nickname) || (user === null || user === void 0 ? void 0 : user.userId)); };
var getSenderName = function (message) { return ((message === null || message === void 0 ? void 0 : message.sender) && getUserName(message === null || message === void 0 ? void 0 : message.sender)); };
var hasSameMembers = function (a, b) {
    if (a === b) {
        return true;
    }
    if (a == null || b == null) {
        return false;
    }
    if (a.length !== b.length) {
        return false;
    }
    var sortedA = __spreadArray([], a, true).sort();
    var sortedB = __spreadArray([], b, true).sort();
    for (var i = 0; i < sortedA.length; ++i) {
        if (sortedA[i] !== sortedB[i]) {
            return false;
        }
    }
    return true;
};
var isFriend = function (user) {
    if (!user)
        return false;
    return !!(user.friendDiscoveryKey || user.friendName);
};
var filterMessageListParams = function (params, message) {
    var _a, _b, _c, _d;
    var _e = params.customTypesFilter, customTypesFilter = _e === void 0 ? [] : _e;
    // @ts-ignore
    if ((params === null || params === void 0 ? void 0 : params.messageTypeFilter) && params.messageTypeFilter !== message.messageType) {
        return false;
    }
    if ((customTypesFilter === null || customTypesFilter === void 0 ? void 0 : customTypesFilter.length) > 0) {
        var customTypes = customTypesFilter.filter(function (item) { return item !== '*'; });
        // Because Chat SDK inserts '*' when customTypes is empty
        if (customTypes.length > 0 && !customTypes.includes(message.customType)) {
            return false;
        }
    }
    if ((params === null || params === void 0 ? void 0 : params.senderUserIdsFilter) && ((_a = params === null || params === void 0 ? void 0 : params.senderUserIdsFilter) === null || _a === void 0 ? void 0 : _a.length) > 0) {
        if (((_b = message === null || message === void 0 ? void 0 : message.isUserMessage) === null || _b === void 0 ? void 0 : _b.call(message)) || ((_c = message === null || message === void 0 ? void 0 : message.isFileMessage) === null || _c === void 0 ? void 0 : _c.call(message))) {
            var messageSender = message.sender || message['_sender'];
            if (!((_d = params === null || params === void 0 ? void 0 : params.senderUserIdsFilter) === null || _d === void 0 ? void 0 : _d.includes(messageSender === null || messageSender === void 0 ? void 0 : messageSender.userId))) {
                return false;
            }
        }
        else {
            return false;
        }
    }
    if (!(params === null || params === void 0 ? void 0 : params.includeParentMessageInfo) && ((message === null || message === void 0 ? void 0 : message.parentMessageId) || (message === null || message === void 0 ? void 0 : message.parentMessage))) {
        return false;
    }
    return true;
};
var filterChannelListParams = function (params, channel, currentUserId) {
    var _a, _b, _c, _d, _e, _f, _g;
    var includeEmpty = params.includeEmpty, includeFrozen = params.includeFrozen, searchFilter = params.searchFilter, userIdsFilter = params.userIdsFilter, customTypesFilter = params.customTypesFilter, channelUrlsFilter = params.channelUrlsFilter, customTypeStartsWithFilter = params.customTypeStartsWithFilter, channelNameContainsFilter = params.channelNameContainsFilter, nicknameContainsFilter = params.nicknameContainsFilter, myMemberStateFilter = params.myMemberStateFilter, hiddenChannelFilter = params.hiddenChannelFilter, unreadChannelFilter = params.unreadChannelFilter, publicChannelFilter = params.publicChannelFilter, superChannelFilter = params.superChannelFilter, _h = params.metadataKey, metadataKey = _h === void 0 ? '' : _h, _j = params.metadataValues, metadataValues = _j === void 0 ? ['a', 'b'] : _j, metadataValueStartsWith = params.metadataValueStartsWith;
    if (!includeEmpty && (channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null) {
        return false;
    }
    if ((searchFilter === null || searchFilter === void 0 ? void 0 : searchFilter.query) && ((_b = (_a = searchFilter === null || searchFilter === void 0 ? void 0 : searchFilter.fields) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 0) {
        var searchQuery_1 = searchFilter.query;
        var searchFields = searchFilter.fields;
        if (searchQuery_1 && searchFields && searchFields.length > 0) {
            if (!searchFields.some(function (searchField) {
                var _a, _b;
                switch (searchField) {
                    case 'channel_name': {
                        return (_a = channel === null || channel === void 0 ? void 0 : channel.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery_1.toLowerCase());
                    }
                    case 'member_nickname': {
                        return (_b = channel === null || channel === void 0 ? void 0 : channel.members) === null || _b === void 0 ? void 0 : _b.some(function (member) { return member.nickname.toLowerCase().includes(searchQuery_1.toLowerCase()); });
                    }
                    default: {
                        return true;
                    }
                }
            })) {
                return false;
            }
        }
    }
    if (((_c = userIdsFilter === null || userIdsFilter === void 0 ? void 0 : userIdsFilter.userIds) === null || _c === void 0 ? void 0 : _c.length) > 0) {
        var includeMode = userIdsFilter.includeMode, queryType = userIdsFilter.queryType;
        var userIds = userIdsFilter.userIds;
        var memberIds_1 = (_d = channel === null || channel === void 0 ? void 0 : channel.members) === null || _d === void 0 ? void 0 : _d.map(function (member) { return member.userId; });
        if (!includeMode) { // exact match
            if (!userIds.includes(currentUserId)) {
                userIds.push(currentUserId); // add the caller's userId if not added already.
            }
            if (((_e = channel === null || channel === void 0 ? void 0 : channel.members) === null || _e === void 0 ? void 0 : _e.length) > userIds.length) {
                return false; // userIds may contain one or more non-member(s).
            }
            if (!hasSameMembers(userIds, memberIds_1)) {
                return false;
            }
        }
        else if (userIds.length > 0) { // inclusive
            switch (queryType) {
                case 'AND': {
                    if (userIds.some(function (userId) { return !memberIds_1.includes(userId); })) {
                        return false;
                    }
                    break;
                }
                case 'OR': {
                    if (userIds.every(function (userId) { return !memberIds_1.includes(userId); })) {
                        return false;
                    }
                    break;
                }
            }
        }
    }
    if (includeEmpty === false && (channel === null || channel === void 0 ? void 0 : channel.lastMessage) === null) {
        return false;
    }
    if (includeFrozen === false && (channel === null || channel === void 0 ? void 0 : channel.isFrozen) === true) {
        return false;
    }
    if (customTypesFilter && !customTypesFilter.includes(channel === null || channel === void 0 ? void 0 : channel.customType)) {
        return false;
    }
    if (customTypeStartsWithFilter && !new RegExp("^".concat(customTypeStartsWithFilter)).test(channel === null || channel === void 0 ? void 0 : channel.customType)) {
        return false;
    }
    if (channelNameContainsFilter && !((_f = channel === null || channel === void 0 ? void 0 : channel.name) === null || _f === void 0 ? void 0 : _f.toLowerCase().includes(channelNameContainsFilter.toLowerCase()))) {
        return false;
    }
    if (nicknameContainsFilter) {
        var lowerCasedSubString_1 = nicknameContainsFilter.toLowerCase();
        if ((_g = channel === null || channel === void 0 ? void 0 : channel.members) === null || _g === void 0 ? void 0 : _g.every(function (member) { return !member.nickname.toLowerCase().includes(lowerCasedSubString_1); })) {
            return false;
        }
    }
    if (channelUrlsFilter && !channelUrlsFilter.includes(channel === null || channel === void 0 ? void 0 : channel.url)) {
        return false;
    }
    if (myMemberStateFilter) {
        switch (myMemberStateFilter) {
            case 'joined_only':
                if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'joined') {
                    return false;
                }
                break;
            case 'invited_only':
                if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited') {
                    return false;
                }
                break;
            case 'invited_by_friend':
                if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited' || !isFriend(channel === null || channel === void 0 ? void 0 : channel.inviter)) {
                    return false;
                }
                break;
            case 'invited_by_non_friend':
                if ((channel === null || channel === void 0 ? void 0 : channel.myMemberState) !== 'invited' || isFriend(channel === null || channel === void 0 ? void 0 : channel.inviter)) {
                    return false;
                }
                break;
        }
    }
    if (hiddenChannelFilter) {
        switch (hiddenChannelFilter) {
            case 'unhidden_only':
                if ((channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'unhidden') {
                    return false;
                }
                break;
            case 'hidden_only':
                if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden)) {
                    return false;
                }
                break;
            case 'hidden_allow_auto_unhide':
                if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'hidden_allow_auto_unhide') {
                    return false;
                }
                break;
            case 'hidden_prevent_auto_unhide':
                if (!(channel === null || channel === void 0 ? void 0 : channel.isHidden) || (channel === null || channel === void 0 ? void 0 : channel.hiddenState) !== 'hidden_prevent_auto_unhide') {
                    return false;
                }
                break;
        }
    }
    if (unreadChannelFilter) {
        switch (unreadChannelFilter) {
            case 'unread_message':
                if ((channel === null || channel === void 0 ? void 0 : channel.unreadMessageCount) === 0) {
                    return false;
                }
                break;
        }
    }
    if (publicChannelFilter) {
        switch (publicChannelFilter) {
            case 'public':
                if (!(channel === null || channel === void 0 ? void 0 : channel.isPublic)) {
                    return false;
                }
                break;
            case 'private':
                if (channel === null || channel === void 0 ? void 0 : channel.isPublic) {
                    return false;
                }
                break;
        }
    }
    if (superChannelFilter) {
        switch (superChannelFilter) {
            case 'super':
                if (!(channel === null || channel === void 0 ? void 0 : channel.isSuper)) {
                    return false;
                }
                break;
            case 'nonsuper':
                if (channel === null || channel === void 0 ? void 0 : channel.isSuper) {
                    return false;
                }
                break;
        }
    }
    var _k = channel.cachedMetaData, cachedMetaData = _k === void 0 ? {} : _k;
    if (metadataKey && (metadataValues || metadataValueStartsWith)) {
        var metadataValue_1 = cachedMetaData[metadataKey];
        if (!metadataValue_1) {
            return false;
        }
        if (metadataValues && !metadataValues.every(function (value) { return metadataValue_1.includes(value); })) {
            return false;
        }
        if (metadataValueStartsWith && !metadataValue_1.startsWith(metadataValueStartsWith)) {
            return false;
        }
    }
    return true;
};
var sortChannelList = function (channels, order) {
    var compareFunc = K(order)
        .with(GroupChannelListOrder.CHANNEL_NAME_ALPHABETICAL, function () { return (function (a, b) { return a.name.localeCompare(b.name); }); })
        .with(GroupChannelListOrder.CHRONOLOGICAL, function () { return (function (a, b) { return b.createdAt - a.createdAt; }); })
        .otherwise(function () { return (function (a, b) { var _a, _b, _c, _d; return ((_b = (_a = b.lastMessage) === null || _a === void 0 ? void 0 : _a.createdAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER) - ((_d = (_c = a.lastMessage) === null || _c === void 0 ? void 0 : _c.createdAt) !== null && _d !== void 0 ? _d : Number.MIN_SAFE_INTEGER); }); });
    return channels.sort(compareFunc);
};
/**
 * Upserts given channel to the channel list and then returns the sorted channel list.
 */
var getChannelsWithUpsertedChannel = function (_channels, channel, order) {
    var channels = __spreadArray([], _channels, true);
    var findingIndex = channels.findIndex(function (ch) { return ch.url === channel.url; });
    if (findingIndex !== -1) {
        channels[findingIndex] = channel;
    }
    else {
        channels.push(channel);
    }
    return sortChannelList(channels, order);
};
var StringObjType;
(function (StringObjType) {
    StringObjType["normal"] = "normal";
    StringObjType["mention"] = "mention";
    StringObjType["url"] = "url";
})(StringObjType || (StringObjType = {}));
/**
 * @deprecated
 * use modules/message/utils/tokenize instead
 */
var convertWordToStringObj = function (word, _users, _template) {
    var users = _users || [];
    var template = _template || '@'; // Use global variable
    var resultArray = [];
    var regex = RegExp("".concat(template, "{(").concat(users.map(function (user) { return user === null || user === void 0 ? void 0 : user.userId; }).join('|'), ")}"), 'g');
    var excutionResult;
    var lastIndex = 0;
    var _loop_1 = function () {
        var template_1 = excutionResult[0], userId = excutionResult[1];
        var endIndex = regex.lastIndex;
        var startIndex = endIndex - template_1.length;
        // Normal text
        var normalText = word.slice(lastIndex, startIndex);
        resultArray.push({
            type: isUrl(normalText) ? StringObjType.url : StringObjType.normal,
            value: normalText,
        });
        // Mention template
        var mentionedUser = users.find(function (user) { return (user === null || user === void 0 ? void 0 : user.userId) === userId; });
        if (!mentionedUser) {
            resultArray.push({
                type: StringObjType.normal,
                value: template_1, // because template is the origin text
            });
        }
        else {
            resultArray.push({
                type: StringObjType.mention,
                value: (mentionedUser === null || mentionedUser === void 0 ? void 0 : mentionedUser.nickname) || '(No name)',
                userId: userId,
            });
        }
        lastIndex = endIndex;
    };
    while ((excutionResult = regex.exec(word)) !== null) {
        _loop_1();
    }
    if (lastIndex < word.length) {
        // Normal text
        var normalText = word.slice(lastIndex);
        resultArray.push({
            type: isUrl(normalText) ? StringObjType.url : StringObjType.normal,
            value: normalText,
        });
    }
    return resultArray;
};
var arrayEqual = function (array1, array2) {
    if (Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length) {
        for (var i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }
    return false;
};
var isSendableMessage = function (message) {
    return Boolean(message) && 'sender' in message;
};

export { isGif as A, convertWordToStringObj as B, isAudio as C, isVoiceMessageMimeType as D, isSentStatus as E, arrayEqual as F, getMimeTypesUIKitAccepts as G, isImageMessage as H, isImageFileInfo as I, isAudioMessage as J, isOGMessage as K, isTextMessage as L, isThreadMessage as M, getEmojiUrl as N, isReactedBy as O, getEmojiTooltipString as P, getEmojiMapAll as Q, filterChannelListParams as R, StringObjType as S, getChannelsWithUpsertedChannel as T, UIKitMessageTypes as U, filterMessageListParams as V, isTextuallyNull as W, isReadMessage as a, isFileMessage as b, isMultipleFilesMessage as c, isImage as d, isEditedMessage as e, isSendableMessage as f, getSuggestedReplies as g, getSenderName as h, isVoiceMessage as i, isSupportedFileView as j, isVideo as k, isUserMessage as l, getUIKitMessageType as m, getUIKitMessageTypes as n, getUIKitFileType as o, isThumbnailMessage as p, isSentMessage as q, isVideoMessage as r, isGifMessage as s, truncateString as t, isFailedMessage as u, isPendingMessage as v, getClassName as w, copyToClipboard as x, getEmojiListAll as y, getUIKitFileTypes as z };
//# sourceMappingURL=bundle-Jwc7mleJ.js.map
