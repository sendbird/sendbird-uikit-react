'use strict';

var React = require('react');
var OpenChannelList_components_OpenChannelPreview = require('./OpenChannelPreview.js');
var ui_PlaceHolder = require('../../ui/PlaceHolder.js');
var ui_IconButton = require('../../ui/IconButton.js');
var ui_Icon = require('../../ui/Icon.js');
var ui_Label = require('../../chunks/bundle-2Pq38lvD.js');
var OpenChannelList_context = require('../../chunks/bundle-1jk-UWl7.js');
var CreateOpenChannel = require('../../CreateOpenChannel.js');
var LocalizationContext = require('../../chunks/bundle-Nz6fSUye.js');
var consts = require('../../chunks/bundle-4jVvOUfV.js');
require('../../chunks/bundle-PoiZwjvJ.js');
require('../../chunks/bundle-zYqQA3cT.js');
require('../../ui/ImageRenderer.js');
require('../../chunks/bundle-Xwl4gw4D.js');
require('../../chunks/bundle-5mXB6h1C.js');
require('../../ui/Loader.js');
require('../../chunks/bundle-xYV6cL9E.js');
require('../../chunks/bundle-eyiJykZ-.js');
require('../../chunks/bundle-NfUcey5s.js');
require('../../useSendbirdStateContext.js');
require('../../withSendbird.js');
require('../../CreateOpenChannel/components/CreateOpenChannelUI.js');
require('../../ui/Button.js');
require('../../chunks/bundle-NeYvE4zX.js');
require('react-dom');
require('../../chunks/bundle-37dz9yoi.js');
require('../../ui/Input.js');
require('../../ui/TextButton.js');
require('../../chunks/bundle-oaDSLq17.js');
require('../../CreateOpenChannel/context.js');

