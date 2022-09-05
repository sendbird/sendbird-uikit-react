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

describe('FileMessageItemBody', () => {
  it('should have class names of own basic status', () => {
    const className = 'classname-for-test';
    const createdMsg = createMockMessage();
    render(
      <FileMessageItemBody
        className={className}
        message={createdMsg}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain(className);
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).not.toContain('outgoing');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('incoming');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).not.toContain('mouse-hover');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).not.toContain('reactions');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').className
    ).toBe('sendbird-file-message-item-body__file-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
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
    render(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('outgoing');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).not.toContain('incoming');
  });

  it('should have class name when isByMe is false', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage()}
        isByMe={false}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).not.toContain('outgoing');
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('incoming');
  });

  it('should have class name by mouseHover prop', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage()}
        mouseHover
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('mouse-hover');
  });

  it('should have class name by reactions of message prop', () => {
    render(
      <FileMessageItemBody
        isReactionEnabled
        message={createMockMessage((mock) => ({
          ...mock,
          reactions: [{}, {}],
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('reactions');
  });

  it('should render icons of image type message', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/jpg',
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-file-message-item-body__file-icon__icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon-photo');
  });

  it('should render icons of video type message', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'video/mp4',
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon-play');
  });

  it('should render icons of audio type message', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'audio/mp3',
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon-file-audio');
  });

  it('should render icons of gif type message', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/gif',
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon-gif');
  });

  it('should render icons of pdf type message', () => {
    render(
      <FileMessageItemBody
        message={createMockMessage((mock) => ({
          ...mock,
          type: 'image/pdf',
        }))}
      />
    );
    expect(
      screen.getByTestId('sendbird-file-message-item-body').className
    ).toContain('sendbird-file-message-item-body');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
    ).toContain('sendbird-icon');
    expect(
      screen.getByTestId('sendbird-file-message-item-body__file-icon').children[0].className
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
