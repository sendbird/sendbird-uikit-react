import React__default, { useState } from 'react';
import { getCreateGroupChannel } from '../sendbirdSelectors.js';
import { useSendbirdStateContext } from '../useSendbirdStateContext.js';

var CHANNEL_TYPE;
(function (CHANNEL_TYPE) {
    CHANNEL_TYPE["GROUP"] = "group";
    CHANNEL_TYPE["SUPERGROUP"] = "supergroup";
    CHANNEL_TYPE["BROADCAST"] = "broadcast";
})(CHANNEL_TYPE || (CHANNEL_TYPE = {}));

var CreateChannelContext = React__default.createContext(undefined);
var CreateChannelProvider = function (props) {
    var _a;
    var children = props.children, onCreateChannelClick = props.onCreateChannelClick, onBeforeCreateChannel = props.onBeforeCreateChannel, onChannelCreated = props.onChannelCreated, userListQuery = props.userListQuery, onCreateChannel = props.onCreateChannel, overrideInviteUser = props.overrideInviteUser;
    var store = useSendbirdStateContext();
    var _userListQuery = userListQuery !== null && userListQuery !== void 0 ? userListQuery : (_a = store === null || store === void 0 ? void 0 : store.config) === null || _a === void 0 ? void 0 : _a.userListQuery;
    var _b = useState(0), step = _b[0], setStep = _b[1];
    var _c = useState(CHANNEL_TYPE.GROUP), type = _c[0], setType = _c[1];
    return (React__default.createElement(CreateChannelContext.Provider, { value: {
            createChannel: getCreateGroupChannel(store),
            onCreateChannelClick: onCreateChannelClick,
            onBeforeCreateChannel: onBeforeCreateChannel,
            onChannelCreated: onChannelCreated,
            userListQuery: _userListQuery,
            step: step,
            setStep: setStep,
            type: type,
            setType: setType,
            onCreateChannel: onCreateChannel,
            overrideInviteUser: overrideInviteUser,
        } }, children));
};
var useCreateChannelContext = function () { return (React__default.useContext(CreateChannelContext)); };

export { CreateChannelProvider as C, CHANNEL_TYPE as a, useCreateChannelContext as u };
//# sourceMappingURL=bundle-rpehLlJe.js.map
