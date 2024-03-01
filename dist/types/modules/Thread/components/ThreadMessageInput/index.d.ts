import React from 'react';
import './index.scss';
export interface ThreadMessageInputProps {
    className?: string;
    disabled?: boolean;
    renderFileUploadIcon?: () => React.ReactElement;
    renderVoiceMessageIcon?: () => React.ReactElement;
    renderSendMessageIcon?: () => React.ReactElement;
    acceptableMimeTypes?: string[];
}
declare const _default: React.ForwardRefExoticComponent<ThreadMessageInputProps & React.RefAttributes<any>>;
export default _default;
