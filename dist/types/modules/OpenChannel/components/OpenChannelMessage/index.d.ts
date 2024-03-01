import React, { ReactElement } from 'react';
import type { RenderMessageProps } from '../../../../types';
import { CoreMessageType } from '../../../../utils';
export type OpenChannelMessageProps = {
    renderMessage?: (props: RenderMessageProps) => React.ElementType<RenderMessageProps>;
    message: CoreMessageType;
    chainTop?: boolean;
    chainBottom?: boolean;
    hasSeparator?: boolean;
    editDisabled?: boolean;
};
export default function MessagOpenChannelMessageeHoc(props: OpenChannelMessageProps): ReactElement;
