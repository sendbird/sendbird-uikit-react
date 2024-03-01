import React__default, { useState } from 'react';
import { GroupChannelListHeader } from '../GroupChannelList/components/GroupChannelListHeader.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';
import EditUserProfile from '../EditUserProfile.js';
import PlaceHolder, { PlaceHolderTypes } from '../ui/PlaceHolder.js';
import { u as useOnScrollPositionChangeDetector } from './bundle-lPKA2RTf.js';

var GroupChannelListUIView = function (_a) {
    var renderHeader = _a.renderHeader, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading, renderPlaceHolderEmptyList = _a.renderPlaceHolderEmptyList, onChangeTheme = _a.onChangeTheme, onUserProfileUpdated = _a.onUserProfileUpdated, allowProfileEdit = _a.allowProfileEdit, channels = _a.channels, onLoadMore = _a.onLoadMore, initialized = _a.initialized, renderChannel = _a.renderChannel, renderAddChannel = _a.renderAddChannel;
    var _b = useState(false), showProfileEdit = _b[0], setShowProfileEdit = _b[1];
    var stores = useSendbirdStateContext().stores;
    var renderer = {
        addChannel: renderAddChannel,
        channel: renderChannel,
        placeholder: {
            loading: function () {
                if (initialized)
                    return null;
                if (renderPlaceHolderLoading)
                    return renderPlaceHolderLoading();
                return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.LOADING });
            },
            empty: function () {
                if (!initialized)
                    return null;
                if (renderPlaceHolderEmptyList)
                    return renderPlaceHolderEmptyList();
                return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.NO_CHANNELS });
            },
            error: function () {
                if (!initialized || !stores.sdkStore.error)
                    return null;
                if (renderPlaceHolderError)
                    return renderPlaceHolderError();
                return React__default.createElement(PlaceHolder, { type: PlaceHolderTypes.WRONG });
            },
        },
    };
    return (React__default.createElement(React__default.Fragment, null,
        React__default.createElement("div", { className: "sendbird-channel-list__header" }, (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || (React__default.createElement(GroupChannelListHeader, { onEdit: function () { return allowProfileEdit && setShowProfileEdit(true); }, allowProfileEdit: allowProfileEdit, renderIconButton: function () { return renderer.addChannel(); } }))),
        showProfileEdit && (React__default.createElement(EditUserProfile, { onThemeChange: onChangeTheme, onCancel: function () { return setShowProfileEdit(false); }, onEditProfile: function (user) {
                setShowProfileEdit(false);
                onUserProfileUpdated(user);
            } })),
        React__default.createElement(ChannelListComponent, { data: channels, renderItem: renderer.channel, onLoadMore: onLoadMore, placeholderLoading: renderer.placeholder.loading(), placeholderEmpty: renderer.placeholder.empty(), placeholderError: renderer.placeholder.error() })));
};
/**
 * To do: Implement windowing
 * Implement windowing if you are dealing with large number of messages/channels
 * https://github.com/bvaughn/react-window -> recommendation
 * We hesitate to bring one more dependency to our library,
 * we are planning to implement it inside the library
 * */
var ChannelListComponent = function (props) {
    var data = props.data, renderItem = props.renderItem, onLoadMore = props.onLoadMore, placeholderLoading = props.placeholderLoading, placeholderError = props.placeholderError, placeholderEmpty = props.placeholderEmpty;
    var onScroll = useOnScrollPositionChangeDetector({
        onReachedBottom: function () { return onLoadMore(); },
    });
    return (React__default.createElement("div", { className: 'sendbird-channel-list__body', onScroll: onScroll },
        placeholderError,
        React__default.createElement("div", null, data.map(function (item, index) { return renderItem({ item: item, index: index }); })),
        placeholderLoading,
        data.length === 0 && placeholderEmpty));
};

export { GroupChannelListUIView as G };
//# sourceMappingURL=bundle-m_0MaBIm.js.map
