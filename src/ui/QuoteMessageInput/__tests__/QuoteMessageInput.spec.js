import React from 'react';
import renderer from 'react-test-renderer';

import QuoteMessageInput from "../index";
import { dummyFileMessageAudio } from '../mockMessage.ts';

describe('QuoteMessageInput', () => {
  it('should do a snapshot test of the QuoteMessageInput DOM', function() {
    const component = renderer.create(
      <QuoteMessageInput replyingMessage={dummyFileMessageAudio} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
