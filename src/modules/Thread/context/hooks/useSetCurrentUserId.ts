import useThread from '../useThread';
import { useEffect } from 'react';
import type { User } from '@sendbird/chat';

interface DynamicParams {
  user: User | null;
}

function useSetCurrentUserId(
  { user }: DynamicParams,
) {
  const {
    actions: {
      setCurrentUserId,
    },
  } = useThread();

  useEffect(() => {
    setCurrentUserId(user?.userId);
  }, [user]);
}

export default useSetCurrentUserId;