function OpenChannelListUI(_a) {
    var renderHeader = _a.renderHeader, renderChannelPreview = _a.renderChannelPreview, renderPlaceHolderEmpty = _a.renderPlaceHolderEmpty, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    var _b = React.useState(false), showCreateChannelModal = _b[0], setShowCreateChannel = _b[1];
    var scrollRef = React.useRef(null);
    var _c = OpenChannelList_context.useOpenChannelListContext(), logger = _c.logger, currentChannel = _c.currentChannel, allChannels = _c.allChannels, fetchingStatus = _c.fetchingStatus, onChannelSelected = _c.onChannelSelected, fetchNextChannels = _c.fetchNextChannels, refreshOpenChannelList = _c.refreshOpenChannelList, openChannelListDispatcher = _c.openChannelListDispatcher;
    var stringSet = React.useContext(LocalizationContext.LocalizationContext).stringSet;
    var handleScroll = function (e) {
        var element = e.target;
        var scrollTop = element.scrollTop, clientHeight = element.clientHeight, scrollHeight = element.scrollHeight;
        var isAboutSame = function (a, b, px) { return (Math.abs(a - b) <= px); };
        if (isAboutSame(clientHeight + scrollTop, scrollHeight, consts.SCROLL_BUFFER)) {
            fetchNextChannels(function (messages) {
                if (messages) {
                    try {
                        element.scrollTop = scrollHeight - clientHeight;
                    }
                    catch (error) {
                        //
                    }
                }
            });
        }
    };
    var handleOnClickCreateChannel = function () {
        setShowCreateChannel(true);
    };
    var MemoizedHeader = React.useMemo(function () {
        return (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || null;
    }, [renderHeader]);
    var MemoizedPlaceHolder = React.useMemo(function () {
        if (fetchingStatus === OpenChannelList_context.OpenChannelListFetchingStatus.EMPTY) {
            return (renderPlaceHolderEmpty === null || renderPlaceHolderEmpty === void 0 ? void 0 : renderPlaceHolderEmpty()) || (React.createElement(ui_PlaceHolder.default, { className: "sendbird-open-channel-list-ui__channel-list--place-holder--empty", type: ui_PlaceHolder.PlaceHolderTypes.NO_CHANNELS }));
        }
        if (fetchingStatus === OpenChannelList_context.OpenChannelListFetchingStatus.FETCHING) {
            return (renderPlaceHolderLoading === null || renderPlaceHolderLoading === void 0 ? void 0 : renderPlaceHolderLoading()) || (React.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list--place-holder--loading" },
                React.createElement(ui_PlaceHolder.default, { iconSize: "24px", type: ui_PlaceHolder.PlaceHolderTypes.LOADING })));
        }
        if (fetchingStatus === OpenChannelList_context.OpenChannelListFetchingStatus.ERROR) {
            return (renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError()) || (React.createElement(ui_PlaceHolder.default, { className: "sendbird-open-channel-list-ui__channel-list--place-holder--error", type: ui_PlaceHolder.PlaceHolderTypes.WRONG }));
        }
        return null;
    }, [fetchingStatus, renderPlaceHolderEmpty, renderPlaceHolderLoading, renderPlaceHolderError]);
    var MemoizedAllChannels = React.useMemo(function () {
        if (fetchingStatus === OpenChannelList_context.OpenChannelListFetchingStatus.DONE) {
            return allChannels.map(function (channel) {
                var isSelected = (channel === null || channel === void 0 ? void 0 : channel.url) === (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url);
                var handleClick = function (e) {
                    onChannelSelected === null || onChannelSelected === void 0 ? void 0 : onChannelSelected(channel, e);
                    logger.info('OpenChannelList|ChannelPreview: A channel is selected', channel);
                    openChannelListDispatcher({
                        type: OpenChannelList_context.OpenChannelListActionTypes.SET_CURRENT_OPEN_CHANNEL,
                        payload: channel,
                    });
                };
                return renderChannelPreview
                    ? (React.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list__item", onClick: handleClick }, renderChannelPreview({ channel: channel, isSelected: isSelected, onChannelSelected: onChannelSelected })))
                    : (React.createElement(OpenChannelList_components_OpenChannelPreview, { className: "sendbird-open-channel-list-ui__channel-list__item", channel: channel, isSelected: isSelected, onClick: handleClick, key: channel === null || channel === void 0 ? void 0 : channel.url }));
            });
        }
        return null;
    }, [allChannels, allChannels.length, currentChannel]);
    return (React.createElement("div", { className: "sendbird-open-channel-list-ui" },
        showCreateChannelModal && (React.createElement(CreateOpenChannel, { closeModal: function () { return setShowCreateChannel(false); }, onCreateChannel: function (openChannel) {
                onChannelSelected === null || onChannelSelected === void 0 ? void 0 : onChannelSelected(openChannel);
                openChannelListDispatcher({
                    type: OpenChannelList_context.OpenChannelListActionTypes.CREATE_OPEN_CHANNEL,
                    payload: openChannel,
                });
            } })),
        MemoizedHeader || (React.createElement("div", { className: "sendbird-open-channel-list-ui__header" },
            React.createElement(ui_Label.Label, { className: "sendbird-open-channel-list-ui__header__title", type: ui_Label.LabelTypography.H_2, color: ui_Label.LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_LIST__TITLE),
            React.createElement(ui_IconButton, { className: "sendbird-open-channel-list-ui__header__button-refresh", width: "32px", height: "32px", type: "button", onClick: function () { return refreshOpenChannelList(); } },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.REFRESH, fillColor: ui_Icon.IconColors.PRIMARY, width: "22px", height: "22px" })),
            React.createElement(ui_IconButton, { className: "sendbird-open-channel-list-ui__header__button-create-channel", width: "32px", height: "32px", type: "button", onClick: handleOnClickCreateChannel },
                React.createElement(ui_Icon.default, { type: ui_Icon.IconTypes.CREATE, fillColor: ui_Icon.IconColors.PRIMARY, width: "22px", height: "22px" })))),
        React.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list", ref: scrollRef, onScroll: handleScroll },
            MemoizedPlaceHolder,
            MemoizedAllChannels)));
}

module.exports = OpenChannelListUI;
//# sourceMappingURL=OpenChannelListUI.js.map
