import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';

import { changeColorToClassName } from '../../../../ui/Label/utils';
import { LabelColors } from '../../../../ui/Label';

import OGMessage from "../index";
import { generateMockMessage } from '../const';
import { checkOGIsEnalbed } from '../utils';
import useMemoizedMessageText from '../memoizedMessageText';

const OG_MESSAGE = 'sendbird-og-message';
const OUTGOING_OG_MESSAGE = 'sendbird-outgoing-og-message';
const INCOMING_OG_MESSAGE = 'sendbird-incoming-og-message';
let realUseContext;
let useContextMock;

// describe('OGMessage', () => {
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
  it('should render outgoing og message component', function () {
    const component = mount(
      <OGMessage
        message={generateMockMessage()}
        isByMe
        userId="user-id"
        useReaction={false}
      />
    );

    expect(
      component.find(`.${OG_MESSAGE}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OG_MESSAGE}--outgoing`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}__more`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}__text-balloon`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}__thumbnail`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}__og-tag`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OUTGOING_OG_MESSAGE}__message-status`).exists()
    ).toEqual(true);
  });

  it('should render incoming og message component', function () {
    const component = mount(
      <OGMessage
        message={generateMockMessage()}
        userId="user-id"
        useReaction={false}
        isByMe={false}
      />
    );

    expect(
      component.find(`.${OG_MESSAGE}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${OG_MESSAGE}--incoming`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__avatar`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__sender-name`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__text-balloon`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__thumbnail`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__og-tag`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__sent-at`).exists()
    ).toEqual(true);
    expect(
      component.find(`.${INCOMING_OG_MESSAGE}__more`).exists()
    ).toEqual(true);
  });

  it('should return axpected booleans', function () {
    const expectedMessage = { ogMetaData: { url: '12345' } };
    const noUrlMessage = { ogMetaData: {} };
    const wrongUrlMessagre = { ogMetaData: { Url: '12345', URL: '12345' } };
    const noOgMetaDataMessage = {};
    const wrongOgMetaDataMessage = { ogMetadata: { url: '12345' }, OGMetaData: { url: '12345' } };

    expect(checkOGIsEnalbed(expectedMessage)).toEqual(true);
    expect(checkOGIsEnalbed(noUrlMessage)).toEqual(false);
    expect(checkOGIsEnalbed(wrongUrlMessagre)).toEqual(false);
    expect(checkOGIsEnalbed(noOgMetaDataMessage)).toEqual(false);
    expect(checkOGIsEnalbed(wrongOgMetaDataMessage)).toEqual(false);
  });

  it('should push edited label at the end of the array for updated message', function () {
    const mockMessage = {
      message: 'one two three four five six seven',
      updatedAt: 10000000,
    };
    const text = 'sample-text';

    function App() {
      const MemoizedMessageText = useMemoizedMessageText({
        message: mockMessage.message,
        updatedAt: mockMessage.updatedAt,
        className: text,
      });
      return <MemoizedMessageText />
    }
    const component = mount(<App />);

    expect(
      component.find(`.${text}`).hostNodes().last().text()
    ).toEqual('(edited)');
    expect(
      component.find(`.${text}`).hostNodes().length
    ).toEqual(8);
    expect(
      component.find(`.${changeColorToClassName(LabelColors.ONCONTENT_2)}`).exists()
    ).toEqual(true);
  });

  it('should not push edited label at the end of the array for not updated message', function() {
    const mockMessage = {
      message: 'one two three four five six seven',
      updatedAt: 0,
    };
    const text = 'sample-text';

    function App() {
      const MemoizedMessageText = useMemoizedMessageText({
        message: mockMessage.message,
        updatedAt: mockMessage.updatedAt,
        className: text,
      });
      return <MemoizedMessageText />;
    }
    const component = mount(<App />);

    expect(
      component.find(`.${text}`).hostNodes().last().text()
    ).not.toEqual('(edited)');
    expect(
      component.find(`.${text}`).hostNodes().length
    ).toEqual(7);
    expect(
      component.find(`.${changeColorToClassName(LabelColors.ONBACKGROUND_2)}`).exists()
    ).toEqual(false);
  });

  it('should display sender nickname, avatar and sent at - incoming', function () {
    const component = mount(
      <OGMessage
        isByMe={false}
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
      />
    );
    expect(
      component.find('.sendbird-incoming-og-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-og-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-og-message__sent-at').hostNodes().exists()
  ).toEqual(true);
  });

  it('should not display sender nickname when chainTop - incoming', function () {
    const component = mount(
      <OGMessage
        isByMe={false}
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
        chainTop
      />
    );
    expect(
      component.find('.sendbird-incoming-og-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-og-message__avatar').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-og-message__sent-at').hostNodes().exists()
  ).toEqual(true);
  });

  it('should not display sender avatar and sent at when chainBottom - incoming', function () {
    const component = mount(
      <OGMessage
        isByMe={false}
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
        chainBottom
      />
    );
    expect(
      component.find('.sendbird-incoming-og-message__sender-name').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-incoming-og-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-og-message__sent-at').hostNodes().exists()
  ).toEqual(false);
  });

  it('should not display sender nickname, avatar and sent at when chainTop and chainBottom - incoming', function () {
    const component = mount(
      <OGMessage
        isByMe={false}
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
        chainTop
        chainBottom
      />
    );
    expect(
      component.find('.sendbird-incoming-og-message__sender-name').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-og-message__avatar').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-incoming-og-message__sent-at').hostNodes().exists()
  ).toEqual(false);
  });

  it('should display message status - outgoing', function () {
    const component = mount(
      <OGMessage
        isByMe
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
      />
    );
    expect(
      component.find('.sendbird-outgoing-og-message__message-status').hostNodes().exists()
    ).toEqual(true);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(true);
  });

  it('should not display message status when chainBottom - outgoing', function () {
    const component = mount(
      <OGMessage
        isByMe
        message={generateMockMessage()}
        useReaction
        status="READ"
        userId="user-id"
        chainBottom
      />
    );
    expect(
      component.find('.sendbird-outgoing-og-message__message-status').hostNodes().exists()
    ).toEqual(false);
    expect(
      component.find('.sendbird-message-status__text').hostNodes().exists()
    ).toEqual(false);
  });

  it('should do a snapshot test of the OGMessage DOM', function () {
    const component = renderer.create(
      <OGMessage
        message={generateMockMessage()}
        userId="user-id"
        isByMe
        useReaction={false}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
}
// );
