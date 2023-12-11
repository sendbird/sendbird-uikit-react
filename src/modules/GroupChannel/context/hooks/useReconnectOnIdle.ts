import { useEffect, useState } from 'react';
import type { GroupChannel } from '@sendbird/chat/groupChannel';

function useReconnectOnIdle(isOnline: boolean, currentGroupChannel: GroupChannel, reconnectOnIdle = true)
  :{ shouldReconnect: boolean }
{
  const [isTabHidden, setIsTabHidden] = useState<boolean>(false);
  const wasOffline = !isOnline;

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (reconnectOnIdle) {
        setIsTabHidden(document.hidden);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [reconnectOnIdle, document.hidden]);

  const shouldReconnect = wasOffline && currentGroupChannel?.url != null && !isTabHidden;
  return { shouldReconnect };
}

export default useReconnectOnIdle;
