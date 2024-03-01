import React from 'react';
import './index.scss';
import { ToggleContainer, ToggleContainerProps } from './ToggleContainer';
import { useToggleContext } from './ToggleContext';
import { ToggleUI, ToggleUIProps } from './ToggleUI';
export interface ToggleProps extends ToggleContainerProps, ToggleUIProps {
    className?: string;
}
declare function Toggle(props: ToggleProps): React.ReactElement;
export type { ToggleContainerProps, ToggleUIProps };
export { Toggle, ToggleContainer, ToggleUI, useToggleContext };
