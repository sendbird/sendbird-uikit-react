var OutgoingMessageStates;
(function (OutgoingMessageStates) {
    OutgoingMessageStates["NONE"] = "NONE";
    OutgoingMessageStates["PENDING"] = "PENDING";
    OutgoingMessageStates["SENT"] = "SENT";
    OutgoingMessageStates["FAILED"] = "FAILED";
    OutgoingMessageStates["DELIVERED"] = "DELIVERED";
    OutgoingMessageStates["READ"] = "READ";
})(OutgoingMessageStates || (OutgoingMessageStates = {}));
var getOutgoingMessageState = function (channel, message) {
    var _a, _b, _c, _d, _e;
    if (!message || !('sendingStatus' in message))
        return OutgoingMessageStates.NONE;
    if (message.sendingStatus === 'pending') {
        return OutgoingMessageStates.PENDING;
    }
    if (message.sendingStatus === 'failed') {
        return OutgoingMessageStates.FAILED;
    }
    if ((_a = channel === null || channel === void 0 ? void 0 : channel.isGroupChannel) === null || _a === void 0 ? void 0 : _a.call(channel)) {
        /* GroupChannel only */
        if (((_c = (_b = channel).getUnreadMemberCount) === null || _c === void 0 ? void 0 : _c.call(_b, message)) === 0) {
            return OutgoingMessageStates.READ;
        }
        else if (((_e = (_d = channel).getUndeliveredMemberCount) === null || _e === void 0 ? void 0 : _e.call(_d, message)) === 0) {
            return OutgoingMessageStates.DELIVERED;
        }
    }
    if (message.sendingStatus === 'succeeded') {
        return OutgoingMessageStates.SENT;
    }
    return OutgoingMessageStates.NONE;
};

export { OutgoingMessageStates, getOutgoingMessageState };
//# sourceMappingURL=getOutgoingMessageState.js.map
