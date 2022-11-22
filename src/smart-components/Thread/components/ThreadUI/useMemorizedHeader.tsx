import React, { ReactElement, useMemo } from 'react';

export interface UseMemorizedHeaderProps {
  renderHeader?: () => React.ReactElement;
}

const useMemorizedHeader = ({ renderHeader }: UseMemorizedHeaderProps): ReactElement => useMemo(() => {
  if (typeof renderHeader === 'function') {
    return renderHeader();
  }
  return null;
}, [renderHeader]);

export default useMemorizedHeader;
