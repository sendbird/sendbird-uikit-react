import React__default, { useState, useRef, useContext, useMemo } from 'react';
import OpenChannelPreview from './OpenChannelPreview.js';
import PlaceHolder, { PlaceHolderTypes } from '../../ui/PlaceHolder.js';
import IconButton from '../../ui/IconButton.js';
import Icon, { IconTypes, IconColors } from '../../ui/Icon.js';
import { L as Label, a as LabelTypography, b as LabelColors } from '../../chunks/bundle-sR62lMVk.js';
import { u as useOpenChannelListContext, a as OpenChannelListFetchingStatus, b as OpenChannelListActionTypes } from '../../chunks/bundle-qNXj9tD2.js';
import CreateOpenChannel from '../../CreateOpenChannel.js';
import { L as LocalizationContext } from '../../chunks/bundle-1inZXcUV.js';
import { S as SCROLL_BUFFER } from '../../chunks/bundle-UKdN0Ihw.js';
import '../../chunks/bundle-VE0ige0C.js';
import '../../chunks/bundle-xhjHZ041.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-IDH-OOHE.js';
import '../../chunks/bundle-3a5xXUZv.js';
import '../../ui/Loader.js';
import '../../chunks/bundle--MbN9aKT.js';
import '../../chunks/bundle-V_fO-GlK.js';
import '../../chunks/bundle-yarrTY_z.js';
import '../../useSendbirdStateContext.js';
import '../../withSendbird.js';
import '../../CreateOpenChannel/components/CreateOpenChannelUI.js';
import '../../ui/Button.js';
import '../../chunks/bundle-ixiL_3Ds.js';
import 'react-dom';
import '../../chunks/bundle-pjLq9qJd.js';
import '../../ui/Input.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-nMxV4WMS.js';
import '../../CreateOpenChannel/context.js';

