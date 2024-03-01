import React from 'react';
import { ThreadProviderProps } from './context/ThreadProvider';
import { ThreadUIProps } from './components/ThreadUI';
export interface ThreadProps extends ThreadProviderProps, ThreadUIProps {
    className?: string;
}
declare const Thread: (props: ThreadProps) => React.JSX.Element;
export default Thread;
