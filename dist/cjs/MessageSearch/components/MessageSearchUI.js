'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var MessageSearch_context = require('../context.js');
var ui_MessageSearchItem = require('../../ui/MessageSearchItem.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_MessageSearchFileItem = require('../../ui/MessageSearchFileItem.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../chunks/bundle-T9gnzy2i.js');
require('../../chunks/bundle-k4IOvwe9.js');
require('../../chunks/bundle-r8DyENxy.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/Icon.js');
require('../../chunks/bundle-2Pq38lvD.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-bjSez2lv.js');
require('@sendbird/chat/groupChannel');
require('../../utils/message/getOutgoingMessageState.js');
require('../../chunks/bundle-8G36Z6Or.js');
require('../../chunks/bundle-Oijs10ng.js');

var COMPONENT_CLASS_NAME = 'sendbird-message-search';
var MessageSearchUI = function (_a) {
    var renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading, renderPlaceHolderNoString = _a.renderPlaceHolderNoString, renderPlaceHolderEmptyList = _a.renderPlaceHolderEmptyList, renderSearchItem = _a.renderSearchItem;
    var _b = MessageSearch_context.useMessageSearchContext(), isInvalid = _b.isInvalid, searchString = _b.searchString, requestString = _b.requestString, currentChannel = _b.currentChannel, retryCount = _b.retryCount, setRetryCount = _b.setRetryCount, loading = _b.loading, scrollRef = _b.scrollRef, hasMoreResult = _b.hasMoreResult, onScroll = _b.onScroll, allMessages = _b.allMessages, onResultClick = _b.onResultClick, selectedMessageId = _b.selectedMessageId, setSelectedMessageId = _b.setSelectedMessageId;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var handleRetryToConnect = function () {
        setRetryCount(retryCount + 1);
    };
    var handleOnScroll = function (e) {
        var scrollElement = e.target;
        var scrollTop = scrollElement.scrollTop, scrollHeight = scrollElement.scrollHeight, clientHeight = scrollElement.clientHeight;
        if (!hasMoreResult) {
            return;
        }
        if (scrollTop + clientHeight >= scrollHeight - 1) {
            onScroll(function () {
                // after load more searched messages
            });
        }
    };
    var getChannelName = function () {
        if (currentChannel && (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.name) && (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.name) !== 'Group Channel') {
            return currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.name;
        }
        if (currentChannel && ((currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.name) === 'Group Channel' || !(currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.name))) {
            return currentChannel.members.map(function (member) { return member.nickname || stringSet.NO_NAME; }).join(', ');
        }
        return stringSet.NO_TITLE;
    };
    if (isInvalid && searchString && requestString) {
        return (renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError()) || (React.createElement("div", { className: COMPONENT_CLASS_NAME },
            React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.WRONG, retryToConnect: handleRetryToConnect })));
    }
    if (loading && searchString && requestString) {
        return (renderPlaceHolderLoading === null || renderPlaceHolderLoading === void 0 ? void 0 : renderPlaceHolderLoading()) || (React.createElement("div", { className: COMPONENT_CLASS_NAME },
            React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.SEARCHING })));
    }
    if (!searchString) {
        return (renderPlaceHolderNoString === null || renderPlaceHolderNoString === void 0 ? void 0 : renderPlaceHolderNoString()) || (React.createElement("div", { className: COMPONENT_CLASS_NAME },
            React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.SEARCH_IN, searchInString: getChannelName() })));
    }
    return (React.createElement("div", { className: COMPONENT_CLASS_NAME, onScroll: handleOnScroll, ref: scrollRef }, (allMessages.length > 0)
        ? (allMessages.map(function (message) {
            if (renderSearchItem) {
                return renderSearchItem({ message: message, onResultClick: onResultClick });
            }
            if (message.messageType === 'file') {
                return (React.createElement(ui_MessageSearchFileItem, { className: "".concat(COMPONENT_CLASS_NAME, "__message-search-item"), message: message, key: message.messageId, selected: (selectedMessageId === message.messageId), onClick: function () {
                        onResultClick(message);
                        setSelectedMessageId(message.messageId);
                    } }));
            }
            return (React.createElement(ui_MessageSearchItem, { className: "".concat(COMPONENT_CLASS_NAME, "__message-search-item"), message: message, key: message.messageId, selected: (selectedMessageId === message.messageId), onClick: function () {
                    onResultClick(message);
                    setSelectedMessageId(message.messageId);
                } }));
        }))
        : (renderPlaceHolderEmptyList === null || renderPlaceHolderEmptyList === void 0 ? void 0 : renderPlaceHolderEmptyList()) || (React.createElement(ui_PlaceHolder.default, { type: ui_PlaceHolder.PlaceHolderTypes.NO_RESULTS }))));
};

exports.MessageSearchUI = MessageSearchUI;
exports.default = MessageSearchUI;
//# sourceMappingURL=MessageSearchUI.js.map
