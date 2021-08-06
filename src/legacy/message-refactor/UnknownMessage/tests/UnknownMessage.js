import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import UnknownMessage from "../index";
import generateUnknownMessage from '../dummyMessage.mock';

import { LabelStringSet } from '../../../../ui/Label';

const mockMessage = generateUnknownMessage();

// jest.mock('date-fns/format', () => () => ('mock-date'));
let realUseContext;
let useContextMock;

// describe('UnknownMessage', () => {
const legacy = () => {
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
  it('should display unknown notice text in a text balloon of incoming unknown message', function() {
    const text = "example-text";
    const component = mount(
      <UnknownMessage
        className={text}
        message={mockMessage}
      />
    );

    expect(
      component.find('.sendbird-unknown-message').hasClass(text)
    ).toBe(true);

    expect(
      component.find('.sendbird-incoming-unknown-message__body__text-balloon__header').hostNodes().text()
    ).toEqual(
      LabelStringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE
    );

    expect(
      component.find('.sendbird-incoming-unknown-message__body__text-balloon__description').hostNodes().text()
    ).toEqual(
      LabelStringSet.UNKNOWN__CANNOT_READ_MESSAGE
    );
  });

  it('should display unknown notice text in a text balloon of outgoing unknown message', function() {
    const text = "example-text";
    const component = mount(
      <UnknownMessage
        className={text}
        message={mockMessage}
        isByMe
        status="READ"
      />
    );

    expect(
      component.find('.sendbird-unknown-message').hasClass(text)
    ).toBe(true);

    expect(
      component.find('.sendbird-outgoing-unknown-message__body__text-balloon__header').hostNodes().text()
    ).toEqual(
      LabelStringSet.UNKNOWN__UNKNOWN_MESSAGE_TYPE
    );

    expect(
      component.find('.sendbird-outgoing-unknown-message__body__text-balloon__description').hostNodes().text()
    ).toEqual(
      LabelStringSet.UNKNOWN__CANNOT_READ_MESSAGE
    );
  });

  it('should display sender nickname, avatar and sent at - incoming', function () {
    const component = mount(
      <UnknownMessage
        isByMe={false}
        message={mockMessage}
      />
    );

    expect(
      component.find('.sendbird-incoming-unknown-message__body__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-unknown-message__left__sender-profile-image').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-unknown-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender nickname when chainTop - incoming', function () {
    const component = mount(
      <UnknownMessage
        isByMe={false}
        message={mockMessage}
        chainTop
      />
    );

    expect(
      component.find('.sendbird-incoming-unknown-message__body__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-unknown-message__left__sender-profile-image').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-unknown-message__sent-at').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display sender avatar and sent at when chainBottom - incoming', function () {
    const component = mount(
      <UnknownMessage
        isByMe={false}
        message={mockMessage}
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-incoming-unknown-message__body__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-unknown-message__left__sender-profile-image').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-unknown-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should not display sender nickname, avatar and sent at when chainTop and chainBottom - incoming', function () {
    const component = mount(
      <UnknownMessage
        isByMe={false}
        message={mockMessage}
        chainTop
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-incoming-unknown-message__body__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-unknown-message__left__sender-profile-image').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-unknown-message__sent-at').hostNodes().exists()
    ).toEqual(false);
  });

  it('should display message status - outgoing', function () {
    const component = mount(
      <UnknownMessage
        isByMe
        message={mockMessage}
        status="READ"
      />
    );

    expect(
      component.find('.sendbird-outgoing-unknown-message__message-status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display message status when chainBottom - outgoing', function () {
    const component = mount(
      <UnknownMessage
        isByMe
        message={mockMessage}
        status="READ"
        chainBottom
      />
    );

    expect(
      component.find('.sendbird-outgoing-unknown-message__message-status').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(false);
  });

  it('should do a snapshot test of the UnknownMessage DOM', function() {
    const text = "example-text";
    const component = renderer.create(
      <UnknownMessage
        className={text}
        message={mockMessage}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
}
// );
