import React from 'react';
import {render} from '@testing-library/react';
import TypingIndicatorMessage from '../index';

describe('ui/TypingIndicatorMessage', () => {
  it('should have class names of own basic status', () => {
    const className = 'sendbird-typing-indicator-message';
    const {container} = render(
      <TypingIndicatorMessage className/>
    );
    expect(
      container.getElementsByClassName(className)[0].className
    ).toContain(className);
  });
});