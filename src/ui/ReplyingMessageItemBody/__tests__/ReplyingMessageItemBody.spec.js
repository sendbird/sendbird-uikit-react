import React from 'react';
// import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import ReplyingMessageItemBody from "../index";

describe('ReplyingMessageItemBody', () => {
  it('should do a snapshot test of the ReplyingMessageItemBody DOM', function() {
    const component = renderer.create(
      <ReplyingMessageItemBody
        message={{ sender: { nickname: 'Simon' } }}
        parentMessageType={null}
        parentMessageText="Hello nice to meet you"
        parentMessageUrl={''}
        parentMessageSender={{ nickname: 'Gabie' }}
        isByMe
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
