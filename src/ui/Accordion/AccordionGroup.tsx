// Wraps all the accordions in an accordion set
// keep one accordion open at a time
import React, { ReactElement, useState } from 'react';

import { Provider } from './context';

interface Props {
  children: Array<ReactElement> | ReactElement;
  className?: string;
}

export default function AccordionGroup({
  children,
  className = '',
}: Props): ReactElement {
  const [opened, setOpened] = useState('');
  return (
    <Provider value={{ opened, setOpened }}>
      <div className={className}>{ children }</div>
    </Provider>
  )
}
