import { useEffect } from 'react';
import { Logger } from '../../../../lib/SendbirdState';
import { SdkStore } from '../../../../lib/types';
import useThread from '../useThread';

interface DanamicPrpos {
  sdk: SdkStore['sdk'];
}
interface StaticProps {
  logger: Logger;
}

export default function useGetAllEmoji({
  sdk,
}: DanamicPrpos, {
  logger,
}: StaticProps): void {
  const {
    actions: {
      setEmojiContainer,
    },
  } = useThread();

  useEffect(() => {
    if (sdk?.getAllEmoji) { // validation check
      sdk?.getAllEmoji()
        .then((emojiContainer) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis succeeded.', emojiContainer);
          setEmojiContainer(emojiContainer);
        })
        .catch((error) => {
          logger.info('Thread | useGetAllEmoji: Getting emojis failed.', error);
        });
    }
  }, [sdk]);
}
