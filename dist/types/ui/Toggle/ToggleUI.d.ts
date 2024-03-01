import React from 'react';
export interface ToggleUIProps {
    reversed?: boolean;
    width?: string;
    animationDuration?: string;
    style?: Record<string, string>;
    name?: string;
    id?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
}
export declare function ToggleUI(props: ToggleUIProps): React.ReactElement;
