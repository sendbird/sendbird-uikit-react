'use strict';

var _tslib = require('../chunks/bundle-xbdnJE9-.js');
var React = require('react');
var groupChannel = require('@sendbird/chat/groupChannel');
var uikitTools = require('@sendbird/uikit-tools');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');
var UserProfileContext = require('../chunks/bundle-uzKywAVp.js');
var useMarkAsDeliveredScheduler = require('../chunks/bundle-Fj06oDBD.js');
var utils = require('../chunks/bundle-jCTpndN0.js');
require('../withSendbird.js');
require('@sendbird/chat');
require('../chunks/bundle-SOIkTCep.js');

var GroupChannelListContext = React.createContext(null);
var GroupChannelListProvider = function (props) {
    var 
    // Default
    children = props.children, _a = props.className, className = _a === void 0 ? '' : _a, selectedChannelUrl = props.selectedChannelUrl, 
    // Flags
    _b = props.allowProfileEdit, 
    // Flags
    allowProfileEdit = _b === void 0 ? true : _b, _c = props.disableAutoSelect, disableAutoSelect = _c === void 0 ? false : _c, _d = props.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _d === void 0 ? false : _d, _e = props.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _e === void 0 ? false : _e, 
    // Custom
    channelListQueryParams = props.channelListQueryParams, onThemeChange = props.onThemeChange, _f = props.onChannelSelect, onChannelSelect = _f === void 0 ? utils.noop : _f, _g = props.onChannelCreated, onChannelCreated = _g === void 0 ? utils.noop : _g, onCreateChannelClick = props.onCreateChannelClick, onBeforeCreateChannel = props.onBeforeCreateChannel, onUserProfileUpdated = props.onUserProfileUpdated, 
    // UserProfile
    disableUserProfile = props.disableUserProfile, renderUserProfile = props.renderUserProfile, onUserProfileMessage = props.onUserProfileMessage;
    var globalStore = useSendbirdStateContext.useSendbirdStateContext();
    var config = globalStore.config, stores = globalStore.stores;
    var sdkStore = stores.sdkStore;
    var _h = config.isTypingIndicatorEnabledOnChannelList, isTypingIndicatorEnabledOnChannelList = _h === void 0 ? false : _h, _j = config.isMessageReceiptStatusEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList = _j === void 0 ? false : _j;
    var sdk = sdkStore.sdk;
    var isConnected = useMarkAsDeliveredScheduler.useOnlineStatus(sdk, config.logger);
    var scheduler = useMarkAsDeliveredScheduler.useMarkAsDeliveredScheduler({ isConnected: isConnected }, config);
    var channelListDataSource = uikitTools.useGroupChannelList(sdk, {
        collectionCreator: getCollectionCreator(sdk, channelListQueryParams),
        markAsDelivered: function (channels) { return channels.forEach(scheduler.push); },
        onChannelsDeleted: function (channelUrls) {
            channelUrls.forEach(function (url) {
                if (url === selectedChannelUrl)
                    onChannelSelect(null);
            });
        },
    });
    var refreshing = channelListDataSource.refreshing, initialized = channelListDataSource.initialized, groupChannels = channelListDataSource.groupChannels, refresh = channelListDataSource.refresh, loadMore = channelListDataSource.loadMore;
    // SideEffect: Auto select channel
    React.useEffect(function () {
        var _a;
        if (!disableAutoSelect && stores.sdkStore.initialized && initialized) {
            if (!selectedChannelUrl)
                onChannelSelect((_a = groupChannels[0]) !== null && _a !== void 0 ? _a : null);
        }
    }, [disableAutoSelect, stores.sdkStore.initialized, initialized, selectedChannelUrl]);
    var _k = React.useState([]), typingChannelUrls = _k[0], setTypingChannelUrls = _k[1];
    uikitTools.useGroupChannelHandler(sdk, {
        onTypingStatusUpdated: function (channel) {
            var _a;
            var channelList = typingChannelUrls.filter(function (channelUrl) { return channelUrl !== channel.url; });
            if (((_a = channel.getTypingUsers()) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                setTypingChannelUrls(channelList.concat(channel.url));
            }
            else {
                setTypingChannelUrls(channelList);
            }
        },
    });
    return (React.createElement(GroupChannelListContext.Provider, { value: {
            // Default
            className: className,
            selectedChannelUrl: selectedChannelUrl,
            // Flags
            allowProfileEdit: allowProfileEdit !== null && allowProfileEdit !== void 0 ? allowProfileEdit : config === null || config === void 0 ? void 0 : config.allowProfileEdit,
            disableAutoSelect: disableAutoSelect,
            isTypingIndicatorEnabled: isTypingIndicatorEnabled !== null && isTypingIndicatorEnabled !== void 0 ? isTypingIndicatorEnabled : isTypingIndicatorEnabledOnChannelList,
            isMessageReceiptStatusEnabled: isMessageReceiptStatusEnabled !== null && isMessageReceiptStatusEnabled !== void 0 ? isMessageReceiptStatusEnabled : isMessageReceiptStatusEnabledOnChannelList,
            // Essential
            onChannelSelect: onChannelSelect,
            onChannelCreated: onChannelCreated,
            // Partial props
            onThemeChange: onThemeChange,
            onCreateChannelClick: onCreateChannelClick,
            onBeforeCreateChannel: onBeforeCreateChannel,
            onUserProfileUpdated: onUserProfileUpdated,
            // Internal
            typingChannelUrls: typingChannelUrls,
            // ReturnType<UseGroupChannelList>
            refreshing: refreshing,
            initialized: initialized,
            groupChannels: groupChannels,
            refresh: refresh,
            loadMore: loadMore,
        } },
        React.createElement(UserProfileContext.UserProfileProvider, { disableUserProfile: disableUserProfile !== null && disableUserProfile !== void 0 ? disableUserProfile : config === null || config === void 0 ? void 0 : config.disableUserProfile, renderUserProfile: renderUserProfile !== null && renderUserProfile !== void 0 ? renderUserProfile : config === null || config === void 0 ? void 0 : config.renderUserProfile, onUserProfileMessage: onUserProfileMessage !== null && onUserProfileMessage !== void 0 ? onUserProfileMessage : config === null || config === void 0 ? void 0 : config.onUserProfileMessage },
            React.createElement("div", { className: "sendbird-channel-list ".concat(className) }, children))));
};
var useGroupChannelListContext = function () {
    var context = React.useContext(GroupChannelListContext);
    if (!context)
        throw new Error('GroupChannelListContext not found. Use within the GroupChannelList module.');
    return context;
};
function getCollectionCreator(sdk, channelListQueryParams) {
    return function (defaultParams) {
        var params = _tslib.__assign(_tslib.__assign({}, defaultParams), channelListQueryParams);
        return sdk.groupChannel.createGroupChannelCollection(_tslib.__assign(_tslib.__assign({}, params), { filter: new groupChannel.GroupChannelFilter(params) }));
    };
}

exports.GroupChannelListContext = GroupChannelListContext;
exports.GroupChannelListProvider = GroupChannelListProvider;
exports.useGroupChannelListContext = useGroupChannelListContext;
//# sourceMappingURL=context.js.map
