import React, { useMemo } from 'react';

export interface UseMemorizedHeaderProps {
  renderHeader?: () => React.ReactElement;
}

const useMemorizedHeader = ({
  renderHeader
}: UseMemorizedHeaderProps) => useMemo(() => {
  if (typeof renderHeader === 'function') {
    return renderHeader();
  }
  return null;
}, [renderHeader]);

export default useMemorizedHeader;
