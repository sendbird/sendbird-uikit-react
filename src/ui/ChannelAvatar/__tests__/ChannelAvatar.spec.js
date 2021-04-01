import React from 'react';
import {shallow} from 'enzyme';

import ChannelAvatar from "../index";
import * as utils from '../utils';

describe('ChannelAvatar', () => {
  it('should render a normal default channel avatar', function() {
    const avatar  = shallow(<ChannelAvatar channel={{}} />);
    expect(avatar.find('.sendbird-chat-header--avatar--group-channel').length).toEqual(1);
  });

  it('should render a default avatar of broadcastChannel', function() {
    const avatar  = shallow(<ChannelAvatar channel={{ isBroadcast: true }} />);
    expect(avatar.find('.sendbird-chat-header--default-avatar').length).toEqual(1);
  });

  it('should render an avatar broadcastChannel with url', function() {
    const coverUrl = '123';
    const avatar  = shallow(<ChannelAvatar channel={{ isBroadcast: true, coverUrl }} />);
    expect(avatar.find('.sendbird-chat-header--avatar--broadcast-channel').length).toEqual(1);
  });
});


describe('ChannelAvatar-Utils-getChannelAvatarSource', () => {
  it('should return channel url if present', () => {
    const coverUrl = '123';
    expect(utils.getChannelAvatarSource({ coverUrl }, '123')).toEqual(coverUrl);
  });
  it('should return list of member avatar urls if no channel url', () => {
    const userId = 'uxxx1';
    const members = [{ userId, profileUrl: 'p1' }, { userId: 'u2', profileUrl: 'p2' }, { userId: 'u3', profileUrl: 'p3' }];
    expect(utils.getChannelAvatarSource({ coverUrl: null, members }, userId)).toEqual(['p2', 'p3']);
  });

  it('should return list of member avatar urls if channel url is default', () => {
    const coverUrl = `${utils.DEFAULT_URL_PREFIX}/123.jpg`;
    const userId = 'uxxx1';
    const members = [{ userId, profileUrl: 'p1' }, { userId: 'u2', profileUrl: 'p2' }, { userId: 'u3', profileUrl: 'p3' }];
    expect(utils.getChannelAvatarSource({ coverUrl, members }, userId)).toEqual(['p2', 'p3']);
  });
});

describe('ChannelAvatar-Utils-useDefaultAvatar', () => {
  it('should return true if coverUrl is empty', () => {
    expect(utils.useDefaultAvatar({})).toEqual(true)
  });
  it('should return true if coverUrl is default one', () => {
    expect(utils.useDefaultAvatar({ coverUrl: `${utils.DEFAULT_URL_PREFIX}/123.jpg` })).toEqual(true)
  });
  it('should return false if coverUrl is there', () => {
    expect(utils.useDefaultAvatar({ coverUrl: 'randomurl' })).toEqual(false)
  });
});
