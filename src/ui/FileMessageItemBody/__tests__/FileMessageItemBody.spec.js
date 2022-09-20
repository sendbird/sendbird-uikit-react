import React from 'react';
import { render, screen } from '@testing-library/react';

import FileMessageItemBody from "../index";

const createMockMessage = (process) => {
  const mockMessage = {
    type: 'image/png',
    url: 'https://sendbird.com',
    name: 'My name is name',
    reactions: [],
  };
  return process ? process(mockMessage) : mockMessage;
};

describe('ui/FileMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const className = 'classname-for-test';
    const createdMsg = createMockMessage();
    const { container } = render(
      <FileMessageItemBody
        className={className}
        message={createdMsg}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain(className);
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).not.toContain('outgoing');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('incoming');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).not.toContain('mouse-hover');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).not.toContain('reactions');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].className
    ).toBe('sendbird-file-message-item-body__file-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-file-message-item-body__file-icon__icon');
    expect(
      screen.getByText(createdMsg.name).className
    ).toContain('sendbird-file-message-item-body__file-name__text');
  });

  it('should render url when name does not exist', () => {
    const createdMsg = createMockMessage((mock) => ({ ...mock, name: '' }));
    render(<FileMessageItemBody message={createdMsg} />);
    expect(
      screen.getByText(createdMsg.url).className
    ).toContain('sendbird-file-message-item-body__file-name__text');
  });

  it('should have class name by isByMe is true', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('outgoing');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).not.toContain('incoming');
  });

  it('should have class name when isByMe is false', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).not.toContain('outgoing');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('incoming');
  });

  it('should have class name by mouseHover prop', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('mouse-hover');
  });

  it('should have class name by reactions of message prop', () => {
    const { container } = render(
      <FileMessageItemBody
        isReactionEnabled
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('reactions');
  });

  it('should render icons of image type message', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/jpg',
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-file-message-item-body__file-icon__icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon-photo');
  });

  it('should render icons of video type message', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'video/mp4',
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon-play');
  });

  it('should render icons of audio type message', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'audio/mp3',
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon-file-audio');
  });

  it('should render icons of gif type message', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/gif',
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon-gif');
  });

  it('should render icons of pdf type message', () => {
    const { container } = render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/pdf',
        }))}
      />
    );
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body')[0].className
    ).toContain('sendbird-file-message-item-body');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon');
    expect(
      container.getElementsByClassName('sendbird-file-message-item-body__file-icon')[0].children[0].className
    ).toContain('sendbird-icon-file-document');
  });

  it('should do a snapshot test of the FileMessageItemBody DOM', function () {
    const { asFragment } = render(
      <FileMessageItemBody
        className="classname-for-snapshot"
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
        }))}
        isByMe
        mouseHover
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
