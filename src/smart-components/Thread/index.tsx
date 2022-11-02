import React from 'react';

import ThreadProvider from './context/ThreadProvider';
import ThreadUI from './components/ThreadUI';

export interface ThreadProps { // extends ThreadContextProps, ThreadUIProps

}

const Thread: React.FC<ThreadProps> = (props: ThreadProps) => {
  return (
    <ThreadProvider>
      <ThreadUI />
    </ThreadProvider>
  );
};

export default Thread;
