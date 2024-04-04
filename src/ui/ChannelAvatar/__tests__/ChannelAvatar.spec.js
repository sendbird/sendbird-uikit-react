import React from 'react';
import { render, screen } from '@testing-library/react';

import ChannelAvatar from "../index";
import * as utils from '../utils';

describe('ui/ChannelAvatar', () => {
  it('should render a normal default channel avatar', function() {
    const targetClassName = "sendbird-chat-header--avatar--group-channel";
    render(<ChannelAvatar channel={{}} />);
    expect(screen.getAllByRole('button')[0].className).toContain(targetClassName);
  });

  it('should render a default avatar of broadcastChannel', function() {
    const targetClassName = "sendbird-chat-header--default-avatar";
    const { container } = render(<ChannelAvatar channel={{ isBroadcast: true }} />);
    expect(container.getElementsByClassName(targetClassName)[0].className).toContain(targetClassName);
  });

  it('should render an avatar broadcastChannel with url', function() {
    const targetClassName = "sendbird-chat-header--avatar--broadcast-channel";
    const coverUrl = '123';
    render(<ChannelAvatar channel={{ isBroadcast: true, coverUrl }} />);
    expect(screen.getByRole('button').className).toContain(targetClassName);
  });
});

describe('ui/ChannelAvatar/utils/getAvatarSource', () => {
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

describe('ui/ChannelAvatar/utils/generateDefaultAvatar', () => {
  it('should return true if coverUrl is empty', () => {
    expect(utils.generateDefaultAvatar({})).toEqual(true)
  });
  it('should return true if coverUrl is default one', () => {
    expect(utils.generateDefaultAvatar({ coverUrl: `${utils.DEFAULT_URL_PREFIX}/123.jpg` })).toEqual(true)
  });
  it('should return false if coverUrl is there', () => {
    expect(utils.generateDefaultAvatar({ coverUrl: 'randomurl' })).toEqual(false)
  });
});
