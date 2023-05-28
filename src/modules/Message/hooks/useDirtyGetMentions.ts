import { useEffect, useLayoutEffect, useState } from 'react';

import { Logger } from '../../../lib/SendbirdState';
import { getMentionNodes } from '../utils/getMentionNodes';

interface DynamicParams {
  ref: React.RefObject<HTMLElement>;
}

interface StaticParams {
  logger: Logger;
}

/**
 * This is a dirty way to get the mentions given DOM node
 */
export function useDirtyGetMentions({
  ref,
}: DynamicParams, {
  logger,
}: StaticParams) {
  // Select the node that will be observed for mutations
  const targetNode = ref.current as HTMLElement;
  const [mentionNodes, setMentionNodes] = useState<Element[]>([]);

  // to get the initial mentions
  useLayoutEffect(() => {
    if (targetNode) {
      const mentions = getMentionNodes(targetNode);
      setMentionNodes(mentions);
    }
  }, [targetNode]);

  useEffect(() => {
    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationList: MutationRecord[]): void => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          // setMentionNodes
          setMentionNodes(getMentionNodes(targetNode));
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    if (targetNode) {
      // Start observing the target node for configured mutations
      observer.observe(targetNode, config);
      logger.info('useDirtyGetMentions: observer started', { observer, config });
    }

    return () => {
      try {
        observer.disconnect();
        logger.info('useDirtyGetMentions: observer disconnected', { observer });
      } catch (error) {
        logger.error('useDirtyGetMentions: observer disconnect failed', { observer });
      }
    };
  }, [targetNode]);
  return mentionNodes;
}
