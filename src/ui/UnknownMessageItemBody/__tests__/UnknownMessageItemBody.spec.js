import React from 'react';
import { render } from '@testing-library/react';

import UnknownMessageItemBody from "../index";

const createMockMessage = (process) => {
  const mockMessage = {
    reactions: [],
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('ui/UnknownMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const className = 'class-name-for-test';
    const { container } = render(
      <UnknownMessageItemBody
        className={className}
        message={createMockMessage()}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-unknown-message-item-body')[0].className
    ).toContain(className);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body')
    ).toHaveLength(1)
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body__header')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body__description')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll(`.${className}.sendbird-unknown-message-item-body`)
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.incoming')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.mouse-hover')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.reactions')
    ).toHaveLength(0);
  });

  it('should have class name when isByMe is true', () => {
    const { container } = render(
      <UnknownMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.outgoing')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.incoming')
    ).toHaveLength(0);
  });
  it('should have class name when isByMe is false', () => {
    const { container } = render(
      <UnknownMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.outgoing')
    ).toHaveLength(0);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.incoming')
    ).toHaveLength(1);
  });

  it('should have class name by mouseHover prop', () => {
    const { container } = render(
      <UnknownMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.mouse-hover')
    ).toHaveLength(1);
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.mouse-hover')
    ).toHaveLength(1);
  });

  it('should have class name by reactions of message', () => {
    const { container } = render(
      <UnknownMessageItemBody
        isReactionEnabled
        message={createMockMessage((mockMessage) => ({
          ...mockMessage,
          reactions: [{}, {}, {}],
        }))}
      />
    );
    expect(
      container.querySelectorAll('.sendbird-unknown-message-item-body.reactions')
    ).toHaveLength(1);
  });

  it('should do a snapshot test of the UnknownMessageItemBody DOM', function () {
    const { asFragment } = render(
      <UnknownMessageItemBody
        className="class-name-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}, {}],
        }))}
        isByMe
        mouseHover
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render default text if empty', () => {
    const customText = '';
    const DEAFULT_TEXT = 'Cannot read this message.';
    const { container } = render(
      <UnknownMessageItemBody
        message={createMockMessage()}
        customText={customText}
      />
    );
    expect(
      container.querySelector('.sendbird-unknown-message-item-body__description').textContent
    ).toEqual(DEAFULT_TEXT);
  });

  it('should render the customText if provided', () => {
    const customText = 'custom text';
    const { container } = render(
      <UnknownMessageItemBody
        message={createMockMessage()}
        customText={customText}
      />
    );
    expect(
      container.querySelector('.sendbird-unknown-message-item-body__description').textContent
    ).toEqual(customText);
  });
});
