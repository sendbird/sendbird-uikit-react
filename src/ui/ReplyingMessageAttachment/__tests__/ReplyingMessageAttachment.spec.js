import React from 'react';
import renderer from 'react-test-renderer';

import ReplyingMessageAttachment from "../index";
import { dummyFileMessageAudio } from '../mockMessage.ts';

describe('ReplyingMessageAttachment', () => {
  it('should do a snapshot test of the ReplyingMessageAttachment DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <ReplyingMessageAttachment replyingMessage={dummyFileMessageAudio} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
