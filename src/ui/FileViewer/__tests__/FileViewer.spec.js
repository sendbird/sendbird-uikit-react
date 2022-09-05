import React from 'react';
import { render, screen } from '@testing-library/react';

import { FileViewerComponent as FileViewer } from "../index";
import { msg0, msg1 } from '../data.mock';

describe('ui/FileViewer', () => {
  it('should display image', function() {
    const {
      sender,
      type,
      url,
      name = 'example-text',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    render(
      <FileViewer
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onClose={() => {}}
        onDelete={() => {}}
        />
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

  it('should display video', function() {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg1;
    const { profileUrl, nickname = '' } = sender;
    render(
      <FileViewer
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onClose={() => {}}
        onDelete={() => {}}
      />
    );
    expect(
      screen.getByTestId('sendbird-fileviewer__content__video').className
    ).not.toContain('sendbird-fileviewer__content__img');
    expect(
      screen.getByTestId('sendbird-fileviewer__content__video').className
    ).toBe('sendbird-fileviewer__content__video');
    expect(
      screen.getByTestId('sendbird-fileviewer__content__video').children[0].src
    ).toEqual(url);
  });

  it('should handle unsupported msg', function() {
    const unsupportedMsg = { sender: {} };
    const profileUrl = '';
    const nickname = '';
    const {
      type = '',
      url = '',
      name = '',
    } = unsupportedMsg;
    render(
      <FileViewer
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onClose={() => {}}
        onDelete={() => {}}
      />
    );
    expect(
      screen.getByTestId('sendbird-fileviewer__content__unsupported').className
    ).toBe('sendbird-fileviewer__content__unsupported');
    expect(
      screen.getByTestId('sendbird-fileviewer__header__right').children[0].className
    ).not.toBe('sendbird-fileviewer__header__right__actions');
  });

  it('should do a snapshot test of the FileViewer DOM', function() {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    const { asFragment } = render(
      <FileViewer
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onClose={() => {}}
        onDelete={() => {}}
        message={msg0}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
