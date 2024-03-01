/**
 * Dashboard UIKitConfig's replyType is consisted of all lowercases,
 * we need to convert it into uppercase ones(or vice versa)
 * when we pass the value to internal components
 *  - 'thread' <-> 'THREAD'
 *  - 'quote_reply' <-> 'QUOTE_REPLY'
 */
function getCaseResolvedReplyType(replyType) {
    return {
        lowerCase: replyType.toLowerCase(),
        upperCase: replyType.toUpperCase(),
    };
}
/**
 * Dashboard UIKitConfig's threadReplySelectType is consisted of all lowercase letters,
 * we need to convert it into uppercase ones(or vice versa)
 * when we pass the value to internal components
 *  - 'thread' <-> 'THREAD'
 *  - 'parent' <-> 'PARENT'
 */
function getCaseResolvedThreadReplySelectType(threadReplySelectType) {
    return {
        lowerCase: threadReplySelectType.toLowerCase(),
        upperCase: threadReplySelectType.toUpperCase(),
    };
}

export { getCaseResolvedThreadReplySelectType as a, getCaseResolvedReplyType as g };
//# sourceMappingURL=bundle-iU7PXFos.js.map
