import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import FileMessage, { OutgoingFileMessage } from "../index";
import dummyFileMessageMock, { dummyFileMessageAudio } from '../dummyFileMessage.mock';
import { getOutgoingMessageStates } from '../../../utils';

// mock date-fns to avoid problems from snapshot timestamping
// between testing in different locations
// ideally we want to mock date-fns globally - needs more research
jest.mock('date-fns/format', () => () => ('mock-date'));
const MessageStatusType = getOutgoingMessageStates();
let realUseContext;
let useContextMock;

describe('FileMessage', () => {
  // Setup mock
  beforeEach(() => {
    realUseContext = React.useContext;
    useContextMock = React.useContext = () => ({
      disableUserProfile: false,
      renderUserProfile: null,
    });
  });

  // Cleanup mock
  afterEach(() => {
    React.useContext = realUseContext;
  });

  it('should display avatar and sent at and nickname - incoming', () => {
    const component = mount(
      <FileMessage
        isByMe={false}
        message={dummyFileMessageMock}
        status=""
        useReaction
      />
    );

    expect(
      component.find('.sendbird-file-message__incoming__body__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-file-message__incoming__body__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-file-message__incoming__right-padding__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender nickname when chainTop - incoming', () => {
    const component = mount(
      <FileMessage
        isByMe={false}
        message={dummyFileMessageMock}
        status=""
        useReaction
        chainTop
      />
    );

    expect(
      component.find('.sendbird-file-message__incoming__body__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-file-message__incoming__body__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-file-message__incoming__right-padding__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display avatar and sent at when chainBottom - incoming', () => {
    const component = mount(
      <FileMessage
        isByMe={false}
        message={dummyFileMessageMock}
        status=""
        useReaction
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-file-message__incoming__body__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-file-message__incoming__body__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-file-message__incoming__right-padding__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should not display sender nickname and avatar and sent at when chainTop and chainBottom - incoming', () => {
    const component = mount(
      <FileMessage
        isByMe={false}
        message={dummyFileMessageMock}
        status=""
        useReaction
        chainTop
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-file-message__incoming__body__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-file-message__incoming__body__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-file-message__incoming__right-padding__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should display message status - outgoing', () => {
    const component = mount(
      <FileMessage
        isByMe
        message={dummyFileMessageMock}
        status="READ"
        useReaction
      />
    );
    expect(
      component.find('.sendbird-file-message__outgoing__left-padding__status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-file-message__outgoing__tooltip__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display message status when chainBottom - outgoing', () => {
    const component = mount(
      <FileMessage
        isByMe
        message={dummyFileMessageMock}
        status="READ"
        useReaction
        chainBottom
      />
    );
    expect(
      component.find('.sendbird-file-message__outgoing__left-padding__status').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-file-message__outgoing__tooltip__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should do a snapshot test of the FileMessage DOM', () => {
    const component = renderer.create(
      <OutgoingFileMessage
        useReaction
        message={dummyFileMessageAudio}
        showRemove={() => { }}
        status={MessageStatusType.SENT}
        chainTop={false}
        chainBottom={false}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
