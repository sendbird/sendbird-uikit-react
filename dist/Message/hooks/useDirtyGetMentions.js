import { useState, useLayoutEffect, useEffect } from 'react';

function getMentionNodes(root) {
    if (root) {
        var mentions = root.querySelectorAll('[data-sb-mention=\'true\']');
        var mentionsArray = Array.from(mentions);
        return mentionsArray;
    }
    return [];
}

/**
 * exported, should be backwords compatible
 * This is a dirty way to get the mentions given DOM node
 */
function useDirtyGetMentions(_a, _b) {
    var ref = _a.ref;
    var logger = _b.logger;
    // Select the node that will be observed for mutations
    var targetNode = ref.current;
    var _c = useState([]), mentionNodes = _c[0], setMentionNodes = _c[1];
    // to get the initial mentions
    useLayoutEffect(function () {
        if (targetNode) {
            var mentions = getMentionNodes(targetNode);
            setMentionNodes(mentions);
        }
    }, [targetNode]);
    useEffect(function () {
        // Options for the observer (which mutations to observe)
        var config = { childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        var callback = function (mutationList) {
            var hasMutation = mutationList.length > 0;
            if (hasMutation) {
                setMentionNodes(getMentionNodes(targetNode));
            }
        };
        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);
        if (targetNode) {
            // Start observing the target node for configured mutations
            observer.observe(targetNode, config);
            // logger.info('useDirtyGetMentions: observer started', { observer, config });
        }
        return function () {
            try {
                observer.disconnect();
                // logger.info('useDirtyGetMentions: observer disconnected', { observer });
            }
            catch (error) {
                logger.error('useDirtyGetMentions: observer disconnect failed', { observer: observer });
            }
        };
    }, [targetNode]);
    return mentionNodes;
}

export { useDirtyGetMentions };
//# sourceMappingURL=useDirtyGetMentions.js.map
