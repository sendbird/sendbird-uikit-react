import React, { ReactElement } from 'react';
export interface UseMemorizedHeaderProps {
    renderHeader?: () => React.ReactElement;
}
declare const useMemorizedHeader: ({ renderHeader }: UseMemorizedHeaderProps) => ReactElement;
export default useMemorizedHeader;
