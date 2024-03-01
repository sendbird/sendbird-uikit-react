import React from 'react';
export declare const copyToClipboard: (text: string) => boolean;
export interface OperatorUIProps {
    renderChannelProfile?: () => React.ReactElement;
}
export declare const OperatorUI: React.FC<OperatorUIProps>;
export default OperatorUI;
