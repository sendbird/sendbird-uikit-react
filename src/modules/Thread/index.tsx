import React from 'react';

import {
  ThreadProvider,
  ThreadProviderProps,
} from './context/ThreadProvider';
import ThreadUI, { ThreadUIProps } from './components/ThreadUI';
import { classnames } from '../../utils/utils';

export interface ThreadProps extends ThreadProviderProps, ThreadUIProps {
  className?: string;
}

const Thread = (props: ThreadProps) => {
  return (
    <div className={classnames('sendbird-thread', props?.className ?? '')}>
      <ThreadProvider {...props} >
        <ThreadUI {...props} />
      </ThreadProvider>
    </div>
  );
};

export default Thread;