function OpenChannelListUI(_a) {
    var renderHeader = _a.renderHeader, renderChannelPreview = _a.renderChannelPreview, renderPlaceHolderEmpty = _a.renderPlaceHolderEmpty, renderPlaceHolderError = _a.renderPlaceHolderError, renderPlaceHolderLoading = _a.renderPlaceHolderLoading;
    var _b = useState(false), showCreateChannelModal = _b[0], setShowCreateChannel = _b[1];
    var scrollRef = useRef(null);
    var _c = useOpenChannelListContext(), logger = _c.logger, currentChannel = _c.currentChannel, allChannels = _c.allChannels, fetchingStatus = _c.fetchingStatus, onChannelSelected = _c.onChannelSelected, fetchNextChannels = _c.fetchNextChannels, refreshOpenChannelList = _c.refreshOpenChannelList, openChannelListDispatcher = _c.openChannelListDispatcher;
    var stringSet = useContext(LocalizationContext).stringSet;
    var handleScroll = function (e) {
        var element = e.target;
        var scrollTop = element.scrollTop, clientHeight = element.clientHeight, scrollHeight = element.scrollHeight;
        var isAboutSame = function (a, b, px) { return (Math.abs(a - b) <= px); };
        if (isAboutSame(clientHeight + scrollTop, scrollHeight, SCROLL_BUFFER)) {
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
    var MemoizedHeader = useMemo(function () {
        return (renderHeader === null || renderHeader === void 0 ? void 0 : renderHeader()) || null;
    }, [renderHeader]);
    var MemoizedPlaceHolder = useMemo(function () {
        if (fetchingStatus === OpenChannelListFetchingStatus.EMPTY) {
            return (renderPlaceHolderEmpty === null || renderPlaceHolderEmpty === void 0 ? void 0 : renderPlaceHolderEmpty()) || (React__default.createElement(PlaceHolder, { className: "sendbird-open-channel-list-ui__channel-list--place-holder--empty", type: PlaceHolderTypes.NO_CHANNELS }));
        }
        if (fetchingStatus === OpenChannelListFetchingStatus.FETCHING) {
            return (renderPlaceHolderLoading === null || renderPlaceHolderLoading === void 0 ? void 0 : renderPlaceHolderLoading()) || (React__default.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list--place-holder--loading" },
                React__default.createElement(PlaceHolder, { iconSize: "24px", type: PlaceHolderTypes.LOADING })));
        }
        if (fetchingStatus === OpenChannelListFetchingStatus.ERROR) {
            return (renderPlaceHolderError === null || renderPlaceHolderError === void 0 ? void 0 : renderPlaceHolderError()) || (React__default.createElement(PlaceHolder, { className: "sendbird-open-channel-list-ui__channel-list--place-holder--error", type: PlaceHolderTypes.WRONG }));
        }
        return null;
    }, [fetchingStatus, renderPlaceHolderEmpty, renderPlaceHolderLoading, renderPlaceHolderError]);
    var MemoizedAllChannels = useMemo(function () {
        if (fetchingStatus === OpenChannelListFetchingStatus.DONE) {
            return allChannels.map(function (channel) {
                var isSelected = (channel === null || channel === void 0 ? void 0 : channel.url) === (currentChannel === null || currentChannel === void 0 ? void 0 : currentChannel.url);
                var handleClick = function (e) {
                    onChannelSelected === null || onChannelSelected === void 0 ? void 0 : onChannelSelected(channel, e);
                    logger.info('OpenChannelList|ChannelPreview: A channel is selected', channel);
                    openChannelListDispatcher({
                        type: OpenChannelListActionTypes.SET_CURRENT_OPEN_CHANNEL,
                        payload: channel,
                    });
                };
                return renderChannelPreview
                    ? (React__default.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list__item", onClick: handleClick }, renderChannelPreview({ channel: channel, isSelected: isSelected, onChannelSelected: onChannelSelected })))
                    : (React__default.createElement(OpenChannelPreview, { className: "sendbird-open-channel-list-ui__channel-list__item", channel: channel, isSelected: isSelected, onClick: handleClick, key: channel === null || channel === void 0 ? void 0 : channel.url }));
            });
        }
        return null;
    }, [allChannels, allChannels.length, currentChannel]);
    return (React__default.createElement("div", { className: "sendbird-open-channel-list-ui" },
        showCreateChannelModal && (React__default.createElement(CreateOpenChannel, { closeModal: function () { return setShowCreateChannel(false); }, onCreateChannel: function (openChannel) {
                onChannelSelected === null || onChannelSelected === void 0 ? void 0 : onChannelSelected(openChannel);
                openChannelListDispatcher({
                    type: OpenChannelListActionTypes.CREATE_OPEN_CHANNEL,
                    payload: openChannel,
                });
            } })),
        MemoizedHeader || (React__default.createElement("div", { className: "sendbird-open-channel-list-ui__header" },
            React__default.createElement(Label, { className: "sendbird-open-channel-list-ui__header__title", type: LabelTypography.H_2, color: LabelColors.ONBACKGROUND_1 }, stringSet.OPEN_CHANNEL_LIST__TITLE),
            React__default.createElement(IconButton, { className: "sendbird-open-channel-list-ui__header__button-refresh", width: "32px", height: "32px", type: "button", onClick: function () { return refreshOpenChannelList(); } },
                React__default.createElement(Icon, { type: IconTypes.REFRESH, fillColor: IconColors.PRIMARY, width: "22px", height: "22px" })),
            React__default.createElement(IconButton, { className: "sendbird-open-channel-list-ui__header__button-create-channel", width: "32px", height: "32px", type: "button", onClick: handleOnClickCreateChannel },
                React__default.createElement(Icon, { type: IconTypes.CREATE, fillColor: IconColors.PRIMARY, width: "22px", height: "22px" })))),
        React__default.createElement("div", { className: "sendbird-open-channel-list-ui__channel-list", ref: scrollRef, onScroll: handleScroll },
            MemoizedPlaceHolder,
            MemoizedAllChannels)));
}

export { OpenChannelListUI as default };
//# sourceMappingURL=OpenChannelListUI.js.map
