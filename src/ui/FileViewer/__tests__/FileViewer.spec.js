import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import { FileViewerComponent as FileViewer } from "../index";
import { msg0, msg1 } from '../data.mock';

describe('FileViewer', () => {
  it('should display image', function() {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    const component = shallow(
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
    const img = component.find('.sendbird-fileviewer__content__img');
    expect(img.length).toEqual(1);
    expect(img.prop('src')).toEqual(msg0.url);
  });

  it('should display video', function() {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg1;
    const { profileUrl, nickname = '' } = sender;
    const component = shallow(
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
    const video = component.find('.sendbird-fileviewer__content__video source');
    expect(video.length).toEqual(1);
    expect(video.prop('src')).toEqual(msg1.url);
  });

  it('should handle unsupported msg', function() {
    const unsupportedMsg = { sender: {} };
    const profileUrl = '';
    const nickname = '';
    const {
      sender,
      type = '',
      url = '',
      name = '',
    } = unsupportedMsg;
    const component = shallow(
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
    const fallback = component.find('.sendbird-fileviewer__content__unsupported');
    expect(fallback.length).toEqual(1);
    const headerActions = component.find('.sendbird-fileviewer__header__right__actions');
    expect(headerActions.length).toEqual(0);
  });

  it('should do a snapshot test of the FileViewer DOM', function() {
    const {
      sender,
      type,
      url,
      name = '',
    } = msg0;
    const { profileUrl, nickname = '' } = sender;
    const component = renderer.create(
      <FileViewer
        profileUrl={profileUrl}
        nickname={nickname}
        type={type}
        url={url}
        name={name}
        onClose={() => {}}
        onDelete={() => {}}
        message={msg0}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
