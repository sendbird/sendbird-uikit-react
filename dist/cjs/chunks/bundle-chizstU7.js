'use strict';

var React = require('react');
var sendbirdSelectors = require('../sendbirdSelectors.js');
var useSendbirdStateContext = require('../useSendbirdStateContext.js');

exports.CHANNEL_TYPE = void 0;
(function (CHANNEL_TYPE) {
    CHANNEL_TYPE["GROUP"] = "group";
    CHANNEL_TYPE["SUPERGROUP"] = "supergroup";
    CHANNEL_TYPE["BROADCAST"] = "broadcast";
})(exports.CHANNEL_TYPE || (exports.CHANNEL_TYPE = {}));

var CreateChannelContext = React.createContext(undefined);
var CreateChannelProvider = function (props) {
    var _a;
    var children = props.children, onCreateChannelClick = props.onCreateChannelClick, onBeforeCreateChannel = props.onBeforeCreateChannel, onChannelCreated = props.onChannelCreated, userListQuery = props.userListQuery, onCreateChannel = props.onCreateChannel, overrideInviteUser = props.overrideInviteUser;
    var store = useSendbirdStateContext.useSendbirdStateContext();
    var _userListQuery = userListQuery !== null && userListQuery !== void 0 ? userListQuery : (_a = store === null || store === void 0 ? void 0 : store.config) === null || _a === void 0 ? void 0 : _a.userListQuery;
    var _b = React.useState(0), step = _b[0], setStep = _b[1];
    var _c = React.useState(exports.CHANNEL_TYPE.GROUP), type = _c[0], setType = _c[1];
    return (React.createElement(CreateChannelContext.Provider, { value: {
            createChannel: sendbirdSelectors.getCreateGroupChannel(store),
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
var useCreateChannelContext = function () { return (React.useContext(CreateChannelContext)); };

exports.CreateChannelProvider = CreateChannelProvider;
exports.useCreateChannelContext = useCreateChannelContext;
//# sourceMappingURL=bundle-chizstU7.js.map
