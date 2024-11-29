import React from 'react';
import { render, screen, renderHook } from '@testing-library/react';

import { FileViewerComponent as FileViewer } from "../index";
import { msg0, msg1 } from '../data.mock';
import { MODAL_ROOT } from '../../../hooks/useModal';
import { SendbirdContext } from '../../../lib/Sendbird/context/SendbirdContext';
import { useSendbird } from '../../../lib/Sendbird/context/hooks/useSendbird';

jest.mock('../../../lib/Sendbird/context/hooks/useSendbird', () => ({
  __esModule: true,
  useSendbird: jest.fn(),
}));

describe('ui/FileViewer', () => {
  let modalRoot;

  beforeAll(() => {
    // Create a modal root element and append it to the body
    modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', MODAL_ROOT);
    document.body.appendChild(modalRoot);
  });

  afterAll(() => {
    // Remove the modal root element after tests
    document.body.removeChild(modalRoot);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    const stateContextValue = {
      state: {
        config: {},
        stores: {},
      },
    };
    useSendbird.mockReturnValue(stateContextValue);
    renderHook(() => useSendbird());
  });

  it('should display image', function () {
    const {
      sender,
      type,
      url,
      name = 'example-text',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    render(
      <SendbirdContext.Provider value={{}}>
        <FileViewer
          profileUrl={profileUrl}
          nickname={nickname}
          type={type}
          url={url}
          name={name}
          onClose={() => { }}
          onDelete={() => { }}
        />
      </SendbirdContext.Provider>
    );
    expect(
      screen.getByAltText(msg0.name).className
    ).toBe('sendbird-fileviewer__content__img');
    expect(
      screen.getByAltText(msg0.name).className
    ).not.toContain('sendbird-fileviewer__content__video');
    expect(
      screen.getByAltText(msg0.name).src
    ).toEqual(msg0.url);
  });

  it('should display video', function () {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg1;
    const { profileUrl, nickname = '' } = sender;
    const { container } = render(
      <SendbirdContext.Provider value={{}}>
        <FileViewer
          profileUrl={profileUrl}
          nickname={nickname}
          type={type}
          url={url}
          name={name}
          onClose={() => { }}
          onDelete={() => { }}
        />
      </SendbirdContext.Provider>
    );

    // Use document to search for the element inside the modal root
    const videoElement = document.querySelector(`#${MODAL_ROOT} .sendbird-fileviewer__content__video`);
    if (!videoElement) {
      throw new Error('Video element not found');
    }

    expect(videoElement.className).not.toContain('sendbird-fileviewer__content__img');
    expect(videoElement.className).toBe('sendbird-fileviewer__content__video');

    const videoChild = videoElement.children[0];
    expect(videoChild.src).toEqual(url);
  });

  it('should handle unsupported msg', function () {
    const unsupportedMsg = { sender: {} };
    const profileUrl = '';
    const nickname = '';
    const {
      type = '',
      url = '',
      name = '',
    } = unsupportedMsg;
    const { container } = render(
      <SendbirdContext.Provider value={{}}>
        <FileViewer
          profileUrl={profileUrl}
          nickname={nickname}
          type={type}
          url={url}
          name={name}
          onClose={() => { }}
          onDelete={() => { }}
        />
      </SendbirdContext.Provider>
    );

    // Use document to search for the element inside the modal root
    const unsupportedElement = document.querySelector(`#${MODAL_ROOT} .sendbird-fileviewer__content__unsupported`);
    if (!unsupportedElement) {
      throw new Error('Unsupported element not found');
    }

    expect(unsupportedElement.className).toBe('sendbird-fileviewer__content__unsupported');

    const headerRightElement = document.querySelector(`#${MODAL_ROOT} .sendbird-fileviewer__header__right`);
    if (!headerRightElement) {
      throw new Error('Header right element not found');
    }

    const headerRightActionElement = headerRightElement.children[0];
    expect(headerRightActionElement.className).not.toBe('sendbird-fileviewer__header__right__actions');
  });

  it('should do a snapshot test of the FileViewer DOM', function () {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    const { asFragment } = render(
      <SendbirdContext.Provider value={{}}>
        <FileViewer
          profileUrl={profileUrl}
          nickname={nickname}
          type={type}
          url={url}
          name={name}
          onClose={() => { }}
          onDelete={() => { }}
          message={msg0}
        />
      </SendbirdContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
