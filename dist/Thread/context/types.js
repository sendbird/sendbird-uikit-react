// Initializing status
var ChannelStateTypes;
(function (ChannelStateTypes) {
    ChannelStateTypes["NIL"] = "NIL";
    ChannelStateTypes["LOADING"] = "LOADING";
    ChannelStateTypes["INVALID"] = "INVALID";
    ChannelStateTypes["INITIALIZED"] = "INITIALIZED";
})(ChannelStateTypes || (ChannelStateTypes = {}));
var ParentMessageStateTypes;
(function (ParentMessageStateTypes) {
    ParentMessageStateTypes["NIL"] = "NIL";
    ParentMessageStateTypes["LOADING"] = "LOADING";
    ParentMessageStateTypes["INVALID"] = "INVALID";
    ParentMessageStateTypes["INITIALIZED"] = "INITIALIZED";
})(ParentMessageStateTypes || (ParentMessageStateTypes = {}));
var ThreadListStateTypes;
(function (ThreadListStateTypes) {
    ThreadListStateTypes["NIL"] = "NIL";
    ThreadListStateTypes["LOADING"] = "LOADING";
    ThreadListStateTypes["INVALID"] = "INVALID";
    ThreadListStateTypes["INITIALIZED"] = "INITIALIZED";
})(ThreadListStateTypes || (ThreadListStateTypes = {}));

export { ChannelStateTypes, ParentMessageStateTypes, ThreadListStateTypes };
//# sourceMappingURL=types.js.map
