import { _ as __assign } from '../chunks/bundle-KMsJXUN2.js';
import React__default, { useEffect, useState, useContext } from 'react';
import { GroupChannelFilter } from '@sendbird/chat/groupChannel';
import { useGroupChannelList, useGroupChannelHandler } from '@sendbird/uikit-tools';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import { U as UserProfileProvider } from '../chunks/bundle-x78eEPy7.js';
import { u as useOnlineStatus, a as useMarkAsDeliveredScheduler } from '../chunks/bundle-tUgX2YQs.js';
import { n as noop } from '../chunks/bundle-7YRb7CRq.js';
import '../withSendbird.js';
import '@sendbird/chat';
import '../chunks/bundle-4_6x-RiC.js';

var GroupChannelListContext = React__default.createContext(null);
var GroupChannelListProvider = function (props) {
    var 
    // Default
    children = props.children, _a = props.className, className = _a === void 0 ? '' : _a, selectedChannelUrl = props.selectedChannelUrl, 
    // Flags
    _b = props.allowProfileEdit, 
    // Flags
    allowProfileEdit = _b === void 0 ? true : _b, _c = props.disableAutoSelect, disableAutoSelect = _c === void 0 ? false : _c, _d = props.isTypingIndicatorEnabled, isTypingIndicatorEnabled = _d === void 0 ? false : _d, _e = props.isMessageReceiptStatusEnabled, isMessageReceiptStatusEnabled = _e === void 0 ? false : _e, 
    // Custom
    channelListQueryParams = props.channelListQueryParams, onThemeChange = props.onThemeChange, _f = props.onChannelSelect, onChannelSelect = _f === void 0 ? noop : _f, _g = props.onChannelCreated, onChannelCreated = _g === void 0 ? noop : _g, onCreateChannelClick = props.onCreateChannelClick, onBeforeCreateChannel = props.onBeforeCreateChannel, onUserProfileUpdated = props.onUserProfileUpdated, 
    // UserProfile
    disableUserProfile = props.disableUserProfile, renderUserProfile = props.renderUserProfile, onUserProfileMessage = props.onUserProfileMessage;
    var globalStore = useSendbirdStateContext();
    var config = globalStore.config, stores = globalStore.stores;
    var sdkStore = stores.sdkStore;
    var _h = config.isTypingIndicatorEnabledOnChannelList, isTypingIndicatorEnabledOnChannelList = _h === void 0 ? false : _h, _j = config.isMessageReceiptStatusEnabledOnChannelList, isMessageReceiptStatusEnabledOnChannelList = _j === void 0 ? false : _j;
    var sdk = sdkStore.sdk;
    var isConnected = useOnlineStatus(sdk, config.logger);
    var scheduler = useMarkAsDeliveredScheduler({ isConnected: isConnected }, config);
    var channelListDataSource = useGroupChannelList(sdk, {
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
    useEffect(function () {
        var _a;
        if (!disableAutoSelect && stores.sdkStore.initialized && initialized) {
            if (!selectedChannelUrl)
                onChannelSelect((_a = groupChannels[0]) !== null && _a !== void 0 ? _a : null);
        }
    }, [disableAutoSelect, stores.sdkStore.initialized, initialized, selectedChannelUrl]);
    var _k = useState([]), typingChannelUrls = _k[0], setTypingChannelUrls = _k[1];
    useGroupChannelHandler(sdk, {
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
    return (React__default.createElement(GroupChannelListContext.Provider, { value: {
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
        React__default.createElement(UserProfileProvider, { disableUserProfile: disableUserProfile !== null && disableUserProfile !== void 0 ? disableUserProfile : config === null || config === void 0 ? void 0 : config.disableUserProfile, renderUserProfile: renderUserProfile !== null && renderUserProfile !== void 0 ? renderUserProfile : config === null || config === void 0 ? void 0 : config.renderUserProfile, onUserProfileMessage: onUserProfileMessage !== null && onUserProfileMessage !== void 0 ? onUserProfileMessage : config === null || config === void 0 ? void 0 : config.onUserProfileMessage },
            React__default.createElement("div", { className: "sendbird-channel-list ".concat(className) }, children))));
};
var useGroupChannelListContext = function () {
    var context = useContext(GroupChannelListContext);
    if (!context)
        throw new Error('GroupChannelListContext not found. Use within the GroupChannelList module.');
    return context;
};
function getCollectionCreator(sdk, channelListQueryParams) {
    return function (defaultParams) {
        var params = __assign(__assign({}, defaultParams), channelListQueryParams);
        return sdk.groupChannel.createGroupChannelCollection(__assign(__assign({}, params), { filter: new GroupChannelFilter(params) }));
    };
}

export { GroupChannelListContext, GroupChannelListProvider, useGroupChannelListContext };
//# sourceMappingURL=context.js.map
