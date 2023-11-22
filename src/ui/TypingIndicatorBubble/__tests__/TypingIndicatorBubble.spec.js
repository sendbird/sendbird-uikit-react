import React from 'react';
import {render} from '@testing-library/react';
import TypingIndicatorBubble from '../index';

const mockMember = {
  profileUrl: 'test-profile-url',
};

describe('ui/TypingIndicatorBubble', () => {
  it('should have class names of own basic status', () => {
    const className = 'sendbird-message-content incoming';
    const {container} = render(
      <TypingIndicatorBubble
        typingMembers={[mockMember]}
      />
    );
    expect(
      container.getElementsByClassName(className)[0].className
    ).toContain(className);
  });
});