'use strict';

exports.PublishingModuleType = void 0;
(function (PublishingModuleType) {
    PublishingModuleType["CHANNEL"] = "CHANNEL";
    PublishingModuleType["THREAD"] = "THREAD";
})(exports.PublishingModuleType || (exports.PublishingModuleType = {}));
// NOTE: To maintain compatibility with the sendbirdSelector provided to customers
//  this utility function ensures that if publishingModules is not provided or its length is zero
//  it will maintain the same behavior as before.
var isTargetIncludedInModules = function (target, modules) {
    if (!modules || modules.length === 0)
        return true;
    else
        return modules.includes(target);
};
function shouldPubSubPublishToChannel(modules) {
    return isTargetIncludedInModules(exports.PublishingModuleType.CHANNEL, modules);
}
function shouldPubSubPublishToThread(modules) {
    return isTargetIncludedInModules(exports.PublishingModuleType.THREAD, modules);
}

// NOTE: It seems not distinguish topics by channel type.
exports.PUBSUB_TOPICS = void 0;
(function (PUBSUB_TOPICS) {
    // Group Channel
    PUBSUB_TOPICS["USER_UPDATED"] = "USER_UPDATED";
    PUBSUB_TOPICS["SEND_MESSAGE_START"] = "SEND_MESSAGE_START";
    PUBSUB_TOPICS["SEND_MESSAGE_FAILED"] = "SEND_MESSAGE_FAILED";
    PUBSUB_TOPICS["SEND_USER_MESSAGE"] = "SEND_USER_MESSAGE";
    PUBSUB_TOPICS["SEND_FILE_MESSAGE"] = "SEND_FILE_MESSAGE";
    PUBSUB_TOPICS["ON_FILE_INFO_UPLOADED"] = "ON_FILE_INFO_UPLOADED";
    PUBSUB_TOPICS["UPDATE_USER_MESSAGE"] = "UPDATE_USER_MESSAGE";
    PUBSUB_TOPICS["DELETE_MESSAGE"] = "DELETE_MESSAGE";
    PUBSUB_TOPICS["LEAVE_CHANNEL"] = "LEAVE_CHANNEL";
    PUBSUB_TOPICS["CREATE_CHANNEL"] = "CREATE_CHANNEL";
    // Open Channel
    PUBSUB_TOPICS["UPDATE_OPEN_CHANNEL"] = "UPDATE_OPEN_CHANNEL";
})(exports.PUBSUB_TOPICS || (exports.PUBSUB_TOPICS = {}));
var pubSubTopics = exports.PUBSUB_TOPICS;

exports.pubSubTopics = pubSubTopics;
exports.shouldPubSubPublishToChannel = shouldPubSubPublishToChannel;
exports.shouldPubSubPublishToThread = shouldPubSubPublishToThread;
//# sourceMappingURL=bundle-LutGJd7y.js.map
