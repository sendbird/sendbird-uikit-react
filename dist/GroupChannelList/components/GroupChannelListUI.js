import { _ as __assign, a as __awaiter, b as __generator } from '../../chunks/bundle-UnAcr6wX.js';
import React__default, { useMemo } from 'react';
import { useGroupChannelListContext } from '../context.js';
import { G as GroupChannelListUIView } from '../../chunks/bundle-nmq7a_d7.js';
import { GroupChannelPreviewAction } from './GroupChannelPreviewAction.js';
import { useSendbirdStateContext } from '../../useSendbirdStateContext.js';
import { GroupChannelListItem } from './GroupChannelListItem.js';
import { AddGroupChannel } from './AddGroupChannel.js';
import '@sendbird/chat/groupChannel';
import '@sendbird/uikit-tools';
import '../../chunks/bundle-jDtVwIPR.js';
import '../../chunks/bundle-TqITKNRx.js';
import '@sendbird/chat';
import '../../chunks/bundle-0Kp88b8b.js';
import '../../chunks/bundle-CRwhglru.js';
import './GroupChannelListHeader.js';
import '../../chunks/bundle-hS8Jw8F1.js';
import '../../chunks/bundle-PIrj5Rm1.js';
import '../../chunks/bundle-8u3PnqsX.js';
import '../../chunks/bundle-LbQw2cVx.js';
import '../../ui/ImageRenderer.js';
import '../../chunks/bundle-fNigAmmf.js';
import '../../ui/Icon.js';
import '../../chunks/bundle-ljRDDTki.js';
import '../../EditUserProfile.js';
import '../../EditUserProfile/context.js';
import '../../EditUserProfile/components/EditUserProfileUI.js';
import '../../chunks/bundle-cjOTjxeU.js';
import '../../chunks/bundle--BlhOpUS.js';
import 'react-dom';
import '../../chunks/bundle-qlkGlvyT.js';
import '../../ui/IconButton.js';
import '../../ui/Button.js';
import '../../ui/Input.js';
import '../../ui/TextButton.js';
import '../../chunks/bundle-02rQraFs.js';
import '../../ui/PlaceHolder.js';
import '../../ui/Loader.js';
import '../../chunks/bundle-WFlcI9AO.js';
import '../../chunks/bundle-1CfFFBx9.js';
import '../../chunks/bundle-H77M-_wK.js';
import '@sendbird/chat/message';
import '../../chunks/bundle-6aMfjTWv.js';
import '../../ui/ContextMenu.js';
import '../../ui/SortByRow.js';
import '../../chunks/bundle-WrTlYypL.js';
import '../../utils/message/getOutgoingMessageState.js';
import '../../chunks/bundle-UuydkZ4A.js';
import '../../withSendbird.js';
import '../../chunks/bundle-FTNAU8Uq.js';
import '../../chunks/bundle-ePTRDi6d.js';
import '../../chunks/bundle-uq2crLI0.js';
import '../../chunks/bundle-6_aRz_Ld.js';
import '../../chunks/bundle-wPETx6j0.js';
import '../../chunks/bundle-okHpD60h.js';
import '../../GroupChannel/components/TypingIndicator.js';
import '../../ui/Badge.js';
import '../../ui/ChannelAvatar.js';
import '../../chunks/bundle-k8wZLjPN.js';
import '../../ui/MentionUserLabel.js';
import '../../chunks/bundle-v7DbCTsH.js';
import '../../chunks/bundle-RAzr6why.js';
import '../../CreateChannel.js';
import '../../CreateChannel/components/CreateChannelUI.js';
import '../../chunks/bundle-rpehLlJe.js';
import '../../sendbirdSelectors.js';
import '../../chunks/bundle-7BSf_PUT.js';
import '../../CreateChannel/components/InviteUsers.js';
import '../../ui/UserListItem.js';
import '../../ui/MutedAvatarOverlay.js';
import '../../ui/Checkbox.js';
import '../../ui/UserProfile.js';
import '../../CreateChannel/components/SelectChannelType.js';

var GroupChannelListUI = function (props) {
    var renderHeader = props.renderHeader, renderChannelPreview = props.renderChannelPreview, renderPlaceHolderError = props.renderPlaceHolderError, renderPlaceHolderLoading = props.renderPlaceHolderLoading, renderPlaceHolderEmptyList = props.renderPlaceHolderEmptyList;
    var _a = useGroupChannelListContext(), onChannelSelect = _a.onChannelSelect, onThemeChange = _a.onThemeChange, allowProfileEdit = _a.allowProfileEdit, typingChannelUrls = _a.typingChannelUrls, groupChannels = _a.groupChannels, initialized = _a.initialized, selectedChannelUrl = _a.selectedChannelUrl, loadMore = _a.loadMore, onUserProfileUpdated = _a.onUserProfileUpdated;
    var sortedGroupChannels = useMemo(function () {
        var _a, _b;
        return (_b = (_a = props.sortChannelList) === null || _a === void 0 ? void 0 : _a.call(props, groupChannels)) !== null && _b !== void 0 ? _b : groupChannels;
    }, [groupChannels, props.sortChannelList]);
    var _b = useSendbirdStateContext(), stores = _b.stores, config = _b.config;
    var logger = config.logger, isOnline = config.isOnline;
    var sdk = stores.sdkStore.sdk;
    var renderListItem = function (renderProps) {
        var channel = renderProps.item, index = renderProps.index;
        var itemProps = {
            channel: channel,
            tabIndex: index,
            isSelected: channel.url === selectedChannelUrl,
            isTyping: typingChannelUrls.includes(channel.url),
            renderChannelAction: function (props) { return React__default.createElement(GroupChannelPreviewAction, __assign({}, props)); },
            onClick: function () {
                if (isOnline || (sdk === null || sdk === void 0 ? void 0 : sdk.isCacheEnabled)) {
                    logger.info('ChannelList: Clicked on channel:', channel);
                    onChannelSelect(channel);
                }
                else {
                    logger.warning('ChannelList: Inactivated clicking channel item during offline.');
                }
            },
            onLeaveChannel: function () {
                return __awaiter(this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                logger.info('ChannelList: Leaving channel', channel);
                                return [4 /*yield*/, channel.leave()];
                            case 1:
                                _a.sent();
                                logger.info('ChannelList: Leaving channel success');
                                return [2 /*return*/];
                        }
                    });
                });
            },
        };
        if (renderChannelPreview) {
            return (React__default.createElement("div", { key: channel.url, onClick: itemProps.onClick }, renderChannelPreview(itemProps)));
        }
        return React__default.createElement(GroupChannelListItem, __assign({ key: channel.url }, itemProps));
    };
    return (React__default.createElement(GroupChannelListUIView, { renderHeader: renderHeader, renderChannel: renderListItem, renderPlaceHolderError: renderPlaceHolderError, renderPlaceHolderLoading: renderPlaceHolderLoading, renderPlaceHolderEmptyList: renderPlaceHolderEmptyList, onChangeTheme: onThemeChange, allowProfileEdit: allowProfileEdit, onUserProfileUpdated: onUserProfileUpdated, channels: sortedGroupChannels, onLoadMore: loadMore, initialized: initialized, renderAddChannel: function () { return React__default.createElement(AddGroupChannel, null); } }));
};

export { GroupChannelListUI, GroupChannelListUI as default };
//# sourceMappingURL=GroupChannelListUI.js.map
